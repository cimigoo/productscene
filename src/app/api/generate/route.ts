import { NextRequest, NextResponse } from "next/server";
import { getSceneById, PLATFORM_SIZES } from "@/lib/scenes";
import {
  verifyApiKey,
  deductCredits,
  extractApiKey,
  decodeApiKey,
} from "@/lib/auth";
import { removeBackground, generateSceneVariant } from "@/lib/fal";
import { makePlaceholder } from "@/lib/placeholder";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB after base64 overhead
const FREE_TRIAL_LIMIT = 3;
const VARIANTS = 4;

/**
 * In-memory free-trial counter. This resets on cold start / redeploy,
 * which is acceptable for MVP. A production version should use a
 * durable store (KV / Upstash / database) keyed by IP hash.
 */
const freeTrialMap = new Map<string, number>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

interface GenerateBody {
  image?: string;
  sceneId?: string;
  size?: string;
  apiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateBody;
    const { image, sceneId, size, apiKey } = body;

    // --- Validation -------------------------------------------------------
    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "A base64 data-URL image is required." },
        { status: 400 }
      );
    }
    if (Buffer.byteLength(image, "utf8") > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image exceeds the 10 MB limit." },
        { status: 400 }
      );
    }

    const scene = sceneId ? getSceneById(sceneId) : undefined;
    if (!scene) {
      return NextResponse.json(
        { error: `Unknown scene: ${sceneId ?? "(none)"}` },
        { status: 400 }
      );
    }

    const sizeObj = PLATFORM_SIZES.find((s) => s.id === size);
    if (!sizeObj) {
      return NextResponse.json(
        { error: `Unknown size: ${size ?? "(none)"}` },
        { status: 400 }
      );
    }

    // --- Auth / credits ---------------------------------------------------
    let remainingCredits: number | null = null;
    let newKey: string | null = null;
    let watermark = true;
    let mode: "free" | "paid" = "free";

    const keyToVerify =
      apiKey || extractApiKey(req.headers).key || undefined;

    if (keyToVerify) {
      const verify = verifyApiKey(keyToVerify);
      if (!verify.valid || !verify.payload) {
        return NextResponse.json(
          { error: verify.error || "Invalid API key." },
          { status: 401 }
        );
      }
      if (verify.payload.credits <= 0) {
        return NextResponse.json(
          { error: "You have 0 credits. Purchase a plan to continue." },
          { status: 402 }
        );
      }
      const deduction = deductCredits(keyToVerify, 1);
      if ("error" in deduction) {
        return NextResponse.json({ error: deduction.error }, { status: 402 });
      }
      newKey = deduction.newKey;
      remainingCredits = deduction.remaining;
      watermark = false;
      mode = "paid";
    } else {
      const ip = getClientIp(req);
      const used = freeTrialMap.get(ip) || 0;
      if (used >= FREE_TRIAL_LIMIT) {
        return NextResponse.json(
          {
            error:
              "Free trial limit reached. Enter an API key or purchase a plan to continue.",
            freeTrialLimit: FREE_TRIAL_LIMIT,
          },
          { status: 402 }
        );
      }
      freeTrialMap.set(ip, used + 1);
      remainingCredits = FREE_TRIAL_LIMIT - (used + 1);
    }

    // --- Generation -------------------------------------------------------
    const prompt = [
      "High-quality product photography. Place the supplied product (which has a transparent background) onto this scene:",
      scene.prompt,
      "Keep the product's appearance, shape, labels and colors 100% accurate and unchanged. Do not distort, recolor, or recreate the product.",
      `Aspect ratio ${sizeObj.ratio}, resolution ${sizeObj.width}x${sizeObj.height}.`,
    ].join(" ");

    const seeds = Array.from(
      { length: VARIANTS },
      (_, i) => Math.floor(Math.random() * 1_000_000) + i
    );

    const images: string[] = [];
    let usedFallback = false;

    if (!process.env.FAL_KEY) {
      usedFallback = true;
    } else {
      try {
        // 1. Remove background
        const cutoutUrl = await removeBackground(image);

        // 2. Generate 4 variants in parallel
        const results = await Promise.all(
          seeds.map((seed) =>
            generateSceneVariant({
              cutoutUrl,
              prompt,
              width: sizeObj.width,
              height: sizeObj.height,
              seed,
            })
          )
        );
        images.push(...results);
      } catch (err) {
        console.error("[generate] Fal.ai pipeline failed, using placeholders:", err);
        usedFallback = true;
      }
    }

    if (usedFallback) {
      images.length = 0;
      for (const seed of seeds) {
        images.push(
          makePlaceholder({
            sceneName: scene.name,
            category: scene.category,
            width: sizeObj.width,
            height: sizeObj.height,
            seed,
            watermark,
          })
        );
      }
    }

    // If a paid key was used, also expose remaining from the new key.
    if (newKey) {
      const payload = decodeApiKey(newKey);
      if (payload) remainingCredits = payload.credits;
    }

    return NextResponse.json({
      images,
      remaining: remainingCredits,
      newKey,
      mode,
      usedFallback,
      scene: scene.name,
      size: sizeObj.id,
    });
  } catch (err) {
    console.error("[generate] fatal:", err);
    const message =
      err instanceof Error ? err.message : "Unknown generation error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

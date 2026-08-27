/**
 * Minimal Fal.ai REST client (no SDK dependency).
 *
 * Pipeline:
 *   1. briaai/rmbg-1.4  — remove background from the uploaded product photo
 *   2. black-forest-labs/flux-schnell (image-to-image) — place the cutout
 *      into the chosen scene using a text prompt.
 *
 * Both calls use the synchronous `https://fal.run/` endpoint with a
 * server-side timeout. Any failure bubbles up so the caller can fall
 * back to local placeholder images.
 */

const FAL_BASE = "https://fal.run";
const DEFAULT_TIMEOUT_MS = 45_000;

interface FalResult {
  image?: { url: string };
  images?: { url: string }[];
}

async function callFal<T>(
  path: string,
  payload: unknown,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const key = process.env.FAL_KEY;
  if (!key) {
    throw new Error("FAL_KEY_NOT_CONFIGURED");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${FAL_BASE}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Fal.ai ${path} returned ${res.status}: ${text.slice(0, 300)}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/** Remove background. Returns a data URL or remote URL of the cutout. */
export async function removeBackground(
  imageDataUrl: string
): Promise<string> {
  const result = await callFal<FalResult>("/briaai/rmbg-1.4", {
    image_url: imageDataUrl,
  });
  const url = result.image?.url || result.images?.[0]?.url;
  if (!url) throw new Error("Background removal returned no image");
  return url;
}

export interface SceneGenerateParams {
  cutoutUrl: string;
  prompt: string;
  width: number;
  height: number;
  seed: number;
  strength?: number;
}

/** Generate a single scene variant using FLUX schnell image-to-image. */
export async function generateSceneVariant(
  params: SceneGenerateParams
): Promise<string> {
  const { cutoutUrl, prompt, width, height, seed, strength = 0.75 } = params;
  const result = await callFal<FalResult>(
    "/black-forest-labs/flux-schnell",
    {
      prompt,
      image_url: cutoutUrl,
      image_size: { width, height },
      seed,
      num_inference_steps: 4,
      strength,
      guidance_scale: 3,
    }
  );
  const url = result.images?.[0]?.url || result.image?.url;
  if (!url) throw new Error("FLUX returned no image");
  return url;
}

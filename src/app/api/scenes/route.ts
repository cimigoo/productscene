import { NextResponse } from "next/server";
import { SCENES, PLATFORM_SIZES } from "@/lib/scenes";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    scenes: SCENES.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      emoji: s.emoji,
      prompt: s.prompt,
    })),
    sizes: PLATFORM_SIZES,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, extractApiKey } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * GET /api/check-credits
 * Header: Authorization: Bearer psk_xxx  (or x-api-key)
 * Returns the payload decoded from the key so the app can show remaining credits.
 */
export async function GET(req: NextRequest) {
  const extracted = extractApiKey(req.headers);
  if (!extracted.key) {
    return NextResponse.json({ error: extracted.error }, { status: 401 });
  }

  const result = verifyApiKey(extracted.key);
  if (!result.valid || !result.payload) {
    return NextResponse.json(
      { error: result.error || "Invalid API key" },
      { status: 401 }
    );
  }

  const { email, plan, credits, issuedAt } = result.payload;
  return NextResponse.json({
    email,
    plan,
    credits,
    remaining: credits,
    issuedAt,
  });
}

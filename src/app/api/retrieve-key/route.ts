import { NextRequest, NextResponse } from "next/server";
import { issuedKeys } from "../paddle-webhook/route";

export const runtime = "nodejs";

/**
 * Success page polls this to retrieve the API key issued by the webhook.
 * GET /api/retrieve-key?reference=<transaction_or_checkout_id>
 *
 * In production this should require an email/OTP confirmation; for MVP
 * the reference acts as a bearer token that is only shared with the
 * customer via the Paddle redirect URL.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json(
      { error: "Missing reference" },
      { status: 400 }
    );
  }

  const record = issuedKeys.get(reference);
  if (!record) {
    return NextResponse.json(
      { error: "Not found yet — webhook may still be processing", pending: true },
      { status: 404 }
    );
  }

  return NextResponse.json({
    apiKey: record.key,
    email: record.payload.email,
    plan: record.payload.plan,
    credits: record.payload.credits,
  });
}

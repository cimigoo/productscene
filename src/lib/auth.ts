import crypto from "crypto";

/**
 * ProductScene — Zero-database HMAC API Key system
 * Key format: psk_<base64url(payload)>.<base64url(signature)>
 *
 * Pattern adapted from ogimage-api/api/_lib/auth.js.
 * All state (email, plan, credits, issuedAt) is encoded in the key itself;
 * "deduction" is performed by re-issuing a new key with lower credits.
 */

const SIGNING_SECRET =
  process.env.SIGNING_SECRET || "psk-dev-secret-change-in-production-2026";

const KEY_PREFIX = "psk_";

export interface KeyPayload {
  email: string;
  plan: "starter" | "pro" | "business" | "free";
  credits: number;
  issuedAt: number;
}

export interface VerifyResult {
  valid: boolean;
  payload?: KeyPayload;
  error?: string;
}

function b64urlEncode(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function b64urlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payloadB64: string): string {
  return crypto
    .createHmac("sha256", SIGNING_SECRET)
    .update(payloadB64)
    .digest("base64url");
}

/** Issue a signed API key containing the given payload. */
export function generateApiKey(payload: Omit<KeyPayload, "issuedAt">): string {
  const full: KeyPayload = { ...payload, issuedAt: Date.now() };
  const payloadB64 = b64urlEncode(JSON.stringify(full));
  const signature = sign(payloadB64);
  return `${KEY_PREFIX}${payloadB64}.${signature}`;
}

/** Parse a key WITHOUT verifying the signature (client-side display only). */
export function decodeApiKey(key: string): KeyPayload | null {
  try {
    if (!key || !key.startsWith(KEY_PREFIX)) return null;
    const withoutPrefix = key.slice(KEY_PREFIX.length);
    const dotIndex = withoutPrefix.lastIndexOf(".");
    if (dotIndex === -1) return null;
    const payloadB64 = withoutPrefix.slice(0, dotIndex);
    return JSON.parse(b64urlDecode(payloadB64)) as KeyPayload;
  } catch {
    return null;
  }
}

/** Verify signature and return the parsed payload. */
export function verifyApiKey(key: string): VerifyResult {
  if (!key || typeof key !== "string") {
    return { valid: false, error: "Missing API key" };
  }
  if (!key.startsWith(KEY_PREFIX)) {
    return { valid: false, error: "Invalid key format" };
  }

  try {
    const withoutPrefix = key.slice(KEY_PREFIX.length);
    const dotIndex = withoutPrefix.lastIndexOf(".");
    if (dotIndex === -1) {
      return { valid: false, error: "Malformed key" };
    }

    const payloadB64 = withoutPrefix.slice(0, dotIndex);
    const signature = withoutPrefix.slice(dotIndex + 1);
    const expected = sign(payloadB64);

    // Simple string comparison - safe enough for API key validation
    // (timingSafeEqual has base64url padding issues as seen in ogimage-api)
    if (signature !== expected) {
      return { valid: false, error: "Invalid signature" };
    }

    const payload = JSON.parse(b64urlDecode(payloadB64)) as KeyPayload;
    if (
      !payload.email ||
      !payload.plan ||
      typeof payload.credits !== "number"
    ) {
      return { valid: false, error: "Invalid payload" };
    }

    return { valid: true, payload };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Verification failed",
    };
  }
}

/** Extract key from Authorization header or x-api-key. */
export function extractApiKey(
  headers: Headers
): { key?: string; error?: string } {
  const auth =
    headers.get("authorization") ||
    headers.get("Authorization") ||
    headers.get("x-api-key");
  if (!auth) return { error: "Missing authorization header" };
  const key = auth.replace(/^Bearer\s+/i, "").replace(/^Token\s+/i, "");
  return { key };
}

/**
 * Deduct credits by re-issuing a signed key with a new balance.
 * Returns the new key and remaining count.
 */
export function deductCredits(
  currentKey: string,
  amount = 1
): { newKey: string; remaining: number } | { error: string } {
  const result = verifyApiKey(currentKey);
  if (!result.valid || !result.payload) {
    return { error: result.error || "Invalid key" };
  }
  if (result.payload.credits < amount) {
    return { error: "Insufficient credits" };
  }
  const remaining = result.payload.credits - amount;
  const newKey = generateApiKey({
    email: result.payload.email,
    plan: result.payload.plan,
    credits: remaining,
  });
  return { newKey, remaining };
}

export const PLAN_CREDITS: Record<KeyPayload["plan"], number> = {
  free: 3,
  starter: 50,
  pro: 200,
  business: 600,
};

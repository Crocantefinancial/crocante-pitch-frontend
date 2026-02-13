import envParsed from "@/config/envParsed";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 16;
const TAG_LEN = 16;
function getKey(): Buffer {
  const env = envParsed();
  const secret = env.SESSION_SECRET ?? "default-secret";
  return createHash("sha256").update(secret).digest();
}

/**
 * Encrypt the backend token so it can be stored in an HttpOnly cookie.
 * No server-side session store needed — works across processes/instances.
 */
export function encryptToken(token: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

/**
 * Decrypt the cookie value to get the backend token. Returns null if invalid.
 */
export function decryptToken(payload: string): string | null {
  try {
    const key = getKey();
    const buf = Buffer.from(payload, "base64url");
    if (buf.length < IV_LEN + TAG_LEN) return null;
    const iv = buf.subarray(0, IV_LEN);
    const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
    const data = buf.subarray(IV_LEN + TAG_LEN);
    const decipher = createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(data) + decipher.final("utf8");
  } catch {
    return null;
  }
}

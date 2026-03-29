import crypto from "node:crypto";

/**
 * Derives a 32-byte encryption key from the client secret using SHA-256.
 */
function deriveKey(secret: string): Buffer {
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a string using AES-256-GCM.
 * Format: iv:authTag:encryptedText (all Base64 encoded)
 */
export function encrypt(text: string, secret: string): string {
  const iv = crypto.randomBytes(12); // GCM standard IV size
  const key = deriveKey(secret);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag().toString("base64");

  return `${iv.toString("base64")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 */
export function decrypt(encryptedData: string, secret: string): string {
  const [ivBase64, authTagBase64, encryptedText] = encryptedData.split(":");

  if (!ivBase64 || !authTagBase64 || !encryptedText) {
    throw new Error("Invalid encrypted data format");
  }

  const iv = Buffer.from(ivBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");
  const key = deriveKey(secret);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

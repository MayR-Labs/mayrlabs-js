/**
 * AES-256-GCM encryption/decryption using the universally supported Web Crypto API.
 * This ensures compatibility with Node.js, Edge, and Browser runtimes.
 */

/**
 * Derives an AES-GCM CryptoKey from the client secret using SHA-256.
 */
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const secretBuffer = new TextEncoder().encode(secret);

  const hash = await crypto.subtle.digest("SHA-256", secretBuffer);

  return crypto.subtle.importKey("raw", hash, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * Encrypts a string using AES-256-GCM.
 * Format: iv:authTag:encryptedText (all Base64 encoded)
 */
export async function encrypt(text: string, secret: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getCryptoKey(secret);
  const encoded = new TextEncoder().encode(text);

  // encrypt() returns ciphertext with the auth tag appended (last 16 bytes)
  const result = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as any },
    key,
    encoded as any
  );

  const uint8Result = new Uint8Array(result);
  const authTag = uint8Result.slice(-16);
  const ciphertext = uint8Result.slice(0, -16);

  return `${toBase64(iv)}:${toBase64(authTag)}:${toBase64(ciphertext)}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 */
export async function decrypt(
  encryptedData: string,
  secret: string
): Promise<string> {
  const [ivBase64, authTagBase64, encryptedText] = encryptedData.split(":");

  if (!ivBase64 || !authTagBase64 || !encryptedText) {
    throw new Error("Invalid encrypted data format");
  }

  const iv = fromBase64(ivBase64);
  const authTag = fromBase64(authTagBase64);
  const ciphertext = fromBase64(encryptedText);

  // Combine ciphertext and authTag for Web Crypto API
  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext);
  combined.set(authTag, ciphertext.length);

  const key = await getCryptoKey(secret);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as any },
    key,
    combined as any
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Helper to convert Uint8Array to Base64 (environment agnostic)
 */
function toBase64(arr: Uint8Array): string {
  if (typeof Buffer !== "undefined") return Buffer.from(arr).toString("base64");

  return btoa(String.fromCharCode.apply(null, arr as any));
}

/**
 * Helper to convert Base64 to Uint8Array (environment agnostic)
 */
function fromBase64(b64: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(b64, "base64"));
  }

  return new Uint8Array(
    atob(b64)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
}

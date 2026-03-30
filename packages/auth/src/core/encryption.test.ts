import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "./encryption";

describe("Encryption (Web Crypto)", () => {
  it("should encrypt and decrypt a string", async () => {
    const secret = "super-secret-key-that-is-long-enough";
    const text = "hello-world-of-mayrlabs";

    const encrypted = await encrypt(text, secret);
    expect(encrypted).toContain(":");

    const decrypted = await decrypt(encrypted, secret);
    expect(decrypted).toBe(text);
  });

  it("should throw error for invalid encrypted data", async () => {
    const secret = "super-secret-key";
    await expect(decrypt("invalid-data", secret)).rejects.toThrow();
  });

  it("should produce different IVs for same text", async () => {
    const secret = "secret";
    const text = "same-text";

    const encrypted1 = await encrypt(text, secret);
    const encrypted2 = await encrypt(text, secret);

    expect(encrypted1).not.toBe(encrypted2);
    expect(await decrypt(encrypted1, secret)).toBe(text);
    expect(await decrypt(encrypted2, secret)).toBe(text);
  });
});

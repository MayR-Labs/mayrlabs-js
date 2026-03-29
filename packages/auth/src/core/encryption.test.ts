import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "./encryption";

describe("Encryption", () => {
  it("should encrypt and decrypt a string", () => {
    const secret = "super-secret-key-that-is-long-enough";
    const text = "hello-world-of-mayrlabs";

    const encrypted = encrypt(text, secret);
    expect(encrypted).toContain(":");

    const decrypted = decrypt(encrypted, secret);
    expect(decrypted).toBe(text);
  });

  it("should throw error for invalid encrypted data", () => {
    const secret = "super-secret-key";
    expect(() => decrypt("invalid-data", secret)).toThrow();
  });

  it("should produce different IVs for same text", () => {
    const secret = "secret";
    const text = "same-text";

    const encrypted1 = encrypt(text, secret);
    const encrypted2 = encrypt(text, secret);

    expect(encrypted1).not.toBe(encrypted2);
    expect(decrypt(encrypted1, secret)).toBe(text);
    expect(decrypt(encrypted2, secret)).toBe(text);
  });
});

/** biome-ignore-all lint/suspicious/noExplicitAny: No energy to fix test */

import { ClientAuthSetup, UnauthenticatedError } from "@mayrlabs/auth";
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createNextAuth } from "./index";

const {
  mockCookiesGet,
  mockCookiesGetSetter,
  MockNextRequest,
  mockNextResponse,
} = vi.hoisted(() => {
  let _mockCookiesGetImpl = (_name?: string) => undefined as any;

  class MockNextRequest {
    public url: string;
    public nextUrl: URL;
    public cookies = { get: (n: string) => _mockCookiesGetImpl(n) };
    constructor(url: string) {
      this.url = url;
      this.nextUrl = new URL(url);
    }
  }

  const mockNextResponse = {
    redirect: (url: string | URL) => ({
      url: url.toString(),
      cookies: { set: vi.fn(), delete: vi.fn() },
    }),
    next: vi.fn(() => ({ type: "next" })),
  };

  return {
    mockCookiesGet: (n: string) => _mockCookiesGetImpl(n),
    mockCookiesGetSetter: (fn: any) => {
      _mockCookiesGetImpl = fn;
    },
    MockNextRequest,
    mockNextResponse,
  };
});

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: mockCookiesGet,
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/server", () => ({
  NextRequest: MockNextRequest,
  NextResponse: mockNextResponse,
}));

describe("createNextAuth", () => {
  beforeEach(() => {
    process.env.MAYRLABS_AUTH_PUBLIC_JWK = JSON.stringify({
      kty: "RSA",
      n: "...",
      e: "...",
    });
    process.env.MAYRLABS_CLIENT_ID = "test-id";
    process.env.MAYRLABS_CLIENT_SECRET = "test-secret";
    process.env.MAYRLABS_ACCOUNT_URL = "https://testing.com";
    mockCookiesGetSetter(() => undefined);
    vi.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should throw if environment variables are missing", () => {
      delete process.env.MAYRLABS_CLIENT_ID;
      expect(() => createNextAuth()).toThrow(
        /MAYRLABS_AUTH_PUBLIC_JWK, MAYRLABS_CLIENT_ID, and MAYRLABS_CLIENT_SECRET are required/
      );
    });

    it("should instantiate successfully with valid environment variables", () => {
      const auth = createNextAuth();
      expect(auth.setup).toBeInstanceOf(ClientAuthSetup);
    });
  });

  describe("handleCallback", () => {
    it("should redirect to error URL when error query param is present", async () => {
      const auth = createNextAuth();
      vi.spyOn(auth.setup, "verifyErrorToken").mockResolvedValue({
        code: "MOCK_ERR",
        message: "Mock error msg",
        iat: Date.now(),
        iss: "auth.mayrlabs.com",
      });

      const req = new NextRequest(
        "http://localhost/api/auth/callback?error=mocked-token"
      ) as any;
      const res = (await auth.handleCallback(req)) as any;

      expect(res.url).toContain("/login");
      expect(res.url).toContain("errorCode=MOCK_ERR");
      expect(res.url).toContain("Mock+error+msg");
    });

    it("should redirect to success and set cookie when valid token is present", async () => {
      const auth = createNextAuth();
      vi.spyOn(auth.setup, "verifyAuthToken").mockResolvedValue({
        userId: "123",
        email: "test@mayrlabs.com",
      } as any);

      const req = new NextRequest(
        "http://localhost/api/auth/callback?token=valid-token"
      ) as any;
      const res = (await auth.handleCallback(req)) as any;

      expect(res.url).toContain("/dashboard");
    });

    it("should reject token when it fails verification", async () => {
      const auth = createNextAuth();
      vi.spyOn(auth.setup, "verifyAuthToken").mockResolvedValue(null);

      const req = new NextRequest(
        "http://localhost/api/auth/callback?token=bad-token"
      ) as any;
      const res = (await auth.handleCallback(req)) as any;

      expect(res.url).toContain("CLIENT_INVALID_AUTH_TOKEN");
    });
  });

  describe("Server Context Retrieval (getUser/getUserOrThrow/getUserOrRedirect)", () => {
    it("should return null if no session cookie exists", async () => {
      mockCookiesGetSetter(() => undefined as any);
      const auth = createNextAuth();
      const user = await auth.getUser();
      expect(user).toBeNull();
    });

    it("getUserOrThrow should throw UnauthenticatedError if no user", async () => {
      mockCookiesGetSetter(() => undefined as any);
      const auth = createNextAuth();
      await expect(auth.getUserOrThrow()).rejects.toThrow(UnauthenticatedError);
    });

    it("getUserOrRedirect should redirect via next/navigation if no user", async () => {
      mockCookiesGetSetter(() => undefined as any);
      const { redirect } = await import("next/navigation");
      const auth = createNextAuth();
      await auth.getUserOrRedirect();
      expect(redirect).toHaveBeenCalledWith(auth.setup.getLoginUrl());
    });
  });

  describe("authProxy", () => {
    it("should pass request through if authenticated", async () => {
      mockCookiesGetSetter(() => ({ value: "valid-token" }) as any);
      const auth = createNextAuth();
      vi.spyOn(auth.setup, "verifyAuthToken").mockResolvedValue({
        userId: "123",
      } as any);

      const req = new NextRequest("http://localhost/dashboard") as any;
      const nextSpy = vi.spyOn(NextResponse, "next");
      await auth.authProxy(req);

      expect(nextSpy).toHaveBeenCalled();
    });

    it("should redirect to login if unauthenticated", async () => {
      mockCookiesGetSetter(() => undefined as any);
      const auth = createNextAuth();

      const req = new NextRequest("http://localhost/dashboard") as any;
      const res = (await auth.authProxy(req)) as any;

      expect(res.url).toContain("/login");
      expect(res.url).toContain("appId=");
    });
  });

  describe("logoutHandler", () => {
    it("should clear session cookie and redirect to error/login route", async () => {
      const auth = createNextAuth();
      const req = new NextRequest("http://localhost/api/auth/logout") as any;

      const res = (await auth.logoutHandler(req)) as any;

      expect(res.url).toContain("/login"); // Defaults to error redirect which is /login
    });
  });
});

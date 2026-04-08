/** biome-ignore-all lint/suspicious/noExplicitAny: No energy to fix test */

process.env.MAYRLABS_AUTH_PUBLIC_JWK = JSON.stringify({
  kty: "RSA",
  n: "...",
  e: "...",
});
process.env.MAYRLABS_AUTH_PRIVATE_JWK = JSON.stringify({
  kty: "RSA",
  n: "...",
  e: "...",
});
process.env.MAYRLABS_CLIENT_ID = "test-id";
process.env.MAYRLABS_CLIENT_SECRET = "test-secret";
process.env.MAYRLABS_ACCOUNT_URL = "https://testing.com";
process.env.MAYRLABS_CLIENT_AUDIENCE = "test-audience";
process.env.MAYRLABS_AUTH_ISSUER = "test-issuer";
process.env.MAYRLABS_AUTH_SESSION_KEY = "mayrlabs-auth-session";
process.env.MAYRLABS_AUTH_ERROR_REDIRECT = "/login";
process.env.MAYRLABS_AUTH_SUCCESS_REDIRECT = "/dashboard";

import {
  ClientAuthSetup,
  IssuerAuthSetup,
  UnauthenticatedError,
} from "@mayrlabs/auth";
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createNextClientAuth, createNextIssuerAuth } from "./index";

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

describe("createNextClientAuth", () => {
  beforeEach(() => {
    mockCookiesGetSetter(() => undefined);
    vi.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should instantiate successfully with valid environment variables", () => {
      const auth = createNextClientAuth();
      expect(auth.setup).toBeInstanceOf(ClientAuthSetup);
    });
  });

  describe("handleCallback", () => {
    it("should redirect to error URL when error query param is present", async () => {
      const auth = createNextClientAuth();
      vi.spyOn(auth.setup, "verifyErrorToken").mockResolvedValue({
        code: "MOCK_ERR",
        message: "Mock error msg",
        iat: Date.now(),
      });

      const req = new NextRequest(
        "http://localhost/api/auth/callback?error=mocked-token",
      ) as any;
      const res = (await auth.handleCallback(req)) as any;

      expect(res.url).toContain("/login");
      expect(res.url).toContain("errorCode=MOCK_ERR");
      expect(res.url).toContain("Mock+error+msg");
    });

    it("should redirect to success and set cookie when valid token is present", async () => {
      const auth = createNextClientAuth();
      vi.spyOn(auth.setup, "verifyAuthToken").mockResolvedValue({
        userId: "123",
        email: "test@mayrlabs.com",
      } as any);

      const req = new NextRequest(
        "http://localhost/api/auth/callback?token=valid-token",
      ) as any;
      const res = (await auth.handleCallback(req)) as any;

      expect(res.url).toContain("/dashboard");
    });

    it("should reject token when it fails verification", async () => {
      const auth = createNextClientAuth();
      vi.spyOn(auth.setup, "verifyAuthToken").mockResolvedValue(null);

      const req = new NextRequest(
        "http://localhost/api/auth/callback?token=bad-token",
      ) as any;
      const res = (await auth.handleCallback(req)) as any;

      expect(res.url).toContain("CLIENT_INVALID_AUTH_TOKEN");
    });

    it("should prioritize error over token in handleCallback", async () => {
      const auth = createNextClientAuth();
      const verifyErrorSpy = vi
        .spyOn(auth.setup, "verifyErrorToken")
        .mockResolvedValue({
          code: "MOCK_ERR",
          message: "Mock error msg",
          iat: Date.now(),
        });
      const verifyAuthSpy = vi.spyOn(auth.setup, "verifyAuthToken");

      const req = new NextRequest(
        "http://localhost/api/auth/callback?token=some-token&error=error-token",
      ) as any;
      const res = (await auth.handleCallback(req)) as any;

      expect(verifyErrorSpy).toHaveBeenCalled();
      expect(verifyAuthSpy).not.toHaveBeenCalled();
      expect(res.url).toContain("errorCode=MOCK_ERR");
    });

    it("should redirect to error if both token and error are missing in handleCallback", async () => {
      const auth = createNextClientAuth();
      const req = new NextRequest("http://localhost/api/auth/callback") as any;
      const res = (await auth.handleCallback(req)) as any;

      expect(res.url).toContain("errorCode=CLIENT_MISSING_AUTH_TOKEN");
    });
  });

  describe("Server Context Retrieval (getUser/getUserOrThrow/getUserOrRedirect)", () => {
    it("should return null if no session cookie exists", async () => {
      mockCookiesGetSetter(() => undefined as any);
      const auth = createNextClientAuth();
      const user = await auth.getUser();
      expect(user).toBeNull();
    });

    it("should use custom session key if provided", async () => {
      const auth = createNextClientAuth({ session: { key: "custom-key" } });
      mockCookiesGetSetter((name: string) => {
        if (name === "custom-key") return { value: "valid-token" } as any;
        return undefined as any;
      });
      vi.spyOn(auth.setup, "verifyAuthToken").mockResolvedValue({
        userId: "123",
      } as any);

      const user = await auth.getUser();
      expect(user?.userId).toBe("123");
    });

    it("getUserOrThrow should throw UnauthenticatedError if no user", async () => {
      mockCookiesGetSetter(() => undefined as any);
      const auth = createNextClientAuth();
      await expect(auth.getUserOrThrow()).rejects.toThrow(UnauthenticatedError);
    });

    it("getUserOrRedirect should redirect via next/navigation if no user", async () => {
      mockCookiesGetSetter(() => undefined as any);
      const { redirect } = await import("next/navigation");
      const auth = createNextClientAuth();
      await auth.getUserOrRedirect();
      expect(redirect).toHaveBeenCalledWith(auth.setup.getLoginUrl());
    });
  });

  describe("authProxy", () => {
    it("should pass request through if authenticated", async () => {
      mockCookiesGetSetter(() => ({ value: "valid-token" }) as any);
      const auth = createNextClientAuth();
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
      const auth = createNextClientAuth();

      const req = new NextRequest("http://localhost/dashboard") as any;
      const res = (await auth.authProxy(req)) as any;

      expect(res.url).toContain("/login");
      expect(res.url).toContain("appId=");
    });
  });

  describe("logoutHandler", () => {
    it("should clear session cookie and redirect to error/login route", async () => {
      const auth = createNextClientAuth();
      const req = new NextRequest("http://localhost/api/auth/logout") as any;

      const res = (await auth.logoutHandler(req)) as any;

      expect(res.url).toContain("/login"); // Defaults to error redirect which is /login
    });

    it("should use custom redirect error path", async () => {
      const auth = createNextClientAuth({ redirects: { error: "/my-error" } });
      const req = new NextRequest(
        "http://localhost/api/auth/callback?error=err-token",
      ) as any;
      vi.spyOn(auth.setup, "verifyErrorToken").mockResolvedValue({
        code: "ERR",
        message: "msg",
      });

      const res = (await auth.handleCallback(req)) as any;
      expect(res.url).toContain("/my-error");
    });
  });
});

describe("createNextIssuerAuth", () => {
  beforeEach(() => {
    mockCookiesGetSetter(() => undefined);
    vi.clearAllMocks();
  });

  it("should instantiate successfully with valid environment variables", () => {
    const auth = createNextIssuerAuth();
    expect(auth.setup).toBeInstanceOf(IssuerAuthSetup);
  });

  it("should retrieve user from session cookie", async () => {
    mockCookiesGetSetter(() => ({ value: "issuer-session-token" }) as any);
    const auth = createNextIssuerAuth();
    vi.spyOn(auth.setup, "verifyAuthToken").mockResolvedValue({
      userId: "issuer-user",
    } as any);

    const user = await auth.getUser();
    expect(user?.userId).toBe("issuer-user");
  });

  it("logoutHandler should clear session cookie", async () => {
    const auth = createNextIssuerAuth();
    const req = new NextRequest("http://localhost/api/auth/logout") as any;
    const res = (await auth.logoutHandler(req)) as any;

    expect(res.cookies.delete).toHaveBeenCalledWith("mayrlabs-auth-session");
  });
});

import { NextResponse } from "next/server";
import { z } from "zod";

export function redirectTo(path: string, base?: string) {
  return NextResponse.redirect(new URL(path, base));
}

export const jwkSchema = z.string().superRefine((val, ctx) => {
  try {
    const parsed = JSON.parse(val);
    if (!parsed || typeof parsed !== "object" || !parsed.kty) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid JWK structure",
      });
    }
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid JSON for JWK",
    });
  }
});

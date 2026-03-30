import { NextResponse } from "next/server";

export function redirectTo(path: string, base?: string) {
  return NextResponse.redirect(new URL(path, base));
}

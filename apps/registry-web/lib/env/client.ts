import { createEnv } from "@t3-oss/env-nextjs";
import { netlify, vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  extends: [netlify(), vercel()],
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});

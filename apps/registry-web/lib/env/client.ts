import { createEnv } from "@t3-oss/env-nextjs";
import { netlify } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

console.log("NEXT_PUBLIC_APP_URL: ", process.env.NEXT_PUBLIC_APP_URL);

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
  },
  extends: [netlify()],
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});

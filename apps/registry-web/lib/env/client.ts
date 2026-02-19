import { createEnv } from "@t3-oss/env-nextjs";
import { netlify } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

console.log("NEXT_PUBLIC_APP_URL: ", process.env.NEXT_PUBLIC_APP_URL);
console.log("DEPLOY_PRIME_URL: ", process.env.DEPLOY_PRIME_URL);

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  extends: [netlify()],
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL:
      process.env.DEPLOY_PRIME_URL ||
      "https://registry.mayrlabs.com" ||
      process.env.NEXT_PUBLIC_APP_URL,
  },
});

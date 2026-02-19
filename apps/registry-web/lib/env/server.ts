import { createEnv } from "@t3-oss/env-nextjs";
import { netlify } from "@t3-oss/env-nextjs/presets-zod";
// import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    // ...
  },
  extends: [netlify()],
  experimental__runtimeEnv: process.env,
});

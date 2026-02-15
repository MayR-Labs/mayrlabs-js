import { createEnv } from "@t3-oss/env-nextjs";
// import { z } from "zod";

// Server env definition
export const serverEnv = createEnv({
  server: {
    // ...
  },
  experimental__runtimeEnv: process.env,
});

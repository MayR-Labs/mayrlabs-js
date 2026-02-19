import type { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config({ path: ".env.netlify" });

// const envFile = process.env.NETLIFY
//   ? ".env.netlify"
//   : process.env.CI
//     ? ".env.ci"
//     : undefined;

// const envFile = ".env.netlify";

// if (envFile) {
//   dotenv.config({ path: envFile });
//   dotenv.config({ path: ".env.ci" });

//   console.log(
//     process.env.NEXT_PUBLIC_APP_URL_BK,
//     process.env.NEXT_PUBLIC_APP_URL,
//     process.env.CI_CONFIG
//   );
// }

import "./lib/env/server";
import "./lib/env/client";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

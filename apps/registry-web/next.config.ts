import type { NextConfig } from "next";
import "./lib/env/server"; // Validate server env vars on build
import "./lib/env/client"; // Validate client env vars on build

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

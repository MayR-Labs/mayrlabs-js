#!/usr/bin/env node

import { introScreen } from "@mayrlabs/core/cli";
import packageJson from "../package.json";

console.clear();
introScreen(packageJson.name, packageJson.version);

console.log("Hello from MayR Labs 👋");

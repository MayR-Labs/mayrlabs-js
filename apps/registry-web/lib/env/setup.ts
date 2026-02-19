import dotenv from "dotenv";
// require('@dotenvx/dotenvx').config()
// import dotenv from "@dotenvx/dotenvx";
import expand from "dotenv-expand";

// expand.expand(dotenv.config())

expand.expand(dotenv.config({ path: ".env.netlify", debug: true }));

console.log("NEXT_PUBLIC_APP_URL: ", process.env.NEXT_PUBLIC_APP_URL);
console.log(
  "NEXT_PUBLIC_APP_URL_OTHER: ",
  process.env.NEXT_PUBLIC_APP_URL_OTHER
);
console.log("APP_CONTEXT: ", process.env.APP_CONTEXT);
console.log("NET_URL: ", process.env.NET_URL);

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

// import dotenv from "dotenv";
// require('@dotenvx/dotenvx').config()
import dotenv from "@dotenvx/dotenvx";

dotenv.config({ path: ".env.netlify", debug: true });

console.log("NEXT_PUBLIC_APP_URL: ", process.env.NEXT_PUBLIC_APP_URL);

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

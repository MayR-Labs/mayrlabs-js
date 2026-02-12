import { prune } from "@mayrlabs/prunejs";

console.log("Hello from prunejs-pg");

function unusedFunction() {
  console.log("I am unused");
}

export function usedFunction() {
  console.log("I am used");
}

usedFunction();

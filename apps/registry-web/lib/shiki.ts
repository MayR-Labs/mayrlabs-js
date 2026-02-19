import { createHighlighter } from "shiki";

let highlighter: any;

export async function highlight(code: string, lang: string = "tsx") {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: ["tsx", "ts", "jsx", "js", "vue", "json", "bash"],
    });
  }

  return highlighter.codeToHtml(code, {
    lang,
    theme: "github-dark",
  });
}

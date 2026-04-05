"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";
import { highlight } from "@/lib/shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
}: CodeBlockProps) {
  const [hasCopied, setHasCopied] = React.useState(false);
  const [highlightedCode, setHighlightedCode] = React.useState<string>("");

  React.useEffect(() => {
    async function highlightCode() {
      const html = await highlight(code, language);
      setHighlightedCode(html);
    }
    highlightCode();
  }, [code, language]);

  const onCopy = React.useCallback(() => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative w-full rounded-lg border bg-zinc-950 text-white dark:border-zinc-800">
      {filename && (
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 bg-zinc-900/50 rounded-t-lg">
          <span className="text-sm font-medium text-zinc-400">{filename}</span>
          <button
            onClick={onCopy}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            {hasCopied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {hasCopied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      {!filename && (
        <button
          onClick={onCopy}
          className="absolute right-4 top-4 p-2 rounded-md hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
        >
          {hasCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      )}
      <div
        className="overflow-x-auto p-4 text-sm font-mono leading-relaxed"
        dangerouslySetInnerHTML={{
          __html:
            highlightedCode || `<pre class="shiki"><code>${code}</code></pre>`,
        }}
      />
    </div>
  );
}

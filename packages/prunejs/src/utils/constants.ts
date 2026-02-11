export const PATTERNS = {
  EXPORT: [
    {
      regex: /export\s+(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      type: "function",
    },
    { regex: /export\s+class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, type: "class" },
    {
      regex: /export\s+interface\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      type: "interface",
    },
    { regex: /export\s+type\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, type: "type" },
    { regex: /export\s+const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, type: "const" },
    {
      regex: /export\s+(?:let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      type: "variable",
    },
  ],
  NON_EXPORTED: [
    {
      regex:
        /^(?!.*export)\s*(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      type: "function",
    },
    {
      regex: /^(?!.*export)\s*class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      type: "class",
    },
    {
      regex:
        /^(?!.*export)\s*(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>)/g,
      type: "function",
    },
  ],
  SKIP: [
    /^_/,
    /^use[A-Z]/,
    /^handle[A-Z]/,
    /^on[A-Z]/,
    /^render[A-Z]/,
    /^get[A-Z]/,
    /^set[A-Z]/,
    /^is[A-Z]/,
    /^has[A-Z]/,
    /Config$/,
    /Options$/,
  ],
};

export const REGEX = {
  NAMED_EXPORT: /export\s*{([^}]+)}/,

  DEFAULT_FUNCTION:
    /export\s+default\s+(?:function\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)/,

  NAMED_IMPORT: /import\s*{([^}]+)}\s*from/,

  DEFAULT_IMPORT: /import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from/,

  NAMESPACE_IMPORT: /import\s+\*\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from/,

  IDENTIFIER: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g,
};

export interface PackageOptions {
  access: "internal" | "published";
  name: string;
  description: string;
  license: "MIT" | "ISC";
  author: {
    name: string;
    email: string;
    url: string;
  };
  type: "bin" | "lib" | "both";
}

export interface PackageJson {
  name: string;
  version: string;
  private?: boolean;
  description: string;
  keywords: string[];
  homepage: string;
  bugs: { url: string };
  license: string;
  author: { name: string; email: string; url: string };
  repository: { type: string; url: string; directory: string };
  files: string[];
  type: "commonjs" | "module";
  main?: string;
  module?: string;
  bin?: Record<string, string>;
  exports: Record<string, { import: string; require: string }>;
  publishConfig?: { access: "public" | "restricted" };
  scripts: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

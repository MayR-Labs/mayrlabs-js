const YEAR_FOUNDED = 2025;

const copyrightYear = (): string => {
  const currentYear = new Date().getFullYear();

  return currentYear === YEAR_FOUNDED
    ? currentYear.toString()
    : `${YEAR_FOUNDED} - ${currentYear}`;
};

export const BANNER = {
  js: `
/**
 * MayR Labs
 * Build. Ship. Repeat intelligently.
 *
 * (c) ${copyrightYear()} MayR Labs
 * https://mayrlabs.com
 */
`,
};

export const FOOTER = {
  js: `
/**
 * Built with discipline by MayR Labs.
 * Software should feel intentional.
 */
`,
};

export const ABOUT = `
MayR Labs is a modern software development brand focused on delivering clean, innovative, and impact-driven solutions for startups, businesses, and communities. We stand at the intersection of reliability and creativity, offering clients not just code — but clarity, collaboration, and value.
`;

export const PACKAGES = [
  {
    name: "@mayrlabs/genesis",
    description:
      "Interactive CLI to setup project tools like Husky, Prettier, ESLint.",
    path: "packages/genesis",
  },
  {
    name: "@mayrlabs/prunejs",
    description:
      "Scan JS/TS projects and detects unused files, functions, classes and exports.",
    path: "packages/prunejs",
  },
  {
    name: "@mayrlabs/core", // @ai: Remove this and add hello instead
    description: "Core shared library and CLI for MayR Labs.",
    path: "packages/core",
  },
];

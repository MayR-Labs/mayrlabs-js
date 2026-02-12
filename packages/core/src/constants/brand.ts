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
MayR Labs is a software collective building tools for the future.
We value discipline, intentionality, and craftsmanship.
`;

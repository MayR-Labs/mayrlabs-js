/**
 * Helper class for generating icon URLs and slugs.
 */
export class Generator {
  /**
   * Generates the URL and slug for a Simple Icon.
   */
  static simpleIcon = {
    url: (slug: string) => `https://cdn.simpleicons.org/${slug}`,
    slug: (slug: string) => slug,
  };

  /**
   * Generates the URL and slug for a Dev Icon.
   */
  static devIcon = {
    url: (slug: string, type: string = "original") =>
      `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-${type}.svg`,
    slug: (slug: string, type: string = "original") => `${slug}:${type}`,
  };

  /**
   * Generates the full icon URL based on the full slug (e.g., "simple:asana", "dev:react").
   * @param fullSlug The full icon string.
   */
  static iconUrl(fullSlug: string): string {
    if (!fullSlug) return "";

    const firstColonIndex = fullSlug.indexOf(":");

    if (firstColonIndex === -1) {
      return Generator.simpleIcon.url(fullSlug);
    }

    const type = fullSlug.substring(0, firstColonIndex);
    const value = fullSlug.substring(firstColonIndex + 1);

    switch (type) {
      case "simple":
        return Generator.simpleIcon.url(value);
      case "dev":
        const [iconName, iconType] = value.split(":");
        return Generator.devIcon.url(iconName, iconType);
      case "local":
        return value.startsWith("/") ? value : `/${value}`;
      case "remote":
        return value;
      default:
        return "";
    }
  }
}

import { Generator } from "./generator";
import { cn } from "./utils";

// --- Types ---
interface IconProps {
  icon: string;
  name?: string;
  size?: number | string;
  className?: string;
}

interface SpecificIconProps {
  name?: string;
  size?: number | string;
  className?: string;
}

// --- Helpers ---
function getStyleAndClass(
  size: number | string = 24,
  className?: string
): { style: string; className: string } {
  const sizeStr = typeof size === "number" ? `${size}px` : size;
  const combinedClass = cn("relative inline-block", className);
  const style = `width: ${sizeStr}; height: ${sizeStr};`;
  return { style, className: combinedClass };
}

function renderDiv(
  className: string,
  style: string,
  imgSrc: string,
  alt: string
): string {
  // We strictly escape attributes if this was a real template engine, but for simple strings:
  return `<div class="${className}" style="${style}"><img src="${imgSrc}" alt="${alt}" class="object-contain w-full h-full" /></div>`;
}

// --- Generators ---

export function SimpleIcon({
  slug,
  size,
  className,
  name,
}: { slug: string } & SpecificIconProps): string {
  const { style, className: cls } = getStyleAndClass(size, className);
  const url = Generator.simpleIcon.url(slug);
  return renderDiv(cls, style, url, `${name || slug} icon`);
}

export function DevIcon({
  config,
  size,
  className,
  name,
}: { config: string } & SpecificIconProps): string {
  const { style, className: cls } = getStyleAndClass(size, className);
  const [iconName, iconType = "original"] = config.split(":");
  const url = Generator.devIcon.url(iconName, iconType);
  return renderDiv(cls, style, url, `${name || iconName} icon`);
}

export function LocalIcon({
  path,
  size,
  className,
  name,
}: { path: string } & SpecificIconProps): string {
  const { style, className: cls } = getStyleAndClass(size, className);
  const src = path.startsWith("/") ? path : `/${path}`;
  return renderDiv(cls, style, src, `${name || "Local"} icon`);
}

export function RemoteIcon({
  url,
  size,
  className,
  name,
}: { url: string } & SpecificIconProps): string {
  const { style, className: cls } = getStyleAndClass(size, className);
  return renderDiv(cls, style, url, `${name || "Remote"} icon`);
}

export function FallbackIcon({
  size,
  className,
}: {
  size?: number | string;
  className?: string;
}): string {
  const { style, className: cls } = getStyleAndClass(size, className);
  const finalClass = cn(
    "bg-muted text-muted-foreground flex items-center justify-center rounded-full bg-gray-200 text-gray-500",
    cls
  );
  // Simplified placeholder
  return `<div class="${finalClass}" style="${style}"><span style="font-size: 12px">?</span></div>`;
}

export function CustomIcon({ icon, name, size, className }: IconProps): string {
  if (!icon) return FallbackIcon({ size, className });

  const firstColonIndex = icon.indexOf(":");

  if (firstColonIndex === -1) {
    return SimpleIcon({ slug: icon, name, size, className });
  }

  const type = icon.substring(0, firstColonIndex);
  const value = icon.substring(firstColonIndex + 1);

  switch (type) {
    case "simple":
      return SimpleIcon({ slug: value, name, size, className });
    case "dev":
      return DevIcon({ config: value, name, size, className });
    case "local":
      return LocalIcon({ path: value, name, size, className });
    case "remote":
      return RemoteIcon({ url: value, name, size, className });
    default:
      return FallbackIcon({ size, className });
  }
}

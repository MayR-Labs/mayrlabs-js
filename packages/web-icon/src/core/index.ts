import { Generator } from "@/generator";

interface BaseIconProps {
  name?: string;
  size?: number | string;
  className?: string; // Still accepted for user custom classes
  style?: string; // Inline style string
}

interface IconProps extends BaseIconProps {
  slug: string;
}

function getStyleAndClass(
  size: number | string = 24,
  className?: string,
  userStyle?: string,
) {
  const sizeStyle =
    typeof size === "number"
      ? `width: ${size}px; height: ${size}px;`
      : `width: ${size}; height: ${size};`;

  const baseStyle = `display: inline-block; ${sizeStyle} ${userStyle || ""}`;
  return { style: baseStyle, className: className || "" };
}

function renderDiv(
  className: string,
  style: string,
  imgSrc: string,
  alt: string,
) {
  const imgStyle = "width: 100%; height: 100%; object-fit: contain;";
  return `<div class="${className}" style="${style}"><img src="${imgSrc}" alt="${alt}" style="${imgStyle}" /></div>`;
}

function SimpleIcon({
  slug,
  size,
  className,
  style,
  name,
}: { slug: string } & BaseIconProps): string {
  const { style: st, className: cls } = getStyleAndClass(
    size,
    className,
    style,
  );
  const url = Generator.simpleIcon.url(slug);
  return renderDiv(cls, st, url, `${name || slug} simple icon`);
}

function DevIcon({
  config,
  size,
  className,
  style,
  name,
}: { config: string } & BaseIconProps): string {
  const [iconName, iconType = "original"] = config.split(":");
  const url = Generator.devIcon.url(iconName, iconType);
  const { style: st, className: cls } = getStyleAndClass(
    size,
    className,
    style,
  );
  return renderDiv(cls, st, url, `${name || iconName} dev icon`);
}

function LocalIcon({
  path,
  size,
  className,
  style,
  name,
}: { path: string } & BaseIconProps): string {
  const src = path.startsWith("/") ? path : `/${path}`;
  const { style: st, className: cls } = getStyleAndClass(
    size,
    className,
    style,
  );
  return renderDiv(cls, st, src, `${name || "local"} icon`);
}

function RemoteIcon({
  url,
  size,
  className,
  style,
  name,
}: { url: string } & BaseIconProps): string {
  const { style: st, className: cls } = getStyleAndClass(
    size,
    className,
    style,
  );
  return renderDiv(cls, st, url, `${name || "remote"} icon`);
}

function FallbackIcon({
  size,
  className,
  style,
}: {
  size?: number | string;
  className?: string;
  style?: string;
}): string {
  const { style: st, className: cls } = getStyleAndClass(
    size,
    className,
    style,
  );
  // Inline styles for fallback: bg-gray-100, text-gray-500, rounded-full, flex center
  const fallbackStyle = `${st} display: flex; align-items: center; justify-content: center; border-radius: 9999px; background-color: #f3f4f6; color: #6b7280;`;
  const fontSize = typeof size === "number" ? `${size * 0.5}px` : "12px";
  return `<div class="${cls}" style="${fallbackStyle}"><span style="font-size: ${fontSize}">?</span></div>`;
}

export default function CustomIcon({
  slug,
  name,
  size = 24,
  className,
  style,
}: IconProps): string {
  if (!slug) return FallbackIcon({ size, className, style });

  const firstColonIndex = slug.indexOf(":");

  if (firstColonIndex === -1) {
    return SimpleIcon({ slug, name, size, className, style });
  }

  const type = slug.substring(0, firstColonIndex);
  const value = slug.substring(firstColonIndex + 1);

  switch (type) {
    case "simple":
      return SimpleIcon({ slug: value, name, size, className, style });
    case "dev":
      return DevIcon({ config: value, name, size, className, style });
    case "local":
      return LocalIcon({ path: value, name, size, className, style });
    case "remote":
      return RemoteIcon({ url: value, name, size, className, style });
    default:
      return FallbackIcon({ size, className, style });
  }
}

CustomIcon.simple = SimpleIcon;
CustomIcon.dev = DevIcon;
CustomIcon.local = LocalIcon;
CustomIcon.remote = RemoteIcon;
CustomIcon.fallback = FallbackIcon;

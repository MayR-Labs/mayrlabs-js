import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "./utils";
import { Generator } from "./generator";

// --- Types ---

export interface IconProps extends Omit<ImageProps, "src" | "alt"> {
  icon: string; // The full icon string (e.g., 'simple:asana')
  name?: string; // Optional name for alt text
  size?: number | string;
  className?: string;
}

interface SpecificIconProps extends Omit<IconProps, "icon"> {}

// Helper to get size props for next/image
const getSizeProps = (size: number | string = 24) => {
  if (typeof size === "number") {
    return { width: size, height: size };
  }
  // If string (e.g. "100%"), we can't easily pass width/height to next/image which expects numbers or fill.
  // For simplicity in this wrapper, if size is a string, we might assume the user handles sizing via className or style,
  // OR we default to a standard size if parsing fails.
  // However, next/image requires width/height unless `fill` is used.
  // Let's assume for this implementation we pass width/height if number, else we assume the user might want `fill` layout or valid number strings.
  // Actually, let's keep it simple: if number, pass it. If string, try to parse.
  const parsed = parseInt(size as string, 10);
  if (!isNaN(parsed)) return { width: parsed, height: parsed };
  return { width: 24, height: 24 }; // Fallback
};

// --- Sub-Components ---

export function SimpleIcon({
  slug,
  size = 24,
  className,
  name,
  ...props
}: { slug: string } & SpecificIconProps) {
  const iconUrl = Generator.simpleIcon.url(slug);
  const sizeProps = getSizeProps(size);

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={iconUrl}
        alt={`${name || slug} icon`}
        className="object-contain"
        unoptimized
        {...sizeProps}
        {...props}
      />
    </div>
  );
}

export function DevIcon({
  config,
  size = 24,
  className,
  name,
  ...props
}: { config: string } & SpecificIconProps) {
  const [iconName, iconType = "original"] = config.split(":");
  const iconUrl = Generator.devIcon.url(iconName, iconType);
  const sizeProps = getSizeProps(size);

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={iconUrl}
        alt={`${name || iconName} icon`}
        className="object-contain"
        unoptimized
        {...sizeProps}
        {...props}
      />
    </div>
  );
}

export function LocalIcon({
  path,
  size = 24,
  className,
  name,
  ...props
}: { path: string } & SpecificIconProps) {
  const src = path.startsWith("/") ? path : `/${path}`;
  const sizeProps = getSizeProps(size);

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={`${name || "Local"} icon`}
        className="object-contain"
        unoptimized
        {...sizeProps}
        {...props}
      />
    </div>
  );
}

export function RemoteIcon({
  url,
  size = 24,
  className,
  name,
  ...props
}: { url: string } & SpecificIconProps) {
  const sizeProps = getSizeProps(size);

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={url}
        alt={`${name || "Remote"} icon`}
        className="object-contain"
        unoptimized
        {...sizeProps}
        {...props}
      />
    </div>
  );
}

export function FallbackIcon({
  size = 24,
  className,
  style,
}: {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground flex items-center justify-center rounded-full bg-gray-200 text-gray-500",
        className
      )}
      style={{ width: size, height: size, ...style }}
    >
      <span
        style={{ fontSize: typeof size === "number" ? size * 0.5 : "12px" }}
      >
        ?
      </span>
    </div>
  );
}

// --- Main Component ---

export function CustomIcon({
  icon,
  name,
  size = 24,
  className,
  ...props
}: IconProps) {
  if (!icon) return <FallbackIcon size={size} className={className} />;

  const firstColonIndex = icon.indexOf(":");

  if (firstColonIndex === -1) {
    return (
      <SimpleIcon
        slug={icon}
        name={name}
        size={size}
        className={className}
        {...props}
      />
    );
  }

  const type = icon.substring(0, firstColonIndex);
  const value = icon.substring(firstColonIndex + 1);

  switch (type) {
    case "simple":
      return (
        <SimpleIcon
          slug={value}
          name={name}
          size={size}
          className={className}
          {...props}
        />
      );
    case "dev":
      return (
        <DevIcon
          config={value}
          name={name}
          size={size}
          className={className}
          {...props}
        />
      );
    case "local":
      return (
        <LocalIcon
          path={value}
          name={name}
          size={size}
          className={className}
          {...props}
        />
      );
    case "remote":
      return (
        <RemoteIcon
          url={value}
          name={name}
          size={size}
          className={className}
          {...props}
        />
      );
    default:
      return <FallbackIcon size={size} className={className} />;
  }
}

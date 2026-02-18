import React, { CSSProperties } from "react";
import { cn } from "./utils";
import { Generator } from "./generator";

export interface IconProps {
  icon: string;
  name?: string;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
}

interface SpecificIconProps extends Omit<IconProps, "icon"> {}

export function SimpleIcon({
  slug,
  size = 24,
  className,
  name,
  style,
}: { slug: string } & SpecificIconProps) {
  const iconUrl = Generator.simpleIcon.url(slug);

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size, ...style }}
    >
      <img
        src={iconUrl}
        alt={`${name || slug} icon`}
        className="object-contain w-full h-full"
      />
    </div>
  );
}

export function DevIcon({
  config,
  size = 24,
  className,
  name,
  style,
}: { config: string } & SpecificIconProps) {
  const [iconName, iconType = "original"] = config.split(":");
  const iconUrl = Generator.devIcon.url(iconName, iconType);

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size, ...style }}
    >
      <img
        src={iconUrl}
        alt={`${name || iconName} icon`}
        className="object-contain w-full h-full"
      />
    </div>
  );
}

export function LocalIcon({
  path,
  size = 24,
  className,
  name,
  style,
}: { path: string } & SpecificIconProps) {
  const src = path.startsWith("/") ? path : `/${path}`;

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size, ...style }}
    >
      <img
        src={src}
        alt={`${name || "Local"} icon`}
        className="object-contain w-full h-full"
      />
    </div>
  );
}

export function RemoteIcon({
  url,
  size = 24,
  className,
  name,
  style,
}: { url: string } & SpecificIconProps) {
  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size, ...style }}
    >
      <img
        src={url}
        alt={`${name || "Remote"} icon`}
        className="object-contain w-full h-full"
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
  style?: CSSProperties;
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

function CustomIconMain({
  icon,
  name,
  size = 24,
  className,
  style,
}: IconProps) {
  if (!icon)
    return <FallbackIcon size={size} className={className} style={style} />;

  const firstColonIndex = icon.indexOf(":");

  if (firstColonIndex === -1) {
    return (
      <SimpleIcon
        slug={icon}
        name={name}
        size={size}
        className={className}
        style={style}
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
          style={style}
        />
      );
    case "dev":
      return (
        <DevIcon
          config={value}
          name={name}
          size={size}
          className={className}
          style={style}
        />
      );
    case "local":
      return (
        <LocalIcon
          path={value}
          name={name}
          size={size}
          className={className}
          style={style}
        />
      );
    case "remote":
      return (
        <RemoteIcon
          url={value}
          name={name}
          size={size}
          className={className}
          style={style}
        />
      );
    default:
      return <FallbackIcon size={size} className={className} style={style} />;
  }
}

export const CustomIcon = Object.assign(CustomIconMain, {
  simple: SimpleIcon,
  dev: DevIcon,
  local: LocalIcon,
  remote: RemoteIcon,
  fallback: FallbackIcon,
});

export default CustomIcon;

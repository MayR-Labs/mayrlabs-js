import React, { CSSProperties } from "react";
import { cn } from "./utils";
import { Generator } from "./core";

// --- Types ---

export interface IconProps {
  icon: string; // The full icon string (e.g., 'simple:asana')
  name?: string; // Optional name for alt text
  size?: number | string;
  className?: string;
  style?: CSSProperties;
}

interface SpecificIconProps extends Omit<IconProps, "icon"> {}

// --- Sub-Components ---

// Simple Icons: simple:icon-slug
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

// Dev Icons: dev:icon-name:type (type defaults to original)
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

// Local Icons: local:path/to/icon.{svg,png}
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

// Remote Icons: remote:https://example.com/path/to/icon.{svg,png}
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

// Fallback for unknown types
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
      {/* Default placeholder if needed */}
      <span
        style={{ fontSize: typeof size === "number" ? size * 0.5 : "12px" }}
      >
        ?
      </span>
    </div>
  );
}

// --- Main Component ---

export function WebIcon({
  icon,
  name,
  size = 24,
  className,
  style,
}: IconProps) {
  if (!icon)
    return <FallbackIcon size={size} className={className} style={style} />;

  // Check if there is a colon, if not, assume simple icon
  // This matches the original logic: "if (firstColonIndex === -1) ... SimpleIcon"
  // And the user requirement: "WebIcon icon would be something like simple:sample-icon... while SimpleIcon... would just be sample-icon"
  // Actually, wait. User said:
  // "The WebIcon is baically that detects the sub component to use based on the slug.
  // ... WebIcon icon would be something like `simple:sample-icon` ...
  // ... while SimpleIcon ... would just be `sample-icon`"
  //
  // Original code:
  // if (firstColonIndex === -1) { return <SimpleIcon slug={icon} ... /> }
  //
  // So if I pass "asana", it renders SimpleIcon("asana").
  // If I pass "simple:asana", it renders SimpleIcon("asana").

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

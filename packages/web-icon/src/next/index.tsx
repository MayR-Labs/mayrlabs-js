import Image, { type ImageProps } from "next/image";
import type React from "react";
import type { CSSProperties } from "react";
import { Generator } from "@/generator";

interface IconProps extends Omit<ImageProps, "src" | "alt"> {
  icon: string;
  name?: string;
  size?: number | string;
  unoptimized?: boolean;
}

interface SpecificIconProps extends Omit<IconProps, "icon"> {}

// Wrapper style to enforce size and positioning for Next.js Image fill
const getWrapperStyle = (
  size: number | string,
  style?: CSSProperties,
): CSSProperties => ({
  position: "relative",
  display: "inline-block",
  width: size,
  height: size,
  ...style,
});

const imageStyle: CSSProperties = {
  objectFit: "contain",
};

function BaseIconWrapper({
  src,
  alt,
  size,
  className,
  style,
  unoptimized,
  ...props
}: { src: string; alt: string } & SpecificIconProps) {
  return (
    <div className={className} style={getWrapperStyle(size ?? 24, style)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size ?? 24}px`}
        style={imageStyle}
        unoptimized={unoptimized}
        {...props}
      />
    </div>
  );
}

function SimpleIcon({
  slug,
  size = 24,
  name,
  unoptimized = false,
  ...props
}: { slug: string } & SpecificIconProps) {
  const iconUrl = Generator.simpleIcon.url(slug);
  return (
    <BaseIconWrapper
      src={iconUrl}
      alt={`${name || slug} simple icon`}
      size={size}
      unoptimized={unoptimized}
      {...props}
    />
  );
}

function DevIcon({
  config,
  size = 24,
  name,
  unoptimized = false,
  ...props
}: { config: string } & SpecificIconProps) {
  const [iconName, iconType = "original"] = config.split(":");
  const iconUrl = Generator.devIcon.url(iconName, iconType);
  return (
    <BaseIconWrapper
      src={iconUrl}
      alt={`${name || iconName} dev icon`}
      size={size}
      unoptimized={unoptimized}
      {...props}
    />
  );
}

function LocalIcon({
  path,
  size = 24,
  name,
  unoptimized = false,
  ...props
}: { path: string } & SpecificIconProps) {
  const src = path.startsWith("/") ? path : `/${path}`;
  return (
    <BaseIconWrapper
      src={src}
      alt={`${name || "local"} icon`}
      size={size}
      unoptimized={unoptimized}
      {...props}
    />
  );
}

function RemoteIcon({
  url,
  size = 24,
  name,
  unoptimized = false,
  ...props
}: { url: string } & SpecificIconProps) {
  return (
    <BaseIconWrapper
      src={url}
      alt={`${name || "remote"} icon`}
      size={size}
      unoptimized={unoptimized}
      {...props}
    />
  );
}

function FallbackIcon({
  size = 24,
  className,
  style,
}: {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties; // Use React.CSSProperties, explicit type
}) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9999px",
        backgroundColor: "#f3f4f6", // gray-100/muted equivalent
        color: "#6b7280", // gray-500/muted-foreground equivalent
        width: size,
        height: size,
        ...style,
      }}
    >
      <span
        style={{ fontSize: typeof size === "number" ? size * 0.5 : "12px" }}
      >
        ?
      </span>
    </div>
  );
}

export default function CustomIcon({
  icon,
  name,
  size = 24,
  className,
  unoptimized,
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
        unoptimized={unoptimized}
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
          unoptimized={unoptimized}
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
          unoptimized={unoptimized}
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
          unoptimized={unoptimized}
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
          unoptimized={unoptimized}
          {...props}
        />
      );
    default:
      return <FallbackIcon size={size} className={className} />;
  }
}

CustomIcon.simple = SimpleIcon;
CustomIcon.dev = DevIcon;
CustomIcon.local = LocalIcon;
CustomIcon.remote = RemoteIcon;
CustomIcon.fallback = FallbackIcon;

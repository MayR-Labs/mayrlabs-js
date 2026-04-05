import type { CSSProperties } from "react";
import { Generator } from "../generator";

interface IconProps {
  icon: string;
  name?: string;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
}

interface SpecificIconProps extends Omit<IconProps, "icon"> {}

// Shared wrapper style
const getWrapperStyle = (
  size: number | string,
  style?: CSSProperties,
): CSSProperties => ({
  display: "inline-block",
  width: size,
  height: size,
  ...style,
});

const imageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

function BaseIconWrapper({
  src,
  alt,
  size,
  className,
  style,
  ...props
}: { src: string; alt: string } & SpecificIconProps) {
  return (
    <div
      className={className}
      style={getWrapperStyle(size ?? 24, style)}
      {...props}
    >
      {/* biome-ignore lint/performance/noImgElement: icons are rendered via external URLs */}
      <img src={src} alt={alt} style={imageStyle} />
    </div>
  );
}

function SimpleIcon({
  slug,
  size = 24,
  name,
  ...props
}: { slug: string } & SpecificIconProps) {
  const iconUrl = Generator.simpleIcon.url(slug);

  return (
    <BaseIconWrapper
      src={iconUrl}
      alt={`${name || slug} simple icon`}
      size={size}
      {...props}
    />
  );
}

function DevIcon({
  config,
  size = 24,
  name,
  ...props
}: { config: string } & SpecificIconProps) {
  const [iconName, iconType = "original"] = config.split(":");
  const iconUrl = Generator.devIcon.url(iconName, iconType);

  return (
    <BaseIconWrapper
      src={iconUrl}
      alt={`${name || iconName} dev icon`}
      size={size}
      {...props}
    />
  );
}

function LocalIcon({
  path,
  size = 24,
  name,
  ...props
}: { path: string } & SpecificIconProps) {
  const src = path.startsWith("/") ? path : `/${path}`;

  return (
    <BaseIconWrapper
      src={src}
      alt={`${name || "local"} icon`}
      size={size}
      {...props}
    />
  );
}

function RemoteIcon({
  url,
  size = 24,
  name,
  ...props
}: { url: string } & SpecificIconProps) {
  return (
    <BaseIconWrapper
      src={url}
      alt={`${name || "remote"} icon`}
      size={size}
      {...props}
    />
  );
}

function FallbackIcon({
  size = 24,
  className,
  style,
  ...props
}: {
  size?: number | string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9999px",
        backgroundColor: "#f3f4f6", // gray-100
        color: "#6b7280", // gray-500
        width: size,
        height: size,
        ...style,
      }}
      {...props}
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
  style,
  ...props
}: IconProps) {
  if (!icon)
    return (
      <FallbackIcon
        size={size}
        className={className}
        style={style}
        {...props}
      />
    );

  const firstColonIndex = icon.indexOf(":");

  if (firstColonIndex === -1) {
    return (
      <SimpleIcon
        slug={icon}
        name={name}
        size={size}
        className={className}
        style={style}
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
          style={style}
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
          style={style}
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
          style={style}
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
          style={style}
          {...props}
        />
      );
    default:
      return (
        <FallbackIcon
          size={size}
          className={className}
          style={style}
          {...props}
        />
      );
  }
}

CustomIcon.simple = SimpleIcon;
CustomIcon.dev = DevIcon;
CustomIcon.local = LocalIcon;
CustomIcon.remote = RemoteIcon;
CustomIcon.fallback = FallbackIcon;

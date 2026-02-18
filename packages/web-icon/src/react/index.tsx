import { CSSProperties } from "react";
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
  style?: CSSProperties
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

function SimpleIcon({
  slug,
  size = 24,
  className,
  style,
  name,
  ...props
}: { slug: string } & SpecificIconProps) {
  const iconUrl = Generator.simpleIcon.url(slug);

  return (
    <div className={className} style={getWrapperStyle(size, style)} {...props}>
      <img src={iconUrl} alt={`${name || slug} icon`} style={imageStyle} />
    </div>
  );
}

function DevIcon({
  config,
  size = 24,
  className,
  style,
  name,
  ...props
}: { config: string } & SpecificIconProps) {
  const [iconName, iconType = "original"] = config.split(":");
  const iconUrl = Generator.devIcon.url(iconName, iconType);

  return (
    <div className={className} style={getWrapperStyle(size, style)} {...props}>
      <img src={iconUrl} alt={`${name || iconName} icon`} style={imageStyle} />
    </div>
  );
}

function LocalIcon({
  path,
  size = 24,
  className,
  style,
  name,
  ...props
}: { path: string } & SpecificIconProps) {
  const src = path.startsWith("/") ? path : `/${path}`;
  return (
    <div className={className} style={getWrapperStyle(size, style)} {...props}>
      <img src={src} alt={`${name || "Local"} icon`} style={imageStyle} />
    </div>
  );
}

function RemoteIcon({
  url,
  size = 24,
  className,
  style,
  name,
  ...props
}: { url: string } & SpecificIconProps) {
  return (
    <div className={className} style={getWrapperStyle(size, style)} {...props}>
      <img src={url} alt={`${name || "Remote"} icon`} style={imageStyle} />
    </div>
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

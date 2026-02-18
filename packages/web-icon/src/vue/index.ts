import { defineComponent, h, type PropType } from "vue";
import { cn } from "@/utils";
import { Generator } from "@/generator";

const props = {
  icon: { type: String, required: false }, // For CustomIcon
  slug: { type: String, required: false }, // For SimpleIcon
  config: { type: String, required: false }, // For DevIcon
  path: { type: String, required: false }, // For LocalIcon
  url: { type: String, required: false }, // For RemoteIcon
  name: { type: String, default: "" },
  size: { type: [Number, String] as PropType<number | string>, default: 24 },
  className: { type: String, default: "" },
};

const getContainerProps = (
  className: string | undefined,
  size: number | string
) => ({
  class: cn("relative inline-block", className),
  style: {
    width: typeof size === "number" ? `${size}px` : size,
    height: typeof size === "number" ? `${size}px` : size,
  },
});

const SimpleIcon = defineComponent({
  name: "SimpleIcon",
  props: { ...props, slug: { type: String, required: true } },
  setup(props) {
    return () => {
      const iconUrl = Generator.simpleIcon.url(props.slug);
      return h("div", getContainerProps(props.className, props.size), [
        h("img", {
          src: iconUrl,
          alt: `${props.name || props.slug} icon`,
          class: "object-contain w-full h-full",
        }),
      ]);
    };
  },
});

const DevIcon = defineComponent({
  name: "DevIcon",
  props: { ...props, config: { type: String, required: true } },
  setup(props) {
    return () => {
      const [iconName, iconType = "original"] = props.config.split(":");
      const iconUrl = Generator.devIcon.url(iconName, iconType);
      return h("div", getContainerProps(props.className, props.size), [
        h("img", {
          src: iconUrl,
          alt: `${props.name || iconName} icon`,
          class: "object-contain w-full h-full",
        }),
      ]);
    };
  },
});

const LocalIcon = defineComponent({
  name: "LocalIcon",
  props: { ...props, path: { type: String, required: true } },
  setup(props) {
    return () => {
      const src = props.path.startsWith("/") ? props.path : `/${props.path}`;
      return h("div", getContainerProps(props.className, props.size), [
        h("img", {
          src: src,
          alt: `${props.name || "Local"} icon`,
          class: "object-contain w-full h-full",
        }),
      ]);
    };
  },
});

const RemoteIcon = defineComponent({
  name: "RemoteIcon",
  props: { ...props, url: { type: String, required: true } },
  setup(props) {
    return () => {
      return h("div", getContainerProps(props.className, props.size), [
        h("img", {
          src: props.url,
          alt: `${props.name || "Remote"} icon`,
          class: "object-contain w-full h-full",
        }),
      ]);
    };
  },
});

const FallbackIcon = defineComponent({
  name: "FallbackIcon",
  props: { ...props },
  setup(props) {
    return () => {
      return h(
        "div",
        {
          class: cn(
            "bg-muted text-muted-foreground flex items-center justify-center rounded-full",
            props.className
          ),
          style: {
            width:
              typeof props.size === "number" ? `${props.size}px` : props.size,
            height:
              typeof props.size === "number" ? `${props.size}px` : props.size,
          },
        },
        [h("span", { style: { fontSize: "12px" } }, "?")]
      );
    };
  },
});

const CustomIconMain = defineComponent({
  name: "CustomIcon",
  props: { ...props, icon: { type: String, required: true } },
  setup(props) {
    return () => {
      if (!props.icon) {
        return h(FallbackIcon, {
          size: props.size,
          className: props.className,
        });
      }

      const firstColonIndex = props.icon.indexOf(":");

      if (firstColonIndex === -1) {
        return h(SimpleIcon, {
          slug: props.icon,
          name: props.name,
          size: props.size,
          className: props.className,
        });
      }

      const type = props.icon.substring(0, firstColonIndex);
      const value = props.icon.substring(firstColonIndex + 1);

      switch (type) {
        case "simple":
          return h(SimpleIcon, {
            slug: value,
            name: props.name,
            size: props.size,
            className: props.className,
          });
        case "dev":
          return h(DevIcon, {
            config: value,
            name: props.name,
            size: props.size,
            className: props.className,
          });
        case "local":
          return h(LocalIcon, {
            path: value,
            name: props.name,
            size: props.size,
            className: props.className,
          });
        case "remote":
          return h(RemoteIcon, {
            url: value,
            name: props.name,
            size: props.size,
            className: props.className,
          });
        default:
          return h(FallbackIcon, {
            size: props.size,
            className: props.className,
          });
      }
    };
  },
});

export const CustomIcon = Object.assign(CustomIconMain, {
  simple: SimpleIcon,
  dev: DevIcon,
  local: LocalIcon,
  remote: RemoteIcon,
  fallback: FallbackIcon,
});

export default CustomIcon;

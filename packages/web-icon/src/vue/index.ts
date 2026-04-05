import { defineComponent, h, type PropType, type StyleValue } from "vue";
import { Generator } from "../generator";

const props = {
  icon: { type: String, required: false }, // For CustomIcon
  name: { type: String, required: false },
  size: { type: [Number, String] as PropType<number | string>, default: 24 },
  className: { type: String, default: "" },
  class: { type: String, default: "" }, // Vue standard check
};

// Helper to construct style object
const getStyle = (size: number | string): StyleValue => ({
  display: "inline-block",
  width: typeof size === "number" ? `${size}px` : size,
  height: typeof size === "number" ? `${size}px` : size,
});

const imgStyle: StyleValue = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

// Base wrapper component to avoid repeating the div+img combination
const BaseIconWrapper = defineComponent({
  name: "BaseIconWrapper",
  props: {
    ...props,
    src: { type: String, required: true },
    alt: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h(
        "div",
        {
          class: props.className || props.class,
          style: getStyle(props.size),
        },
        h("img", {
          src: props.src,
          alt: props.alt,
          style: imgStyle,
        }),
      );
  },
});

const SimpleIcon = defineComponent({
  name: "SimpleIcon",
  props: { ...props, slug: { type: String, required: true } },
  setup(props) {
    return () => {
      const iconUrl = Generator.simpleIcon.url(props.slug);
      return h(BaseIconWrapper, {
        ...props,
        src: iconUrl,
        alt: `${props.name || props.slug} simple icon`,
      });
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
      return h(BaseIconWrapper, {
        ...props,
        src: iconUrl,
        alt: `${props.name || iconName} dev icon`,
      });
    };
  },
});

const LocalIcon = defineComponent({
  name: "LocalIcon",
  props: { ...props, path: { type: String, required: true } },
  setup(props) {
    return () => {
      const src = props.path.startsWith("/") ? props.path : `/${props.path}`;
      return h(BaseIconWrapper, {
        ...props,
        src: src,
        alt: `${props.name || "local"} icon`,
      });
    };
  },
});

const RemoteIcon = defineComponent({
  name: "RemoteIcon",
  props: { ...props, url: { type: String, required: true } },
  setup(props) {
    return () => {
      return h(BaseIconWrapper, {
        ...props,
        src: props.url,
        alt: `${props.name || "remote"} icon`,
      });
    };
  },
});

const FallbackIcon = defineComponent({
  name: "FallbackIcon",
  props: { ...props },
  setup(props) {
    return () => {
      const sizeVal = props.size;
      return h(
        "div",
        {
          class: props.className || props.class,
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9999px",
            backgroundColor: "#f3f4f6", // gray-100
            color: "#6b7280", // gray-500
            width: typeof sizeVal === "number" ? `${sizeVal}px` : sizeVal,
            height: typeof sizeVal === "number" ? `${sizeVal}px` : sizeVal,
          },
        },
        h(
          "span",
          {
            style: {
              fontSize:
                typeof sizeVal === "number" ? `${sizeVal * 0.5}px` : "12px",
            },
          },
          "?",
        ),
      );
    };
  },
});

export default function CustomIcon(props: any, { attrs }: any) {
  const icon = props.icon;
  if (!icon) return h(FallbackIcon, { ...props, ...attrs });

  const firstColonIndex = icon.indexOf(":");
  if (firstColonIndex === -1) {
    return h(SimpleIcon, { ...props, ...attrs, slug: icon });
  }

  const type = icon.substring(0, firstColonIndex);
  const value = icon.substring(firstColonIndex + 1);

  switch (type) {
    case "simple":
      return h(SimpleIcon, { ...props, ...attrs, slug: value });
    case "dev":
      return h(DevIcon, { ...props, ...attrs, config: value });
    case "local":
      return h(LocalIcon, { ...props, ...attrs, path: value });
    case "remote":
      return h(RemoteIcon, { ...props, ...attrs, url: value });
    default:
      return h(FallbackIcon, { ...props, ...attrs });
  }
}

// Vue function components can have static properties attached like this
CustomIcon.simple = SimpleIcon;
CustomIcon.dev = DevIcon;
CustomIcon.local = LocalIcon;
CustomIcon.remote = RemoteIcon;
CustomIcon.fallback = FallbackIcon;

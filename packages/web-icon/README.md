# @mayrlabs/web-icon

A framework-agnostic icon package for React, Vue, and Next.js, supporting Simple Icons, Dev Icons, Local, and Remote icons.

## Installation

```bash
npm install @mayrlabs/web-icon
# Peer dependencies
npm install react # for React usage
npm install vue # for Vue usage
npm install next # for Next.js usage
```

## Usage

### Icon Types & Formats

The icon components and core functions support auto-dispatching based on a prefixed string, or explicit sub-components for specific icon types.

#### 1. Simple Icons (`simple:`)

Load icons from [Simple Icons](https://simpleicons.org/).

- **Auto-dispatch:** `icon="simple:github"` (or simply `icon="github"`, as it defaults to `simple` if no prefix is provided).
- **Sub-component:** `<CustomIcon.simple slug="github" />`

#### 2. Dev Icons (`dev:`)

Load icons from [Devicon](https://devicon.dev/). You can specify both the icon name and its variant. Valid variants are `original`, `original-wordmark`, `plain`, and `plain-wordmark`. If the variant is omitted or invalid, it defaults to `original`.

- **Auto-dispatch:** Format is `dev:<icon-name>:<variant>` or `dev:<icon-name>`. Example: `icon="dev:react"`, `icon="dev:react:original"`, or `icon="dev:github:original-wordmark"`.
- **Sub-component:** `<CustomIcon.dev config="react:original" />`

#### 3. Local Icons (`local:`)

Load icons stored locally in your project's public directory.

- **Auto-dispatch:** `icon="local:/assets/icon.svg"` (or `icon="local:assets/icon.svg"`)
- **Sub-component:** `<CustomIcon.local path="/assets/icon.svg" />`

#### 4. Remote Icons (`remote:`)

Load icons from any absolute external URL.

- **Auto-dispatch:** `icon="remote:https://example.com/icon.png"`
- **Sub-component:** `<CustomIcon.remote url="https://example.com/icon.png" />`

### Generator (Root Export)

```typescript
import { Generator } from "@mayrlabs/web-icon";

const url = Generator.simpleIcon.url("asana");
```

### React

```tsx
import CustomIcon from "@mayrlabs/web-icon/react";

export function App() {
  return (
    <div className="flex gap-4">
      {/* Auto-dispatch */}
      <CustomIcon icon="simple:asana" size={32} />
      <CustomIcon icon="dev:react:original" size={32} />
      <CustomIcon icon="local:/assets/icon.svg" size={32} />
      <CustomIcon icon="remote:https://example.com/icon.png" size={32} />

      {/* Sub-components via dot-notation */}
      <CustomIcon.simple slug="github" size={32} />
      <CustomIcon.dev config="react:original" size={32} />
      <CustomIcon.local path="/assets/icon.svg" size={32} />
      <CustomIcon.remote url="https://example.com/icon.png" size={32} />
    </div>
  );
}
```

### Next.js

Optimized for Next.js using `next/image`.

```tsx
import CustomIcon from "@mayrlabs/web-icon/next";

export function App() {
  return (
    <>
      <CustomIcon icon="simple:asana" size={32} />
      <CustomIcon.simple slug="github" size={32} />
    </>
  );
}
```

### Vue

```vue
<script setup>
import CustomIcon from "@mayrlabs/web-icon/vue";
</script>

<template>
  <div class="flex gap-4">
    <CustomIcon icon="simple:asana" :size="32" />
    <CustomIcon.simple slug="github" :size="32" />
  </div>
</template>
```

### Core (Plain HTML)

Returns HTML strings.

```typescript
import CustomIcon from "@mayrlabs/web-icon/core";

const html1 = CustomIcon({ icon: "simple:asana", size: 32 });
const html2 = CustomIcon.simple({ slug: "github", size: 32 });
```

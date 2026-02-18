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

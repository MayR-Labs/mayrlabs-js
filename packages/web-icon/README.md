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
import { CustomIcon, SimpleIcon, DevIcon } from "@mayrlabs/web-icon/react";

export function App() {
  return (
    <div className="flex gap-4">
      <CustomIcon icon="simple:asana" size={32} />
      <CustomIcon icon="dev:react:original" size={32} />
      <SimpleIcon slug="github" />
    </div>
  );
}
```

### Next.js

Optimized for Next.js using `next/image`.

```tsx
import { CustomIcon } from "@mayrlabs/web-icon/next";

export function App() {
  return <CustomIcon icon="simple:asana" size={32} />;
}
```

### Vue

```vue
<script setup>
import { CustomIcon } from "@mayrlabs/web-icon/vue";
</script>

<template>
  <CustomIcon icon="simple:asana" :size="32" />
</template>
```

### Core (Plain HTML)

Returns HTML strings.

```typescript
import { CustomIcon } from "@mayrlabs/web-icon/core";

const html = CustomIcon({ icon: "simple:asana", size: 32 });
// <div ...><img ... /></div>
```

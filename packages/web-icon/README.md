# @mayrlabs/web-icon

A framework-agnostic icon package for React and Vue, supporting Simple Icons, Dev Icons, Local, and Remote icons.

## Installation

```bash
npm install @mayrlabs/web-icon
# Peer dependencies
npm install react # for React usage
npm install vue # for Vue usage
```

## Usage

The package exposes three entry points: `core`, `react`, and `vue`.

### Core (Framework Agnostic)

Useful for plain HTML/JS or custom integrations.

```typescript
import { Generator } from "@mayrlabs/web-icon/core";

// Generate URLs
const simpleUrl = Generator.simpleIcon.url("asana");
// https://cdn.simpleicons.org/asana

const devUrl = Generator.devIcon.url("react", "original");
// https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg

// Generic resolver
const url = Generator.iconUrl("simple:asana");
```

### React

Includes `WebIcon` dispatcher and specific icon components.

```tsx
import {
  WebIcon,
  SimpleIcon,
  DevIcon,
  LocalIcon,
  RemoteIcon,
} from "@mayrlabs/web-icon/react";

export function App() {
  return (
    <div className="flex gap-4">
      {/* Auto-dispatch based on prefix */}
      <WebIcon icon="simple:asana" size={32} />
      <WebIcon icon="dev:react:original" size={32} />
      <WebIcon icon="local:/assets/my-icon.svg" size={32} />
      <WebIcon icon="remote:https://example.com/logo.png" size={32} />

      {/* Specific Components */}
      <SimpleIcon slug="github" />
      <DevIcon config="typescript:original" />
    </div>
  );
}
```

### Vue

Includes functional Vue components.

```vue
<script setup>
import { WebIcon, SimpleIcon, DevIcon } from "@mayrlabs/web-icon/vue";
</script>

<template>
  <div class="flex gap-4">
    <!-- Auto-dispatch based on prefix -->
    <WebIcon icon="simple:asana" :size="32" />
    <WebIcon icon="dev:vuejs:original" :size="32" />

    <!-- Specific Components -->
    <SimpleIcon slug="github" />
    <DevIcon config="javascript:plain" />
  </div>
</template>
```

## Icon Types Supported

- **Simple Icons**: Prefix `simple:`. Uses [Simple Icons CDN](https://simpleicons.org/).
- **Dev Icons**: Prefix `dev:`. Uses [Devicon](https://devicon.dev/).
- **Local Icons**: Prefix `local:`. Refers to local assets (e.g., in `public` folder).
- **Remote Icons**: Prefix `remote:`. Direct URL to an image.

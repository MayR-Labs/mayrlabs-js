<script setup lang="ts">
import CustomIcon from "@mayrlabs/web-icon/vue";
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    <h1>Vue Icon Playground</h1>

    <section>
      <h2>Auto-Dispatch (via icon prop)</h2>
      <div style="display: flex; gap: 10px;">
        <CustomIcon icon="simple:asana" :size="32" />
        <CustomIcon icon="dev:react:original" :size="32" />
        <CustomIcon icon="local:assets/icon.svg" :size="32" />
        <CustomIcon icon="remote:https://example.com/icon.png" :size="32" />
      </div>
    </section>

    <section>
      <h2>Dot-Notation</h2>
      <div style="display: flex; gap: 10px;">
        <CustomIcon.simple slug="github" :size="32" />
        <CustomIcon.dev config="vuejs:original" :size="32" />
        <CustomIcon.local path="/assets/icon.svg" :size="32" />
        <CustomIcon.remote url="https://example.com/icon.png" :size="32" />
      </div>
    </section>

    <section>
      <h2>Styling & Sizing</h2>
      <CustomIcon.simple
        slug="twitter"
        :size="48"
        class="text-blue-500"
        style="border: 1px solid #ccc; padding: 4px;"
      />
    </section>
  </div>
</template>

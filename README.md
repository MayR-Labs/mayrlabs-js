# mayrlabs-js

A Turborepo monorepo for MayR Labs JavaScript/TypeScript tooling.

This repository is the home for shared packages, internal tooling, and playgrounds used to build, test, and evolve MayR Labs projects. The goal is to keep reusable logic centralised, iteration fast, and standards consistent.

---

## ✨ What lives here

This repo is intentionally simple and opinionated. It is organised into three top-level areas:

- `apps/` – runnable applications or long‑lived tools
- `packages/` – reusable libraries and CLI packages
- `playground/` – disposable sandboxes for testing packages in real-world conditions

The README avoids listing individual apps or packages on purpose. Those change. The structure does not.

---

## ✅ Requirements

- Node.js (LTS recommended)
- npm (or the package manager configured for this repo)

---

## 🚀 Getting started

Install all dependencies from the repo root:

```bash
npm install
```

Run Turborepo tasks:

```bash
npm run turbo
```

Common workflows:

```bash
npm run build
npm run dev
npm run lint
npm run test
```

Turborepo handles dependency ordering automatically when pipelines are configured correctly.

---

## 🧱 Repository layout

```txt
mayrlabs-js/
  apps/
  packages/
  playground/
  turbo.json
  package.json
```

---

## 🧪 Using the playground

The `playground/` directory exists purely for fast feedback.

It allows you to:

- Install local packages as if they were published
- Test CLIs interactively
- Reproduce real consumer behaviour without polluting actual apps

Example local install using a file reference:

```bash
npm install "@mayrlabs/some-package@file:../../packages/some-package"
```

For smoother iteration, workspace linking is preferred.

---

## 🧰 Workspace linking

Internal packages should usually be consumed via workspace resolution.

Example dependency:

```json
{
  "dependencies": {
    "@mayrlabs/some-package": "*"
  }
}
```

Then install from the repo root:

```bash
npm install
```

This keeps changes flowing instantly without reinstalls.

---

## 📦 Versioning & publishing

This repo is designed to work cleanly with Changesets.

Create a changeset:

```bash
npx changeset
```

Apply version bumps:

```bash
npx changeset version
```

Publish packages:

```bash
npx changeset publish
```

For public scoped packages, ensure the following exists in the package configuration:

```json
{
  "publishConfig": { "access": "public" }
}
```

---

## 🧭 Conventions

- Scoped packages use `@mayrlabs/*`
- Prefer small, focused packages over “god modules”
- Avoid circular dependencies
- CLIs must provide a useful `--help`

If a tool is added, it should be easy to remove.

---

## 🛠 Troubleshooting

### Package not found when using npx

- Confirm the package is published and public
- Check `publishConfig.access`
- Verify the package name exactly (npm is literal-minded)

### Local changes not reflected

- File-based installs may require reinstall
- Prefer workspace linking for active development

---

## 📄 Licence

MIT, unless stated otherwise in a specific package.

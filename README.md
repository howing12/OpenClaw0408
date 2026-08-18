# OpenClaw0408 — Todo List

A modern todo list web app built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. Deployed to **GitHub Pages** as a fully static site (no server, no database — data persists in the browser via LocalStorage).

## Features

- ➕ Add tasks
- ✏️ Edit tasks (click a task or the pencil icon)
- 🗑️ Delete tasks
- ✅ Mark tasks as complete / active
- 🔎 Filter by All / Active / Completed
- 🧹 Clear completed
- 🌗 Dark / light mode
- 💾 LocalStorage persistence
- 📱 Fully responsive

## Tech stack

- Next.js 14 (App Router, `output: "export"` static export)
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI primitives)
- lucide-react icons

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The static site is generated to `out/` and auto-deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml` on every push to `main`.

# Deep Pasnani — Portfolio

Personal portfolio and professional resume site for **Deep Pasnani**, a Computer Engineering student specializing in quant tooling, applied machine learning, and full-stack systems.

Built as a server-rendered, single-page application with TanStack Start, React, and Tailwind CSS.

## Tech Stack

| Layer        | Technology                                                                     |
| ------------ | ------------------------------------------------------------------------------ |
| Framework    | [TanStack Start](https://tanstack.com/start) (v1) with React Router           |
| UI           | React 19, TypeScript 5.8                                                       |
| Styling      | Tailwind CSS 4 (via `@tailwindcss/vite`)                                       |
| Animations   | Motion (Framer Motion successor), Lenis smooth scroll                          |
| Data         | TanStack Query (server/client state)                                           |
| Server       | Nitro 3 (SSR wrapper via `src/server.ts`)                                      |
| Build        | Vite 8                                                                         |
| Package Mgr  | Bun / npm                                                                      |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.x (or Node.js >= 20 with npm)

### Install

```bash
bun install
```

### Development

```bash
bun run dev
```

Starts the Vite dev server with HMR and TanStack Router devtools enabled.

### Build & Preview

```bash
bun run build     # production build
bun run preview   # serve the production build locally
bun run start     # run via the Nitro server
```

### Static-ish / Development Build

```bash
bun run build:dev # vite build --mode development
```

## Project Structure

```
├── public/                    # Static assets (portrait, lords images)
├── src/
│   ├── components/            # UI components (nav, footer, cursor, transitions)
│   │   └── ui/                # Primitive UI components
│   ├── content/site.ts        # Single source of truth for all site content
│   ├── lib/                   # Utilities, error capture & reporting
│   ├── routes/                # File-based TanStack Router routes
│   ├── router.tsx             # Router + QueryClient setup
│   ├── server.ts              # Nitro SSR server entry (used by the build)
│   ├── start.ts               # Start instance + SSR error & CSRF middleware
│   ├── routeTree.gen.ts       # Generated route tree (do not edit)
│   └── styles.css             # Tailwind entry & global styles
├── vite.config.ts             # Build configuration (Lovable preset)
├── tsconfig.json
└── package.json
```

### Content

All site content (profile info, skills, projects, certifications, work experience, nav) is maintained centrally in [`src/content/site.ts`](src/content/site.ts). Edits there propagate to the corresponding routes — no component changes required for content updates.

## Routes

| Route            | Purpose                              |
| ---------------- | ------------------------------------ |
| `/`              | Landing / hero                       |
| `/about`         | Bio and background                   |
| `/skills`        | Skill matrix grouped by domain       |
| `/projects`      | Portfolio projects by category       |
| `/certifications`| Certifications & virtual labs        |
| `/experience`    | Work experience                      |
| `/contact`       | Contact links                        |

## Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `bun run dev`        | Start the dev server                     |
| `bun run build`      | Production build                         |
| `bun run build:dev`  | Development-mode build                   |
| `bun run preview`    | Preview the production build             |
| `bun run start`      | Start the Nitro production server        |

## Deployment

The app is built with the Lovable Vite/TanStack preset and defaults to a Cloudflare-compatible Nitro target (see [`vite.config.ts`](vite.config.ts)). The Nitro compatibility date is pinned to `2024-09-23` to keep local preview and deployments stable.

> **Note:** TanStack Start route files are code-generated (`src/routeTree.gen.ts`) and gitignored via `.tanstack/**` — regenerate them on build.

## License

Private. All content, code, and design © Deep Pasnani.

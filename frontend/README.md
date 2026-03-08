# Frontend – React + Vite + shadcn/ui

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **shadcn/ui** – theme (CSS variables), `cn()` in `@/lib/utils`, and a sample **Button** in `@/components/ui/button`

## Add more shadcn components

From the frontend folder:

```bash
pnpm dlx shadcn@latest add card input dialog
```

Components are added under `src/components/ui/`. The project already has `components.json`, path alias `@/*` → `./src/*`, and the required dependencies (CVA, clsx, tailwind-merge, Radix, lucide-react).

## Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173. The app proxies `/api` to the backend (default http://localhost:4000).

# old-zebra-ui

**Archived — do not use.**

This was the first iteration of the Houseclay admin portal. It has been replaced by [`zebra-ui`](../zebra-ui/README.md).

| | old-zebra-ui | zebra-ui (current) |
|-|-------------|-------------------|
| Build tool | Vite 6, SPA | Next.js 15, App Router |
| Routing | react-router-dom 7 | File-based (App Router) |
| UI library | Material UI (MUI) 7 | Tailwind CSS (custom) |
| State | Redux Toolkit | Redux Toolkit |
| Rendering | Client-side only | SSR / SSG / Server Components |

The migration to `zebra-ui` was driven by the need for server-side rendering capabilities, a lighter custom design system, and alignment with the `hc-frontend` architecture.

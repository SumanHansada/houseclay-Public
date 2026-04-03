This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure and Design

Brief descriptions of top-level folders under `src/`.

- **app**: Contains pages and route segments per Next.js App Router.
- **base-components**: Foundational UI primitives (e.g., Button, Autocomplete, Input).
- **components**: Reusable feature-level UI components.
- **services**: API clients and service-layer utilities.
- **layout-components**: Layout wrappers (headers, footers, containers, grids).
- **hooks**: Custom React hooks.
- **interfaces**: TypeScript interfaces and types.
- **common**: Shared constants and utility helpers.
- **form-components**: Form fields and form-specific components/integrations.
- **utility-components**: Small helper/presentation components (e.g., loaders, skeletons).
- **data**: Static data and JSON fixtures.
- **icons**: SVG assets and icon components.
- **providers**: App-level context/providers (theme, store, etc.).
- **store**: State management setup (slices, selectors, configuration).
- **dialogs**: Modal and dialog components.
- **hoc**: Higher-order components.
- **utils**: General-purpose utility functions.
- **stories**: Storybook stories and examples.

## Coding Guidelines

### Styling with Tailwind CSS

- Use Tailwind for all styling. Prefer utility classes; avoid custom CSS unless strictly necessary.
- Build mobile-first, then layer responsive overrides with `md:` and `lg:`.

### Responsive breakpoints

We use three core breakpoints (Tailwind defaults):

- **`max-md:`**: Mobile-only styles (applies below `md`).
- **`md:`**: Applies at and above tablet (tablet and desktop baseline).
- **`lg:`**: Applies at and above desktop.

Guidelines:

- **Mobile-first**: Write base classes for mobile; add `md:` and `lg:` overrides as needed.
- **Tablet-specific layouts**: To target tablet-only behaviors, set styles at `md:` and then override again at `lg:`. Pair with `max-md:` for the mobile case.
- **Large screens**: Do not add larger breakpoints by default. The UI should adapt for `md:` and `lg:`. Use `xl`, `2xl`, or `3xl` only when necessary for images or typography rendering fidelity.
- **Avoid custom media queries** unless there is a documented, exceptional need.

Examples:

```html
<!-- Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>

<!-- Tablet-only visibility: hidden on mobile and desktop -->
<div class="hidden md:block lg:hidden"></div>

<!-- Mobile-specific tweak -->
<img class="w-full max-md:h-40 md:h-64 lg:h-72" />
```

## Sizing and Spacing (height, width, margin, padding)

### Height and width

- Prefer Tailwind utilities up to `h-96` / `w-96`, or fractional sizes like `h-1/2`, `w-1/2`, etc.
- Avoid custom pixel or percentage sizes unless strictly required by the design.
- Let content flow naturally; only constrain when there is a clear design need.

Examples:

```html
<div class="h-64 w-full md:h-80 lg:h-96"></div>
<img class="w-1/2 md:w-2/3 lg:w-3/4" />
```

### Padding, margin, and containers

- Standard horizontal padding for major containers:
  - `xl:px-24 lg:px-12 md:px-8 px-4`
  - Vertical padding (`py-*`) depends on the design; choose per context.
- On standalone mobile UI, horizontal padding is always `px-6`.
- For very wide screens or pages that don’t scale nicely, wrap content with Tailwind’s `container` utility to keep a readable max width.

Examples:

```html
<section
  class="container mx-auto xl:px-24 lg:px-12 md:px-8 px-4 py-8"
></section>
```

### Sectioning and structure

- Group related UI into semantic `<section>` blocks for readability and layout control.
- Place desktop markup first and mobile markup below it.
- Use sections and comments to separate logical chunks.

```html
<!-- Desktop section -->
<section class="hidden md:block">...</section>

<!-- Mobile section -->
<section class="block md:hidden">...</section>
```

### Visibility and performance

- We do not conditionally render desktop vs mobile with JavaScript for performance reasons.
- Load both desktop and mobile DOM where necessary, and control visibility with CSS:
  - `max-md:hidden` to hide on mobile
  - `md:hidden` to hide on tablet and above

Examples:

```html
<!-- Shown on desktop/tablet, hidden on mobile -->
<div class="max-md:hidden">Desktop/tablet UI</div>

<!-- Shown on mobile, hidden from tablet upward -->
<div class="md:hidden">Mobile UI</div>
```

### When conditional rendering is needed

- If CSS alone cannot express the behavior (e.g., choosing a dialog type, coordinating an animation), use the device context:
  - `useDeviceContext()` from `providers/DeviceContextProvider.tsx` exposes `{ isMobile, isTablet, isDesktop }`.

```tsx
import { useDeviceContext } from "@/providers/DeviceContextProvider";

const Example = () => {
  const { isMobile, isTablet, isDesktop } = useDeviceContext();
  return isMobile ? <MobileDialog /> : <DesktopDialog />;
};
```

### Main content wrapper

- Header/footer offsets are already handled; you don’t need extra CSS for margins/paddings. Use the shared main wrapper:

```html
<main
  class="mx-auto my-0 pt-14 max-md:pb-16 flex-1 flex flex-col justify-center"
></main>
```

# Code Conventions

This project is a React 19 + TypeScript portfolio site built with Vite. It uses React Router for pages, SCSS Modules for component styling, i18next for localized content, and Zustand for client-side state.

## Architecture

- `src/main.tsx` is the app entry point. It loads global styles, initializes i18n, applies the default theme class, and renders the router.
- `src/routes/index.tsx` owns route definitions. Route-level screens live under `src/pages`.
- `src/layouts` contains shared page shells. `DefaultLayout` wraps most non-home routes with nav, mobile nav, outlet, and footer.
- `src/components` contains reusable UI components. Components are usually grouped by domain, such as `home`, `projects`, `skills`, `nav`, and `common`.
- `src/service` contains typed data access modules. Each domain generally has `types.ts`, static `data`, a `Client`, a `Service`, and a Zustand `Store`.
- `src/hooks` contains reusable React hooks.
- `src/styles` contains global SCSS, theme files, variables, colors, fonts, typography, and animations.
- `src/i18n` contains locale JSON files. User-facing portfolio copy is usually read through translation keys.
- `public` contains static source assets. `docs` is the Vite build output used for GitHub Pages.

## File And Folder Style

- Use lowercase folder names for pages and components.
- Prefer `index.tsx` as the public component/page entry file inside a folder.
- Put component-local styles beside the component as `styles.module.scss`.
- Use domain-specific folders when a feature has multiple parts, for example `components/projects/project-list`.
- Keep shared utilities in `common`, `hooks`, `service/default`, or `styles` rather than duplicating them in feature folders.
- Existing microapps use `.jsx` plus matching `.d.ts` and `.module.scss` files; keep each microapp self-contained under `src/pages/microapps`.

## TypeScript And React Style

- Prefer functional components and hooks.
- Export named components for most TypeScript components, for example `export const ProjectItem = ...`.
- Define prop shapes with local `interface` declarations named after the component, such as `ProjectItemProps`.
- Accept optional `className?: string` when a reusable component needs parent layout control.
- Keep route pages thin. Compose reusable components from `src/components` rather than embedding large UI sections directly in `src/pages`.
- Use `useMemo` and `useCallback` around derived lists and callback-heavy logic when the component already does non-trivial filtering, searching, or rendering.
- Keep effects focused. Fetch list/detail data in `useEffect`; reset layout state and scroll position in layout/page-level effects.
- Avoid adding new `any` usage unless matching an existing generic boundary or interop limitation.

## Styling

- Use SCSS Modules for component styles: `import styles from "./styles.module.scss"`.
- Use camelCase class names in modules, matching current usage like `projectDetails`, `projectImage`, and `mobileNav`.
- Import shared SCSS tokens with `@use`, usually from `styles/colors` and `styles/variables`.
- Reuse existing spacing, transition, breakpoint, color, and layout variables instead of hard-coding repeated values.
- Keep responsive behavior in the component's module file with media queries based on shared breakpoints.
- Global resets, fonts, typography, animations, and theme rules belong in `src/styles`, not in component modules.

## Data And State

- Domain data should flow through the service layer where possible:
  - `types.ts` defines entities and filter shapes.
  - `data.ts` or `data.tsx` provides fallback/static data.
  - `Client` handles API-or-fallback data access.
  - `Service` wraps client methods.
  - `Store` exposes Zustand state and fetch/set actions.
- Stores should expose loading and error state for async fetches.
- Keep store actions small and explicit, such as `fetchProjectList`, `fetchProject`, `setSearchTerm`, and `setFilters`.
- Prefer typed entities from the service domain instead of duplicating object shapes in components.

## Localization

- Use `useTranslation` for user-facing text that appears in the main portfolio experience.
- Store translated content in `src/i18n/*.json` using stable keys.
- For project and skill content, follow existing key patterns such as `data.projects.description.${id}`.
- If a component renders HTML from translations, keep the source key trusted and narrowly scoped.

## Assets

- Use `public/imgs`, `public/videos`, and `public/fonts` for static assets referenced by the app.
- Reference public assets with the existing relative style, such as `./imgs/theme1.jpg`, unless the surrounding code uses another convention.
- Keep generated deploy assets in `docs` separate from source assets in `public`.

## Storybook And Validation

- Storybook stories live beside components as `index.stories.tsx`.
- Run `npm run lint` after code changes when practical.
- Run `npm run build` before deploy-related changes or changes that affect routing, TypeScript types, or production output.
- Use `npm run dev` for local Vite development and `npm run storybook` for isolated component work.

## Build And Deploy

- `npm run build` runs TypeScript build mode and Vite.
- Vite writes production output to `docs` for GitHub Pages.
- `npm run deploy` currently aliases the production build; commit updated `docs` output when publishing the site.

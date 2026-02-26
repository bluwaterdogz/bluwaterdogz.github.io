# BluWaterDogz Portfolio Site

A React + TypeScript portfolio website for showcasing projects, skills, and personal work.

Live site: [https://bluwaterdogz.github.io](https://bluwaterdogz.github.io)

## Stack

- React 19
- TypeScript
- Vite
- React Router
- SCSS Modules
- i18next (multi-language support)
- Zustand (state management)

## What This Project Includes

- Main portfolio pages:
  - Home
  - About
  - Skills
  - Projects
- Dynamic project detail pages (`/project/:id`)
- Microapps section (`/microapps`) with standalone mini apps:
  - Thai Learning Flashcards
  - Todo App (localStorage + drag/drop categories)
- Storybook for UI/component development

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start local dev server

```bash
npm run dev
```

Then open the local URL shown in terminal (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - TypeScript compile + production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook on port 6006
- `npm run build-storybook` - Build static Storybook output
- `npm run deploy` - Deploy `dist` to GitHub Pages (runs `predeploy` first)

## Build and Deploy

```bash
npm run build
npm run deploy
```

This project is configured with:

- `homepage`: `https://bluwaterdogz.github.io`
- `gh-pages`: deploys from the `dist` directory

## Project Structure (High-Level)

```text
src/
  components/    # Reusable UI components
  layouts/       # Shared layout wrappers
  pages/         # Route-level pages
    microapps/   # Standalone micro apps
  routes/        # Router config
  service/       # Data/service layer
  stores/        # Zustand stores
  styles/        # Global SCSS and theme variables
```

## Notes

- This site is actively evolving.
- Architecture intentionally favors scalability and separation of concerns.

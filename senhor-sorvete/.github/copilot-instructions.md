## Purpose
Short, targeted instructions to help an AI coding agent be productive in this repository.

## Quick start (commands)
- Install: `npm ci` (or `npm install`)
- Dev server: `npm start` (CRA dev server; opens on http://10.0.0.26:3000 in README)
- Build: `npm run build` (outputs to `build/`)
- Tests: `npm test`

## Big picture
- This is a Create React App (CRA) single-page application that mixes JavaScript and TypeScript files.
- Client-side routing is defined in `src/routes.js` (react-router v6).
- Global state uses Redux Toolkit; store is in `src/store/store.ts` and slices live under `src/store/slices` (example: `filtroCardapio`).
- Services that call backend APIs are under `src/service`. The axios instance is at `src/service/api/ApiConfig.ts` and centralizes baseURL and auth header injection.

## Data flow & API conventions
- Use the shared axios instance (`src/service/api/ApiConfig.ts`) for backend calls so the Authorization header (taken from `sessionStorage.getItem('token')`) and baseURL are applied automatically.
  - Example: prefer `Api.get('/produtos/ativos')` instead of `axios.get('https://mestre-sorvete-back-end.onrender.com/produtos/ativos')`.
- Service functions commonly return typed results or an `ApiException` (see `src/service/SubtipoService.ts` and `src/service/api/ApiException.ts`). Follow that pattern when adding new services.

## Component & file conventions
- Pages live under `src/app/pages/*` and are grouped by feature (e.g., `cardapio`, `ADM`, `home`).
- Shared UI components go into `src/app/shared/components/*` with a local CSS file next to the component (e.g., `index.jsx` + `component.css`).
- Hooks for page-specific logic are under feature folders in `hooks/` (example: `src/app/pages/cardapio/hooks/useCardapio.ts`). Keep fetch and UI state logic inside these hooks when possible.

## Patterns to follow / gotchas
- Mixed JS/TS: `tsconfig.json` exists but many files are `.js`/.jsx. When adding TypeScript, keep `allowJs: true` in mind and add types incrementally.
- Error handling: services wrap errors into `ApiException`. Use this to signal upstream UI code instead of throwing raw errors.
- Notifications: user-facing errors/feedback use `react-toastify` (see usages in hooks/pages). Use `toast.error`/`toast.success` for consistency.
- Authentication token: read from sessionStorage under key `token`. Do not hardcode tokens or credentials.
- Styling: project predominantly uses plain CSS files per component; avoid introducing global styles without justification.

## Integration & external dependencies
- Backend base URL is configured in `src/service/api/ApiConfig.ts` (currently points to `https://mestre-sorvete-back-end.onrender.com`).
- Major libs: React 18, react-router-dom v6, Redux Toolkit, axios, MUI, PrimeReact, styled-components, react-toastify.

## Examples (do this style)
- Replace direct axios usage with the shared Api instance:
  - Before (found in repo):
    - `axios.get('https://mestre-sorvete-back-end.onrender.com/produtos/ativos')`
  - After:
    - `import Api from 'src/service/api/ApiConfig';` then `Api.get('/produtos/ativos')`

## Where to look first when debugging or changing behavior
- Routing: `src/routes.js`
- App boot: `src/index.js`, `src/App.js`
- Store & slices: `src/store/store.ts`, `src/store/slices/*`
- API common behavior: `src/service/api/ApiConfig.ts` and `src/service/api/ApiException.ts`
- Cardápio feature (important business area): `src/app/pages/cardapio/*` including `hooks/useCardapio.ts` and `sections/*`

## Developer workflow notes
- Dev server uses CRA (`react-scripts start`). If the environment requires a different host/port, update the `start` script or provide .env files for CRA.
- There's a `Dockerfile` at repo root; confirm build artifacts (`build/`) are what the Dockerfile expects.

## Small guardrails for AI edits
- Prefer minimal, local changes. Follow existing file structure and naming patterns.
- When adding network calls, use the `Api` instance to avoid missing auth headers.
- Preserve Portuguese UI strings unless working on i18n explicitly.
- When converting a file to TypeScript, update adjacent imports and ensure build passes (`npm run build`).

If anything above is unclear or you'd like more examples (e.g., common slice shape or a short code sample showing Api+slice), tell me which area and I'll expand.

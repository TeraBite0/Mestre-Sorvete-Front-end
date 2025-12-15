# Mestre Sorvete Front-end AI Coding Guidelines

## Architecture Overview
- **SPA Structure**: React app with public pages (Home, Cardapio, Gastronomia, Contato) and ADM admin panel (Dashboard, Estoque, etc.).
- **Component Organization**: Pages use `sections/` for UI composition (e.g., [HeroSection.tsx](src/app/pages/Home/sections/HeroSection.tsx)), `modals/` for interactions, and `hooks/` for state/API logic.
- **Shared Components**: Reusable UI in `src/app/shared/components/` (e.g., Header, Footer, Modals).
- **Routing**: React Router with paths like `/cardapio`, `/adm/dashboard` (see [routes.js](src/routes.js)).
- **Data Flow**: Hooks fetch from backend API (e.g., `https://mestre-sorvete-back-end.onrender.com/`) using axios/fetch; state managed locally per hook.

## Key Patterns
- **Language Mix**: Use TypeScript for hooks (e.g., [useHome.ts](src/app/pages/Home/hooks/useHome.ts)) and complex components; JavaScript for simpler pages.
- **Styling**: CSS files per component/page (e.g., `home.css`); styled-components available but primarily CSS-based.
- **State Management**: Local state in hooks; no global state library.
- **Notifications**: Use `react-toastify` for user feedback (ToastContainer in [App.js](src/App.js)).
- **Icons/Libraries**: FontAwesome, Material-UI, PrimeReact for UI elements; Chart.js for ADM charts.

## Workflows
- **Development**: `npm start` runs on `http://10.0.0.26:3000` (custom host).
- **Build**: `npm run build` for production static files.
- **Deployment**: Docker multi-stage build (Node build, Nginx serve); Nginx proxies `/api/` to backend load balancer.
- **Testing**: `npm test` (Jest/React Testing Library); minimal tests exist.
- **Linting**: Standard CRA ESLint config.

## Conventions
- **File Structure**: `src/app/pages/[Page]/[sections|hooks|modals]/`; shared in `src/app/shared/`.
- **Imports**: Relative paths; destructure props in components.
- **API Calls**: Async functions in hooks; error handling with try/catch and console.error.
- **ADM Pages**: Use `HeaderGerenciamento`, `BotaoGerenciamento`; charts with Chart.js registration.
- **Images**: Stored in `public/Imagens/`; reference as `Imagens/...`.

## Integration Points
- **Backend API**: RESTful endpoints for products, orders; CORS handled by Nginx.
- **External Services**: None prominent; potential for email/newsletter in future.
- **Mobile/Web Sync**: Shared backend with mobile app.

Reference: [package.json](senhor-sorvete/package.json) for deps; [Dockerfile](senhor-sorvete/Dockerfile) for build.</content>
<parameter name="filePath">c:\ws-vscode\Mestre-Sorvete-Front-end\.github\copilot-instructions.md
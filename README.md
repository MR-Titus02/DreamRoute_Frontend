# DreamRoute frontend

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Set `VITE_API_URL` to the backend API base URL, including its path prefix (for example, `http://localhost:5001/api`).
4. Set the Stripe public key for the Stripe environment in use.
5. Start the app with `npm run dev`.

All frontend API requests use the shared Axios client in `src/api/axios.js`. Change `VITE_API_URL` once for a different deployment. If it is unset, the client uses the same-origin `/api` path. Vite environment values are embedded at build time, so configure them in the hosting provider before each production build; do not place private API or Stripe secret keys in `VITE_*` variables.

## Checks

- `npm run build`
- `npm run lint`

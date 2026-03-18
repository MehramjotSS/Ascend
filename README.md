## ASCEND

Monorepo-style project with a Node/Express/MongoDB backend and a Vite + React + Tailwind frontend.

### Structure

- `backend` – Express server, MongoDB connection, and basic health check route.
- `frontend` – Vite + React app styled with Tailwind CSS.

### Running the backend

From `/Users/abc/Desktop/Ascend/backend`:

```bash
npm install
npm run dev
```

Environment variables (create a `.env` file in `backend` if you haven't already):

```bash
PORT=5001
MONGODB_URI=mongodb://localhost:27017/gym_progress_dev
```

Health check endpoint:

- `GET /api/health` → `{ "status": "OK" }`

### Running the frontend

From `/Users/abc/Desktop/Ascend/frontend`:

```bash
npm install
npm run dev
```

Then open the printed local URL (by default `http://localhost:5173`).

The root page renders: **“Gym Progress App – Phase 0 Setup”**.


# Hospital & Equipment Management System Scaffold

This repository contains:

- `app`: Next.js frontend (App Router)
- `server`: Node.js + Express backend with MongoDB (Mongoose)

## 1) Setup

### Backend

1. Copy env file:

   ```bash
   cp server/.env.example server/.env
   ```

2. Install dependencies:

   ```bash
   cd server && npm install
   ```

3. Start backend:

   ```bash
   npm run dev
   ```

Backend runs at `http://localhost:5001`.

### Frontend

1. Install dependencies:

   ```bash
   cd app && npm install
   ```

2. Start frontend:

   ```bash
   npm run dev
   ```

Frontend runs at `http://localhost:3000`.

Optional frontend envs (`app/.env.local`):

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

## 2) Health check

- Backend route: `GET /api/health`
- Expected response:

```json
{
  "message": "Server is running"
}
```

The frontend homepage calls `/api/health` and displays the response.

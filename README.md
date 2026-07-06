# compuroom

![CI](https://github.com/Worxchit/compuroom/actions/workflows/ci.yml/badge.svg)

Computer Lab Equipment Registry — a CRUD system for tracking computer assets (asset code, brand/model, CPU/RAM specs, room location, and operational status).

## Student Information

| Field | Value |
|---|---|
| Name | นาย วรชิต ดีไร่ |
| Student ID | 68319010028 |
| Class | 30901-2008 กลุ่ม 2 |
| Course | DevOps 30901-2008 — Midterm Practical Exam |

## Tech Stack

- **Backend:** Node.js, Express, PostgreSQL (`pg`)
- **Frontend:** HTML + Vanilla JavaScript
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions
- **Registry:** Docker Hub

## Project Structure

```
compuroom/
├── backend/                 # Express REST API
│   ├── src/
│   │   ├── config/db.js     # PostgreSQL connection pool
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # Express routers
│   │   ├── db/init.sql      # Schema + seed data
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/                # Jest/Supertest test suite
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/                 # Static HTML/JS UI
│   ├── public/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   ├── config.js.template    # Runtime env substitution (API_BASE_URL)
│   ├── docker-entrypoint.sh
│   └── Dockerfile
├── .github/workflows/ci.yml  # lint -> test -> build pipeline
├── docker-compose.yml         # Local development (3 services)
├── docker-compose.prod.yml    # Production (pulls from Docker Hub)
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/assets` | List all assets |
| GET | `/api/assets/:id` | Get asset by ID |
| POST | `/api/assets` | Create a new asset |
| PUT | `/api/assets/:id` | Update an asset |
| DELETE | `/api/assets/:id` | Delete an asset |

### Asset fields

| Field | Type | Notes |
|---|---|---|
| `asset_code` | string | unique, required |
| `brand` | string | required |
| `model` | string | required |
| `cpu` | string | optional |
| `ram` | string | optional |
| `room` | string | required |
| `status` | string | `active` \| `repair` \| `disposed` (default `active`) |

## Running Locally with Docker Compose (recommended)

```bash
git clone https://github.com/Worxchit/compuroom.git
cd compuroom
docker compose up -d --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

Data persists in the `db_data` named volume across container restarts.

## Running in Production (Docker Hub images)

```bash
docker compose -f docker-compose.prod.yml up -d
```

Pulls prebuilt images instead of building locally:

- Backend: [`kanompungz/compuroom-api`](https://hub.docker.com/r/kanompungz/compuroom-api) (tags: `latest`, `v1.0.0`)
- Frontend: [`kanompungz/compuroom-web`](https://hub.docker.com/r/kanompungz/compuroom-web) (tags: `latest`, `v1.0.0`)

## Running Without Docker

**Backend**

```bash
cd backend
cp .env.example .env   # adjust PG* values to point at your local Postgres
npm install
npm run dev
```

**Frontend**

Serve `frontend/public` with any static file server (e.g. `npx http-server frontend/public`), and make sure `config.js` sets `window.API_BASE_URL` to your backend URL.

## Tests & Linting

```bash
cd backend
npm run lint   # ESLint
npm test       # Jest + Supertest
```

## CI/CD Pipeline

Every push and pull request runs a 3-stage GitHub Actions pipeline:

1. **Lint** — ESLint over `backend/src`
2. **Test** — Jest/Supertest suite (6 test cases covering health check and asset CRUD)
3. **Build** — Docker image build for both backend and frontend

## Git Workflow

- `main` — stable/release branch
- `develop` — integration branch
- `feature/*` — one branch per feature, merged into `develop` via Pull Request

# Primo

**Primo** is a French land-data platform that lets users explore, analyze, and collaborate around cadastral parcels, real-estate transactions, urban-planning rules, and geographic points of interest - all on an interactive map.

Live at **[primo-data.fr](https://primo-data.fr)** - Web app at **[app.primo-data.fr](https://app.primo-data.fr)**

---

## Architecture

The monorepo contains four workspaces:

| Directory | Role | Stack |
|---|---|---|
| `back/` | REST API | NestJS 11, TypeORM, MySQL |
| `web/` | Web client | React 19, Vite, Tailwind CSS v4, Leaflet |
| `mobile/` | Mobile client | React Native (Expo 54), NativeWind |
| `landing-page/` | Marketing site | Astro |

### Infrastructure services

| Service | Purpose |
|---|---|
| **MySQL 8** | Relational data (users, projects, notifications, history) |
| **PostGIS + GeoServer** | Spatial data serving (parcels, sections, BD TOPO) |
| **Addok** | French address geocoding (offline, data from IGN/BAN) |
| **Ollama** | Local LLM for AI-assisted queries |
| **Brevo** | Transactional email (verification, password reset) |
| **Traefik** | TLS termination and reverse proxy |

---

## Features

- **Interactive cadastral map** - browse French parcels, sections, and departments by clicking or searching an address
- **Parcel details** - surface area, legal references, building footprints (BD TOPO), GPU urban-planning zones and prescriptions
- **DVF history** - full real-estate transaction history for any parcel (Demandes de Valeurs Foncières)
- **POI layer** - points of interest filtered by type and bounding box
- **Project workspaces** - create and share named projects, pin notes to parcels, manage team members
- **Activity history** - per-project event log
- **Notification system** - in-app alerts on workspace activity
- **AI assistant** - on-device LLM chat powered by Ollama
- **Authentication** - email/password with email verification, Google OAuth, JWT sessions
- **Admin panel** - user and platform management
- **Mobile app** - same map and parcel features on iOS and Android via Expo

---

## Getting started

### Prerequisites

- Node.js 20+, Yarn
- Docker & Docker Compose
- A running MySQL 8 instance (or use the compose stack)

### Backend

```bash
cd back
cp .env.example .env   # fill in the variables listed below
yarn install
yarn start:dev
```

Required environment variables (see `deployment/docker-compose-backend.yml` for the full list):

| Variable | Description |
|---|---|
| `MYSQL_HOST` | MySQL host |
| `MYSQL_PORT` | MySQL port (default `6673`) |
| `MYSQL_USER` | MySQL user |
| `MYSQL_PASSWORD` | MySQL password |
| `MYSQL_DATABASE` | Database name |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `ADDOK_URL` | URL of the Addok geocoding service |
| `EXTERNE_GEOSERVER_URL` | GeoServer base URL |
| `BREVO_API_URL` | Brevo SMTP API endpoint |
| `BREVO_API_KEY` | Brevo API key |
| `EMAIL_VERIFICATION_URL` | Frontend URL for email verification links |
| `FRONT_URL` | Frontend origin (used for CORS and redirect links) |
| `OLLAMA_API_URL` | Ollama inference endpoint |

### Web client

```bash
cd web
yarn install
yarn dev        # http://localhost:5173
```

Set `VITE_API_URL` to point at the backend (defaults to `http://localhost:3000`).

### Mobile client

```bash
cd mobile
yarn install
expo start      # scan QR code with Expo Go, or use --ios / --android
```

Set `API_URL` in `mobile/.env` to point at the backend.

### Landing page

```bash
cd landing-page
yarn install
yarn dev
```

---

## Full-stack deployment with Docker

Two compose files live in `deployment/`:

| File | What it starts |
|---|---|
| `docker-compose-backend.yml` | Backend API, MySQL, PostGIS, GeoServer, Addok, Ollama, phpMyAdmin, Traefik |
| `docker-compose.yml` | Frontend, Landing page, Traefik |

```bash
cd deployment

# Start infrastructure + backend
docker compose -f docker-compose-backend.yml up -d

# Start frontend services
docker compose -f docker-compose.yml up -d
```

### Geodata setup

Helper scripts are provided to import official French datasets:

```bash
# Import BD TOPO (IGN topographic database)
bash deployment/import-bdtopo.sh

# Import cadastral parcels
bash deployment/install-parcelle.sh

# Import cadastral sections
bash deployment/install-section.sh

# Install and seed Addok address database
bash deployment/install-addock.sh
```

---

## CI/CD

GitHub Actions (`.github/workflows/docker-publish.yml`) builds and pushes Docker images to Docker Hub on every push to `dev` or `main`:

| Image | Tag |
|---|---|
| `garoverr/primo-backend` | `dev` / `latest` |
| `garoverr/primo-frontend` | `dev` / `latest` |
| `garoverr/primo-landing` | `dev` / `latest` |

Additional workflows run backend unit tests, build checks, and frontend build tests on every pull request.

---

## API overview

All routes are prefixed by the backend base URL. Protected routes require a `Bearer <jwt>` header.

| Prefix | Description |
|---|---|
| `POST /auth/register` | Register with email + password |
| `POST /auth/login` | Log in, returns JWT |
| `POST /auth/google` | Google OAuth login |
| `GET  /auth/verify` | Validate token, refresh last-connection |
| `GET/POST/PATCH/DELETE /projects` | Project workspace CRUD |
| `GET /geo/departements` | List all French departments (GeoJSON) |
| `GET /geo/communes/:deptCode` | Communes for a department |
| `GET /geo/pois?bbox=&types=` | Points of interest in a bounding box |
| `GET /dvf/parcelle/:id` | Real-estate transaction history for a 14-char parcel ID |
| `GET /notifications` | User notifications |
| `GET /history/:projectId` | Activity events for a project |
| `POST /ai/ask` | Proxy to Ollama LLM |
| `/addok/*` | Proxy to Addok geocoding API |
| `/geoserver/*` | Proxy to GeoServer WMS/WFS |

---

## Project structure

```
Primo/
├── back/               # NestJS API
│   └── src/
│       ├── auth/       # JWT + Google OAuth
│       ├── user/       # User management
│       ├── project/    # Workspace CRUD
│       ├── project-members/
│       ├── geo/        # Geographic data endpoints
│       ├── dvf/        # Real-estate transactions
│       ├── notification/
│       ├── history/    # Activity log
│       ├── mail/       # Brevo email service
│       ├── database/   # TypeORM entities
│       └── api/        # Addok / GeoServer / Ollama proxies
├── web/                # React SPA
│   └── src/
│       ├── pages/      # Route-level components
│       ├── components/ # Shared UI
│       ├── requests/   # API client functions
│       └── context/    # Auth + global state
├── mobile/             # Expo app
│   └── src/
│       ├── screens/    # Auth, Dashboard, Map, Settings
│       ├── navigation/ # Stack navigators
│       └── requests/   # API client functions
├── landing-page/       # Astro marketing site
└── deployment/         # Docker Compose + data import scripts
```


[Creative Commons Attribution-NonCommercial 4.0 International](LICENSE) - free for non-commercial use with attribution.

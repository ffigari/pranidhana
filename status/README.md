# Status Monitoring App

A modular status monitoring application with three interfaces: CLI, REST API, and React Web UI.

## Architecture

This project follows a clean, modular architecture with strict module boundaries:

### Modules

- **src/domain** - Domain models (AppStatus interface)
- **src/core** - Shared business logic
- **src/persistent-memory** - Database layer (migrations, schema)
- **src/bootstrap** - Initialization and dependency injection
- **src/cli** - Command-line interface
- **src/web-api** - REST API server (Express)
- **src/web-ui** - React single-page application

### Module Boundaries

The ESLint configuration enforces these import rules:

- `src/domain` → can import NOTHING
- `src/core` → can only import from `@domain`
- `src/persistent-memory` → can import from `@domain`
- `src/bootstrap` → can import `@domain`, `@core`, `@persistent-memory`
- `src/web-ui` → can only import from `@domain`
- `src/web-api` → can import `@domain`, `@core`, `@bootstrap`
- `src/cli` → can import `@domain`, `@core`, `@bootstrap`

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```
PGHOST=localhost
PGPORT=5432
PGDATABASE=status_db
PGUSER=postgres
PGPASSWORD=your_password_here
PORT=3000
```

### 3. Run Migrations

Build the CLI and run migrations:

```bash
npm run build:cli
npm run cli run-migrations
```

## Usage

### CLI

Build and use the CLI:

```bash
npm run build:cli
npm run cli get app-statuses
```

Available commands:
- `status get app-statuses` - Get all app statuses
- `status run-migrations` - Run database migrations

### Web API

Build and start the API server:

```bash
npm run build
npm run build:api
npm run start:api
```

The API will be available at `http://localhost:3000`

Endpoint:
- `GET /api/app-statuses` - Returns all app statuses

### Web UI (Development)

Start the Vite dev server:

```bash
npm run dev
```

The UI will be available at `http://localhost:5173` (proxies API calls to `http://localhost:3000`)

### Web UI (Production)

Build everything and start the API server (which serves the static React build):

```bash
npm run build
npm run build:api
npm run start:api
```

Visit `http://localhost:3000` to see the React app.

## Development

### Building

- `npm run build` - Build React app (TypeScript + Vite)
- `npm run build:api` - Build API server (tsup)
- `npm run build:cli` - Build CLI (tsup)

### Code Quality

- `npm run lint-check` - Run ESLint
- `npm run format-check` - Check code formatting
- `npm run format-write` - Auto-format code
- `npm test` - Run tests (Vitest)

## Current State

The app is currently using **hardcoded data** in the core business logic layer (`src/core/app-statuses.ts`). The data includes two apps:
- personal-website (ok: true)
- bin-paste (ok: true)

The persistent memory layer has migrations functionality set up, but the core layer is not yet using it for data retrieval. The schema is defined using Drizzle ORM and ready for future implementation.

## Technology Stack

- **TypeScript** - Strict typing throughout
- **React** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool for web UI
- **tsup** - Build tool for CLI and API
- **Express** - API server
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database schema
- **Bootstrap** - UI styling (via CDN)
- **ESLint** - Code linting with module boundary enforcement
- **Prettier** - Code formatting
- **Vitest** - Testing framework

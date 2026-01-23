# Paste Bin Clone

A pastebin clone application with three interfaces: CLI, Web API, and React Web UI.

## Project Structure

```
src/
├── domain/     - Domain models (Entry interface)
├── core/       - Shared business logic
├── cli/        - CLI implementation
├── web-api/    - REST API server
└── web-ui/     - React SPA
```

## Setup

```bash
npm install --legacy-peer-deps
```

Note: `--legacy-peer-deps` is required due to ESLint dependency conflicts.

## CLI

Build and run the CLI:

```bash
npm run build:cli
npm run cli get entry {id}
```

Example:
```bash
npm run cli get entry 123
```

## Web API

Build and start the API server:

```bash
npm run build:api
npm run start:api
```

The API will be available at `http://localhost:3000`

Endpoint:
- `GET /api/entries/:id` - Get entry by ID

Example:
```bash
curl http://localhost:3000/api/entries/123
```

## React Web UI

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

Routes:
- `/` - Home page
- `/entries/:id` - Entry detail page

Build for production:

```bash
npm run build
```

## Architecture

### Import Restrictions

- `web-ui` can only import from `@domain`
- `web-api` can import from `@domain` and `@core`
- `cli` can import from `@domain` and `@core`
- `core` can only import from `@domain`
- No relative back imports (e.g., `../web-ui`) are allowed

### Path Aliases

- `@domain` → `src/domain`
- `@core` → `src/core`

## Development

Run linting:

```bash
npm run lint
```

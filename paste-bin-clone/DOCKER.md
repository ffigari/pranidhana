# Docker Deployment Guide

This guide explains how to deploy the paste-bin-clone application to your Digital Ocean server using Docker.

## Prerequisites

- Existing `pg` PostgreSQL container running on your server
- Port 3004 available on your server

## Step 1: Build the Docker Image

On your local machine or on the server:

```bash
docker build -t paste-bin-clone .
```

## Step 2: Create Network (if not exists)

Check if you already have a network connecting your containers. If not, create one:

```bash
# Create network
docker network create paste-bin-net

# Connect existing postgres to the network
docker network connect paste-bin-net pg
```

## Step 3: Create .env File on Server

Create a `.env` file in your deployment directory with these variables:

```bash
PGHOST=pg
PGPORT=5432
PGDATABASE=paste_bin_clone
PGUSER=figari
PGPASSWORD=
```

**Note**: `PGHOST=pg` works because both containers will be on the same Docker network.

## Step 4: Run the Container

```bash
docker run -d \
  --name paste-bin-clone \
  --network paste-bin-net \
  -p 3004:3000 \
  --env-file .env \
  --restart unless-stopped \
  paste-bin-clone
```

This will:
- Run the container in detached mode (`-d`)
- Name it `paste-bin-clone`
- Connect it to the `paste-bin-net` network (same as `pg`)
- Map port 3004 on host to port 3000 in container
- Load environment variables from `.env` file
- Restart automatically unless explicitly stopped

## Step 5: Run Database Migrations

Before using the app, run migrations to set up the database schema:

```bash
docker exec paste-bin-clone node dist/cli/index.js run-migrations
```

## Verify Deployment

Check that the container is running:

```bash
docker ps | grep paste-bin-clone
```

Check logs:

```bash
docker logs paste-bin-clone
```

Access the application at: `http://your-server-ip:3004`

## Using the CLI

### Create an Entry

```bash
echo '{"text":"Hello from CLI"}' | docker exec -i paste-bin-clone node dist/cli/index.js create entry
```

### Get an Entry

```bash
docker exec paste-bin-clone node dist/cli/index.js get entry <entry-id>
```

## Updating the Application

1. Build new image:
   ```bash
   docker build -t paste-bin-clone .
   ```

2. Stop and remove old container:
   ```bash
   docker stop paste-bin-clone
   docker rm paste-bin-clone
   ```

3. Run new container (same command as Step 4)

4. Run migrations if needed:
   ```bash
   docker exec paste-bin-clone node dist/cli/index.js run-migrations
   ```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker logs paste-bin-clone
```

### Can't connect to database

Verify both containers are on the same network:
```bash
docker network inspect paste-bin-net
```

You should see both `pg` and `paste-bin-clone` in the "Containers" section.

### Test database connection

```bash
docker exec paste-bin-clone node -e "console.log('Testing connection...')"
```

## Architecture

```
┌──────────────────────────────────────┐
│     Your Digital Ocean Server        │
│                                      │
│  ┌────────────────────────────────┐  │
│  │    paste-bin-net (network)     │  │
│  │                                │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │  paste-bin-clone         │  │  │
│  │  │  - React UI (static)     │  │  │
│  │  │  - Express API           │  │  │
│  │  │  - CLI                   │  │  │
│  │  │  Port: 3004 → 3000       │  │  │
│  │  └──────────────────────────┘  │  │
│  │             ↓                  │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │  pg (PostgreSQL)         │  │  │
│  │  │  Port: 5432              │  │  │
│  │  └──────────────────────────┘  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

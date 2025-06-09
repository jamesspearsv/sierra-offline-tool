# Sierra Offline Circulation Tool

A simple circulation tool built to help manage offline circulations at a public library

> [!IMPORTANT]
> This app is in active development subject to breaking changes without notice.

## App Structure

This app includes a Vue client and a Hono server that communicate using a basic REST API.

- **Hono Server**: Handles API requests and database operations
- **Vue Client**: Provides a UI to interact with the API, track local state, and manage unsynced checkouts

## Deployment

This app is deployed using Docker and Docker Compose. In production the Vue client is built and bundled with the Hono server to run as a single process.

Use the included `DOCKERFILE` and `docker-compose.yaml` to get started.

### Docker Instructions

> [!NOTE]
> pnpm is required to use this repo. Run `npm install -g pnpm` to install

1. Clone this repo
2. `pnpm install`
3. `pnpm docker:build`
4. `pnpm docker:run`

Or

1. `docker compose up`

### Public Docker Image

This tool has a public Docker image that can be used in the following `docker-compose.yaml`

```Docker
services:
  app:
    image: ghcr.io/jamesspearsv/sierra-offline-tool:latest
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production
    restart: unless-stopped
    volumes:
      - app-data:/app/data
volumes:
  app-data:
```

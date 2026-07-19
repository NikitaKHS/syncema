# Deployment

1. Provision PostgreSQL, Redis, DNS, TLS, and secret storage.
2. Set strong JWT secrets, production origins, database/Redis URLs, Google web client ID, and a server-restricted YouTube Data API key.
3. Run Prisma migrations as a one-shot release job.
4. Build immutable images with `docker compose -f compose.yaml -f compose.production.yaml build`.
5. Start and require `/api/v1/health` liveness plus `/api/v1/ready` readiness before traffic.
6. Verify WebSocket upgrade, CORS, App Links, refresh rotation, reconnect recovery, and database backup restoration.

`compose.production.yaml` is a single-host reference, not a substitute for managed secrets, backups, monitoring, or multi-zone infrastructure.

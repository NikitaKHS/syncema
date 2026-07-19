# Delivery plan

## Vertical MVP

- [x] Repository conventions and architecture decisions
- [x] Versioned REST and realtime contracts
- [x] Guest session and refresh rotation
- [x] Room create/join/leave and invite flow
- [x] Authoritative Socket.IO room state, chat, presence, and reconnect snapshots
- [x] Responsive web room with YouTube adapter and ru/en-ready UI structure
- [x] Native Compose room shell, deep links, and isolated YouTube WebView
- [ ] PostgreSQL/Redis production repository adapters (schema and Compose topology are ready)
- [x] Automated, contract, and visual verification available in this environment

## Production hardening after MVP

- Google identity credentials and server-side ID token verification
- FCM/Crashlytics concrete providers
- Redis Streams adapter load and failover test
- External Postgres migration rehearsal and backup/restore drill
- Signed Android release in the owner's secure CI environment
- YouTube API audit and quota monitoring with production credentials

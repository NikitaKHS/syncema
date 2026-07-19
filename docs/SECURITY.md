# Security

- Access tokens are short-lived; refresh tokens rotate and are stored hashed. Browser refresh tokens belong in Secure, HttpOnly, SameSite cookies in production. Android stores them through Keystore-backed encrypted storage.
- DTO validation uses a global whitelist and rejects unknown fields. Public endpoints use request limits; auth and invite endpoints have stricter limits.
- CORS is an explicit allow-list. Helmet applies baseline response headers. Structured logs redact authorization, cookies, tokens, and secrets.
- Room authorization is checked both for REST mutations and every realtime command. Sequence numbers and server timestamps prevent stale-event replay.
- The player WebView allows JavaScript only for the app-owned bootstrap page, blocks arbitrary navigation and file/content access, and exposes a narrow message bridge.
- Production startup must use high-entropy JWT secrets, TLS, managed database credentials, and a restricted YouTube key. Rotate credentials after suspected exposure.

Report vulnerabilities privately to the repository owner; do not open a public issue containing exploit details or secrets.

# Testing

`pnpm check` runs lint, type checks, unit tests, and production builds across JavaScript/TypeScript packages. `pnpm --filter @video-together/web test:e2e` runs Playwright after the web/API dev servers are available.

Contract checks parse OpenAPI, AsyncAPI, and realtime JSON Schemas. API tests cover synchronization math, authorization boundaries, and room lifecycle. Web tests cover URL parsing, theme persistence, and primary room interactions.

Android: from `apps/android`, run `gradlew testDebugUnitTest lintDebug assembleDebug`; with an emulator run `gradlew connectedDebugAndroidTest`; for an unsigned release bundle run `gradlew bundleRelease`. A production signing key is intentionally not generated.

Visual QA evidence belongs in `docs/screenshots` for desktop, mobile portrait, tablet/landscape, light theme, and dark theme.

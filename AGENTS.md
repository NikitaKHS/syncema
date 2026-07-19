# Video Together repository guide

## Scope

This repository contains a web client, a NestJS API/Socket.IO gateway, a native Android client, shared contracts, and local/production infrastructure.

## Working agreements

- Keep TypeScript strict and Kotlin null-safe.
- Treat `packages/contracts` as the source of truth for public REST and realtime payloads.
- Never expose YouTube, Google, database, Redis, signing, or JWT credentials to a client or commit them.
- The YouTube player must remain an official IFrame embed with its controls visible and unobstructed.
- Android WebView is permitted only inside `YouTubePlayerView`; do not turn the app into a WebView wrapper.
- Every behavior change should include the narrowest useful automated test.
- Run `pnpm check` for JavaScript/TypeScript changes. Run `apps/android/gradlew testDebugUnitTest lintDebug` for Android changes when an Android toolchain is available.
- Do not deploy, push, publish, or generate production signing keys without explicit user approval.

## Directory ownership

- `apps/web`: Next.js web client and browser tests.
- `apps/api`: NestJS REST API and Socket.IO authority.
- `apps/android`: native Kotlin/Compose application.
- `packages/contracts`: OpenAPI, AsyncAPI, and JSON Schemas.
- `packages/shared`: framework-neutral TypeScript domain types and sync math.
- `infra`: reverse proxy and operational configuration.
- `docs`: architecture, compliance, security, operations, and verification evidence.

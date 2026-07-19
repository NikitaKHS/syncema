# Development

## Windows / VS Code

Install Node.js 22 LTS, enable Corepack, copy `.env.example` to `.env`, then run `pnpm install` and `pnpm dev`. Use the checked-in VS Code tasks for web/API startup. Docker Desktop is optional for the credential-free vertical MVP and required for PostgreSQL/Redis integration.

Older Corepack builds can reject a newly rotated pnpm signing key. The non-global fallback is `npx --yes pnpm@10.13.1 install` followed by `npx --yes pnpm@10.13.1 dev`.

Android development requires Android Studio, JDK 21, SDK Platform 36, Build Tools 36, and an emulator/device. Put the SDK location in `apps/android/local.properties` as `sdk.dir=C:\\Users\\you\\AppData\\Local\\Android\\Sdk`, then run `apps\android\gradlew.bat testDebugUnitTest assembleDebug`.

## Linux

Install Node.js 22 LTS, Corepack, Docker Engine with Compose, JDK 17+, and Android SDK 37 (the app still targets API 36). Run `corepack prepare pnpm@10.13.1 --activate`, `cp .env.example .env`, `pnpm install`, then `pnpm dev`.

Never place secrets in `NEXT_PUBLIC_*`, Gradle source files, or checked-in resources.

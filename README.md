# Cheapskate

Cheapskate is a grocery price tracking app. The project is organized as an npm workspace so the mobile app, backend code, and shared packages can grow independently.

## Workspace

- `apps/` - applications, starting with the future Expo mobile app at `apps/mobile`
- `packages/` - shared packages such as database, shared types, or config

## Commands

```sh
npm install
npm run lint
npm run typecheck
npm run test
```

The root scripts delegate to workspace packages when those packages define matching scripts.

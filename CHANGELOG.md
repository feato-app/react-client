# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-01

### Added

- 🎉 Initial release of `@feato/react-sdk`
- Real-time feature flag updates via Server-Sent Events (SSE)
- `FeatoClient` core with framework-agnostic implementation:
  - Initial feature flag fetch via HTTP
  - Persistent SSE connection for real-time updates
  - Safe connect / disconnect lifecycle
- React integration via `FeatoProvider`
  - Automatic client initialization on mount
  - Automatic cleanup on unmount
- React hooks API:
  - `useFlag(key)` — subscribe to a single feature flag
  - `useFlags()` — access all feature flags
  - `useInitialized()` — track client initialization state
- Support for multiple environments (dev, stage, prod, etc.)
- Browser-safe behavior with SSR compatibility (no SSE on server)
- Graceful handling of blocked or unavailable projects
- TypeScript-first design with full type definitions (`.d.ts`)
- ESM-first package with CJS compatibility
- Tree-shakeable, side-effect free build

### Features

- **React 18+ native**: Built on `useSyncExternalStore` for concurrent-safe subscriptions
- **Framework-agnostic core**: React is a thin binding layer over the client
- **Type-safe**: All public APIs are fully typed
- **Lightweight**: No external state managers or runtime dependencies
- **Real-time**: Instant updates via SSE, no polling
- **Resilient**: Safe disconnect on errors, no runtime crashes
- **DX-focused**: Predictable API aligned with React idioms

[1.0.0]: https://github.com/feato-app/react-sdk/releases/tag/v1.0.0

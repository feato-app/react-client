# @feato/react-client

Feato client for React applications.

`@feato/react-client` connects your React app to Feato and provides
real-time feature flag updates via Server-Sent Events (SSE).

---

## Features

- 🚀 Real-time feature flag updates
- 🔌 Automatic reconnect & lifecycle-safe cleanup
- 🌱 Environment-scoped flags
- ⚛️ React 18+ first-class API
- ⚡ Lightweight, no external state managers
- 🛡️ Graceful handling of blocked projects

---

## Installation

```bash
npm install @feato/react-client
```

---

## Requirements

- React **18 or newer**

> Older React versions are not supported.

---

## Basic Usage

### 1. Create Feato client

```ts
import { FeatoClient } from '@feato/react-client';

const featoClient = new FeatoClient({
  projectKey: 'YOUR_PROJECT_KEY',
  environment: 'prod',
});
```

---

### 2. Provide Feato client

Wrap your application with `FeatoProvider`.

```tsx
import { FeatoProvider } from '@feato/react-client';

root.render(
  <FeatoProvider client={featoClient}>
    <App />
  </FeatoProvider>
);
```

The client is initialized automatically when the provider is mounted.

---

## Client Lifecycle

Initialization includes:

- initial fetch of all feature flags
- opening the real-time SSE connection

Cleanup happens automatically when the provider is unmounted.

You do **not** need to manually manage the connection in application code.

---

## Browser-only

This SDK uses Server-Sent Events (`EventSource`) for real-time updates.

- The SSE connection starts only in the browser.
- In SSR / server environments the client remains inactive.

This makes the SDK safe to use in SSR setups.

---

## Using Feature Flags

### useFlag

```tsx
import { useFlag } from '@feato/react-client';

function Example() {
  const isEnabled = useFlag('new-dashboard');

  if (!isEnabled) {
    return null;
  }

  return <NewDashboard />;
}
```

---

### useFlags

```tsx
import { useFlags } from '@feato/react-client';

function DebugFlags() {
  const flags = useFlags();

  return <pre>{JSON.stringify(flags, null, 2)}</pre>;
}
```

---

### useInitialized

```tsx
import { useInitialized } from '@feato/react-client';

function App() {
  const initialized = useInitialized();

  if (!initialized) {
    return null;
  }

  return <MainApp />;
}
```

---

## Environments

Feature flags are isolated per environment.

```ts
environment: 'prod' | 'dev' | 'stage' | 'qa' | 'preview';
```

The environment must match the configuration in Feato.

---

## Real-time Updates

The client maintains a persistent SSE connection and receives updates when:

- feature flags are toggled
- values change
- configuration is updated

No polling. No manual refresh.

---

## Blocked Projects

If a project is blocked due to plan limits:

- the client stops receiving updates
- all flags resolve to `false`
- no runtime errors are thrown

This guarantees safe production behavior.

---

## Error Handling

The client is designed to fail **silently and safely**.

- Network errors → connection is closed safely
- Server errors → no crashes
- Blocked project → flags disabled

The application remains stable in all cases.

---

## API Reference

> Full API reference will be added.

Main exports:

```ts
FeatoClient;
FeatoProvider;
FeatoClientConfig;
```

Hooks:

```ts
useFlag(key: string): boolean | undefined;
useFlags(): Record<string, boolean>;
useInitialized(): boolean;
```

---

## Versioning

- Package versions follow **semantic versioning**
- React compatibility is defined via `peerDependencies`
- Backend contract changes are versioned independently

---

## License

MIT © Feato

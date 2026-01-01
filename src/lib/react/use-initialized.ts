import { useSyncExternalStore } from 'react';
import { useFeatoClient } from './use-feato-client';

export function useInitialized(): boolean {
  const client = useFeatoClient();

  return useSyncExternalStore(
    (onStoreChange) =>
      client.subscribeInitialized(() => {
        onStoreChange();
      }),
    () => client.initialized
  );
}

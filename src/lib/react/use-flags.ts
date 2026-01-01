import { useSyncExternalStore } from 'react';
import { FeatureFlagsMap } from '../types/api';
import { useFeatoClient } from './use-feato-client';

export function useFlags(): FeatureFlagsMap {
  const client = useFeatoClient();

  return useSyncExternalStore(
    (onStoreChange) =>
      client.subscribeFlags(() => {
        onStoreChange();
      }),
    () => client.flags
  );
}

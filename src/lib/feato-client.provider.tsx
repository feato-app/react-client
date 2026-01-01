import { ReactNode, useEffect } from 'react';
import { FeatoClient } from './feato-client';
import { FeatoContext } from './react/context';

interface FeatoProviderProps {
  client: FeatoClient;
  children: ReactNode;
}

export function FeatoProvider({ client, children }: FeatoProviderProps) {
  useEffect(() => {
    client.init();

    return () => client.disconnect();
  }, [client]);

  return <FeatoContext.Provider value={client}>{children}</FeatoContext.Provider>;
}

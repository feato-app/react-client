import { useContext } from 'react';
import { FeatoContext } from './context';
import { FeatoClient } from '../feato-client';

export function useFeatoClient(): FeatoClient {
  const client = useContext(FeatoContext);

  if (!client) {
    throw new Error('Feato hooks must be used inside <FeatoProvider>');
  }

  return client;
}

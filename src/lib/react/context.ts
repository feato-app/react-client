import { createContext } from 'react';
import { FeatoClient } from '../feato-client';

export const FeatoContext = createContext<FeatoClient | null>(null);

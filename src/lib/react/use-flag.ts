import { useFlags } from './use-flags';

export function useFlag(key: string): boolean | undefined {
  const flags = useFlags();

  return flags[key];
}

'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
type ThemeContextValue = { mode: ThemeMode; setMode: (mode: ThemeMode) => void };
const ThemeContext = createContext<ThemeContextValue>({ mode: 'system', setMode: () => undefined });

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 15_000 } } }));
  const [mode, setModeState] = useState<ThemeMode>('system');
  useEffect(() => { const stored = localStorage.getItem('vt-theme') as ThemeMode | null; setModeState(stored ?? 'system'); }, []);
  useEffect(() => {
    const root = document.documentElement; const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => root.dataset.theme = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
    apply(); media.addEventListener('change', apply); localStorage.setItem('vt-theme', mode); return () => media.removeEventListener('change', apply);
  }, [mode]);
  const theme = useMemo(() => ({ mode, setMode: (next: ThemeMode) => setModeState(next) }), [mode]);
  return <QueryClientProvider client={queryClient}><ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider></QueryClientProvider>;
}
export const useTheme = () => useContext(ThemeContext);

import { createStore } from 'zustand/vanilla';

export type ThemeState = 'light' | 'dark' | 'stone' | 'blue';

export type ThemeActions = {
  setTheme: (theme: ThemeState) => void;
};

export type ThemeStore = {
  theme: ThemeState;
} & ThemeActions;

export const defaultInitState: ThemeState = 'light';

export const createThemeStore = (
  initialState: ThemeState = defaultInitState
) => {
  const store = createStore<ThemeStore>()((set) => ({
    theme: initialState,
    setTheme: (theme: ThemeState) => {
      set((state) => ({ ...state, theme }));
    },
  }));

  // Check system theme preference if running in browser
  if (typeof window !== 'undefined') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Initial check
    store.setState({ theme: systemTheme.matches ? 'dark' : 'light' });

    // Listen for changes
    systemTheme.addEventListener('change', (e) => {
      store.setState({ theme: e.matches ? 'dark' : 'light' });
    });
  }

  return store;
};

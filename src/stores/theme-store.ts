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
  return createStore<ThemeStore>()((set) => ({
    theme: initialState,
    setTheme: (theme: ThemeState) => {
      set((state) => ({ ...state, theme }));
    },
  }));
};

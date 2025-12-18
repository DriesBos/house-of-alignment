import { createStore } from 'zustand/vanilla';

export type ThemeState = 'light' | 'dark' | 'stone' | 'blue';

export type ThemeActions = {
  setUserTheme: (theme: ThemeState | null) => void;
};

export type ThemeStore = {
  userTheme: ThemeState | null; // null means "use system theme"
} & ThemeActions;

const THEME_STORAGE_KEY = 'hoa-theme-preference';

export const defaultInitState: ThemeState | null = null;

// Get initial theme from localStorage or default to null (system)
function getInitialTheme(): ThemeState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && ['light', 'dark', 'stone', 'blue'].includes(stored)) {
      return stored as ThemeState;
    }
  } catch {
    // localStorage might be unavailable
  }

  return null;
}

export const createThemeStore = (
  initialState: ThemeState | null = defaultInitState
) => {
  // Use stored preference if available, otherwise use initialState
  const theme =
    typeof window !== 'undefined' ? getInitialTheme() : initialState;

  const store = createStore<ThemeStore>()((set) => ({
    userTheme: theme,
    setUserTheme: (theme: ThemeState | null) => {
      set({ userTheme: theme });

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        try {
          if (theme === null) {
            localStorage.removeItem(THEME_STORAGE_KEY);
          } else {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
          }
        } catch {
          // localStorage might be unavailable
        }
      }
    },
  }));

  return store;
};

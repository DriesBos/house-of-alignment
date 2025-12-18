# Theme Implementation Documentation

## Overview

This implementation prevents the "flash of unstyled content" (FOUC) that occurs when the theme is applied after React hydration. It uses a combination of:

1. **Blocking script** in the HTML head that applies the theme before React hydrates
2. **localStorage** for persisting user preferences
3. **useSyncExternalStore** for system theme detection (avoiding hydration mismatches)
4. **Zustand vanilla store** for state management

## Architecture

### Files Structure

```
src/
├── stores/
│   └── theme-store.ts              # Zustand vanilla store for theme state
├── hooks/
│   ├── useSystemTheme.ts           # Hook for system theme detection
│   └── useTheme.ts                 # Hook that combines user preference + system theme
├── providers/
│   └── theme-store-provider.tsx    # Context provider and DOM applier
├── components/
│   └── theme-toggle/
│       └── theme-toggle.tsx        # Theme toggle button component
├── utils/
│   └── theme-helpers.ts            # Helper functions for theme operations
└── app/
    └── layout.tsx                  # Root layout with blocking script
```

## How It Works

### 1. Initial Theme Application (No Flash!)

The blocking script in `layout.tsx` runs **before** React hydrates:

```javascript
// This runs synchronously in the <head>, blocking render
const stored = localStorage.getItem('hoa-theme-preference');
let theme = 'light'; // default

if (stored && ['light', 'dark', 'stone', 'blue'].includes(stored)) {
  theme = stored;
} else {
  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

document.documentElement.setAttribute('data-theme', theme);
```

**Result**: The correct theme is applied before the page renders, preventing any flash.

### 2. User Preference Storage

The Zustand store (`theme-store.ts`) stores the user's preference:

- `userTheme: null` - Use system theme (light/dark based on OS preference)
- `userTheme: 'light' | 'dark' | 'stone' | 'blue'` - Use this specific theme

When `setUserTheme()` is called, the preference is saved to localStorage immediately.

### 3. System Theme Detection

The `useSystemTheme` hook uses React's `useSyncExternalStore` API to track system theme changes:

- **Avoids hydration mismatches** between server and client
- **Automatically updates** when the user changes their system preference
- **Only detects light/dark** (system themes don't know about custom themes like 'stone' or 'blue')

### 4. Active Theme Resolution

The `useTheme` hook returns the currently active theme:

```typescript
const activeTheme = userTheme ?? systemTheme;
```

Logic:
- If user has set a preference → use it
- Otherwise → use system theme (light or dark)

## Usage Examples

### Basic Usage

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const theme = useTheme(); // 'light' | 'dark' | 'stone' | 'blue'
  
  return <div>Current theme: {theme}</div>;
}
```

### Setting a Theme

```tsx
import { useThemeStore } from '@/providers/theme-store-provider';

function ThemeButton() {
  const setUserTheme = useThemeStore((state) => state.setUserTheme);
  
  return (
    <button onClick={() => setUserTheme('stone')}>
      Use Stone Theme
    </button>
  );
}
```

### Resetting to System Theme

```tsx
import { useThemeStore } from '@/providers/theme-store-provider';

function ResetThemeButton() {
  const setUserTheme = useThemeStore((state) => state.setUserTheme);
  
  // Pass null to use system theme
  return (
    <button onClick={() => setUserTheme(null)}>
      Use System Theme
    </button>
  );
}
```

### Cycling Through Themes

```tsx
import { useThemeStore } from '@/providers/theme-store-provider';
import { useTheme } from '@/hooks/useTheme';
import { getNextTheme } from '@/utils/theme-helpers';

function ThemeCycleButton() {
  const theme = useTheme();
  const setUserTheme = useThemeStore((state) => state.setUserTheme);
  
  return (
    <button onClick={() => setUserTheme(getNextTheme(theme))}>
      Next Theme ({theme})
    </button>
  );
}
```

## Best Practices

### ✅ Do

1. **Use `useTheme()` to read the active theme** - This properly combines user preference and system theme
2. **Use `setUserTheme()` to change themes** - This persists to localStorage automatically
3. **Pass `null` to revert to system theme** - Lets the user follow their OS preference
4. **Trust the blocking script** - It ensures the correct theme is applied before React hydrates

### ❌ Don't

1. **Don't directly read from localStorage in components** - Use the hooks instead
2. **Don't manually set `data-theme` attribute** - The provider handles this automatically
3. **Don't use `useThemeStore((state) => state.userTheme)` for display** - This doesn't account for system theme fallback

## Zustand Best Practices Applied

1. **Vanilla store with context** - Allows for SSR/SSG compatibility
2. **Separation of concerns** - Store handles state, hooks handle derived values
3. **Single source of truth** - localStorage is synced through the store, not directly accessed
4. **Proper hydration handling** - Initial state is read during store creation on the client

## Alternative Options Considered

### Option 2: CSS-Only with Media Queries
**Pros**: Simple, no JavaScript needed
**Cons**: Only supports light/dark, can't persist user preference across custom themes

### Option 3: Server-Side Cookies
**Pros**: Theme available during SSR
**Cons**: More complex setup, requires middleware, overkill for this use case

### Why Option 1 (Current Implementation) is Best:
- ✅ Supports multiple custom themes (light, dark, stone, blue)
- ✅ No flash on initial load
- ✅ Persists user preference
- ✅ Respects system theme when no preference is set
- ✅ Follows Zustand best practices
- ✅ Handles hydration properly
- ✅ Simple to understand and maintain

## Troubleshooting

### Flash still occurring?

1. **Check that the blocking script is in the `<head>`** - It must execute before the body renders
2. **Verify localStorage key matches** - Both script and store use `'hoa-theme-preference'`
3. **Check CSS is loading** - Ensure theme CSS variables are defined for all themes

### Theme not persisting?

1. **Check localStorage is available** - Some browsers/modes block localStorage
2. **Verify setUserTheme is being called** - Not just reading the theme

### Hydration errors?

1. **Use `useTheme()` instead of `userTheme`** - Properly handles SSR/CSR differences
2. **Don't render theme-dependent content on first render** - Use `useEffect` if needed

## Future Enhancements

Potential additions (not implemented yet):

1. **Theme-specific metadata** - Update `theme-color` meta tag based on active theme
2. **Animated transitions** - Smooth color transitions when changing themes
3. **Per-route themes** - Allow different themes for different sections
4. **Theme preview** - Show theme before applying it
5. **Keyboard shortcuts** - Quick theme switching with keyboard

## Summary

This implementation provides a robust, flash-free theme system that:
- Works perfectly with Next.js App Router
- Supports multiple custom themes
- Respects user and system preferences
- Follows React and Zustand best practices
- Is easy to maintain and extend


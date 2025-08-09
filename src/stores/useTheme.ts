import { create } from 'zustand';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  isDark: false,
  toggleTheme: () =>
    set((state) => {
      const newIsDark = !state.isDark;
      // Apply theme to document
      if (newIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Save to localStorage
      localStorage.setItem('theme-preference', JSON.stringify(newIsDark));
      return { isDark: newIsDark };
    }),
  setTheme: (isDark: boolean) =>
    set(() => {
      // Apply theme to document
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Save to localStorage
      localStorage.setItem('theme-preference', JSON.stringify(isDark));
      return { isDark };
    }),
}));
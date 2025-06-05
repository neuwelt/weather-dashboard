import { defineStore } from 'pinia';
import { useDark, useToggle } from '@vueuse/core';

//theme store for dark mode and light mode
export const useThemeStore = defineStore('theme', () => {
  const isDark = useDark();
  const toggleDark = useToggle(isDark);
  
  return {
    isDark,
    toggleDark
  };
});

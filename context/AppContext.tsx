import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslation, Translations } from '../translations';

export type Theme = 'light' | 'dark';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: Translations;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mymotolog_language');
    return (saved === 'en' || saved === 'ms') ? saved : 'en';
  });

  // Initialize theme from localStorage or default to dark
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('mymotolog_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Get translations based on current language
  const t = getTranslation(language);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mymotolog_language', lang);
  };

  // Save theme to localStorage when it changes
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('mymotolog_theme', newTheme);
  };

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme, toggleTheme, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
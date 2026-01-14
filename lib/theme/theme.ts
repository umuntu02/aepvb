"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";
export type ContrastMode = "normal" | "high";
export type Theme = {
  mode: ThemeMode;
  contrast: ContrastMode;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleMode: () => void;
  toggleContrast: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "aepvb-theme";

const defaultTheme: Theme = {
  mode: "light",
  contrast: "normal",
};

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return defaultTheme;
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading theme from localStorage:", error);
  }
  
  return defaultTheme;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  
  // Remove all theme classes
  root.classList.remove("light", "dark", "high-contrast");
  
  // Apply mode
  root.classList.add(theme.mode);
  
  // Apply contrast
  if (theme.contrast === "high") {
    root.classList.add("high-contrast");
  }
  
  // Store in localStorage
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.error("Error saving theme to localStorage:", error);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client
    const storedTheme = getStoredTheme();
    setThemeState(storedTheme);
    applyTheme(storedTheme);
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const toggleMode = () => {
    const newTheme: Theme = {
      ...theme,
      mode: theme.mode === "light" ? "dark" : "light",
    };
    setTheme(newTheme);
  };

  const toggleContrast = () => {
    const newTheme: Theme = {
      ...theme,
      contrast: theme.contrast === "normal" ? "high" : "normal",
    };
    setTheme(newTheme);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return React.createElement(React.Fragment, null, children);
  }

  return React.createElement(
    ThemeContext.Provider,
    {
      value: {
        theme,
        setTheme,
        toggleMode,
        toggleContrast,
      },
    },
    children
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Fallback for SSR/prerendering when provider isn't available yet
    const fallbackTheme: Theme = { mode: "light", contrast: "normal" };
    return {
      theme: fallbackTheme,
      setTheme: () => {},
      toggleMode: () => {},
      toggleContrast: () => {},
    };
  }
  return context;
}

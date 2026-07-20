"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isThemeCookie, PERF_COOKIES, PERF_COOKIE_MAX_AGE } from "@/lib/perf-cookies";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark" | undefined;
  systemTheme: "light" | "dark" | undefined;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "theme";

function readThemeCookie(): Theme | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${PERF_COOKIES.theme.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]+)`)
  );
  const value = match?.[1] ? decodeURIComponent(match[1]) : null;
  return value && isThemeCookie(value) ? value : null;
}

function writeThemeCookie(theme: Theme) {
  if (typeof document === "undefined") return;
  document.cookie = `${PERF_COOKIES.theme}=${encodeURIComponent(theme)};path=/;max-age=${PERF_COOKIE_MAX_AGE};SameSite=Lax`;
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme): "light" | "dark" {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
  return resolved;
}

function readStoredTheme(defaultTheme: Theme): Theme {
  try {
    const fromCookie = readThemeCookie();
    if (fromCookie) return fromCookie;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // storage unavailable
  }
  return defaultTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark" | undefined>(undefined);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark" | undefined>(undefined);

  useEffect(() => {
    const stored = readStoredTheme(defaultTheme);
    setThemeState(stored);
    setResolvedTheme(applyTheme(stored));
    setSystemTheme(getSystemTheme());
  }, [defaultTheme]);

  useEffect(() => {
    setResolvedTheme(applyTheme(theme));
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      writeThemeCookie(theme);
    } catch {
      // storage unavailable
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      setSystemTheme(getSystemTheme());
      setResolvedTheme(applyTheme("system"));
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, resolvedTheme, systemTheme }),
    [theme, setTheme, resolvedTheme, systemTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "system" as Theme,
      setTheme: () => {},
      resolvedTheme: undefined,
      systemTheme: undefined,
    };
  }
  return ctx;
}

/** Inline script for layout — cookie first, then localStorage (prevents theme flash). */
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement,c=d.classList,w=['light','dark'];function s(t){c.remove('light','dark');c.add(t);d.style.colorScheme=t}function g(){return window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}function r(){var m=document.cookie.match(/(?:^|; )w3l_theme=([^;]+)/);if(m){var t=decodeURIComponent(m[1]);if(t==='light'||t==='dark'||t==='system')return t}return localStorage.getItem('theme')||'system'}var e=r();s(e==='system'?g():e)}catch(e){}})();`;

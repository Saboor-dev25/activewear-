"use client";

import { useEffect, useState } from "react";

const themeStorageKey = "activewear-theme";
const themeChangedEvent = "activewear-theme-change";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const syncTheme = () => setIsDark(document.documentElement.dataset.theme === "dark");
    syncTheme();
    window.addEventListener(themeChangedEvent, syncTheme);
    return () => window.removeEventListener(themeChangedEvent, syncTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    setIsDark(nextTheme === "dark");
    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // The theme still applies for this visit when storage is unavailable.
    }
    window.dispatchEvent(new Event(themeChangedEvent));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-surface text-heading transition hover:bg-background-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
    >
      {isDark ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
        </svg>
      )}
    </button>
  );
}

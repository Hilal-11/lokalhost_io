"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Framework } from "@/lib/mobile/types";
import type { PackageManager } from "@/lib/mobile/install";

/* ------------------------------------------------------------------ */
/* Per-viewer preferences for /mobile. Persisted in localStorage;     */
/* defaults render on the server so hydration never mismatches.       */
/* ------------------------------------------------------------------ */

export interface MobilePrefs {
  framework: Framework;
  pm: PackageManager;
  lang: "ts" | "js";
  collapsed: boolean;
}

const DEFAULTS: MobilePrefs = { framework: "react-native", pm: "npm", lang: "ts", collapsed: false };
const KEY = "lk-mobile-prefs";

interface Ctx extends MobilePrefs {
  set: <K extends keyof MobilePrefs>(key: K, value: MobilePrefs[K]) => void;
}

const PrefsContext = createContext<Ctx | null>(null);

export function MobilePrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<MobilePrefs>(DEFAULTS);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<MobilePrefs>;
      setPrefs((p) => ({ ...p, ...stored }));
    } catch {
      /* storage unavailable — keep defaults */
    }
  }, []);

  const set = useCallback<Ctx["set"]>((key, value) => {
    setPrefs((p) => {
      const next = { ...p, [key]: value };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ ...prefs, set }), [prefs, set]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <MobilePrefsProvider>");
  return ctx;
}

export const FRAMEWORK_LABEL: Record<Framework, string> = {
  "react-native": "React Native",
  flutter: "Flutter",
};

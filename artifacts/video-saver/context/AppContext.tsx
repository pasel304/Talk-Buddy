import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { type Language } from "@/constants/i18n";

export interface DownloadRecord {
  id: string;
  url: string;
  title: string;
  platform: string;
  downloadedAt: number;
  thumbnailUrl?: string;
}

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  themeMode: "light" | "dark" | "system";
  setThemeMode: (mode: "light" | "dark" | "system") => void;
  isDark: boolean;
  history: DownloadRecord[];
  addToHistory: (record: Omit<DownloadRecord, "id" | "downloadedAt">) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEYS = {
  LANGUAGE: "@videosaver/language",
  THEME: "@videosaver/theme",
  HISTORY: "@videosaver/history",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [language, setLanguageState] = useState<Language>("ar");
  const [themeMode, setThemeModeState] = useState<"light" | "dark" | "system">(
    "system"
  );
  const [history, setHistory] = useState<DownloadRecord[]>([]);

  const isDark =
    themeMode === "system"
      ? systemColorScheme === "dark"
      : themeMode === "dark";

  useEffect(() => {
    (async () => {
      try {
        const [lang, theme, hist] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEYS.THEME),
          AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
        ]);
        if (lang === "ar" || lang === "en") setLanguageState(lang);
        if (theme === "light" || theme === "dark" || theme === "system")
          setThemeModeState(theme);
        if (hist) setHistory(JSON.parse(hist));
      } catch {}
    })();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }, []);

  const setThemeMode = useCallback(
    async (mode: "light" | "dark" | "system") => {
      setThemeModeState(mode);
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
    },
    []
  );

  const addToHistory = useCallback(
    async (record: Omit<DownloadRecord, "id" | "downloadedAt">) => {
      const newRecord: DownloadRecord = {
        ...record,
        id:
          Date.now().toString() + Math.random().toString(36).substring(2, 9),
        downloadedAt: Date.now(),
      };
      setHistory((prev) => {
        const updated = [newRecord, ...prev].slice(0, 100);
        AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
  }, []);

  const removeFromHistory = useCallback(async (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        themeMode,
        setThemeMode,
        isDark,
        history,
        addToHistory,
        clearHistory,
        removeFromHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

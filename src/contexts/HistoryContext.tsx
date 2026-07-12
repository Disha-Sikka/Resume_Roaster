import React, { createContext, useContext, useEffect, useState } from "react";
import { RoastHistoryItem, ParsedResume, RoastMode, RoastResult } from "../types";
import { useAuth } from "./AuthContext";

interface HistoryContextType {
  history: RoastHistoryItem[];
  saveRoast: (
    fileName: string,
    resumeText: string,
    parsedData: ParsedResume,
    mode: RoastMode,
    result: RoastResult
  ) => Promise<RoastHistoryItem>;
  deleteRoast: (id: string) => void;
  renameRoast: (id: string, newFileName: string) => void;
  searchHistory: (query: string) => RoastHistoryItem[];
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<RoastHistoryItem[]>([]);

  // Load history when user changes
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    const storageKey = `roaster_history_${user.email}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
  }, [user]);

  // Save to localStorage helper
  const saveToStorage = (updated: RoastHistoryItem[]) => {
    if (!user) return;
    const storageKey = `roaster_history_${user.email}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setHistory(updated);
  };

  const saveRoast = async (
    fileName: string,
    resumeText: string,
    parsedData: ParsedResume,
    mode: RoastMode,
    result: RoastResult
  ) => {
    const newItem: RoastHistoryItem = {
      id: "roast_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now(),
      date: new Date().toISOString(),
      fileName: fileName || "Untitled Resume",
      resumeText,
      parsedData,
      mode,
      result,
    };

    const updated = [newItem, ...history];
    saveToStorage(updated);
    return newItem;
  };

  const deleteRoast = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveToStorage(updated);
  };

  const renameRoast = (id: string, newFileName: string) => {
    const updated = history.map((item) =>
      item.id === id ? { ...item, fileName: newFileName } : item
    );
    saveToStorage(updated);
  };

  const searchHistory = (query: string) => {
    if (!query) return history;
    const lowerQuery = query.toLowerCase();
    return history.filter(
      (item) =>
        item.fileName.toLowerCase().includes(lowerQuery) ||
        item.parsedData.name.toLowerCase().includes(lowerQuery) ||
        item.result.roast.toLowerCase().includes(lowerQuery)
    );
  };

  const clearHistory = () => {
    saveToStorage([]);
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        saveRoast,
        deleteRoast,
        renameRoast,
        searchHistory,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) throw new Error("useHistory must be used within a HistoryProvider");
  return context;
}

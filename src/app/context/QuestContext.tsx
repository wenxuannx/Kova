import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { generateQuest as apiGenerateQuest } from "../../lib/anthropic";
import type { QuestInput, GeneratedQuest } from "../../lib/anthropic";
import type { QuestStatus } from "../components/vault/Shared";
import { useAuth } from "./AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Quest extends GeneratedQuest {
  id: string;
  generatedAt: string;
  status: QuestStatus;
  hasRescheduled: boolean;
}

export interface QuestContextValue {
  currentQuest: Quest | null;
  isGenerating: boolean;
  generateError: string | null;
  generateQuest: (input: QuestInput) => Promise<void>;
  setQuestStatus: (s: QuestStatus) => void;
  setHasRescheduled: (v: boolean) => void;
  clearQuest: () => void;
}

export const QuestContext = createContext<QuestContextValue | null>(null);

// ─── Persistence helpers ──────────────────────────────────────────────────────

function storageKey(userId: string) {
  return `kova_quest_${userId}`;
}

function loadQuest(userId: string): Quest | null {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? (JSON.parse(raw) as Quest) : null;
  } catch {
    return null;
  }
}

function saveQuest(userId: string, quest: Quest) {
  localStorage.setItem(storageKey(userId), JSON.stringify(quest));
}

function removeQuest(userId: string) {
  localStorage.removeItem(storageKey(userId));
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function QuestProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Load persisted quest when user changes
  useEffect(() => {
    if (user) {
      setCurrentQuest(loadQuest(user.id));
    } else {
      setCurrentQuest(null);
    }
  }, [user?.id]);

  const generateQuest = useCallback(async (input: QuestInput) => {
    if (!user) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const generated = await apiGenerateQuest(input);
      const quest: Quest = {
        ...generated,
        id: `quest_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        status: "active",
        hasRescheduled: false,
      };
      setCurrentQuest(quest);
      saveQuest(user.id, quest);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Failed to generate quest.");
    } finally {
      setIsGenerating(false);
    }
  }, [user]);

  const setQuestStatus = useCallback((s: QuestStatus) => {
    if (!user || !currentQuest) return;
    const updated = { ...currentQuest, status: s };
    setCurrentQuest(updated);
    saveQuest(user.id, updated);
  }, [user, currentQuest]);

  const setHasRescheduled = useCallback((v: boolean) => {
    if (!user || !currentQuest) return;
    const updated = { ...currentQuest, hasRescheduled: v };
    setCurrentQuest(updated);
    saveQuest(user.id, updated);
  }, [user, currentQuest]);

  const clearQuest = useCallback(() => {
    if (!user) return;
    setCurrentQuest(null);
    removeQuest(user.id);
  }, [user]);

  return (
    <QuestContext.Provider value={{ currentQuest, isGenerating, generateError, generateQuest, setQuestStatus, setHasRescheduled, clearQuest }}>
      {children}
    </QuestContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useQuest(): QuestContextValue {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuest must be used inside QuestProvider");
  return ctx;
}

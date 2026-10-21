"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { demoContent, type ContentData } from "@/backend/data/content";

export type ContentContextValue = {
  content: ContentData;
  hydrated: boolean;
  storageError: string | null;
  saveContent: (next: ContentData) => void;
  restoreDemoContent: () => void;
  refreshContent: () => Promise<void>;
};

const initialSnapshot: ContentContextValue = {
  content: demoContent,
  hydrated: false,
  storageError: null,
  saveContent,
  restoreDemoContent,
  refreshContent,
};

let snapshot = initialSnapshot;
let initialized = false;
let pendingWrite = Promise.resolve();
const listeners = new Set<() => void>();

function publish(next: ContentContextValue) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export async function refreshContent() {
  try {
    const response = await fetch("/api/content", { cache: "no-store" });
    const payload = await response.json() as { content?: ContentData; error?: string };
    if (!response.ok || !payload.content) throw new Error(payload.error ?? "Unable to load website content.");
    publish({ ...snapshot, content: payload.content, hydrated: true, storageError: null });
  } catch (error) {
    publish({
      ...snapshot,
      hydrated: true,
      storageError: error instanceof Error ? error.message : "Unable to load website content.",
    });
  }
}

function initializeStore() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  void refreshContent();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  initializeStore();
  return () => listeners.delete(listener);
}

function saveContent(next: ContentData) {
  publish({ ...snapshot, content: next, hydrated: true, storageError: null });
  pendingWrite = pendingWrite.then(async () => {
    const response = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snapshot.content),
    });
    const payload = await response.json() as { content?: ContentData; error?: string };
    if (!response.ok || !payload.content) throw new Error(payload.error ?? "Changes could not be saved.");
    publish({ ...snapshot, content: payload.content, hydrated: true, storageError: null });
  }).catch((error: unknown) => {
    publish({
      ...snapshot,
      storageError: error instanceof Error ? error.message : "Changes could not be saved.",
    });
  });
}

function restoreDemoContent() {
  saveContent(demoContent);
}

export function ContentProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useContent() {
  return useSyncExternalStore(subscribe, () => snapshot, () => initialSnapshot);
}

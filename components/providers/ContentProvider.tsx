"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { demoContent, type ContentData } from "@/data/content";
import { CONTENT_STORAGE_KEY, parseStoredContent, serializeContent } from "@/lib/contentStore";

export type ContentContextValue = {
  content: ContentData;
  hydrated: boolean;
  storageError: string | null;
  saveContent: (next: ContentData) => void;
  restoreDemoContent: () => void;
};

const initialSnapshot: ContentContextValue = {
  content: demoContent,
  hydrated: false,
  storageError: null,
  saveContent,
  restoreDemoContent,
};

let snapshot = initialSnapshot;
let initialized = false;
const listeners = new Set<() => void>();

function publish(next: ContentContextValue) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function initializeStore() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  let content = demoContent;
  let storageError: string | null = null;

  try {
    const saved = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    if (saved === null) {
      window.localStorage.setItem(CONTENT_STORAGE_KEY, serializeContent(demoContent));
    } else {
      content = parseStoredContent(saved);
    }
  } catch (error) {
    storageError = error instanceof Error
      ? error.message
      : "Unable to read saved content from this browser.";
  }

  publish({ ...snapshot, content, hydrated: true, storageError });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  initializeStore();
  return () => listeners.delete(listener);
}

function saveContent(next: ContentData) {
  try {
    window.localStorage.setItem(CONTENT_STORAGE_KEY, serializeContent(next));
    publish({ ...snapshot, content: next, hydrated: true, storageError: null });
  } catch {
    publish({ ...snapshot, storageError: "Changes could not be saved. Check available browser storage." });
  }
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

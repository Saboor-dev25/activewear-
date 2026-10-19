import type { ContentData } from "@/data/content";

export const CONTENT_STORAGE_KEY = "activewear-content-v1";

export type StoredContent = {
  version: 1;
  data: ContentData;
};

export function parseStoredContent(raw: string): ContentData {
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Saved content has an invalid format.");
  }

  const stored = parsed as Partial<StoredContent>;
  const data = stored.version === 1 ? stored.data : undefined;
  if (!data || !Array.isArray(data.categories) || !Array.isArray(data.products)
    || !Array.isArray(data.companies) || !Array.isArray(data.testimonials)
    || !Array.isArray(data.faqs)) {
    throw new Error("Saved content is missing one or more collections.");
  }
  return data;
}

export function serializeContent(data: ContentData): string {
  const stored: StoredContent = { version: 1, data };
  return JSON.stringify(stored);
}

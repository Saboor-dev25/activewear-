import type { ContentData } from "@/backend/data/content";

export type ContentCollectionName = keyof ContentData;

export type StoredRecord = { id: string; [key: string]: unknown };

export type ContentDocument = {
  _id: string;
  [key: string]: unknown;
};

export type { ContentData };

import type { ContentData } from "@/backend/data/content";
import { HttpError, isRecord } from "@/backend/utils/http";

const collectionNames = ["categories", "products", "companies", "testimonials", "faqs"] as const;

export function validateContent(value: unknown): ContentData {
  if (!isRecord(value) || collectionNames.some((name) => !Array.isArray(value[name]))) {
    throw new HttpError(400, "Content must include categories, products, companies, testimonials, and FAQs.");
  }
  for (const name of collectionNames) {
    const entries = value[name] as unknown[];
    if (entries.some((entry) => !isRecord(entry) || typeof entry.id !== "string" || entry.id.length > 200)) {
      throw new HttpError(400, `Every ${name} entry needs a valid id.`);
    }
  }
  return value as unknown as ContentData;
}

export function validateCredentials(value: unknown): { email: string; password: string } {
  if (!isRecord(value) || typeof value.email !== "string" || typeof value.password !== "string") {
    throw new HttpError(400, "Email and password are required.");
  }
  const email = value.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new HttpError(400, "Enter a valid email address.");
  }
  if (value.password.length < 8 || value.password.length > 12) {
    throw new HttpError(400, "Passwords must be between 8 and 12 characters.");
  }
  return { email, password: value.password };
}

export function validateStoredContent(raw: string): ContentData {
  const parsed: unknown = JSON.parse(raw);
  if (!isRecord(parsed) || parsed.version !== 1) throw new HttpError(400, "Saved browser content has an unsupported format.");
  return validateContent(parsed.data);
}

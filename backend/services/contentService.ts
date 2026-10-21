import "server-only";
import { demoContent, type ContentData } from "@/backend/data/content";
import { getDatabase } from "@/backend/config/database";
import type { ContentCollectionName } from "@/backend/models/content";
import { HttpError } from "@/backend/utils/http";

const collectionNames: ContentCollectionName[] = ["categories", "products", "companies", "testimonials", "faqs"];

export async function getContent(): Promise<ContentData> {
  const db = await getDatabase();
  const rows = await Promise.all(collectionNames.map((name) => db.collection<Record<string, unknown> & { _id: string }>(name).find().toArray()));
  if (rows.every((items) => items.length === 0)) return demoContent;
  const content = Object.fromEntries(collectionNames.map((name, index) => [
    name,
    rows[index].map((record) => {
      const item = { ...record };
      Reflect.deleteProperty(item, "_id");
      return item;
    }),
  ]));
  return content as unknown as ContentData;
}

export async function saveContent(content: ContentData): Promise<void> {
  const db = await getDatabase();
  for (const name of collectionNames) {
    const records = content[name] as Array<Record<string, unknown> & { id: string }>;
    const ids = records.map((record) => record.id);
    if (new Set(ids).size !== ids.length) throw new HttpError(400, `Duplicate ids found in ${name}.`);
    const collection = db.collection<Record<string, unknown> & { _id: string }>(name);
    if (records.length) {
      await collection.bulkWrite(records.map((record) => ({
        replaceOne: { filter: { _id: record.id }, replacement: { ...record, _id: record.id }, upsert: true },
      })));
    }
    await collection.deleteMany(ids.length ? { _id: { $nin: ids } } : {});
  }
  await db.collection<{ _id: string; initializedAt?: Date }>("app_metadata").updateOne(
    { _id: "content_initialized" },
    { $set: { initializedAt: new Date() } },
    { upsert: true },
  );
}

export async function migrateLegacyContent(content: ContentData): Promise<"migrated" | "already-initialized"> {
  const db = await getDatabase();
  const marker = db.collection<{ _id: string; initializedAt?: Date }>("app_metadata");
  if (await marker.findOne({ _id: "content_initialized" })) return "already-initialized";
  for (const name of collectionNames) {
    const collection = db.collection<Record<string, unknown> & { _id: string }>(name);
    const existingIds = new Set(await collection.distinct<string>("_id"));
    const legacyRecords = content[name] as Array<Record<string, unknown> & { id: string }>;
    const missingRecords = legacyRecords.filter((record) => !existingIds.has(record.id));
    if (missingRecords.length) {
      await collection.bulkWrite(missingRecords.map((record) => ({
        replaceOne: { filter: { _id: record.id }, replacement: { ...record, _id: record.id }, upsert: true },
      })));
    }
  }
  await marker.updateOne({ _id: "content_initialized" }, { $set: { initializedAt: new Date() } }, { upsert: true });
  return "migrated";
}


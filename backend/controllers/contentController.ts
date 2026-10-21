import "server-only";
import { migrateLegacyContent, getContent, saveContent } from "@/backend/services/contentService";
import { deleteImageByUrl, managedPublicId } from "@/backend/services/cloudinaryService";
import { requireAdmin, requireSameOrigin } from "@/backend/middleware/auth";
import { validateContent, validateStoredContent } from "@/backend/validation/content";
import { HttpError, isRecord, readJson } from "@/backend/utils/http";

export async function getPublicContent(): Promise<Response> {
  return Response.json({ content: await getContent() }, { headers: { "Cache-Control": "no-store" } });
}

export async function updateContent(request: Request): Promise<Response> {
  await requireAdmin(request);
  requireSameOrigin(request);
  const content = validateContent(await readJson(request));
  const previous = await getContent();
  await saveContent(content);
  const retainedImages = collectImageUrls(content);
  const retainedCloudinaryIds = new Set([...retainedImages].map(managedPublicId).filter((id): id is string => Boolean(id)));
  const removedImages = [...collectImageUrls(previous)].filter((url) => {
    const publicId = managedPublicId(url);
    return publicId !== null && !retainedCloudinaryIds.has(publicId);
  });
  await Promise.all(removedImages.map(async (url) => {
    try { await deleteImageByUrl(url); } catch (error) { console.error("Cloudinary image cleanup failed after content update", error); }
  }));
  return Response.json({ content });
}

function collectImageUrls(value: unknown, result = new Set<string>()): Set<string> {
  if (Array.isArray(value)) value.forEach((item) => collectImageUrls(item, result));
  else if (isRecord(value)) {
    for (const [key, child] of Object.entries(value)) {
      if (key === "image" && typeof child === "string") result.add(child);
      else collectImageUrls(child, result);
    }
  }
  return result;
}

export async function importLegacyContent(request: Request): Promise<Response> {
  await requireAdmin(request);
  requireSameOrigin(request);
  const body = await readJson(request);
  if (!isRecord(body) || (body.legacy !== null && typeof body.legacy !== "string")) {
    throw new HttpError(400, "Legacy browser content is invalid.");
  }
  const content = body.legacy === null ? validateContent(body.demo) : validateStoredContent(body.legacy);
  const result = await migrateLegacyContent(content);
  return Response.json({ result });
}

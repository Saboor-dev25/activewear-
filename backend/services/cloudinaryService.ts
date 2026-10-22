import "server-only";
import { Readable } from "node:stream";
import { getCloudinary } from "@/backend/config/cloudinary";
import { HttpError } from "@/backend/utils/http";

const maxImageBytes = 4 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function uploadImage(file: File): Promise<{ url: string; publicId: string }> {
  if (!allowedTypes.has(file.type)) throw new HttpError(415, "Upload a JPEG, PNG, WebP, or AVIF image.");
  if (file.size === 0 || file.size > maxImageBytes) throw new HttpError(413, "Images must be 4 MiB (4,194,304 bytes) or smaller.");
  const cloudinary = getCloudinary();
  const bytes = Buffer.from(await file.arrayBuffer());
  let uploaded: { secure_url: string; public_id: string };
  try {
    uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        folder: "activewear",
        resource_type: "image",
        // Keep the full source dimensions up to this ceiling and avoid the aggressive
        // default quality setting that can make detailed garment prints look soft.
        transformation: [{ width: 3000, height: 3000, crop: "limit", quality: "auto:best" }],
      }, (error, result) => {
        if (error || !result) reject(error ?? new Error("Cloudinary returned no image."));
        else resolve({ secure_url: result.secure_url, public_id: result.public_id });
      });
      Readable.from(bytes).pipe(stream);
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "http_code" in error && error.http_code === 401) {
      throw new HttpError(502, "Cloudinary rejected the upload signature. Check that the cloud name, API key, and API secret all belong to the same Cloudinary account, then restart the dev server.");
    }
    throw error;
  }
  return { url: uploaded.secure_url, publicId: uploaded.public_id };
}

export async function deleteImageByUrl(url: string): Promise<boolean> {
  const publicId = managedPublicId(url);
  if (!publicId) return false;
  const result = await getCloudinary().uploader.destroy(publicId, { resource_type: "image", invalidate: true });
  if (result.result !== "ok" && result.result !== "not found") throw new Error("Cloudinary could not delete the image.");
  return true;
}

export function managedPublicId(url: string): string | null {
  let parsed: URL;
  try { parsed = new URL(url); } catch { return null; }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (parsed.hostname !== "res.cloudinary.com" || !cloudName || !parsed.pathname.startsWith(`/${cloudName}/image/upload/`)) {
    return null;
  }
  const marker = "/image/upload/";
  const uploadPath = parsed.pathname.slice(parsed.pathname.indexOf(marker) + marker.length);
  const segments = uploadPath.split("/");
  const activewearIndex = segments.indexOf("activewear");
  const publicId = activewearIndex < 0 ? "" : segments.slice(activewearIndex).join("/").replace(/\.[a-z0-9]+$/i, "");
  if (!publicId || !publicId.startsWith("activewear/")) return null;
  return publicId;
}

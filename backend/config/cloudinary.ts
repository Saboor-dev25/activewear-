import "server-only";
import { v2 as cloudinary } from "cloudinary";

export function getCloudinary() {
  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY?.trim();
  const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are required for image uploads.");
  }
  // Reapply current env values on each use. Next.js can reload .env.local while
  // keeping this SDK singleton alive, so a one-time config can leave stale keys.
  cloudinary.config({ cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET, secure: true });
  return cloudinary;
}

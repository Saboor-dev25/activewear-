import "server-only";
import { uploadImage } from "@/backend/services/cloudinaryService";
import { requireAdmin, requireSameOrigin } from "@/backend/middleware/auth";
import { HttpError } from "@/backend/utils/http";

export async function uploadAsset(request: Request): Promise<Response> {
  await requireAdmin(request);
  requireSameOrigin(request);
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new HttpError(400, "Choose an image to upload.");
  return Response.json(await uploadImage(file), { status: 201 });
}

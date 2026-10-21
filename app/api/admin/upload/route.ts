import { uploadAsset } from "@/backend/controllers/uploadController";
import { requestRoute } from "@/backend/routes/dispatch";

export const POST = requestRoute(uploadAsset);

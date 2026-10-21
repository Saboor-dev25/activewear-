import { importLegacyContent } from "@/backend/controllers/contentController";
import { requestRoute } from "@/backend/routes/dispatch";

export const POST = requestRoute(importLegacyContent);

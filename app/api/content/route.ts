import { getPublicContent, updateContent } from "@/backend/controllers/contentController";
import { route, requestRoute } from "@/backend/routes/dispatch";

export const GET = route(getPublicContent);
export const PUT = requestRoute(updateContent);

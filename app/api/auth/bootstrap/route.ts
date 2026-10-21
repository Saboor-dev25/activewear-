import { bootstrapAdmin } from "@/backend/controllers/authController";
import { requestRoute } from "@/backend/routes/dispatch";

export const POST = requestRoute(bootstrapAdmin);

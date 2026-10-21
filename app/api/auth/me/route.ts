import { currentAdmin } from "@/backend/controllers/authController";
import { requestRoute } from "@/backend/routes/dispatch";

export const GET = requestRoute(currentAdmin);

import { removeAdmin } from "@/backend/controllers/adminController";
import { requestRoute } from "@/backend/routes/dispatch";

export const DELETE = requestRoute(removeAdmin);

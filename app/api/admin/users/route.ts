import { addAdmin, getAdmins } from "@/backend/controllers/adminController";
import { requestRoute } from "@/backend/routes/dispatch";

export const GET = requestRoute(getAdmins);
export const POST = requestRoute(addAdmin);

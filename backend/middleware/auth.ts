import "server-only";
import { getSession } from "@/backend/services/authService";
import { HttpError } from "@/backend/utils/http";
import type { AdminUser } from "@/backend/models/admin";

export async function requireAdmin(request: Request): Promise<AdminUser> {
  const admin = await getSession(request);
  if (!admin) throw new HttpError(401, "Sign in as an admin to continue.");
  return admin;
}

export function requireSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  let validOrigin = false;
  try { validOrigin = Boolean(origin) && new URL(origin!).origin === new URL(request.url).origin; } catch { validOrigin = false; }
  if (!validOrigin) {
    throw new HttpError(403, "This request must come from the same website.");
  }
}

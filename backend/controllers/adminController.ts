import "server-only";
import { createAdmin, deleteAdmin, listAdmins } from "@/backend/services/authService";
import { requireAdmin, requireSameOrigin } from "@/backend/middleware/auth";
import { validateCredentials } from "@/backend/validation/content";
import { isRecord, readJson, HttpError } from "@/backend/utils/http";

export async function getAdmins(request: Request): Promise<Response> {
  await requireAdmin(request);
  return Response.json({ admins: await listAdmins() }, { headers: { "Cache-Control": "no-store" } });
}

export async function addAdmin(request: Request): Promise<Response> {
  await requireAdmin(request);
  requireSameOrigin(request);
  const { email, password } = validateCredentials(await readJson(request));
  const admin = await createAdmin(email, password);
  return Response.json({ admin }, { status: 201 });
}

export async function removeAdmin(request: Request): Promise<Response> {
  const current = await requireAdmin(request);
  requireSameOrigin(request);
  const body = await readJson(request);
  if (!isRecord(body) || typeof body.id !== "string") throw new HttpError(400, "Admin id is required.");
  await deleteAdmin(body.id, current.email);
  return Response.json({ ok: true });
}

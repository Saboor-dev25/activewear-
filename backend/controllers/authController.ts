import "server-only";
import { createInitialAdmin, hasAdmins, login, revokeSession, getSession, getSessionCookie, clearedSessionCookie, verifyBootstrapSecret } from "@/backend/services/authService";
import { requireSameOrigin } from "@/backend/middleware/auth";
import { validateCredentials } from "@/backend/validation/content";
import { HttpError, readJson } from "@/backend/utils/http";

export async function currentAdmin(request: Request): Promise<Response> {
  const admin = await getSession(request);
  return Response.json({ admin }, { status: admin ? 200 : 401, headers: { "Cache-Control": "no-store" } });
}

export async function signIn(request: Request): Promise<Response> {
  requireSameOrigin(request);
  const credentials = validateCredentials(await readJson(request));
  const clientAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const session = await login(credentials.email, credentials.password, clientAddress);
  return Response.json({ admin: session.admin }, { headers: { "Set-Cookie": getSessionCookie(session.cookie), "Cache-Control": "no-store" } });
}

export async function signOut(request: Request): Promise<Response> {
  requireSameOrigin(request);
  await revokeSession(request);
  return Response.json({ ok: true }, { headers: { "Set-Cookie": clearedSessionCookie() } });
}

export async function bootstrapAdmin(request: Request): Promise<Response> {
  requireSameOrigin(request);
  if (await hasAdmins()) throw new HttpError(409, "An admin account already exists. Sign in or use the admin-user tab.");
  if (!await verifyBootstrapSecret(request.headers.get("x-bootstrap-secret"))) throw new HttpError(403, "The initial setup secret is missing or incorrect.");
  const credentials = validateCredentials(await readJson(request));
  const admin = await createInitialAdmin(credentials.email, credentials.password);
  return Response.json({ admin }, { status: 201 });
}

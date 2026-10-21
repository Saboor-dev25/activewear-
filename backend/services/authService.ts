import "server-only";
import { createHmac, createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Collection } from "mongodb";
import { getDatabase } from "@/backend/config/database";
import type { AdminDocument, AdminUser } from "@/backend/models/admin";
import { HttpError } from "@/backend/utils/http";

const scrypt = promisify(scryptCallback);
const sessionCookieName = "activewear_admin_session";
const sessionDurationMs = 1000 * 60 * 60 * 24 * 7;

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters.");
  return secret;
}

function hashToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function signature(value: string): string {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

async function admins(): Promise<Collection<AdminDocument>> {
  return (await getDatabase()).collection<AdminDocument>("admins");
}

async function passwordHash(password: string, salt: string): Promise<Buffer> {
  return await scrypt(password, salt, 64) as Buffer;
}

export async function createAdmin(email: string, password: string): Promise<AdminUser> {
  const collection = await admins();
  await collection.createIndex({ email: 1 }, { unique: true });
  const salt = randomBytes(16).toString("hex");
  const document: AdminDocument = {
    _id: email,
    email,
    passwordSalt: salt,
    passwordHash: (await passwordHash(password, salt)).toString("hex"),
    createdAt: new Date(),
  };
  try {
    await collection.insertOne(document);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      throw new HttpError(409, "An admin account with that email already exists.");
    }
    throw error;
  }
  return publicAdmin(document);
}

export async function createInitialAdmin(email: string, password: string): Promise<AdminUser> {
  const db = await getDatabase();
  const locks = db.collection<{ _id: string; createdAt: Date }>("setup_locks");
  try {
    await locks.insertOne({ _id: "initial-admin", createdAt: new Date() });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      throw new HttpError(409, "Initial admin setup has already been used.");
    }
    throw error;
  }
  try {
    if (await hasAdmins()) throw new HttpError(409, "An admin account already exists.");
    return await createAdmin(email, password);
  } catch (error) {
    await locks.deleteOne({ _id: "initial-admin" });
    throw error;
  }
}

function publicAdmin(admin: AdminDocument): AdminUser {
  return { id: admin._id, email: admin.email, createdAt: admin.createdAt.toISOString() };
}

export async function listAdmins(): Promise<AdminUser[]> {
  const collection = await admins();
  return (await collection.find().sort({ createdAt: 1 }).toArray()).map(publicAdmin);
}

export async function deleteAdmin(id: string, currentEmail: string): Promise<void> {
  if (id === currentEmail) throw new HttpError(400, "You cannot remove the account you are currently using.");
  const collection = await admins();
  if (await collection.countDocuments() <= 1) throw new HttpError(400, "At least one admin account must remain.");
  await collection.deleteOne({ _id: id });
}

export async function login(email: string, password: string, clientAddress: string): Promise<{ admin: AdminUser; cookie: string }> {
  const collection = await admins();
  const admin = await collection.findOne({ _id: email });
  const supplied = await passwordHash(password, admin?.passwordSalt ?? "0".repeat(32));
  const expected = Buffer.from(admin?.passwordHash ?? "0".repeat(128), "hex");
  const valid = supplied.length === expected.length && timingSafeEqual(supplied, expected);
  const db = await getDatabase();
  const identity = requestIdentity(email, clientAddress);
  const now = new Date();
  const attempts = db.collection<{ _id: string; attempts: number; resetAt: Date }>("login_attempts");
  await attempts.createIndex({ resetAt: 1 }, { expireAfterSeconds: 0 });
  const existing = await attempts.findOne({ _id: identity, resetAt: { $gt: now } });
  if ((existing?.attempts ?? 0) >= 8) throw new HttpError(429, "Too many sign-in attempts. Try again in 15 minutes.");
  if (!admin || !valid) {
    if (existing) await attempts.updateOne({ _id: identity, resetAt: { $gt: now } }, { $inc: { attempts: 1 } });
    else await attempts.updateOne({ _id: identity }, { $set: { attempts: 1, resetAt: new Date(Date.now() + 15 * 60 * 1000) } }, { upsert: true });
    throw new HttpError(401, "Email or password is incorrect.");
  }
  await attempts.deleteOne({ _id: identity });

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + sessionDurationMs);
  const sessions = db.collection<{ _id: string; adminId: string; expiresAt: Date }>("sessions");
  await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await sessions.insertOne({ _id: tokenHash, adminId: admin._id, expiresAt });
  return { admin: publicAdmin(admin), cookie: `${token}.${signature(token)}` };
}

function requestIdentity(email: string, clientAddress: string): string {
  // Login attempts are keyed by normalized email and the proxy-provided client address.
  return hashToken(`${email}|${clientAddress || "unknown"}`);
}

export async function getSession(request: Request): Promise<AdminUser | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const value = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${sessionCookieName}=`))?.slice(sessionCookieName.length + 1);
  if (!value) return null;
  let decoded: string;
  try { decoded = decodeURIComponent(value); } catch { return null; }
  const [token, suppliedSignature] = decoded.split(".");
  if (!token || !suppliedSignature) return null;
  const expectedSignature = signature(token);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  const db = await getDatabase();
  const session = await db.collection<{ _id: string; adminId: string; expiresAt: Date }>("sessions").findOne({ _id: hashToken(token), expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const admin = await (await admins()).findOne({ _id: session.adminId });
  return admin ? publicAdmin(admin) : null;
}

export async function revokeSession(request: Request): Promise<void> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const value = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${sessionCookieName}=`))?.slice(sessionCookieName.length + 1);
  let token: string | undefined;
  try { token = value ? decodeURIComponent(value).split(".")[0] : undefined; } catch { token = undefined; }
  if (!token) return;
  const db = await getDatabase();
  await db.collection<{ _id: string; adminId: string; expiresAt: Date }>("sessions").deleteOne({ _id: hashToken(token) });
}

export function getSessionCookie(cookie: string, expiresAt?: Date): string {
  const maxAge = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000)) : sessionDurationMs / 1000;
  return `${sessionCookieName}=${encodeURIComponent(cookie)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export function clearedSessionCookie(): string {
  return `${sessionCookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export async function verifyBootstrapSecret(value: string | null): Promise<boolean> {
  const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
  if (!expected || !value) return false;
  const actualBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function hasAdmins(): Promise<boolean> {
  return (await admins()).estimatedDocumentCount().then((count) => count > 0);
}

export { sessionCookieName };

import "server-only";
import { jsonError } from "@/backend/utils/http";

export function route(handler: () => Promise<Response>): () => Promise<Response> {
  return () => handler().catch(jsonError);
}

export function requestRoute(handler: (request: Request) => Promise<Response>): (request: Request) => Promise<Response> {
  return (request) => handler(request).catch(jsonError);
}

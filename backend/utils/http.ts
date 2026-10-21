export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

export function jsonError(error: unknown): Response {
  if (typeof error === "object" && error !== null && "digest" in error && error.digest === "NEXT_PRERENDER_INTERRUPTED") {
    throw error;
  }
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("API request failed", error);
  return Response.json({ error: "The request could not be completed." }, { status: 500 });
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, "Request body must be valid JSON.");
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

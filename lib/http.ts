import { NextResponse } from "next/server";
import { siteOrigin } from "./site";

const maxBody = 8192;

export function sameOrigin(request: Request) {
  const expected = siteOrigin() ?? (process.env.NODE_ENV !== "production" ? new URL(request.url).origin : undefined);
  return Boolean(expected && request.headers.get("origin") === expected);
}

export async function readJson(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return null;
  if (Number(request.headers.get("content-length")) > maxBody || !request.body) return null;

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBody) {
        await reader.cancel();
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
    return JSON.parse(body + decoder.decode());
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

export function result(status: number, error?: string) {
  return NextResponse.json(error ? { error } : { ok: true }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

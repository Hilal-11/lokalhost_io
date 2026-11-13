import "server-only";

type Fields = Record<string, string | number | boolean | null | undefined>;

/** One JSON line per billing event. Never pass secrets or full payloads. */
export function billingLog(level: "info" | "warn" | "error", event: string, fields: Fields = {}) {
  const line = JSON.stringify({ scope: "billing", level, event, ...fields, ts: new Date().toISOString() });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (e && typeof e === "object") {
    const o = e as { error?: { description?: string }; message?: string; description?: string };
    return o.error?.description ?? o.description ?? o.message ?? "unknown error";
  }
  return String(e);
}

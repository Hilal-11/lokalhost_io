/**
 * Mock streaming helpers for Micro AI UI demos.
 * No API keys, no network — just believable token timing.
 */

export interface MockStreamOptions {
  /** Words per minute. ~600 feels like a fast model. Defaults to 600. */
  wpm?: number;
  /** 0..1 — random variance applied to each token delay. Defaults to 0.4. */
  jitter?: number;
  /** Delay before the first token, in ms (time-to-first-token). Defaults to 0. */
  initialDelay?: number;
  /** Abort the stream early. */
  signal?: AbortSignal;
}

export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const t = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/** Splits text into word-ish tokens, keeping whitespace attached to the following word. */
export function tokenize(text: string): string[] {
  return text.match(/\s*\S+|\s+$/g) ?? [];
}

/**
 * Async generator yielding tokens of `text` at a realistic pace.
 *
 * ```ts
 * for await (const token of mockStream("Hello world", { wpm: 600 })) {
 *   setText((t) => t + token);
 * }
 * ```
 */
export async function* mockStream(
  text: string,
  { wpm = 600, jitter = 0.4, initialDelay = 0, signal }: MockStreamOptions = {}
): AsyncGenerator<string, void, unknown> {
  const base = 60_000 / Math.max(1, wpm);
  if (initialDelay > 0) await sleep(initialDelay, signal);
  for (const token of tokenize(text)) {
    const variance = 1 + (Math.random() * 2 - 1) * Math.min(1, Math.max(0, jitter));
    // punctuation & newlines get a tiny natural pause
    const pause = /[.!?:]\s*$|\n/.test(token) ? base * 0.6 : 0;
    await sleep(Math.max(4, base * variance + pause), signal);
    yield token;
  }
}

/** Wraps an async iterable so it can be cancelled with an AbortSignal. */
export async function* withAbort<T>(source: AsyncIterable<T>, signal: AbortSignal): AsyncGenerator<T> {
  for await (const chunk of source) {
    if (signal.aborted) return;
    yield chunk;
  }
}

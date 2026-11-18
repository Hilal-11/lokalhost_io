/**
 * Tiny word-level diff (LCS). Whitespace is attached to the following word so
 * re-joining all parts reproduces the input exactly. Good for paragraphs; for
 * very large documents swap in the `diff` package's `diffWords`.
 */

export type DiffPart = { type: "same" | "add" | "remove"; text: string };

const tokens = (s: string) => s.match(/\s*\S+|\s+$/g) ?? [];
const norm = (t: string) => t.trim().toLowerCase();

export function diffWords(before: string, after: string): DiffPart[] {
  const a = tokens(before);
  const b = tokens(after);
  const n = a.length;
  const m = b.length;
  // dp[i][j] = LCS length of a[i:] and b[j:]
  const dp: Uint16Array[] = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = norm(a[i]) === norm(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: DiffPart[] = [];
  const push = (type: DiffPart["type"], text: string) => {
    const last = out[out.length - 1];
    if (last && last.type === type) last.text += text;
    else out.push({ type, text });
  };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (norm(a[i]) === norm(b[j])) {
      push("same", b[j]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push("remove", a[i++]);
    } else {
      push("add", b[j++]);
    }
  }
  while (i < n) push("remove", a[i++]);
  while (j < m) push("add", b[j++]);
  return out;
}

/**
 * Diff while the rewrite is still streaming: only the part of `before` that the
 * stream has plausibly covered is compared, so the tail isn't shown as deleted yet.
 */
export function diffStreaming(before: string, partial: string, done: boolean): DiffPart[] {
  if (done) return diffWords(before, partial);
  const a = tokens(before);
  const covered = Math.min(a.length, Math.ceil(tokens(partial).length * 1.15) + 1);
  const head = a.slice(0, covered).join("");
  const parts = diffWords(head, partial);
  // trailing removals at the stream edge are probably just "not written yet"
  while (parts.length && parts[parts.length - 1].type === "remove") parts.pop();
  return parts;
}

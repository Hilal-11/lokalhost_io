import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";
import { getBillingStatus } from "@/lib/billing";
import { languageOf, type BlockEntry } from "./catalog";

export interface BlockFile {
  path: string;
  code: string;
  language: string;
}

export interface BlockViewer {
  loggedIn: boolean;
  hasAccess: boolean;
}

/** Who is looking — decides whether Pro block source is sent at all. */
export async function getBlockViewer(): Promise<BlockViewer> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { loggedIn: false, hasAccess: false };
    const status = await getBillingStatus(user.id);
    return { loggedIn: true, hasAccess: status.hasAccess };
  } catch {
    // Billing/auth unavailable: fail closed for Pro, open for free.
    return { loggedIn: false, hasAccess: false };
  }
}

export function canViewCode(block: BlockEntry, viewer: BlockViewer) {
  return block.access === "free" || viewer.hasAccess;
}

const ROOT = process.cwd();

/** Reads a block's files from disk. Only paths inside the repo are allowed. */
export async function readBlockFiles(block: BlockEntry): Promise<BlockFile[]> {
  const out: BlockFile[] = [];
  for (const rel of block.files) {
    const abs = path.resolve(ROOT, rel);
    if (!abs.startsWith(ROOT + path.sep)) continue;
    try {
      out.push({ path: rel, code: await readFile(abs, "utf8"), language: languageOf(rel) });
    } catch {
      out.push({ path: rel, code: `// Source not found: ${rel}`, language: "ts" });
    }
  }
  return out;
}

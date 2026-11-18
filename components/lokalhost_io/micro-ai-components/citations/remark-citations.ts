/**
 * remarkCitations — turns `[1]`, `[1,3]` markers in markdown into `<citation ids="…">`
 * elements. Render them with react-markdown's `components={{ citation: MarkdownCitation }}`.
 *
 * Numbers are 1-based indexes into the `sources` array passed to <CitationProvider>.
 * Markers inside code, inline code and links are left alone.
 */

interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
}

const MARKER = /\[(\d{1,3}(?:\s*,\s*\d{1,3})*)\]/g;
const SKIP = new Set(["code", "inlineCode", "link", "linkReference", "definition", "html"]);

export interface RemarkCitationsOptions {
  /** Element name produced in the hast tree. Defaults to "citation". */
  tagName?: string;
}

export function remarkCitations(options: RemarkCitationsOptions = {}) {
  const tagName = options.tagName ?? "citation";

  const split = (text: string): MdNode[] => {
    const out: MdNode[] = [];
    let last = 0;
    for (const m of text.matchAll(MARKER)) {
      const index = m.index ?? 0;
      const before = text.slice(last, index);
      if (before) out.push({ type: "text", value: before });
      const indexes = m[1].split(",").map((n) => n.trim());
      out.push({
        type: "citation",
        children: [],
        data: { hName: tagName, hProperties: { indexes: indexes.join(",") } },
      });
      last = index + m[0].length;
    }
    const rest = text.slice(last);
    if (rest) out.push({ type: "text", value: rest });
    return out;
  };

  const walk = (node: MdNode) => {
    if (!node.children || SKIP.has(node.type)) return;
    const next: MdNode[] = [];
    for (const child of node.children) {
      if (child.type === "text" && child.value && MARKER.test(child.value)) {
        MARKER.lastIndex = 0;
        next.push(...split(child.value));
      } else {
        walk(child);
        next.push(child);
      }
      MARKER.lastIndex = 0;
    }
    node.children = next;
  };

  return (tree: MdNode) => walk(tree);
}

export default remarkCitations;

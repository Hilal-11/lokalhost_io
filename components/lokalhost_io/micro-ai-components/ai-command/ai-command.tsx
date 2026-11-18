"use client";

/**
 * AI Command — two connected pieces:
 *  (A) <AICommandPalette> — ⌘K palette whose "Ask AI" row streams an answer in place.
 *  (B) <InlineAI> — floating "Ask AI" toolbar over selected text with a streamed word diff.
 */
export { AICommandPalette, Kbd } from "./command-palette";
export type { AICommandPaletteProps, PaletteCommand } from "./command-palette";
export { InlineAI, textareaRangeRects } from "./inline-ai";
export type { InlineAIProps, InlineAIAction } from "./inline-ai";
export { diffWords, diffStreaming } from "./word-diff";
export type { DiffPart } from "./word-diff";

export { AICommandPalette as default } from "./command-palette";

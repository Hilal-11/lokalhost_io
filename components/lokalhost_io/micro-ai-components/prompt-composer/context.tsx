"use client";

import * as React from "react";

export type ComposerStatus = "idle" | "submitting" | "streaming" | "error";

export type AttachmentStatus = "uploading" | "done" | "error";

export interface ComposerAttachment {
  /** Stable id. */
  id: string;
  /** The original File (absent for attachments restored from a server). */
  file?: File;
  name: string;
  /** Size in bytes. */
  size: number;
  /** MIME type. */
  type: string;
  /** Object URL for image thumbnails. */
  previewUrl?: string;
  /** Upload progress 0..1. */
  progress?: number;
  status: AttachmentStatus;
  /** Error text for the "error" state. */
  error?: string;
}

export interface ComposerContextValue {
  value: string;
  setValue: (value: string) => void;
  status: ComposerStatus;
  maxLength?: number;
  disabled: boolean;
  canSubmit: boolean;
  isOver: boolean;
  submit: () => void;
  stop: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  attachments: ComposerAttachment[];
  addFiles: (files: FileList | File[]) => void;
  removeAttachment: (id: string) => void;
  retryAttachment: (id: string) => void;
  /** Increments every time a submit is blocked (used to shake the counter). */
  blockedCount: number;
  /** Increments on every successful submit (used for the arrow nudge). */
  sentCount: number;
  recallHistory: () => boolean;
}

export const ComposerContext = React.createContext<ComposerContextValue | null>(null);

export function useComposer() {
  const ctx = React.useContext(ComposerContext);
  if (!ctx) throw new Error("Composer.* parts must be rendered inside <Composer>");
  return ctx;
}

export const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;
export const SOFT = { type: "spring", stiffness: 260, damping: 26 } as const;
export const EASE = [0.22, 1, 0.36, 1] as const;

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

"use client";

import * as React from "react";
import { Preview } from "./preview";

/**
 * Kept for backwards compatibility with existing MDX.
 * Preview now has a built-in replay button, so this is a thin alias.
 */
export function PreviewClient(props: React.ComponentProps<typeof Preview>) {
  return <Preview {...props} />;
}

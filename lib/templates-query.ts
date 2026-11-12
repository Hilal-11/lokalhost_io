"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface TemplateSummary {
  id: string;
  template_name: string;
  template_images: string[];
  template_price: string;
}

async function fetchTemplates(): Promise<TemplateSummary[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("templates")
    .select("id, template_name, template_images, template_price")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Shared between the docs sidebar and the /docs overview (same cache key). */
export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
    staleTime: 5 * 60 * 1000,
  });
}

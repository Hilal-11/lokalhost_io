"use client";

import { UseFormReturn } from "react-hook-form";
import { FullFormData } from "@/lib/Schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

const PLATFORMS = ["Web", "iOS", "Android", "Cross-platform"];
const PROJECT_TYPES = ["Web App", "Mobile App", "Desktop App", "SaaS Platform", "UI/UX Design", "API / Backend"];

interface Props {
  form: UseFormReturn<FullFormData>;
}

export function StepTwo({ form }: Props) {
  const { register, formState: { errors }, setValue, watch } = form;
  const platforms = watch("platforms") ?? [];
  const [fileName, setFileName] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const togglePlatform = (p: string) => {
    const next = platforms.includes(p) ? platforms.filter((x) => x !== p) : [...platforms, p];
    setValue("platforms", next, { shouldValidate: true });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-100">
          Project details
        </h2>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">
          Describe what you're building and the challenge you're solving.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Project title <span className="text-red-500">*</span>
        </Label>
        <Input
          placeholder="e.g. SaaS Dashboard for Logistics"
          {...register("projectTitle")}
          className={errors.projectTitle ? "border-red-400" : ""}
        />
        {errors.projectTitle && <p className="text-[11px] text-red-500">{errors.projectTitle.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Project description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          rows={3}
          placeholder="Briefly describe your project and its purpose..."
          {...register("projectDescription")}
          className={errors.projectDescription ? "border-red-400" : ""}
        />
        {errors.projectDescription && <p className="text-[11px] text-red-500">{errors.projectDescription.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Problem statement <span className="text-red-500">*</span>
        </Label>
        <Textarea
          rows={3}
          placeholder="What core problem does this solve? Who faces this problem?"
          {...register("problemStatement")}
          className={errors.problemStatement ? "border-red-400" : ""}
        />
        {errors.problemStatement && <p className="text-[11px] text-red-500">{errors.problemStatement.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
            Project type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("projectType")}
            onValueChange={(v) => setValue("projectType", v as FullFormData["projectType"], { shouldValidate: true })}
          >
            <SelectTrigger className={errors.projectType ? "border-red-400" : ""}>
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.projectType && <p className="text-[11px] text-red-500">{errors.projectType.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
            Tech stack preference
          </Label>
          <Input
            placeholder="e.g. Next.js, Supabase, React Native"
            {...register("techStack")}
          />
          <p className="text-[11px] text-neutral-400">Comma-separated or leave blank</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Target platform <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePlatform(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[13px] border transition-all duration-150",
                platforms.includes(p)
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-medium"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        {errors.platforms && <p className="text-[11px] text-red-500">{errors.platforms.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Reference links
        </Label>
        <Input
          placeholder="https://example.com, https://dribbble.com/..."
          {...register("referenceLinks")}
        />
        <p className="text-[11px] text-neutral-400">Inspiration or competitor sites (optional)</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Attach files
        </Label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg p-5 text-center hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors group"
        >
          <Upload className="w-5 h-5 mx-auto mb-2 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
          <p className="text-[12px] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
            {fileName || "Click to upload brief, wireframes, or assets"}
          </p>
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const names = [...(e.target.files ?? [])].map((f) => f.name).join(", ");
            setFileName(names);
          }}
        />
      </div>
    </div>
  );
}
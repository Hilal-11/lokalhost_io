"use client";

import { UseFormReturn } from "react-hook-form";
import { FullFormData } from "@/lib/Schema";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const FEATURES = ["Authentication", "Payments", "Dashboard", "AI Integration", "Realtime Features", "Analytics"];
const STAGES = ["Idea only", "Wireframes ready", "Design ready", "Already started"];
const MAINTENANCE_OPTS = ["Yes", "No", "Maybe / Discuss"];

interface Props {
  form: UseFormReturn<FullFormData>;
}

export function StepThree({ form }: Props) {
  const { formState: { errors }, setValue, watch } = form;
  const features = watch("featuresNeeded") ?? [];
  const stage = watch("projectStage");
  const maintenance = watch("maintenanceRequired");

  const toggleFeature = (f: string) => {
    const next = features.includes(f) ? features.filter((x) => x !== f) : [...features, f];
    setValue("featuresNeeded", next);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-100">
          Scope &amp; business
        </h2>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">
          Define the project boundaries so we can give you an accurate estimate.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
            Budget range <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("budget")}
            onValueChange={(v) => setValue("budget", v as FullFormData["budget"], { shouldValidate: true })}
          >
            <SelectTrigger className={errors.budget ? "border-red-400" : ""}>
              <SelectValue placeholder="Select budget..." />
            </SelectTrigger>
            <SelectContent>
              {["₹5k – ₹10k", "₹10k – ₹50k", "₹50k – ₹1L", "₹1L+", "To be discussed"].map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budget && <p className="text-[11px] text-red-500">{errors.budget.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
            Timeline <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("timeline")}
            onValueChange={(v) => setValue("timeline", v as FullFormData["timeline"], { shouldValidate: true })}
          >
            <SelectTrigger className={errors.timeline ? "border-red-400" : ""}>
              <SelectValue placeholder="Select timeline..." />
            </SelectTrigger>
            <SelectContent>
              {["Urgent (1–2 weeks)", "1 month", "2–3 months", "Flexible"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeline && <p className="text-[11px] text-red-500">{errors.timeline.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Project stage <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setValue("projectStage", s as FullFormData["projectStage"], { shouldValidate: true })}
              className={cn(
                "px-3 py-2 rounded-lg text-[13px] border transition-all duration-150",
                stage === s
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-medium"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        {errors.projectStage && <p className="text-[11px] text-red-500">{errors.projectStage.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Features needed
        </Label>
        <div className="flex flex-wrap gap-2">
          {FEATURES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => toggleFeature(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[13px] border transition-all duration-150",
                features.includes(f)
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-medium"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-neutral-400">Select all that apply</p>
      </div>

      <div className="space-y-2">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Maintenance required?
        </Label>
        <div className="flex gap-2">
          {MAINTENANCE_OPTS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setValue("maintenanceRequired", m as FullFormData["maintenanceRequired"])}
              className={cn(
                "flex-1 py-2 rounded-lg text-[13px] border transition-all duration-150",
                maintenance === m
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-medium"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
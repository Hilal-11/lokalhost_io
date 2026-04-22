"use client";

import { UseFormReturn } from "react-hook-form";
import { FullFormData } from "@/lib/Schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const MEETING_TYPES = ["Google Meet", "Zoom", "Phone Call"];

interface Props {
  form: UseFormReturn<FullFormData>;
}

export function StepFour({ form }: Props) {
  const { register, formState: { errors }, setValue, watch } = form;
  const date = watch("preferredDate");
  const meetingType = watch("meetingType");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setValue("timezone", tz);
    } catch {}
  }, [setValue]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-100">
          Schedule your call
        </h2>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">
          Pick a time that works — we'll confirm within 2 hours.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Preferred date <span className="text-red-500">*</span>
        </Label>
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden w-fit">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => setValue("preferredDate", d as Date, { shouldValidate: true })}
            disabled={{ before: new Date() }}
            className="p-3"
          />
        </div>
        {errors.preferredDate && (
          <p className="text-[11px] text-red-500">{errors.preferredDate.message}</p>
        )}
        {date && (
          <p className="text-[12px] text-neutral-600 dark:text-neutral-400">
            Selected: {date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
            Preferred time <span className="text-red-500">*</span>
          </Label>
          <Input
            type="time"
            {...register("preferredTime")}
            className={errors.preferredTime ? "border-red-400" : ""}
          />
          {errors.preferredTime && (
            <p className="text-[11px] text-red-500">{errors.preferredTime.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
            Timezone
          </Label>
          <Input
            readOnly
            {...register("timezone")}
            className="cursor-default text-neutral-500 dark:text-neutral-400 text-[12px]"
          />
          <p className="text-[11px] text-neutral-400">Auto-detected from your browser</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Meeting type <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {MEETING_TYPES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setValue("meetingType", m as FullFormData["meetingType"], { shouldValidate: true })}
              className={cn(
                "px-4 py-2 rounded-lg text-[13px] border transition-all duration-150",
                meetingType === m
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-medium"
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
              )}
            >
              {m}
            </button>
          ))}
        </div>
        {errors.meetingType && (
          <p className="text-[11px] text-red-500">{errors.meetingType.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Call agenda
        </Label>
        <Textarea
          rows={3}
          placeholder="What would you like to discuss? Any specific goals for the call?"
          {...register("callAgenda")}
        />
        <p className="text-[11px] text-neutral-400">Helps us prepare — optional but recommended</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Extra notes
        </Label>
        <Textarea
          rows={2}
          placeholder="Anything else we should know before the call?"
          {...register("extraNotes")}
        />
      </div>
    </div>
  );
}
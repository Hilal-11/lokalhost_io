"use client";

import { UseFormReturn } from "react-hook-form";
import { FullFormData } from "@/lib/Schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Phone, Building2, Briefcase, Sparkles } from "lucide-react";

interface Props {
  form: UseFormReturn<FullFormData>;
}

const roleOptions = [
  "Founder / Co-founder",
  "Developer",
  "Product Manager",
  "Designer",
  "Student",
  "Other",
];

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function FieldWrapper({ label, required, hint, error, icon, children }: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <Label className="text-[13px] font-semibold tracking-wide text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
          {icon}
        </span>
        {label}
        {required && <span className="text-neutral-900 dark:text-neutral-100 ml-0.5">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="text-[11.5px] text-neutral-800 dark:text-neutral-200 font-medium flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-neutral-800 dark:bg-neutral-200 mt-0.5" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11.5px] text-neutral-400 dark:text-neutral-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function StepOne({ form }: Props) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const inputClass = (hasError: boolean) =>
    [
      "h-11 rounded-xl border bg-white dark:bg-neutral-900 px-3.5 text-[14px] text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
      "transition-all duration-150 shadow-sm",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:border-neutral-400 dark:focus-visible:ring-neutral-500/40 dark:focus-visible:border-neutral-500",
      hasError
        ? "border-neutral-900 dark:border-neutral-100 focus-visible:ring-neutral-400/40"
        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600",
    ].join(" ");

  return (
    <div className="space-y-7">

      {/* ── Section Header ── */}
      <div className="relative pb-5 border-b border-neutral-100 dark:border-neutral-800">
        {/* Decorative blob — neutral */}
        <div className="absolute -top-6 -right-4 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none bg-neutral-400 dark:bg-neutral-600" />

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm bg-neutral-900 dark:bg-neutral-100">
            <Sparkles size={16} className="text-white dark:text-neutral-900" />
          </div>

          <div>
            <h2 className="text-[20px] font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Tell us about yourself
            </h2>
            <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
              Help us understand who you are and your professional context.
            </p>
          </div>
        </div>

        {/* Step badge */}
        <span className="absolute top-0 right-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
          Step 1 of 3
        </span>
      </div>

      {/* ── Row 1: Name + Email ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FieldWrapper
          label="Full Name"
          required
          hint="Your full legal or professional name"
          error={errors.fullName?.message}
          icon={<User size={11} />}
        >
          <Input
            id="fullName"
            placeholder="e.g. Arjun Sharma"
            {...register("fullName")}
            className={inputClass(!!errors.fullName)}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Email Address"
          required
          hint="We'll send your confirmation here"
          error={errors.email?.message}
          icon={<Mail size={11} />}
        >
          <Input
            id="email"
            type="email"
            placeholder="arjun@company.com"
            {...register("email")}
            className={inputClass(!!errors.email)}
          />
        </FieldWrapper>
      </div>

      {/* ── Row 2: Phone + Company ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FieldWrapper
          label="Phone Number"
          hint="Optional — for urgent follow-ups"
          icon={<Phone size={11} />}
        >
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register("phone")}
            className={inputClass(false)}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Company / Organisation"
          hint="Leave blank if freelance or personal"
          icon={<Building2 size={11} />}
        >
          <Input
            id="company"
            placeholder="e.g. Lokalhost Inc."
            {...register("company")}
            className={inputClass(false)}
          />
        </FieldWrapper>
      </div>

      {/* ── Row 3: Role ── */}
      <FieldWrapper
        label="Your Role"
        required
        hint="Helps us tailor our conversation"
        error={errors.role?.message}
        icon={<Briefcase size={11} />}
      >
        <Select
          value={watch("role")}
          onValueChange={(v) =>
            setValue("role", v as FullFormData["role"], { shouldValidate: true })
          }
        >
          <SelectTrigger
            className={[
              "h-11 rounded-xl border bg-white dark:bg-neutral-900 px-3.5 text-[14px] text-neutral-800 dark:text-neutral-100",
              "shadow-sm transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-neutral-400/40 focus:border-neutral-400 dark:focus:ring-neutral-500/40 dark:focus:border-neutral-500",
              errors.role
                ? "border-neutral-900 dark:border-neutral-100"
                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600",
            ].join(" ")}
          >
            <SelectValue placeholder="Select your role…" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg">
            {roleOptions.map((r) => (
              <SelectItem
                key={r}
                value={r}
                className="text-[13.5px] rounded-lg cursor-pointer"
              >
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldWrapper>
    </div>
  );
}
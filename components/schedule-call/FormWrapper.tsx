"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fullFormSchema,
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  stepFourSchema,
  type FullFormData,
} from "@/lib/Schema";
import { submitCustomWorkForm } from "@/app/actions/submit";
import { ProgressBar } from "./Progressbar";
import { StepOne } from "./Stepone";
import { StepTwo } from "./Steptwo";
import { StepThree } from "./Stepthree";
import { StepFour } from "./Stepfour";
import { SuccessScreen } from "./Successscreen";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "lokalhost_customwork_draft";

const STEP_SCHEMAS = [stepOneSchema, stepTwoSchema, stepThreeSchema, stepFourSchema];

interface Props {
  user?: { name?: string; email?: string } | null;
}

export function FormWrapper({ user }: Props) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const form = useForm<FullFormData>({
    resolver: zodResolver(fullFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: user?.name ?? "",   // ← pre-filled from JWT
      email: user?.email ?? "",     // ← pre-filled from JWT
      platforms: [],
      featuresNeeded: [],
    },
  });

  // Load draft from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft.preferredDate) draft.preferredDate = new Date(draft.preferredDate);
      form.reset(draft);
      setDraftSaved(true);
    } catch {}
  }, []);

  // Auto-save draft
  useEffect(() => {
    const sub = form.watch((values) => {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
          setDraftSaved(true);
          setTimeout(() => setDraftSaved(false), 2000);
        } catch {}
      }, 600);
    });
    return () => sub.unsubscribe();
  }, [form]);

  const goNext = async () => {
  const schema = STEP_SCHEMAS[step];
  const values = form.getValues();
  const result = schema.safeParse(values);

  if (!result.success) {
    // Clear stale errors first, then set new ones
    form.clearErrors();
    result.error.issues.forEach((e) => {   // .issues is Zod's primary — same as .errors
      const field = e.path[0] as keyof FullFormData;
      form.setError(field, { message: e.message });
    });
    return;
  }

  form.clearErrors(); // ← clear before advancing so old errors don't bleed into next step

  if (step < 3) {
    setDirection(1);
    setStep((s) => s + 1);
  } else {
    await handleSubmit();
  }
};

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const values = form.getValues();
      const result = await submitCustomWorkForm(values);
      if (result.success) {
        localStorage.removeItem(DRAFT_KEY);
        setSubmitted(true);
      } else {
        form.setError("root", { message: result.error });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    form.reset();
    setStep(0);
    setSubmitted(false);
    setDirection(1);
  };

  if (submitted) {
    return <SuccessScreen data={form.getValues()} onReset={reset} />;
  }

  const steps = [
    <StepOne key="s1" form={form} />,
    <StepTwo key="s2" form={form} />,
    <StepThree key="s3" form={form} />,
    <StepFour key="s4" form={form} />,
  ];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="flex flex-col h-full pt-6 ">
      <ProgressBar currentStep={step} />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        {form.formState.errors.root && (
          <p className="mt-4 text-[12px] text-red-500 text-center">
            {form.formState.errors.root.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 rounded-b-xl">
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors duration-300",
            draftSaved ? "bg-neutral-500" : "bg-neutral-300 dark:bg-neutral-600"
          )} />
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
            {draftSaved ? "Draft saved" : "Auto-saving..."}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goBack}
              disabled={submitting}
              className="text-[13px] h-9"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={goNext}
            disabled={submitting}
            className="text-[13px] h-9 min-w-[120px] bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : step === 3 ? (
              "Submit enquiry"
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
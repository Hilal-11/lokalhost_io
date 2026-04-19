"use client";

import { useEffect, useState } from "react";
import { FullFormData } from "@/lib/Schema";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, CalendarDays, Banknote, Monitor, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  data: Partial<FullFormData>;
  onReset: () => void;
}

const summaryRows = (data: Partial<FullFormData>) => [
  {
    icon: <User2 size={12} />,
    label: "Name",
    value: data.fullName,
  },
  {
    icon: <Monitor size={12} />,
    label: "Project",
    value: data.projectTitle,
  },
  {
    icon: <Monitor size={12} />,
    label: "Type",
    value: data.projectType,
  },
  {
    icon: <Banknote size={12} />,
    label: "Budget",
    value: data.budget,
  },
  {
    icon: <CalendarDays size={12} />,
    label: "Call date",
    value: data.preferredDate?.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  },
  {
    icon: <Monitor size={12} />,
    label: "Via",
    value: data.meetingType,
  },
];

// Animated tick — draws the checkmark via SVG stroke
function AnimatedTick() {
  return (
    <motion.div
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
      className="relative w-20 h-20 mx-auto"
    >
      {/* Outer ring pulse */}
      <motion.span
        className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-neutral-100 opacity-10"
        initial={{ scale: 0.6 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      />
      {/* Circle */}
      <div className="w-20 h-20 rounded-full bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center shadow-lg">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.25 }}
        >
          <Check
            size={32}
            strokeWidth={2.5}
            className="text-white dark:text-neutral-900"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Staggered container for children
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.45 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.35 } },
};

export function SuccessScreen({ data, onReset }: Props) {
  const [showConfetti, setShowConfetti] = useState(false);
  const rows = summaryRows(data).filter((r) => r.value);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-start py-10 px-6 text-center overflow-hidden min-h-full">

      {/* ── Subtle grid background ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Animated confetti dots ── */}
      <AnimatePresence>
        {showConfetti &&
          Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500"
              initial={{
                opacity: 1,
                x: 0,
                y: 0,
                left: "50%",
                top: "18%",
              }}
              animate={{
                opacity: 0,
                x: (Math.cos((i / 12) * Math.PI * 2) * 120),
                y: (Math.sin((i / 12) * Math.PI * 2) * 90) - 20,
              }}
              transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.03 }}
            />
          ))}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-sm flex flex-col items-center gap-6 relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >

        {/* ── Tick ── */}
        <AnimatedTick />

        {/* ── Heading ── */}
        <motion.div variants={item} className="space-y-1.5">
          <h2 className="text-[22px] font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
            You're all set!
          </h2>
          <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[260px] mx-auto">
            We'll confirm your call within{" "}
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">2 hours</span>.
            Check your inbox at{" "}
            <span className="font-semibold text-neutral-700 dark:text-neutral-300 break-all">
              {data.email}
            </span>
            .
          </p>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          variants={item}
          className="w-full flex items-center gap-3"
        >
          <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-600 font-medium">
            Booking summary
          </span>
          <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        </motion.div>

        {/* ── Summary card ── */}
        <motion.div
          variants={item}
          className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm"
        >
          {rows.map(({ icon, label, value }, idx) => (
            <motion.div
              key={label}
              variants={item}
              className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-none"
            >
              <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500">
                {icon}
                <span className="text-[11.5px] font-medium tracking-wide uppercase">
                  {label}
                </span>
              </div>
              <span className="text-[12.5px] font-semibold text-neutral-800 dark:text-neutral-200 text-right max-w-[55%] truncate">
                {value as string}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── What happens next ── */}
        <motion.div
          variants={item}
          className="w-full rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-4 py-3 text-left space-y-2"
        >
          <p className="text-[10.5px] uppercase tracking-widest text-neutral-400 font-semibold mb-2">
            What happens next
          </p>
          {[
            "We review your enquiry & match a team member",
            "You get a calendar invite within 2 hrs",
            "We hop on a call & scope your project",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[9px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-[12px] text-neutral-600 dark:text-neutral-400 leading-snug">
                {step}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div variants={item} className="w-full flex flex-col gap-2 pt-1">
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full h-10 text-[13px] font-medium rounded-xl border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group"
          >
            Submit another enquiry
            <ArrowRight
              size={13}
              className="ml-1.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
            />
          </Button>
        </motion.div>

      </motion.div>
    </div>
  );
}
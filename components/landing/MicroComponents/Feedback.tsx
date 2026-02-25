"use client"
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from "motion/react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { FeedbackSchema } from "@/lib/definitions"
import { toast, Toaster } from 'sonner'
import { IoMdSend } from "react-icons/io"
import { LuMessageSquare, LuBug, LuZap, LuPaintbrush, LuGauge, LuUser, LuFileText, LuLink, LuThumbsUp } from "react-icons/lu"
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
/* ── topic config with icons ── */
const TOPICS = [
  { value: "bug_report",          label: "Report a Bug",                  Icon: LuBug },
  { value: "feature_request",     label: "Feature Request",               Icon: LuZap },
  { value: "improvement",         label: "Improvement Suggestion",        Icon: LuThumbsUp },
  { value: "ui_ux_feedback",      label: "UI / UX Feedback",              Icon: LuPaintbrush },
  { value: "performance_issue",   label: "Performance Issue",             Icon: LuGauge },
  { value: "account_issue",       label: "Account / Login Issue",         Icon: LuUser },
  { value: "content_issue",       label: "Content / Docs Issue",          Icon: LuFileText },
  { value: "integration_problem", label: "Integration Problem",           Icon: LuLink },
  { value: "general_feedback",    label: "General Feedback",              Icon: LuMessageSquare },
  { value: "other",               label: "Other",                         Icon: TbHelpSquareRoundedFilled },
]

const MAX_CHARS = 400

function Feedback() {
  const [feedbackTitle, setFeedbackTitle]           = useState('')
  const [feedbackDescription, setFeedbackDescription] = useState('')
  const [loading, setLoading]                       = useState(false)
  const [submitted, setSubmitted]                   = useState(false)
  const [focused, setFocused]                       = useState(false)
  const [errors, setErrors] = useState({ feedback_title: '', feedback_discription: '' })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const charCount   = feedbackDescription.length
  const charPercent = (charCount / MAX_CHARS) * 100
  const charColor   = charPercent > 90 ? '#ef4444' : charPercent > 70 ? '#f59e0b' : '#a3a3a3'

  const selectedTopic = TOPICS.find(t => t.value === feedbackTitle)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const validated: any = FeedbackSchema.safeParse({
      feedback_title: feedbackTitle,
      feedback_discription: feedbackDescription,
    })
    if (!validated.success) {
      setLoading(false)
      setErrors(validated.error.flatten().fieldErrors)
      return
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback_title: feedbackTitle, feedback_discription: feedbackDescription }),
      })
      if (res.ok) {
        setSubmitted(true)
        setFeedbackTitle('')
        setFeedbackDescription('')
        setErrors({ feedback_title: '', feedback_discription: '' })
        toast.success('Feedback submitted — thank you!')
        setTimeout(() => setSubmitted(false), 3000)
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="relative w-[340px] lg:w-[360px] overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl bg-white dark:bg-neutral-950">

          {/* ── animated top accent line ── */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ originX: 0.5 }}
          />

          {/* ── Header ── */}
          <CardHeader className="pb-3 pt-5 px-5">
            {/* title row */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-2 mb-3"
            >
              <motion.div
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                className="flex items-center justify-center w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
              >
                <LuMessageSquare className="text-sm" />
              </motion.div>
              <div>
                <h2 className="text-sm font-sans font-bold text-neutral-800 dark:text-neutral-200 leading-none">
                  Share Feedback
                </h2>
                <p className="text-[11px] font-sans text-neutral-400 dark:text-neutral-600 mt-0.5">
                  Help us improve lokalhost.io
                </p>
              </div>
            </motion.div>

            {/* topic select */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
            >
              <Select onValueChange={(v) => { setFeedbackTitle(v); setErrors(p => ({ ...p, feedback_title: '' })) }} value={feedbackTitle}>
                <SelectTrigger className={`w-full text-sm transition-all duration-200 ${errors.feedback_title ? 'border-red-400 dark:border-red-500' : ''}`}>
                  <div className="flex items-center gap-2">
                    <AnimatePresence mode="wait">
                      {selectedTopic ? (
                        <motion.span
                          key={selectedTopic.value}
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ duration: 0.15 }}
                          className="text-neutral-500 dark:text-neutral-400"
                        >
                          <selectedTopic.Icon className="text-sm" />
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                    <SelectValue placeholder="Select a topic…" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {TOPICS.map(({ value, label, Icon }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <Icon className="text-sm text-neutral-500" />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AnimatePresence>
                {errors.feedback_title && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] text-red-500 font-medium mt-1 pl-0.5"
                  >
                    {errors.feedback_title}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </CardHeader>

          {/* ── Textarea ── */}
          <CardContent className="px-5 pb-2">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.26 }}
              className="relative"
            >
              <label className="text-xs font-sans font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                Message
              </label>

              {/* textarea wrapper with animated border */}
              <div className={`relative rounded-md transition-all duration-200 ${focused ? 'ring-1 ring-neutral-300 dark:ring-neutral-700' : ''} ${errors.feedback_discription ? 'ring-1 ring-red-400 dark:ring-red-500' : ''}`}>
                <Textarea
                  ref={textareaRef}
                  id="feedback"
                  placeholder="Your feedback helps us improve…"
                  className="h-28 resize-none text-sm border-neutral-200 dark:border-neutral-800 focus-visible:ring-0 focus-visible:ring-offset-0 bg-neutral-50 dark:bg-neutral-900/50 transition-colors duration-200"
                  value={feedbackDescription}
                  maxLength={MAX_CHARS}
                  onChange={e => { setFeedbackDescription(e.target.value); setErrors(p => ({ ...p, feedback_discription: '' })) }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />

                {/* char counter arc */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                  <svg width="18" height="18" viewBox="0 0 18 18" className="-rotate-90">
                    <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-200 dark:text-neutral-800" />
                    <motion.circle
                      cx="9" cy="9" r="7"
                      fill="none"
                      stroke={charColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 7}`}
                      strokeDashoffset={`${2 * Math.PI * 7 * (1 - charPercent / 100)}`}
                      style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease' }}
                    />
                  </svg>
                  <motion.span
                    key={charCount > MAX_CHARS - 30 ? 'visible' : 'hidden'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: charCount > MAX_CHARS - 30 ? 1 : 0 }}
                    className="text-[10px] font-mono"
                    style={{ color: charColor }}
                  >
                    {MAX_CHARS - charCount}
                  </motion.span>
                </div>
              </div>

              <AnimatePresence>
                {errors.feedback_discription && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] text-red-500 font-medium mt-1 pl-0.5"
                  >
                    {errors.feedback_discription}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>

          {/* ── Footer ── */}
          <CardFooter className="px-5 pb-5 pt-2 flex flex-wrap justify-between items-center lg: gap-2 ">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-[10px] font-sans text-neutral-400 dark:text-neutral-600"
            >
              Anonymous · not stored with account
            </motion.p>

            <motion.button
              onClick={handleSubmit}
              disabled={loading || submitted}
              whileHover={!loading && !submitted ? { scale: 1.04, y: -1 } : {}}
              whileTap={!loading && !submitted ? { scale: 0.97 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative flex items-center justify-center gap-2 text-xs border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 cursor-pointer font-sans font-semibold px-4 py-2 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06)] overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {/* shimmer sweep */}
              <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.span
                    key="done"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex items-center gap-1.5 relative z-10"
                  >
                    <motion.span
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      ✓
                    </motion.span>
                    Sent!
                  </motion.span>
                ) : loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 relative z-10"
                  >
                    <Spinner />
                    Sending…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 relative z-10"
                  >
                    <motion.span
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <IoMdSend />
                    </motion.span>
                    Send Feedback
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </CardFooter>

          {/* ── Success overlay flash ── */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 pointer-events-none bg-gradient-to-t from-emerald-500/5 to-transparent rounded-xl"
              />
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </>
  )
}

export default Feedback
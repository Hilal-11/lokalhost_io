"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { toast, Toaster } from 'sonner'
import { MdLogout } from "react-icons/md"
import { LuLayoutDashboard, LuUser } from "react-icons/lu"
import { RiMoonLine } from "react-icons/ri"

interface HeaderClientProps {
  user: string | null;
  userEmail: string | null;
} 
function HeaderProfile({ user, userEmail }: HeaderClientProps) {
  const [open, setOpen]           = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const res = await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        window.location.href = '/'
      } else {
        toast.error('Logout failed')
        setLoggingOut(false)
      }
    } catch {
      toast.error('Logout failed')
      setLoggingOut(false)
    }
  }

  const initials = user?.slice(0, 2).toUpperCase() ?? '?'

  return (
    <div className="flex items-center">
      <Toaster position="top-right" />

      <DropdownMenu open={open} onOpenChange={setOpen}>

        {/* ── Avatar trigger ── */}
        <DropdownMenuTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative cursor-pointer flex items-center justify-center w-[28px] h-[28px] lg:w-[32px] lg:h-[32px] rounded-md overflow-hidden bg-gradient-to-t from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-300 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_2px_4px_rgba(0,0,0,0.12)] outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
          >
            {/* shimmer sweep on hover */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full"
              animate={open ? { x: "100%" } : { x: "-100%" }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10 text-[13px] font-bold font-sans text-white dark:text-black tracking-tight select-none">
              {initials}
            </span>

            {/* online dot */}
            <motion.span
              initial={{ scale: 0 }}
              className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-white dark:border-neutral-950"
            />
          </motion.button>
        </DropdownMenuTrigger>

        {/* ── Dropdown content ── */}
        <DropdownMenuContent
          className="w-56 lg:w-60 p-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl bg-white dark:bg-neutral-950"
          align="end"
          sideOffset={8}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* ── animated top accent ── */}
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ originX: 0.5 }}
                />

                {/* ── User info ── */}
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="px-4 pt-4 pb-3"
                >
                  {/* avatar + name row */}
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-t from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-300 shadow-sm">
                      <span className="text-sm font-bold text-white dark:text-black select-none">
                        {initials}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans font-semibold text-sm text-neutral-800 dark:text-neutral-200 truncate leading-tight">
                        {user}
                      </p>
                      <p className="font-sans font-medium text-[11px] text-neutral-400 dark:text-neutral-600 truncate mt-0.5">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 mx-3" />

                {/* ── Menu items ── */}
                <div className="px-2 py-2 flex flex-col gap-0.5">
                  {[
                    { label: 'Dashboard', Icon: LuLayoutDashboard, href: '/dashboard' },
                    { label: 'Profile',   Icon: LuUser,             href: '/profile' },
                  ].map(({ label, Icon, href }, i) => (
                    <motion.a
                      key={label}
                      href={href}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.22 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ x: 2 }}
                      className="group/item flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors duration-150 cursor-pointer relative overflow-hidden"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 group-hover/item:border-neutral-300 dark:group-hover/item:border-neutral-600 transition-colors duration-150 flex-shrink-0">
                        <Icon className="text-xs" />
                      </span>
                      <span className="text-sm font-sans font-medium text-neutral-700 dark:text-neutral-300 group-hover/item:text-neutral-900 dark:group-hover/item:text-neutral-100 transition-colors duration-150">
                        {label}
                      </span>
                      <motion.span
                        className="ml-auto text-xs text-neutral-300 dark:text-neutral-700 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150"
                      >
                        →
                      </motion.span>
                    </motion.a>
                  ))}

                  {/* theme toggle row */}
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors duration-150 cursor-pointer"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                      <RiMoonLine className="text-xs" />
                    </span>
                    <span className="text-sm font-sans font-medium text-neutral-700 dark:text-neutral-300 flex-1">
                      Theme
                    </span>
                    <ThemeToggle />
                  </motion.div>
                </div>

                <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 mx-3" />

                {/* ── Logout ── */}
                <div className="px-2 py-2">
                  <motion.button
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
                    onClick={handleLogout}
                    disabled={loggingOut}
                    whileHover={!loggingOut ? { scale: 1.02, y: -0.5 } : {}}
                    whileTap={!loggingOut ? { scale: 0.97 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="relative w-full flex items-center justify-between px-3 py-2 rounded-lg border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-900 dark:border-neutral-800 bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_2px_4px_rgba(0,0,0,0.12)] overflow-hidden group/logout disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {/* shimmer */}
                    <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/logout:translate-x-full transition-transform duration-700" />

                    <span className="relative z-10 text-sm font-sans font-semibold">
                      {loggingOut ? 'Signing out…' : 'Sign out'}
                    </span>
                    <motion.span
                      animate={loggingOut ? { x: [0, 4, 0] } : { x: 0 }}
                      transition={{ duration: 0.6, repeat: loggingOut ? Infinity : 0 }}
                      className="relative z-10 text-base"
                    >
                      <MdLogout />
                    </motion.span>
                  </motion.button>
                </div>

                {/* bottom accent */}
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ originX: 0.5 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default HeaderProfile
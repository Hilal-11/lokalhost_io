"use client"

import { FaGoogle } from "react-icons/fa6";
import { useState } from "react";
import PrefetchLink from "@/components/pre-fetching";
import { LoginFormSchema } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { PiTerminalFill } from "react-icons/pi";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Spinner } from "@/components/ui/spinner";

import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
export const dynamic = "force-static";

// reusable field block
const Field = ({ label, id, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-sm font-medium text-neutral-700 dark:text-neutral-300 pl-0.5 select-none"
    >
      {label}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1.5 text-[0.72rem] font-medium text-red-500 dark:text-red-400 pl-0.5">
        <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500/15 text-[9px] font-bold shrink-0 leading-none">
          !
        </span>
        {Array.isArray(error) ? error[0] : error}
      </p>
    )}
  </div>
);

const Login = () => {
  const [invalidCreds, setInvalidCreds] = useState({ email: "", password: "" });
  const [loading, setLoading]           = useState(false);
  const [formData, setFormData]         = useState({ email: "", password: "" });
  const [showPw, setShowPw]             = useState(false);
  const [errors, setErrors]             = useState({ email: "", password: "" });
  const router = useRouter();
  const searchParams = useSearchParams();                    // ← add this
  const redirectTo = searchParams.get("redirect") || "/";
  console.log("redirectTo:", redirectTo); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors((p)       => ({ ...p, [name]: "" }));
    setInvalidCreds((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validated = LoginFormSchema.safeParse(formData);
    if (!validated.success) {
      setLoading(false);
      setErrors(validated.error.flatten().fieldErrors);
      return;
    }
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        setInvalidCreds({ email: data?.message, password: data?.message });
        return;
      }
        // This line — does it actually run?
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (f) => errors?.[f] || invalidCreds?.[f];

  const inputBase =
    "w-full py-[13px] px-4 text-sm rounded-xl outline-none transition-all duration-150 " +
    "bg-neutral-100 dark:bg-neutral-800/60 " +
    "text-neutral-900 dark:text-neutral-100 " +
    "placeholder:text-neutral-400 dark:placeholder:text-neutral-600 " +
    "border ";

  const inputNormal =
    "border-neutral-200 dark:border-neutral-700/70 " +
    "hover:border-neutral-300 dark:hover:border-neutral-600 " +
    "focus:border-neutral-400 dark:focus:border-neutral-500 " +
    "focus:ring-2 focus:ring-neutral-400/10 dark:focus:ring-neutral-500/10 ";

  const inputErr =
    "border-red-400 dark:border-red-500/60 " +
    "ring-2 ring-red-400/10 dark:ring-red-500/10 ";

  return (
    <div className="relative min-h-svh w-full flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-950">

      {/* grid light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(0,0,0,0.05) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%,black 10%,transparent 100%)",
        }}
      />
      {/* grid dark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%,black 10%,transparent 100%)",
        }}
      />

      {/* card */}
      <div
        className="relative z-10 w-full max-w-[460px] mx-4 my-8
          bg-white dark:bg-neutral-900
          border border-neutral-200/80 dark:border-neutral-800
          rounded-2xl
          shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08),0_40px_64px_rgba(0,0,0,0.05)]
          dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),0_24px_48px_rgba(0,0,0,0.5)]
          px-8 py-9"
        style={{ animation: "cardIn 0.55s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <style>{`
          @keyframes cardIn {
            from { opacity:0; transform:translateY(18px) scale(0.984); }
            to   { opacity:1; transform:translateY(0) scale(1); }
          }
          @keyframes fadeUp {
            from { opacity:0; transform:translateY(8px); }
            to   { opacity:1; transform:translateY(0); }
          }
          .fu1 { animation:fadeUp .4s .06s both }
          .fu2 { animation:fadeUp .4s .11s both }
          .fu3 { animation:fadeUp .4s .16s both }
          .fu4 { animation:fadeUp .4s .20s both }
          .fu5 { animation:fadeUp .4s .24s both }
          .fu6 { animation:fadeUp .4s .28s both }
          .fu7 { animation:fadeUp .4s .32s both }
          .fu8 { animation:fadeUp .4s .36s both }
        `}</style>

        {/* brand */}
        <div className="fu1 flex items-center gap-3 mb-7">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
            bg-neutral-900 dark:bg-neutral-100
            text-white dark:text-neutral-900 text-[16px] shadow-sm">
            <PiTerminalFill />
          </div>
          <span className="font-mono text-[1rem] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            lokal<span className="text-neutral-400 dark:text-neutral-600">host</span>.io
          </span>
        </div>

        {/* heading */}
        <div className="fu2 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Welcome back
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
            Login to your account to continue building.
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* email */}
          <div className="fu3">
            <Field label="Email" id="email" error={fieldError("email")}>
              <input
                id="email" name="email" type="email"
                placeholder="Enter email ID"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleFocus}
                autoComplete="email"
                className={inputBase + (fieldError("email") ? inputErr : inputNormal)}
              />
            </Field>
          </div>

          {/* password */}
          <div className="fu4">
            <Field label="Password" id="password" error={fieldError("password")}>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  autoComplete="current-password"
                  className={inputBase + (fieldError("password") ? inputErr : inputNormal) + " pr-11"}
                />
                <button
                  type="button" tabIndex={-1}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-3.5 flex items-center
                    text-neutral-400 hover:text-neutral-600
                    dark:text-neutral-600 dark:hover:text-neutral-400
                    transition-colors duration-150"
                >
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </Field>
          </div>

          {/* remember me + forgot password */}
          <div className="fu5 flex items-center justify-between px-0.5 -mt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                className="w-3.5 h-3.5 rounded accent-neutral-800 dark:accent-neutral-200 cursor-pointer"
              />
              <span className="text-[0.78rem] text-neutral-500 dark:text-neutral-500">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="text-[0.78rem] font-medium
                text-neutral-500 dark:text-neutral-500
                hover:text-neutral-800 dark:hover:text-neutral-300
                transition-colors duration-150"
            >
              Forgot password?
            </button>
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className="fu6 mt-1 w-full flex items-center justify-center gap-2.5
              py-[13px] rounded-xl text-sm font-semibold tracking-tight
              bg-neutral-900 dark:bg-neutral-100
              text-white dark:text-neutral-900
              shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)]
              hover:bg-neutral-700 dark:hover:bg-white
              active:scale-[0.99]
              hover:-translate-y-px active:translate-y-0
              transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:translate-y-0 disabled:active:scale-100"
          >
            {loading && <Spinner className="w-4 h-4 shrink-0" />}
            {loading ? "Logging in…" : "Login →"}
          </button>

          {/* divider */}
          <div className="fu7 flex items-center gap-3">
            <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-[0.7rem] font-mono tracking-widest uppercase text-neutral-400 dark:text-neutral-600 select-none px-1">
              or
            </span>
            <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* google */}
          <button
            type="button"
            className="fu8 w-full flex items-center justify-center gap-2.5
              py-[13px] rounded-xl text-sm font-medium
              bg-white dark:bg-transparent
              text-neutral-700 dark:text-neutral-300
              border border-neutral-200 dark:border-neutral-800
              hover:bg-neutral-50 dark:hover:bg-neutral-800/60
              hover:border-neutral-300 dark:hover:border-neutral-700
              shadow-[0_1px_2px_rgba(0,0,0,0.04)]
              hover:-translate-y-px active:translate-y-0
              transition-all duration-150"
          >
            <FaGoogle className="text-[#ea4335] text-[0.9rem] shrink-0" />
            Continue with Google
          </button>

        </form>

        {/* footer */}
        <p className="mt-6 text-center text-[0.8rem] text-neutral-400 dark:text-neutral-600">
          Don&apos;t have an account?{" "}
          <PrefetchLink
            href="/signup"
            className="font-semibold
              text-neutral-700 dark:text-neutral-300
              underline underline-offset-2
              decoration-neutral-300 dark:decoration-neutral-700
              hover:text-neutral-900 dark:hover:text-neutral-100
              hover:decoration-neutral-500 dark:hover:decoration-neutral-500
              transition-colors duration-150"
          >
            Sign up
          </PrefetchLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
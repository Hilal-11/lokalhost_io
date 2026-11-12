"use client";

import { useState } from "react";
import {
  Apple,
  ArrowLeft,
  ArrowUp,
  Bell,
  Bookmark,
  Camera,
  Check,
  ChevronLeft,
  CircleHelp,
  CloudOff,
  CreditCard,
  Grid3x3,
  Heart,
  Home,
  Inbox,
  Lock,
  Mail,
  MessageCircle,
  Minus,
  MoreHorizontal,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings as SettingsIcon,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  User,
  Video,
  Zap,
  Globe,
  Moon,
  LogOut,
  Pencil,
  Share,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePhone } from "../phone-frame";
import { Art, Body, MAvatar, MButton, MGroup, MInput, MRow, MSegmented, MSwitch, MTabBar, NavHeader, SafeBottom, Screen, type MTabItem } from "../kit";

const TABS: MTabItem[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "search", label: "Search", icon: Search },
  { key: "inbox", label: "Inbox", icon: Inbox, badge: 2 },
  { key: "profile", label: "Profile", icon: User },
];

/* ------------------------------ Onboarding --------------------------- */

const SLIDES = [
  { hue: 250, icon: Sparkles, title: "Design that ships", body: "Production-ready screens for React Native and Flutter, themed in minutes." },
  { hue: 160, icon: Zap, title: "Fast by default", body: "Native drivers, 60fps gestures and zero layout thrash on every component." },
  { hue: 20, icon: Shield, title: "Yours to own", body: "Copy the source into your app. No runtime dependency, no lock-in." },
];

function OnboardingStep({ index }: { index: number }) {
  const s = SLIDES[index];
  const last = index === SLIDES.length - 1;
  return (
    <Screen>
      <div className="flex h-11 items-center justify-end px-5">
        {!last && <button type="button" className="text-[16px] font-medium text-[var(--m-fg-muted)]">Skip</button>}
      </div>
      <div className="flex flex-1 flex-col px-6">
        <Art hue={s.hue} icon={s.icon} className="mt-4 aspect-square w-full rounded-[32px]" />
        <h1 className="mt-10 text-[30px] font-bold leading-tight tracking-tight">{s.title}</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[var(--m-fg-muted)]">{s.body}</p>
      </div>
      <div className="flex flex-col gap-6 px-6 pb-4">
        <div className="flex items-center gap-1.5" aria-label={`Step ${index + 1} of 3`}>
          {SLIDES.map((_, i) => (
            <span key={i} className={cn("h-2 rounded-full transition-all", i === index ? "w-6 bg-[var(--m-fg)]" : "w-2 bg-[var(--m-border)]")} />
          ))}
        </div>
        <MButton full size="lg">{last ? "Get started" : "Next"}</MButton>
      </div>
      <SafeBottom />
    </Screen>
  );
}

export const Onboarding1 = () => <OnboardingStep index={0} />;
export const Onboarding2 = () => <OnboardingStep index={1} />;
export const Onboarding3 = () => <OnboardingStep index={2} />;

/* --------------------------------- Auth ------------------------------ */

function Social() {
  return (
    <div className="flex flex-col gap-2.5">
      <MButton full variant="outline" icon={Apple}>Continue with Apple</MButton>
      <MButton full variant="outline" icon={Globe}>Continue with Google</MButton>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 text-[13px] text-[var(--m-fg-muted)]">
      <span className="h-px flex-1 bg-[var(--m-border)]" />
      or
      <span className="h-px flex-1 bg-[var(--m-border)]" />
    </div>
  );
}

export function AuthSignIn() {
  return (
    <Screen>
      <Body className="flex flex-col gap-6 px-6 pt-10">
        <div>
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--m-primary)] text-[var(--m-on-primary)]">
            <Sparkles size={22} />
          </span>
          <h1 className="mt-6 text-[30px] font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-[16px] text-[var(--m-fg-muted)]">Sign in to continue to Lumen.</p>
        </div>
        <div className="flex flex-col gap-4">
          <MInput label="Email" placeholder="you@example.com" icon={Mail} />
          <MInput label="Password" value="password" secure icon={Lock} />
          <button type="button" className="self-end text-[14px] font-medium">Forgot password?</button>
        </div>
        <MButton full size="lg">Sign in</MButton>
        <Divider />
        <Social />
        <p className="pb-6 text-center text-[15px] text-[var(--m-fg-muted)]">
          New here? <span className="font-semibold text-[var(--m-fg)]">Create an account</span>
        </p>
      </Body>
    </Screen>
  );
}

export function AuthSignUp() {
  return (
    <Screen>
      <NavHeader title="" back />
      <Body className="flex flex-col gap-5 px-6 pt-2">
        <div>
          <h1 className="text-[30px] font-bold tracking-tight">Create account</h1>
          <p className="mt-1 text-[16px] text-[var(--m-fg-muted)]">It takes less than a minute.</p>
        </div>
        <MInput label="Full name" value="Amelia Hart" icon={User} />
        <MInput label="Email" value="amelia@lumen.app" icon={Mail} />
        <MInput label="Password" value="secretpass" secure icon={Lock} helper="At least 8 characters." />
        <label className="flex items-start gap-3 text-[14px] text-[var(--m-fg-muted)]">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-[var(--m-primary)] text-[var(--m-on-primary)]">
            <Check size={14} strokeWidth={3} />
          </span>
          I agree to the Terms of Service and Privacy Policy.
        </label>
        <MButton full size="lg">Create account</MButton>
      </Body>
    </Screen>
  );
}

export function AuthOtp() {
  const [code, setCode] = useState("4829");
  const { interactive } = usePhone();
  return (
    <Screen>
      <NavHeader title="" back />
      <Body className="flex flex-col gap-7 px-6 pt-2">
        <div>
          <h1 className="text-[30px] font-bold tracking-tight">Check your email</h1>
          <p className="mt-1 text-[16px] leading-relaxed text-[var(--m-fg-muted)]">
            We sent a 6-digit code to <span className="font-medium text-[var(--m-fg)]">amelia@lumen.app</span>
          </p>
        </div>
        <label className="relative flex justify-between gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "flex h-14 flex-1 items-center justify-center rounded-xl border text-[24px] font-semibold",
                i === code.length ? "border-[var(--m-fg)]" : "border-[var(--m-border)]"
              )}
            >
              {code[i] ?? ""}
              {i === code.length && <span className="h-6 w-px animate-pulse bg-[var(--m-fg)]" />}
            </span>
          ))}
          <input
            aria-label="Verification code"
            inputMode="numeric"
            value={code}
            readOnly={!interactive}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="absolute inset-0 opacity-0"
          />
        </label>
        <MButton full size="lg" disabled={code.length < 6}>Verify</MButton>
        <p className="text-center text-[15px] text-[var(--m-fg-muted)]">
          Didn’t get it? <span className="font-semibold text-[var(--m-fg)]">Resend in 0:24</span>
        </p>
      </Body>
    </Screen>
  );
}

/* ---------------------------------- Feed ----------------------------- */

const STORIES = ["Your story", "Amelia Hart", "Jonas Berg", "Maya Lin", "Leo Park", "Sara Ali"];

function StoryRailInner() {
  return (
    <div className="scrollbar-hide flex gap-3.5 overflow-x-auto px-5 py-2">
      {STORIES.map((s, i) => (
        <span key={s} className="flex w-[66px] shrink-0 flex-col items-center gap-1.5">
          <span
            className={cn("rounded-full p-[2.5px]", i === 0 ? "" : i < 3 ? "bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600" : "bg-[var(--m-border)]")}
          >
            <span className="relative block rounded-full bg-[var(--m-bg)] p-[2.5px]">
              <MAvatar name={i === 0 ? "Hilal Ahmad" : s} size={56} />
              {i === 0 && (
                <span className="absolute bottom-0 right-0 flex size-5 items-center justify-center rounded-full bg-[var(--m-accent)] text-white ring-2 ring-[var(--m-bg)]">
                  <Plus size={13} strokeWidth={3} />
                </span>
              )}
            </span>
          </span>
          <span className="w-full truncate text-center text-[12px]">{i === 0 ? s : s.split(" ")[0]}</span>
        </span>
      ))}
    </div>
  );
}

function Post({ name, time, hue, text, likes }: { name: string; time: string; hue: number; text: string; likes: number }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="border-t border-[var(--m-border)] py-3">
      <header className="flex items-center gap-3 px-5">
        <MAvatar name={name} size={36} />
        <div className="flex-1">
          <p className="text-[15px] font-semibold">{name}</p>
          <p className="text-[12.5px] text-[var(--m-fg-muted)]">{time}</p>
        </div>
        <MoreHorizontal size={20} className="text-[var(--m-fg-muted)]" />
      </header>
      <p className="px-5 py-2.5 text-[15px] leading-snug">{text}</p>
      <Art hue={hue} className="mx-5 h-52 rounded-[var(--m-radius-card)]" />
      <footer className="flex items-center gap-5 px-5 pt-3 text-[14px] text-[var(--m-fg-muted)]">
        <button type="button" onClick={() => setLiked(!liked)} className="flex items-center gap-1.5">
          <Heart size={20} className={liked ? "fill-[var(--m-danger)] text-[var(--m-danger)]" : ""} />
          {likes + (liked ? 1 : 0)}
        </button>
        <span className="flex items-center gap-1.5">
          <MessageCircle size={20} /> 24
        </span>
        <Share size={20} />
        <Bookmark size={20} className="ml-auto" />
      </footer>
    </article>
  );
}

export function HomeFeed() {
  const [tab, setTab] = useState("home");
  return (
    <Screen>
      <NavHeader
        title="Feed"
        large
        subtitle="Good morning, Hilal"
        right={
          <>
            <Search size={22} />
            <Bell size={22} />
          </>
        }
      />
      <Body>
        <StoryRailInner />
        <Post name="Amelia Hart" time="12 min ago" hue={200} likes={128} text="Shipped the new onboarding flow today — three screens, zero layout jank." />
        <Post name="Jonas Berg" time="1 h ago" hue={320} likes={64} text="Weekend build: an offline-first notes app in Expo." />
      </Body>
      <MTabBar items={TABS} active={tab} onChange={setTab} />
    </Screen>
  );
}

/* -------------------------------- Product ---------------------------- */

const COLORS = [
  { name: "Graphite", hex: "#3f3f46" },
  { name: "Sand", hex: "#d6c7a8" },
  { name: "Sage", hex: "#8fa98a" },
];

export function ProductScreen() {
  const [color, setColor] = useState(0);
  const [size, setSize] = useState("M");
  const [img, setImg] = useState(0);
  return (
    <Screen style={{ paddingTop: 0 }}>
      <Body>
        <div className="relative">
          <Art hue={[220, 35, 120][color]} icon={ShoppingBag} className="h-[400px]" />
          <div className="absolute inset-x-0 flex justify-between px-4" style={{ top: "calc(var(--safe-top) + 4px)" }}>
            <span className="flex size-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur">
              <ArrowLeft size={20} />
            </span>
            <span className="flex size-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur">
              <Heart size={20} />
            </span>
          </div>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                aria-label={`Image ${i + 1}`}
                onClick={() => setImg(i)}
                className={cn("h-1.5 rounded-full transition-all", i === img ? "w-5 bg-white" : "w-1.5 bg-white/50")}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5 px-5 pb-6 pt-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-[24px] font-bold leading-tight tracking-tight">Everyday Tote</h1>
              <p className="text-[22px] font-bold">$89</p>
            </div>
            <p className="mt-1 flex items-center gap-1 text-[14px] text-[var(--m-fg-muted)]">
              <Star size={15} className="fill-amber-400 text-amber-400" /> 4.8 · 1,204 reviews
            </p>
          </div>
          <div>
            <p className="mb-2 text-[14px] font-medium">
              Color <span className="text-[var(--m-fg-muted)]">· {COLORS[color].name}</span>
            </p>
            <div className="flex gap-3">
              {COLORS.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.name}
                  onClick={() => setColor(i)}
                  className={cn("size-9 rounded-full ring-offset-2 ring-offset-[var(--m-bg)]", i === color && "ring-2 ring-[var(--m-fg)]")}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[14px] font-medium">Size</p>
            <div className="flex gap-2">
              {["S", "M", "L", "XL"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={cn(
                    "h-11 flex-1 rounded-xl border text-[15px] font-semibold",
                    s === size ? "border-[var(--m-fg)] bg-[var(--m-fg)] text-[var(--m-bg)]" : "border-[var(--m-border)]"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--m-fg-muted)]">
            Water-resistant canvas, a padded laptop sleeve and a magnetic closure. Made to carry everything.
          </p>
        </div>
      </Body>
      <div className="flex shrink-0 gap-3 border-t border-[var(--m-border)] bg-[var(--m-bg)] px-5 pt-3" style={{ paddingBottom: "calc(var(--safe-bottom) + 4px)" }}>
        <MButton variant="outline" size="lg" icon={Bookmark} />
        <MButton size="lg" className="flex-1" icon={ShoppingBag}>Add to bag</MButton>
      </div>
    </Screen>
  );
}

/* ---------------------------- Cart & checkout ------------------------ */

function Stepper({ initial }: { initial: number }) {
  const [n, setN] = useState(initial);
  return (
    <span className="flex items-center gap-3 rounded-full border border-[var(--m-border)] px-1 py-1">
      <button type="button" aria-label="Decrease" onClick={() => setN(Math.max(1, n - 1))} className="flex size-7 items-center justify-center rounded-full bg-[var(--m-muted)]">
        <Minus size={14} />
      </button>
      <span className="w-3 text-center text-[15px] font-semibold tabular-nums">{n}</span>
      <button type="button" aria-label="Increase" onClick={() => setN(n + 1)} className="flex size-7 items-center justify-center rounded-full bg-[var(--m-muted)]">
        <Plus size={14} />
      </button>
    </span>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex justify-between text-[15px]", strong ? "font-semibold" : "text-[var(--m-fg-muted)]")}>
      <span>{label}</span>
      <span className={strong ? "" : "text-[var(--m-fg)]"}>{value}</span>
    </div>
  );
}

export function CartScreen() {
  const items = [
    { name: "Everyday Tote", variant: "Graphite · M", price: 89, hue: 220, qty: 1 },
    { name: "Ceramic pour-over", variant: "Sand", price: 38, hue: 35, qty: 2 },
    { name: "Linen cap", variant: "Sage · One size", price: 29, hue: 120, qty: 1 },
  ];
  return (
    <Screen>
      <NavHeader title="Bag" large right={<span className="text-[15px] font-medium text-[var(--m-fg-muted)]">Edit</span>} />
      <Body className="flex flex-col gap-4 px-5">
        {items.map((it) => (
          <div key={it.name} className="flex items-center gap-3">
            <Art hue={it.hue} className="size-[76px] shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-semibold">{it.name}</p>
              <p className="text-[13.5px] text-[var(--m-fg-muted)]">{it.variant}</p>
              <p className="mt-1 text-[15px] font-semibold">${it.price}</p>
            </div>
            <Stepper initial={it.qty} />
          </div>
        ))}
        <div className="mt-2 flex flex-col gap-2 rounded-[var(--m-radius-card)] bg-[var(--m-muted)] p-4">
          <SummaryRow label="Subtotal" value="$194.00" />
          <SummaryRow label="Shipping" value="Free" />
          <SummaryRow label="Tax" value="$15.52" />
          <div className="my-1 h-px bg-[var(--m-border)]" />
          <SummaryRow label="Total" value="$209.52" strong />
        </div>
      </Body>
      <div className="shrink-0 px-5 pt-3" style={{ paddingBottom: "calc(var(--safe-bottom) + 4px)" }}>
        <MButton full size="lg">Checkout · $209.52</MButton>
      </div>
    </Screen>
  );
}

export function CheckoutScreen() {
  const [ship, setShip] = useState(0);
  return (
    <Screen subtle>
      <NavHeader title="Checkout" back />
      <Body className="flex flex-col gap-5 pt-2">
        <MGroup title="Delivery">
          {[
            { t: "Standard", s: "3–5 business days", p: "Free", icon: Truck },
            { t: "Express", s: "Tomorrow by 9pm", p: "$9.99", icon: Zap },
          ].map((o, i) => (
            <MRow
              key={o.t}
              title={o.t}
              subtitle={o.s}
              icon={o.icon}
              tint={i ? "#f59e0b" : "#22c55e"}
              onClick={() => setShip(i)}
              trailing={
                <span className="flex items-center gap-3">
                  <span className="text-[15px] text-[var(--m-fg-muted)]">{o.p}</span>
                  <span className={cn("flex size-5 items-center justify-center rounded-full border-2", ship === i ? "border-[var(--m-fg)]" : "border-[var(--m-border)]")}>
                    {ship === i && <span className="size-2.5 rounded-full bg-[var(--m-fg)]" />}
                  </span>
                </span>
              }
            />
          ))}
        </MGroup>
        <MGroup title="Ship to">
          <MRow title="Amelia Hart" subtitle="24 Rue Oberkampf, 75011 Paris" />
        </MGroup>
        <MGroup title="Payment">
          <MRow title="Visa •••• 4242" subtitle="Expires 08/28" icon={CreditCard} tint="#1d4ed8" />
          <MRow title="Apple Pay" icon={Wallet} tint="#0a0a0a" />
        </MGroup>
      </Body>
      <div className="shrink-0 bg-[var(--m-bg)] px-5 pt-3" style={{ paddingBottom: "calc(var(--safe-bottom) + 4px)" }}>
        <MButton full size="lg" icon={Lock}>Pay ${ship ? "219.51" : "209.52"}</MButton>
      </div>
    </Screen>
  );
}

export function OrderSuccess() {
  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-[var(--m-success)]/15">
          <span className="flex size-14 items-center justify-center rounded-full bg-[var(--m-success)] text-white">
            <Check size={30} strokeWidth={3} />
          </span>
        </span>
        <h1 className="mt-6 text-[28px] font-bold tracking-tight">Order placed</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-[var(--m-fg-muted)]">
          Order #LK-20491 is confirmed. We’ll email you when it ships.
        </p>
        <div className="mt-6 flex w-full items-center gap-3 rounded-[var(--m-radius-card)] bg-[var(--m-muted)] p-4 text-left">
          <Package size={22} className="text-[var(--m-fg-muted)]" />
          <div>
            <p className="text-[15px] font-semibold">Arrives Thu, Nov 20</p>
            <p className="text-[13.5px] text-[var(--m-fg-muted)]">Standard delivery · 3 items</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 px-5" style={{ paddingBottom: "calc(var(--safe-bottom) + 4px)" }}>
        <MButton full size="lg">Track order</MButton>
        <MButton full size="lg" variant="ghost">Continue shopping</MButton>
      </div>
    </Screen>
  );
}

/* -------------------------------- Profile ---------------------------- */

export function ProfileScreen() {
  const [tab, setTab] = useState(0);
  return (
    <Screen>
      <NavHeader title="hilal" right={<SettingsIcon size={22} />} />
      <Body>
        <div className="flex flex-col items-center px-6 pt-2 text-center">
          <MAvatar name="Hilal Ahmad" size={88} />
          <h1 className="mt-3 text-[22px] font-bold">Hilal Ahmad</h1>
          <p className="text-[14px] text-[var(--m-fg-muted)]">@hilal · Kashmir</p>
          <p className="mt-2 text-[15px] leading-snug">Building lokalhost.io — UI for the web and mobile.</p>
          <div className="mt-4 grid w-full grid-cols-3 rounded-[var(--m-radius-card)] bg-[var(--m-muted)] py-3">
            {[
              ["248", "Posts"],
              ["12.4k", "Followers"],
              ["180", "Following"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-[18px] font-bold">{v}</p>
                <p className="text-[12.5px] text-[var(--m-fg-muted)]">{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex w-full gap-2">
            <MButton className="flex-1" icon={Pencil}>Edit profile</MButton>
            <MButton variant="secondary" icon={Share} />
          </div>
        </div>
        <div className="mt-5">
          <MSegmented variant="underline" tabs={["Posts", "Saved", "Tagged"]} value={tab} onChange={setTab} />
        </div>
        <div className="grid grid-cols-3 gap-0.5 pt-0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <Art key={i} hue={(i * 40 + tab * 90) % 360} className="aspect-square" />
          ))}
        </div>
      </Body>
      <MTabBar items={TABS} active="profile" />
    </Screen>
  );
}

/* -------------------------------- Settings --------------------------- */

export function SettingsScreen() {
  return (
    <Screen subtle>
      <NavHeader title="Settings" large />
      <Body className="flex flex-col gap-6 pb-8 pt-1">
        <div className="px-4">
          <div className="flex items-center gap-3 rounded-[var(--m-radius-card)] bg-[var(--m-card)] p-3.5">
            <MAvatar name="Hilal Ahmad" size={56} />
            <div className="flex-1">
              <p className="text-[18px] font-semibold">Hilal Ahmad</p>
              <p className="text-[14px] text-[var(--m-fg-muted)]">hilal@lokalhost.io</p>
            </div>
            <span className="text-[var(--m-fg-muted)]">›</span>
          </div>
        </div>
        <MGroup>
          <MRow title="Notifications" icon={Bell} tint="#ef4444" />
          <MRow title="Privacy & security" icon={Shield} tint="#3b82f6" />
          <MRow title="Language" icon={Globe} tint="#14b8a6" value="English" />
        </MGroup>
        <MGroup title="Appearance">
          <MRow title="Dark mode" icon={Moon} tint="#6366f1" trailing={<MSwitch on />} />
          <MRow title="Haptics" icon={Zap} tint="#f59e0b" trailing={<MSwitch on />} />
        </MGroup>
        <MGroup>
          <MRow title="Help & support" icon={CircleHelp} tint="#64748b" />
          <MRow title="Sign out" icon={LogOut} tint="#ef4444" destructive chevron={false} />
        </MGroup>
        <p className="text-center text-[12.5px] text-[var(--m-fg-muted)]">Version 2.4.0 (1042)</p>
      </Body>
    </Screen>
  );
}

/* ---------------------------------- Chat ----------------------------- */

const CHATS = [
  { name: "Amelia Hart", msg: "Sent you the Figma link ✨", time: "9:38", unread: 2, online: true },
  { name: "Design team", msg: "Jonas: Ship it 🚀", time: "9:12", unread: 5 },
  { name: "Maya Lin", msg: "Haha that’s perfect", time: "Yesterday" },
  { name: "Leo Park", msg: "Voice message · 0:42", time: "Yesterday", online: true },
  { name: "Sara Ali", msg: "See you Friday!", time: "Mon" },
  { name: "Omar Diaz", msg: "Thanks for the review", time: "Sun" },
];

export function ChatList() {
  return (
    <Screen>
      <NavHeader title="Messages" large right={<Pencil size={21} />} />
      <div className="px-5 pb-2">
        <div className="flex h-10 items-center gap-2 rounded-xl bg-[var(--m-muted)] px-3 text-[var(--m-fg-muted)]">
          <Search size={17} />
          <span className="text-[16px]">Search</span>
        </div>
      </div>
      <Body>
        {CHATS.map((c) => (
          <div key={c.name} className="flex items-center gap-3 px-5 py-2.5 active:bg-[var(--m-muted)]">
            <MAvatar name={c.name} size={52} status={c.online ? "online" : undefined} />
            <div className="min-w-0 flex-1 border-b border-[var(--m-border)] pb-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-[16px] font-semibold">{c.name}</p>
                <span className={cn("shrink-0 text-[13px]", c.unread ? "text-[var(--m-accent)]" : "text-[var(--m-fg-muted)]")}>{c.time}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[14.5px] text-[var(--m-fg-muted)]">{c.msg}</p>
                {c.unread ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--m-accent)] px-1.5 text-[12px] font-bold text-white">{c.unread}</span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </Body>
      <MTabBar items={TABS} active="inbox" />
    </Screen>
  );
}

export function ChatThread() {
  const [msgs, setMsgs] = useState([
    { me: false, text: "Hey! Did you get a chance to look at the new onboarding?", time: "9:30" },
    { me: true, text: "Yes — the pager feels great. Love the progress dots.", time: "9:31" },
    { me: false, text: "Sent you the Figma link ✨", time: "9:38" },
    { me: true, text: "Opening it now 👀", time: "9:39" },
  ]);
  const [draft, setDraft] = useState("");
  const { interactive } = usePhone();
  const send = () => {
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { me: true, text: draft.trim(), time: "9:41" }]);
    setDraft("");
  };
  return (
    <Screen>
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--m-border)] px-3">
        <ChevronLeft size={26} />
        <MAvatar name="Amelia Hart" size={36} status="online" />
        <div className="flex-1">
          <p className="text-[16px] font-semibold leading-tight">Amelia Hart</p>
          <p className="text-[12.5px] text-[var(--m-success)]">Online</p>
        </div>
        <Phone size={21} />
        <Video size={22} />
      </div>
      <Body className="flex flex-col gap-1.5 px-3 py-4">
        <p className="mb-2 text-center text-[12px] text-[var(--m-fg-muted)]">Today</p>
        {msgs.map((m, i) => (
          <div key={i} className={cn("flex", m.me ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[78%] rounded-[20px] px-3.5 py-2 text-[15.5px] leading-snug",
                m.me ? "rounded-br-md bg-[var(--m-accent)] text-white" : "rounded-bl-md bg-[var(--m-muted)]"
              )}
            >
              {m.text}
              <span className={cn("ml-2 inline-block translate-y-0.5 text-[11px]", m.me ? "text-white/70" : "text-[var(--m-fg-muted)]")}>{m.time}</span>
            </div>
          </div>
        ))}
      </Body>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex shrink-0 items-center gap-2 border-t border-[var(--m-border)] px-3 pt-2"
        style={{ paddingBottom: "calc(var(--safe-bottom) + 2px)" }}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--m-muted)]">
          <Camera size={18} />
        </span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          readOnly={!interactive}
          placeholder="Message"
          aria-label="Message"
          className="h-10 min-w-0 flex-1 rounded-full border border-[var(--m-border)] bg-transparent px-4 text-[16px] outline-none placeholder:text-[var(--m-fg-muted)]"
        />
        <button type="submit" aria-label="Send" className="flex size-9 items-center justify-center rounded-full bg-[var(--m-accent)] text-white">
          <ArrowUp size={18} strokeWidth={2.5} />
        </button>
      </form>
    </Screen>
  );
}

/* ---------------------------- Empty & error -------------------------- */

function StateScreen({
  icon: Icon,
  title,
  body,
  action,
  secondary,
  tab,
}: {
  icon: typeof Inbox;
  title: string;
  body: string;
  action: string;
  secondary?: string;
  tab: string;
}) {
  return (
    <Screen>
      <NavHeader title={tab === "inbox" ? "Inbox" : tab === "search" ? "Search" : "Home"} large />
      <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
        <span className="flex size-20 items-center justify-center rounded-[26px] border border-[var(--m-border)] bg-[var(--m-muted)]">
          <Icon size={34} strokeWidth={1.6} className="text-[var(--m-fg-muted)]" />
        </span>
        <h2 className="mt-5 text-[21px] font-semibold">{title}</h2>
        <p className="mt-1.5 text-[15.5px] leading-relaxed text-[var(--m-fg-muted)]">{body}</p>
        <div className="mt-6 flex flex-col items-center gap-1">
          <MButton icon={tab === "home" ? RefreshCw : undefined}>{action}</MButton>
          {secondary && <MButton variant="ghost" size="sm">{secondary}</MButton>}
        </div>
      </div>
      <MTabBar items={TABS} active={tab} />
    </Screen>
  );
}

export const EmptyState = () => (
  <StateScreen icon={Inbox} title="No messages yet" body="When people message you, conversations will show up here." action="Start a conversation" tab="inbox" />
);
export const ErrorState = () => (
  <StateScreen icon={Sparkles} title="Something went wrong" body="We couldn’t load your feed. It’s not you — it’s us." action="Try again" secondary="Contact support" tab="home" />
);
export const OfflineState = () => (
  <StateScreen icon={CloudOff} title="You’re offline" body="Check your connection. We’ll sync your changes when you’re back." action="Retry" tab="search" />
);

/* -------------------------------- Blocks ----------------------------- */

export function AppHeaderBlock() {
  return (
    <Screen subtle>
      <div className="bg-[var(--m-bg)] px-5 pb-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium text-[var(--m-fg-muted)]">Thursday, 13 November</p>
            <h1 className="text-[32px] font-bold tracking-tight">Today</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-10 items-center justify-center rounded-full bg-[var(--m-muted)]">
              <Bell size={19} />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[var(--m-danger)] ring-2 ring-[var(--m-muted)]" />
            </span>
            <MAvatar name="Hilal Ahmad" size={40} />
          </div>
        </div>
        <MInput placeholder="Search tasks, notes, people" icon={Search} />
      </div>
      <Body className="flex flex-col gap-3 px-5 pt-4">
        {["Design review", "Ship 2.4 to TestFlight", "Reply to Amelia"].map((t, i) => (
          <div key={t} className="flex items-center gap-3 rounded-[var(--m-radius-card)] bg-[var(--m-card)] p-4">
            <span className={cn("flex size-6 items-center justify-center rounded-full border-2", i === 0 ? "border-[var(--m-success)] bg-[var(--m-success)] text-white" : "border-[var(--m-border)]")}>
              {i === 0 && <Check size={14} strokeWidth={3} />}
            </span>
            <span className={cn("text-[16px]", i === 0 && "text-[var(--m-fg-muted)] line-through")}>{t}</span>
          </div>
        ))}
      </Body>
    </Screen>
  );
}

export function StoryRailBlock() {
  return (
    <Screen>
      <NavHeader title="Stories" large />
      <StoryRailInner />
      <div className="mx-5 mt-4 h-px bg-[var(--m-border)]" />
      <Body className="flex flex-col gap-3 px-5 pt-4">
        <p className="text-[13px] font-medium uppercase tracking-wide text-[var(--m-fg-muted)]">Seen rings</p>
        <p className="text-[15px] leading-relaxed text-[var(--m-fg-muted)]">
          Unseen stories get a gradient ring, seen ones a hairline. The first tile adds your own story.
        </p>
      </Body>
    </Screen>
  );
}

function Spark({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * 100},${30 - ((d - min) / (max - min || 1)) * 28}`).join(" ");
  return (
    <svg viewBox="0 0 100 32" className="h-8 w-full" preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} fill="none" stroke={up ? "var(--m-success)" : "var(--m-danger)"} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function StatsGridBlock() {
  const stats = [
    { l: "Revenue", v: "$12.4k", d: 8.2, s: [4, 6, 5, 8, 7, 9, 11] },
    { l: "Orders", v: "318", d: 3.1, s: [3, 4, 4, 5, 4, 6, 6] },
    { l: "Refunds", v: "12", d: -2.4, s: [6, 5, 6, 4, 5, 3, 3] },
    { l: "Visitors", v: "9,842", d: 14.6, s: [2, 3, 5, 4, 7, 8, 10] },
  ];
  return (
    <Screen subtle>
      <NavHeader title="Overview" large subtitle="Last 7 days" />
      <Body className="px-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.l} className="flex flex-col gap-1 rounded-[var(--m-radius-card)] bg-[var(--m-card)] p-4">
              <p className="text-[13px] text-[var(--m-fg-muted)]">{s.l}</p>
              <p className="text-[24px] font-bold tracking-tight">{s.v}</p>
              <p className={cn("text-[13px] font-medium", s.d >= 0 ? "text-[var(--m-success)]" : "text-[var(--m-danger)]")}>
                {s.d >= 0 ? "▲" : "▼"} {Math.abs(s.d)}%
              </p>
              <Spark data={s.s} up={s.d >= 0} />
            </div>
          ))}
        </div>
      </Body>
    </Screen>
  );
}

export function PricingPlansBlock() {
  const [plan, setPlan] = useState("year");
  const plans = [
    { id: "year", name: "Yearly", price: "$59.99", per: "$4.99 / month", badge: "Save 50%" },
    { id: "month", name: "Monthly", price: "$9.99", per: "billed monthly" },
    { id: "life", name: "Lifetime", price: "$149", per: "one-time purchase" },
  ];
  return (
    <Screen>
      <div className="flex h-10 items-center justify-end px-5">
        <span className="flex size-8 items-center justify-center rounded-full bg-[var(--m-muted)] text-[var(--m-fg-muted)]">✕</span>
      </div>
      <Body className="flex flex-col gap-5 px-6">
        <div className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-white">
            <Star size={26} className="fill-white" />
          </span>
          <h1 className="mt-4 text-[27px] font-bold tracking-tight">Unlock Pro</h1>
          <p className="mt-1 text-[15px] text-[var(--m-fg-muted)]">Unlimited projects, sync and every template.</p>
        </div>
        <ul className="flex flex-col gap-2">
          {["Unlimited projects", "Cloud sync across devices", "All 40+ templates"].map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[15px]">
              <Check size={18} className="text-[var(--m-success)]" strokeWidth={2.5} /> {f}
            </li>
          ))}
        </ul>
        <div role="radiogroup" aria-label="Plans" className="flex flex-col gap-2.5">
          {plans.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={plan === p.id}
              onClick={() => setPlan(p.id)}
              className={cn(
                "relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors",
                plan === p.id ? "border-[var(--m-fg)]" : "border-[var(--m-border)]"
              )}
            >
              <span className={cn("flex size-5 items-center justify-center rounded-full border-2", plan === p.id ? "border-[var(--m-fg)]" : "border-[var(--m-border)]")}>
                {plan === p.id && <span className="size-2.5 rounded-full bg-[var(--m-fg)]" />}
              </span>
              <span className="flex-1">
                <span className="block text-[16px] font-semibold">{p.name}</span>
                <span className="block text-[13px] text-[var(--m-fg-muted)]">{p.per}</span>
              </span>
              <span className="text-[17px] font-bold">{p.price}</span>
              {p.badge && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-[var(--m-success)] px-2 py-0.5 text-[11px] font-bold text-white">{p.badge}</span>
              )}
            </button>
          ))}
        </div>
      </Body>
      <div className="flex flex-col items-center gap-2 px-6 pt-3" style={{ paddingBottom: "calc(var(--safe-bottom) + 4px)" }}>
        <MButton full size="lg">Continue</MButton>
        <span className="text-[13px] text-[var(--m-fg-muted)]">Restore purchases · Terms · Privacy</span>
      </div>
    </Screen>
  );
}

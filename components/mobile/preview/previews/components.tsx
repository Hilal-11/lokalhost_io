"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Heart,
  Home,
  Info,
  Lock,
  Mail,
  MapPin,
  Moon,
  Plus,
  Search,
  Share,
  ShoppingBag,
  Trash2,
  User,
  Wifi,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePhone } from "../phone-frame";
import {
  Art,
  Body,
  MAvatar,
  MButton,
  MGroup,
  MInput,
  MRow,
  MSegmented,
  MSwitch,
  MTabBar,
  NavHeader,
  SafeBottom,
  Screen,
  type MTabItem,
} from "../kit";

/* ------------------------------- Buttons ----------------------------- */

export function ButtonsPreview() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, [loading]);
  return (
    <Screen>
      <NavHeader title="Buttons" large />
      <Body className="flex flex-col gap-6 px-5 pb-10 pt-2">
        <section className="flex flex-col gap-2.5">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[var(--m-fg-muted)]">Variants</p>
          <MButton full>Primary</MButton>
          <MButton full variant="secondary">Secondary</MButton>
          <MButton full variant="outline">Outline</MButton>
          <MButton full variant="ghost">Ghost</MButton>
          <MButton full variant="destructive" icon={Trash2}>Delete account</MButton>
        </section>
        <section className="flex flex-col gap-2.5">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[var(--m-fg-muted)]">Sizes</p>
          <div className="flex items-center gap-2">
            <MButton size="sm">Small</MButton>
            <MButton size="md">Medium</MButton>
            <MButton size="lg">Large</MButton>
          </div>
        </section>
        <section className="flex flex-col gap-2.5">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[var(--m-fg-muted)]">States</p>
          <MButton full icon={ShoppingBag} loading={loading} onClick={() => setLoading(true)}>
            {loading ? "Adding…" : "Add to bag — tap me"}
          </MButton>
          <MButton full variant="outline" disabled>
            Disabled
          </MButton>
        </section>
      </Body>
    </Screen>
  );
}

/* -------------------------------- Inputs ----------------------------- */

export function InputsPreview() {
  const [show, setShow] = useState(false);
  return (
    <Screen>
      <NavHeader title="Inputs" large />
      <Body className="flex flex-col gap-5 px-5 pb-10 pt-2">
        <MInput label="Email" placeholder="you@example.com" icon={Mail} helper="We’ll never share your email." />
        <MInput
          label="Password"
          value="hunter22"
          icon={Lock}
          secure={!show}
          trailing={
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff size={18} className="text-[var(--m-fg-muted)]" /> : <Eye size={18} className="text-[var(--m-fg-muted)]" />}
            </button>
          }
        />
        <MInput label="Username" value="hilal" icon={User} error="That username is taken." />
        <MInput placeholder="Search" icon={Search} focused />
      </Body>
    </Screen>
  );
}

/* --------------------------------- Cards ----------------------------- */

export function CardsPreview() {
  const [liked, setLiked] = useState(false);
  return (
    <Screen subtle>
      <NavHeader title="Cards" large />
      <Body className="flex flex-col gap-4 px-4 pb-10 pt-2">
        <article className="overflow-hidden rounded-[var(--m-radius-card)] bg-[var(--m-card)] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]">
          <Art hue={200} className="h-40">
            <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">
              Featured
            </span>
          </Art>
          <div className="p-4">
            <h3 className="text-[17px] font-semibold">Lake Bled, Slovenia</h3>
            <p className="mt-0.5 flex items-center gap-1 text-[14px] text-[var(--m-fg-muted)]">
              <MapPin size={14} /> 4 nights · from $420
            </p>
            <div className="mt-4 flex gap-2">
              <MButton size="sm" className="flex-1">Book</MButton>
              <MButton size="sm" variant="outline" icon={Heart} onClick={() => setLiked(!liked)}>
                {liked ? "Saved" : "Save"}
              </MButton>
            </div>
          </div>
        </article>
        <article className="flex items-center gap-3 rounded-[var(--m-radius-card)] border border-[var(--m-border)] bg-[var(--m-card)] p-3">
          <Art hue={30} className="size-16 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[16px] font-semibold">Ceramic pour-over</h3>
            <p className="text-[14px] text-[var(--m-fg-muted)]">Outline · $38</p>
          </div>
          <ChevronRight size={18} className="text-[var(--m-fg-muted)]" />
        </article>
        <article className="rounded-[var(--m-radius-card)] bg-[var(--m-muted)] p-4">
          <p className="text-[13px] font-medium text-[var(--m-fg-muted)]">Filled</p>
          <p className="mt-1 text-[22px] font-bold tracking-tight">$2,481.20</p>
          <p className="text-[14px] text-[var(--m-success)]">+12.4% this month</p>
        </article>
      </Body>
    </Screen>
  );
}

/* --------------------------------- Lists ----------------------------- */

export function ListsPreview() {
  return (
    <Screen subtle>
      <NavHeader title="Lists" large />
      <Body className="flex flex-col gap-6 pb-10 pt-2">
        <MGroup title="General">
          <MRow title="Notifications" icon={Bell} tint="#ef4444" value="On" />
          <MRow title="Language" icon={Globe} tint="#3b82f6" value="English" />
          <MRow title="Dark mode" icon={Moon} tint="#6366f1" trailing={<MSwitch on />} />
        </MGroup>
        <MGroup title="People" footer="Rows support leading avatars and subtitles.">
          <MRow title="Amelia Hart" subtitle="Product designer" leading={<MAvatar name="Amelia Hart" size={36} />} />
          <MRow title="Jonas Berg" subtitle="iOS engineer" leading={<MAvatar name="Jonas Berg" size={36} />} />
        </MGroup>
        <MGroup>
          <MRow title="Sign out" destructive chevron={false} />
        </MGroup>
      </Body>
    </Screen>
  );
}

/* ------------------------------ Bottom sheet ------------------------- */

const SNAPS = [0.42, 0.88];

export function BottomSheetPreview() {
  const { interactive, device } = usePhone();
  const [open, setOpen] = useState(!interactive);
  const [snap, setSnap] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);
  const start = useRef<{ y: number; h: number } | null>(null);
  const H = device.height;
  const height = drag ?? SNAPS[snap] * H;

  const onDown = (e: ReactPointerEvent) => {
    start.current = { y: e.clientY, h: height };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent) => {
    if (!start.current) return;
    // pointer deltas are in screen px; the frame may be scaled
    const el = e.currentTarget as HTMLElement;
    const scale = el.getBoundingClientRect().width / el.offsetWidth || 1;
    const dy = (e.clientY - start.current.y) / scale;
    setDrag(Math.max(80, Math.min(H * 0.95, start.current.h - dy)));
  };
  const onUp = () => {
    if (drag == null) {
      start.current = null;
      return;
    }
    const frac = drag / H;
    if (frac < SNAPS[0] - 0.12) setOpen(false);
    else setSnap(Math.abs(frac - SNAPS[0]) < Math.abs(frac - SNAPS[1]) ? 0 : 1);
    setDrag(null);
    start.current = null;
  };

  return (
    <Screen>
      <NavHeader title="Bottom Sheet" large />
      <Body className="flex flex-col gap-3 px-5">
        <Art hue={250} className="h-48 rounded-[var(--m-radius-card)]" />
        <p className="text-[15px] leading-relaxed text-[var(--m-fg-muted)]">
          Drag the handle between snap points, or flick it down to dismiss.
        </p>
        <MButton
          full
          onClick={() => {
            setSnap(0);
            setOpen(true);
          }}
        >
          Open sheet
        </MButton>
      </Body>

      {/* backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "absolute inset-0 z-40 bg-[var(--m-scrim)] transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      {/* sheet */}
      <div
        role="dialog"
        aria-label="Share sheet"
        className={cn(
          "absolute inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[24px] bg-[var(--m-card)] shadow-[0_-10px_40px_rgba(0,0,0,0.25)]",
          drag == null && "transition-[height,transform] duration-300 ease-[cubic-bezier(0.2,0.9,0.3,1)]"
        )}
        style={{ height, transform: open ? "translateY(0)" : "translateY(105%)" }}
      >
        <div
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="flex h-7 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
        >
          <span className="h-[5px] w-10 rounded-full bg-[var(--m-border)]" />
        </div>
        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-[18px] font-semibold">Share</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="flex size-8 items-center justify-center rounded-full bg-[var(--m-muted)]">
            <X size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-hidden px-5 pb-4">
          {["Amelia Hart", "Jonas Berg", "Maya Lin", "Leo Park"].map((n) => (
            <span key={n} className="flex w-16 flex-col items-center gap-1.5">
              <MAvatar name={n} size={56} />
              <span className="w-full truncate text-center text-[12px]">{n.split(" ")[0]}</span>
            </span>
          ))}
        </div>
        <div className="mx-5 overflow-hidden rounded-[var(--m-radius-card)] bg-[var(--m-muted)] [&>*+*]:border-t [&>*+*]:border-[var(--m-border)]">
          <MRow title="Copy link" chevron={false} trailing={<Share size={18} className="text-[var(--m-fg-muted)]" />} />
          <MRow title="Add to favourites" chevron={false} trailing={<Heart size={18} className="text-[var(--m-fg-muted)]" />} />
          <MRow title="Report" destructive chevron={false} />
        </div>
      </div>
    </Screen>
  );
}

/* --------------------------------- Tabs ------------------------------ */

export function TabsPreview() {
  const [seg, setSeg] = useState(0);
  const [under, setUnder] = useState(1);
  const content = [
    ["Morning run", "5.2 km · 28 min"],
    ["Evening walk", "3.1 km · 41 min"],
    ["Cycling", "18.4 km · 52 min"],
  ];
  return (
    <Screen>
      <NavHeader title="Tabs" large />
      <Body className="flex flex-col gap-6 pb-10 pt-2">
        <div className="flex flex-col gap-3 px-5">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[var(--m-fg-muted)]">Segmented</p>
          <MSegmented tabs={["Day", "Week", "Month"]} value={seg} onChange={setSeg} />
          <div className="rounded-[var(--m-radius-card)] bg-[var(--m-muted)] p-4">
            <p className="text-[13px] text-[var(--m-fg-muted)]">{["Today", "This week", "This month"][seg]}</p>
            <p className="text-[28px] font-bold tracking-tight">{["6,240", "41,382", "172,904"][seg]} steps</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="px-5 text-[13px] font-medium uppercase tracking-wide text-[var(--m-fg-muted)]">Underline</p>
          <MSegmented variant="underline" tabs={["Runs", "Walks", "Rides"]} value={under} onChange={setUnder} />
          <div className="px-5 pt-3">
            <p className="text-[17px] font-semibold">{content[under][0]}</p>
            <p className="text-[14px] text-[var(--m-fg-muted)]">{content[under][1]}</p>
          </div>
        </div>
      </Body>
    </Screen>
  );
}

/* ----------------------------- Navigation bar ------------------------ */

const NAV_ITEMS: MTabItem[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "search", label: "Search", icon: Search },
  { key: "inbox", label: "Inbox", icon: Mail, badge: 3 },
  { key: "profile", label: "Profile", icon: User },
];

export function NavigationBarPreview() {
  const [active, setActive] = useState("home");
  const item = NAV_ITEMS.find((i) => i.key === active)!;
  const Icon = item.icon;
  return (
    <Screen>
      <NavHeader title={item.label} large />
      <Body className="flex flex-col items-center justify-center gap-3 px-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-[var(--m-muted)]">
          <Icon size={30} />
        </span>
        <p className="text-[15px] text-[var(--m-fg-muted)]">Tap the tabs below — the active indicator follows the platform convention.</p>
      </Body>
      <MTabBar items={NAV_ITEMS} active={active} onChange={setActive} />
    </Screen>
  );
}

/* --------------------------------- Modal ----------------------------- */

export function ModalPreview() {
  const { interactive, platform } = usePhone();
  const [open, setOpen] = useState(!interactive);
  const ios = platform === "ios";
  return (
    <Screen subtle>
      <NavHeader title="Modal" large />
      <Body className="flex flex-col gap-6 pt-2">
        <MGroup title="Danger zone">
          <MRow title="Delete account" destructive onClick={() => setOpen(true)} />
        </MGroup>
        <p className="px-8 text-center text-[14px] text-[var(--m-fg-muted)]">Tap “Delete account” to open the confirm dialog.</p>
      </Body>
      <div
        className={cn(
          "absolute inset-0 z-40 flex items-center justify-center bg-[var(--m-scrim)] px-10 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      >
        <div
          role="alertdialog"
          aria-label="Delete account?"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "w-full bg-[var(--m-card)] shadow-2xl transition-transform duration-200",
            open ? "scale-100" : "scale-95",
            ios ? "rounded-[18px]" : "rounded-[28px]"
          )}
        >
          <div className={cn("flex flex-col gap-2 p-6", ios && "items-center text-center")}>
            <span className="flex size-11 items-center justify-center rounded-full bg-[var(--m-danger)]/15 text-[var(--m-danger)]">
              <AlertCircle size={22} />
            </span>
            <h2 className="text-[19px] font-semibold">Delete account?</h2>
            <p className="text-[15px] leading-snug text-[var(--m-fg-muted)]">
              This permanently removes your profile, posts and messages. This can’t be undone.
            </p>
          </div>
          <div className="flex gap-2 px-5 pb-5">
            <MButton variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </MButton>
            <MButton variant="destructive" className="flex-1" onClick={() => setOpen(false)}>
              Delete
            </MButton>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* --------------------------------- Toast ----------------------------- */

type ToastV = "default" | "success" | "error";
interface T {
  id: number;
  v: ToastV;
  title: string;
  body: string;
}
const TOAST_COPY: Record<ToastV, [string, string]> = {
  success: ["Payment sent", "$24.00 to Amelia Hart"],
  error: ["Upload failed", "Check your connection and try again."],
  default: ["New message", "Jonas: Are we still on for 6?"],
};

export function ToastPreview() {
  const { interactive } = usePhone();
  const [toasts, setToasts] = useState<T[]>(
    interactive ? [] : [{ id: 1, v: "success", title: TOAST_COPY.success[0], body: TOAST_COPY.success[1] }]
  );
  const id = useRef(2);

  const push = (v: ToastV) => {
    const t = { id: id.current++, v, title: TOAST_COPY[v][0], body: TOAST_COPY[v][1] };
    setToasts((ts) => [t, ...ts].slice(0, 3));
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== t.id)), 3500);
  };

  const icon = (v: ToastV) =>
    v === "success" ? (
      <CheckCircle2 size={20} className="text-[var(--m-success)]" />
    ) : v === "error" ? (
      <AlertCircle size={20} className="text-[var(--m-danger)]" />
    ) : (
      <Info size={20} className="text-[var(--m-accent)]" />
    );

  return (
    <Screen>
      <div className="absolute inset-x-0 z-50 flex flex-col items-center gap-2 px-3" style={{ top: "calc(var(--safe-top) + 4px)" }}>
        {toasts.map((t, i) => (
          <div
            key={t.id}
            role="status"
            className="flex w-full animate-in slide-in-from-top-4 fade-in items-start gap-3 rounded-2xl border border-[var(--m-border)] bg-[var(--m-card)] p-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] duration-300"
            style={{ transform: `scale(${1 - i * 0.04})`, opacity: 1 - i * 0.2 }}
          >
            {icon(t.v)}
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">{t.title}</p>
              <p className="text-[14px] text-[var(--m-fg-muted)]">{t.body}</p>
            </div>
            <button type="button" aria-label="Dismiss" onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}>
              <X size={16} className="text-[var(--m-fg-muted)]" />
            </button>
          </div>
        ))}
      </div>
      <NavHeader title="Toast" large />
      <Body className="flex flex-col gap-2.5 px-5 pt-2">
        <MButton full icon={CheckCircle2} onClick={() => push("success")}>Show success</MButton>
        <MButton full variant="secondary" icon={Wifi} onClick={() => push("error")}>Show error</MButton>
        <MButton full variant="outline" icon={Bell} onClick={() => push("default")}>Show default</MButton>
        <p className="pt-2 text-center text-[14px] text-[var(--m-fg-muted)]">Up to three toasts stack; each auto-dismisses.</p>
      </Body>
    </Screen>
  );
}

/* -------------------------------- Avatar ----------------------------- */

export function AvatarPreview() {
  const people = ["Amelia Hart", "Jonas Berg", "Maya Lin", "Leo Park", "Sara Ali", "Omar Diaz"];
  return (
    <Screen>
      <NavHeader title="Avatars" large />
      <Body className="flex flex-col gap-7 px-5 pb-10 pt-2">
        <section className="flex flex-col gap-3">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[var(--m-fg-muted)]">Sizes</p>
          <div className="flex items-end gap-3">
            {[24, 32, 40, 56, 72].map((s) => (
              <MAvatar key={s} name="Amelia Hart" size={s} />
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[var(--m-fg-muted)]">Presence</p>
          <div className="flex gap-4">
            <MAvatar name="Jonas Berg" size={52} status="online" />
            <MAvatar name="Maya Lin" size={52} status="away" />
            <MAvatar name="Leo Park" size={52} status="offline" />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[var(--m-fg-muted)]">Group</p>
          <div className="flex items-center">
            {people.slice(0, 4).map((p, i) => (
              <MAvatar key={p} name={p} size={44} ring className={i ? "-ml-3" : ""} />
            ))}
            <span className="-ml-3 flex size-11 items-center justify-center rounded-full bg-[var(--m-muted)] text-[14px] font-semibold ring-2 ring-[var(--m-bg)]">
              +{people.length - 4}
            </span>
          </div>
        </section>
        <section className="flex items-center gap-3 rounded-[var(--m-radius-card)] bg-[var(--m-muted)] p-3">
          <MAvatar name="Sara Ali" size={44} status="online" />
          <div className="flex-1">
            <p className="text-[16px] font-semibold">Sara Ali</p>
            <p className="text-[14px] text-[var(--m-fg-muted)]">Active now</p>
          </div>
          <MButton size="sm" icon={Plus}>Follow</MButton>
        </section>
      </Body>
    </Screen>
  );
}

/* -------------------------------- Skeleton --------------------------- */

function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={cn("relative block overflow-hidden rounded-lg bg-[var(--m-muted)]", className)}
      style={style}
    >
      <span className="absolute inset-0 -translate-x-full animate-[lk-shimmer_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </span>
  );
}

export function SkeletonPreview() {
  return (
    <Screen>
      <style>{`@keyframes lk-shimmer{100%{transform:translateX(100%)}}`}</style>
      <NavHeader title="Skeleton" large />
      <Body className="flex flex-col gap-6 px-5 pb-10 pt-2">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Bone className="size-11 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Bone className="h-3.5 w-2/5" />
                <Bone className="h-3 w-1/4" />
              </div>
            </div>
            <Bone className="h-44 rounded-[var(--m-radius-card)]" />
            <Bone className="h-3.5 w-11/12" />
            <Bone className="h-3.5 w-3/5" />
          </div>
        ))}
      </Body>
      <SafeBottom />
    </Screen>
  );
}

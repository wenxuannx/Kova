import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Home, Target, Users, Plus, BarChart2, Bell } from "lucide-react";

// ─── Tokens ────────────────────────────────────────────────────────────────────
export const C = {
  bg: "#F0EFFE",
  primary: "#7B61FF",
  secondary: "#4B3FBF",
  gradStart: "#9B7FFF",
  gradEnd: "#5B3FDF",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  text: "#1A1A2E",
  textSecondary: "#6B7280",
  muted: "#9CA3AF",
  border: "rgba(123,97,255,0.08)",
  cardShadow: "0px 4px 24px rgba(123,97,255,0.10)",
} as const;

// ─── Navigation ────────────────────────────────────────────────────────────────
export type Screen =
  | "home"
  | "quest"
  | "group"
  | "new"
  | "insights"
  | "notifications"
  | "member-profile"
  | "wallet"
  | "profile";

export type QuestStatus = "active" | "completed" | "rescheduled" | "expired";

export type NavigatePayload = { memberId?: string; groupId?: string };
export type NavigateFn = (screen: Screen, payload?: NavigatePayload) => void;

// ─── useIsDesktop ─────────────────────────────────────────────────────────────
export function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= breakpoint
  );
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isDesktop;
}

// ─── StatusBar ─────────────────────────────────────────────────────────────────
// Web-safe top spacer: honours iOS/Android safe-area-inset-top on mobile browsers;
// renders a 20px breathing room on desktop where env() resolves to 0.
export function StatusBar() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: "max(env(safe-area-inset-top, 0px), 20px)",
        flexShrink: 0,
      }}
    />
  );
}

// ─── SectionLabel ──────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: C.muted,
        margin: "0 0 10px",
      }}
    >
      {children}
    </p>
  );
}

// ─── Card (with press animation) ──────────────────────────────────────────────
export function Card({
  children,
  style,
  onClick,
  role,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  role?: string;
  "aria-label"?: string;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      whileTap={onClick && !prefersReduced ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      style={{
        background: "white",
        borderRadius: 20,
        padding: 16,
        boxShadow: C.cardShadow,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── PressableDiv ─────────────────────────────────────────────────────────────
export function PressableDiv({
  children,
  onClick,
  style,
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  "aria-label"?: string;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      whileTap={onClick && !prefersReduced ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined, ...style }}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  );
}

// ─── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ style }: { style?: React.CSSProperties }) {
  return <div style={{ height: 1, background: C.border, ...style }} />;
}

// ─── Avatar ────────────────────────────────────────────────────────────────────
export type AvatarColor = "purple" | "teal" | "amber";
const AVATAR_GRADS: Record<AvatarColor, string> = {
  purple: "linear-gradient(135deg, #9B7FFF, #5B3FDF)",
  teal: "linear-gradient(135deg, #2DD4BF, #0D9488)",
  amber: "linear-gradient(135deg, #FCD34D, #F59E0B)",
};

export function Avatar({
  initials,
  size = 40,
  color = "purple",
  style,
}: {
  initials: string;
  size?: number;
  color?: AvatarColor;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: AVATAR_GRADS[color],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      <span style={{ color: "white", fontWeight: 700, fontSize: Math.round(size * 0.34) }}>
        {initials}
      </span>
    </div>
  );
}

// ─── StreakDots ────────────────────────────────────────────────────────────────
export type DotState = "green" | "red" | "empty";

export function StreakDots({ dots }: { dots: DotState[] }) {
  const label = dots
    .map((d, i) => `Week ${i + 1}: ${d === "green" ? "completed" : d === "red" ? "missed" : "upcoming"}`)
    .join(", ");
  return (
    <div style={{ display: "flex", gap: 4 }} aria-label={label} role="img">
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background:
              d === "green" ? C.success : d === "red" ? C.danger : "transparent",
            border: d === "empty" ? "1.5px solid #D1D5DB" : "none",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

// ─── Pill ──────────────────────────────────────────────────────────────────────
export type PillColor = "purple" | "green" | "amber" | "red" | "outline-purple";
const PILL_STYLES: Record<PillColor, { bg: string; text: string; border?: string }> = {
  purple: { bg: "rgba(123,97,255,0.10)", text: C.primary },
  green: { bg: "rgba(34,197,94,0.12)", text: "#16A34A" },
  amber: { bg: "rgba(245,158,11,0.12)", text: "#D97706" },
  red: { bg: "rgba(239,68,68,0.12)", text: "#DC2626" },
  "outline-purple": { bg: "white", text: C.primary, border: `1.5px solid ${C.primary}` },
};

export function Pill({
  children,
  color = "purple",
  style,
}: {
  children: React.ReactNode;
  color?: PillColor;
  style?: React.CSSProperties;
}) {
  const { bg, text, border } = PILL_STYLES[color];
  return (
    <span
      style={{
        background: bg,
        color: text,
        borderRadius: 50,
        padding: "4px 10px",
        fontSize: 11,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        border,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ─── PrimaryButton ────────────────────────────────────────────────────────────
export function PrimaryButton({
  children,
  style,
  onClick,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.button
      whileTap={!disabled && !loading && !prefersReduced ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      style={{
        width: "100%",
        background: C.primary,
        color: "white",
        border: "none",
        borderRadius: 14,
        height: 52,
        fontSize: 15,
        fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        boxShadow: disabled ? "none" : "0px 4px 16px rgba(123,97,255,0.30)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        ...style,
      }}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          style={{
            width: 18,
            height: 18,
            border: "2.5px solid rgba(255,255,255,0.3)",
            borderTop: "2.5px solid white",
            borderRadius: "50%",
          }}
        />
      )}
      {!loading && children}
    </motion.button>
  );
}

// ─── SmallPillButton ──────────────────────────────────────────────────────────
export function SmallPillButton({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: "white",
        color: C.primary,
        border: "1.5px solid rgba(123,97,255,0.28)",
        borderRadius: 50,
        height: 32,
        padding: "0 14px",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "border-color 0.15s, box-shadow 0.15s",
        whiteSpace: "nowrap",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.primary;
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(123,97,255,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(123,97,255,0.28)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </button>
  );
}

// ─── OutlineButton ────────────────────────────────────────────────────────────
export function OutlineButton({
  children,
  style,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.button
      whileTap={!disabled && !prefersReduced ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={{
        width: "100%",
        background: "white",
        color: C.primary,
        border: `1.5px solid ${C.primary}`,
        borderRadius: 14,
        height: 52,
        fontSize: 15,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}

// ─── BottomSheet ───────────────────────────────────────────────────────────────
export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }}
          />
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { y: "100%" }}
            animate={prefersReduced ? { opacity: 1 } : { y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            style={{
              position: "relative",
              zIndex: 1,
              background: "white",
              borderRadius: "24px 24px 0 0",
              padding: "0 20px 36px",
              maxHeight: "88%",
              overflowY: "auto",
            }}
            className="vault-scroll"
          >
            <div
              style={{ padding: "14px 0 16px", display: "flex", justifyContent: "center" }}
            >
              <div style={{ width: 36, height: 4, background: "#E5E7EB", borderRadius: 2 }} />
            </div>
            {title && (
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: C.text,
                  margin: "0 0 6px",
                  lineHeight: 1.3,
                }}
              >
                {title}
              </p>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── DisabledTooltip ──────────────────────────────────────────────────────────
export function DisabledTooltip({
  message,
  children,
}: {
  message: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              bottom: "110%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#1A1A2E",
              color: "white",
              fontSize: 11,
              lineHeight: 1.4,
              padding: "8px 12px",
              borderRadius: 8,
              whiteSpace: "nowrap",
              zIndex: 300,
              textAlign: "center",
            }}
          >
            {message}
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "5px solid #1A1A2E",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── BottomNav ─────────────────────────────────────────────────────────────────
export function BottomNav({ active, onNavigate }: { active: Screen; onNavigate: NavigateFn }) {
  const isDesktop = useIsDesktop();
  if (isDesktop) return null;

  const tabActive = active === "member-profile" ? "group" : active;
  const items: { id: Screen; Icon: React.ElementType; label: string; badge?: boolean }[] = [
    { id: "home", Icon: Home, label: "Home" },
    { id: "quest", Icon: Target, label: "Challenges" },
    { id: "group", Icon: Users, label: "Goal Groups" },
    { id: "new", Icon: Plus, label: "New goal" },
    { id: "notifications", Icon: Bell, label: "Notifications", badge: true },
  ];
  return (
    <div
      style={{
        background: "white",
        borderRadius: 50,
        padding: "8px",
        display: "flex",
        boxShadow: "0px 4px 28px rgba(123,97,255,0.18)",
        height: 64,
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {items.map(({ id, Icon, label, badge }) => {
        const isActive = id === tabActive;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "9px 0",
              borderRadius: 50,
              background: isActive ? C.primary : "transparent",
              border: "none",
              cursor: "pointer",
              minWidth: 44,
              minHeight: 44,
              position: "relative",
            }}
          >
            <Icon size={20} color={isActive ? "white" : C.muted} strokeWidth={isActive ? 2.2 : 1.8} />
            {badge && !isActive && (
              <span style={{
                position: "absolute",
                top: 6,
                right: "calc(50% - 14px)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.danger,
                border: "1.5px solid white",
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── BackButton ────────────────────────────────────────────────────────────────
export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      aria-label="Go back"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0 12px 0 0",
        minHeight: 44,
        minWidth: 44,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M10 3L5 8L10 13"
          stroke={C.primary}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>Back</span>
    </button>
  );
}

// ─── ScrollArea ────────────────────────────────────────────────────────────────
export function ScrollArea({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className="vault-scroll" style={{ flex: 1, overflowY: "auto", ...style }}>
      {children}
    </div>
  );
}

// ─── NumberedStep ──────────────────────────────────────────────────────────────
export function NumberedStep({
  n,
  title,
  description,
}: {
  n: number;
  title: string;
  description: string;
}) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 0" }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #9B7FFF, #5B3FDF)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{n}</span>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 3px" }}>{title}</p>
        <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.55 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

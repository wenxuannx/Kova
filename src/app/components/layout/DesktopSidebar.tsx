import React from "react";
import { motion } from "motion/react";
import { Home, Target, Users, Plus, BarChart2, Bell, Wallet, LogOut } from "lucide-react";
import { C, Avatar, type Screen, type NavigateFn } from "../vault/Shared";
import type { User } from "../../context/AuthContext";
import kovaLogo from "../../../imgs/kova_logo.png";

interface Props {
  active: Screen;
  onNavigate: NavigateFn;
  user: User | null;
  onLogout: () => void;
}

// "member-profile" and "profile" are sub-screens — resolve to their parent tab for highlight purposes
function resolveTab(screen: Screen): Screen {
  if (screen === "member-profile") return "group";
  if (screen === "profile") return "home";
  return screen;
}

const NAV_ITEMS: { id: Screen; Icon: React.ElementType; label: string; badge?: boolean }[] = [
  { id: "home", Icon: Home, label: "Home" },
  { id: "quest", Icon: Target, label: "Challenges" },
  { id: "group", Icon: Users, label: "Goal Groups" },
  { id: "new", Icon: Plus, label: "New goal" },
  { id: "insights", Icon: BarChart2, label: "Insights" },
  { id: "notifications", Icon: Bell, label: "Notifications", badge: true },
  { id: "wallet", Icon: Wallet, label: "Wallet" },
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function DesktopSidebar({ active, onNavigate, user, onLogout }: Props) {
  const tabActive = resolveTab(active);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        width: 240,
        minWidth: 240,
        height: "100vh",
        background: "white",
        boxShadow: "2px 0 24px rgba(123,97,255,0.08)",
        display: "flex",
        flexDirection: "column",
        padding: "0 16px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        overflowY: "auto",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "24px 8px 20px" }}>
        <img
          src={kovaLogo}
          alt="Kova"
          style={{
            width: 108,
            height: "auto",
            mixBlendMode: "multiply",
            display: "block",
          }}
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: C.border, margin: "0 8px 16px" }} />

      {/* Navigation label */}
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: C.muted,
          padding: "0 8px",
          margin: "0 0 8px",
        }}
      >
        Menu
      </p>

      {/* Nav items */}
      <nav role="navigation" aria-label="Main navigation" style={{ flex: 1 }}>
        {NAV_ITEMS.map(({ id, Icon, label, badge }) => {
          const isActive = id === tabActive;
          return (
            <motion.button
              key={id}
              onClick={() => onNavigate(id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 12,
                background: isActive ? `rgba(123,97,255,0.10)` : "transparent",
                border: "none",
                cursor: "pointer",
                marginBottom: 2,
                textAlign: "left",
                transition: "background 0.15s",
                position: "relative",
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Icon size={18} color={isActive ? C.primary : C.muted} strokeWidth={isActive ? 2.2 : 1.8} />
                {badge && !isActive && (
                  <span style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, borderRadius: "50%", background: C.danger, border: "1.5px solid white" }} />
                )}
              </div>
              <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? C.primary : C.text, fontFamily: "inherit" }}>
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-dot"
                  style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.primary }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: 1, background: C.border, margin: "8px 8px 16px" }} />

      {/* User section */}
      {user && (
        <div style={{ padding: "0 0 24px" }}>
          <button
            onClick={() => onNavigate("profile")}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 4, width: "100%", background: "none", border: "none", cursor: "pointer", borderRadius: 12, textAlign: "left" }}
          >
            <Avatar initials={getInitials(user.name)} size={34} color="purple" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </p>
              <p style={{ fontSize: 11, color: C.muted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </p>
            </div>
          </button>

          <motion.button
            onClick={onLogout}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 12,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: C.danger,
            }}
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span style={{ fontSize: 14, fontWeight: 500, fontFamily: "inherit" }}>Sign out</span>
          </motion.button>
        </div>
      )}
    </motion.aside>
  );
}

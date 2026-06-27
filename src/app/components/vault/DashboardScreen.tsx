import React, { useState } from "react";
import { Bell, Flame, Sparkles } from "lucide-react";
import {
  C,
  StatusBar,
  Card,
  SectionLabel,
  Avatar,
  StreakDots,
  Pill,
  Divider,
  PressableDiv,
  BottomNav,
  ScrollArea,
  type Screen,
  type NavigateFn,
  type DotState,
  type AvatarColor,
  type QuestStatus,
} from "./Shared";
import { useQuest } from "../../context/QuestContext";
import { QuestGeneratorSheet } from "./QuestGeneratorSheet";
import { useAuth } from "../../context/AuthContext";

function VaultCard({
  title,
  current,
  target,
  percent,
  active,
}: {
  title: string;
  current: string;
  target: string;
  percent: string;
  active?: boolean;
}) {
  return (
    <PressableDiv
      style={{
        background: "linear-gradient(135deg, #9B7FFF 0%, #5B3FDF 100%)",
        borderRadius: 20,
        padding: "16px 18px",
        width: 210,
        minHeight: 114,
        flexShrink: 0,
        opacity: active ? 1 : 0.68,
        boxShadow: active ? "0px 8px 24px rgba(91,63,223,0.32)" : "none",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      aria-label={`${title}: ${current} of ${target} — ${percent}`}
    >
      <div
        style={{
          position: "absolute",
          top: -24,
          right: -24,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          pointerEvents: "none",
        }}
      />
      <p
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.85)",
          margin: 0,
          fontWeight: 500,
          position: "relative",
        }}
      >
        {title}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          position: "relative",
        }}
      >
        <p style={{ fontSize: 17, fontWeight: 700, color: "white", margin: 0 }}>
          {current} / {target}
        </p>
        <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)", margin: 0 }}>
          {percent}
        </p>
      </div>
    </PressableDiv>
  );
}

export function DashboardScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const { currentQuest } = useQuest();
  const { user } = useAuth();
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const questStatus = currentQuest?.status ?? "active";
  const members: {
    initials: string;
    color: AvatarColor;
    name: string;
    dots: DotState[];
  }[] = [
    {
      initials: "JL",
      color: "purple",
      name: "You",
      dots: ["green", "green", "green", "green", "green", "green", "empty"],
    },
    {
      initials: "SR",
      color: "teal",
      name: "Sarah R.",
      dots: ["green", "green", "green", "green", "green", "red", "empty"],
    },
    {
      initials: "MT",
      color: "amber",
      name: "Marcus T.",
      dots: ["green", "red", "green", "green", "red", "red", "empty"],
    },
  ];

  // Contextual badge: merges deadline + status into one urgency-aware badge
  const questBadge = () => {
    if (questStatus === "completed") return <Pill color="green">✓ Completed</Pill>;
    if (questStatus === "rescheduled") return <Pill color="amber">Rescheduled · 7 days</Pill>;
    if (questStatus === "expired") return <Pill color="red">Expired</Pill>;
    return <Pill color="amber">3 days left</Pill>;
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}
    >
      <StatusBar />
      <ScrollArea style={{ padding: "0 20px 110px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Avatar initials="JL" size={40} color="purple" />
          <p style={{ flex: 1, fontSize: 20, fontWeight: 500, color: C.text, margin: 0 }}>
            Hello, {user?.name?.split(" ")[0] ?? "there"}
          </p>
          <button
            aria-label="Notifications"
            style={{
              position: "relative",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
              borderRadius: "50%",
              boxShadow: C.cardShadow,
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Bell size={17} color={C.text} strokeWidth={1.8} />
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                background: C.danger,
                borderRadius: "50%",
                border: `1.5px solid ${C.bg}`,
              }}
              aria-label="1 new notification"
            />
          </button>
        </div>

        {/* Balance — taps to wallet */}
        <Card
          style={{ marginBottom: 14, padding: "18px" }}
          onClick={() => onNavigate("wallet")}
          role="button"
          aria-label="View Kova wallet — 696 dollars saved of 1200 dollar goal"
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.muted,
              margin: "0 0 5px",
            }}
          >
            Total Balance
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <p
              style={{ fontSize: 32, fontWeight: 700, color: C.text, margin: "0 0 3px" }}
              aria-hidden="true"
            >
              $1,200
            </p>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.primary }}>Wallet →</span>
          </div>
          <p style={{ fontSize: 13, color: C.textSecondary, margin: 0 }}>target by Dec 31</p>
        </Card>

        {/* Streak */}
        <Card style={{ marginBottom: 24, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                background: "#FEF3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <Flame size={20} color={C.warning} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>
                6-week streak
              </p>
              <p style={{ fontSize: 12, color: C.textSecondary, margin: "2px 0 0" }}>
                keep it going
              </p>
            </div>
            <Pill color="green">on track</Pill>
          </div>
        </Card>

        {/* VAULT */}
        <SectionLabel>Vault</SectionLabel>
        <div
          className="vault-scroll"
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            margin: "0 -20px 24px",
            padding: "0 20px 6px",
          }}
        >
          <VaultCard
            title="Emergency fund"
            current="$696"
            target="$1,200"
            percent="58%"
            active
          />
          <VaultCard title="Holiday savings" current="$320" target="$800" percent="40%" />
          <VaultCard title="New laptop" current="$150" target="$1,500" percent="10%" />
          <div style={{ width: 4, flexShrink: 0 }} />
        </div>

        {/* QUEST */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9B9AB0", margin: 0 }}>Quest</p>
          <button
            onClick={() => setGeneratorOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.primary, padding: "4px 0", fontFamily: "inherit" }}
          >
            <Sparkles size={12} /> {currentQuest ? "Regenerate" : "Generate"}
          </button>
        </div>

        {currentQuest ? (
          <Card style={{ marginBottom: 24 }} onClick={() => onNavigate("quest")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Pill color="purple"><Sparkles size={10} /> AI-generated</Pill>
              {questBadge()}
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 5px" }}>
              {currentQuest.title}
            </p>
            <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 10px", lineHeight: 1.55 }}>
              {currentQuest.rationale}
            </p>
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Reward: {currentQuest.reward}</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.primary }}>View →</span>
            </div>
          </Card>
        ) : (
          <Card style={{ marginBottom: 24 }}>
            <button
              onClick={() => setGeneratorOpen(true)}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", textAlign: "left" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(123,97,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Sparkles size={20} color={C.primary} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 3px" }}>No quest yet</p>
                  <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Generate a personalised quest →</p>
                </div>
              </div>
            </button>
          </Card>
        )}

        {/* GROUP */}
        <SectionLabel>Group</SectionLabel>
        <Card>
          {members.map((m, i) => (
            <div key={m.initials}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0" }}>
                <Avatar initials={m.initials} color={m.color} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: C.text, margin: "0 0 5px" }}>
                    {m.name}
                  </p>
                  <StreakDots dots={m.dots} />
                </div>
              </div>
              {i < members.length - 1 && <Divider />}
            </div>
          ))}
          <Divider style={{ marginTop: 4 }} />
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10 }}>
            <button
              onClick={() => onNavigate("group")}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.primary,
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: "4px 0",
                minHeight: 44,
              }}
            >
              View group →
            </button>
          </div>
        </Card>
      </ScrollArea>

      <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, zIndex: 10 }}>
        <BottomNav active="home" onNavigate={onNavigate} />
      </div>

      <QuestGeneratorSheet isOpen={generatorOpen} onClose={() => setGeneratorOpen(false)} />
    </div>
  );
}

import React, { useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import {
  C,
  StatusBar,
  Card,
  SectionLabel,
  Avatar,
  Pill,
  Divider,
  PressableDiv,
  BottomNav,
  ScrollArea,
  SmallPillButton,
  type Screen,
  type NavigateFn,
  type QuestStatus,
} from "./Shared";
import { useQuest } from "../../context/QuestContext";
import { QuestGeneratorSheet } from "./QuestGeneratorSheet";
import { useAuth } from "../../context/AuthContext";
import { useGroup } from "../../context/GroupContext";

function VaultCard({
  title,
  current,
  target,
  percent,
  deadline,
}: {
  title: string;
  current: string;
  target: string;
  percent: string;
  deadline: string;
}) {
  return (
    <PressableDiv
      style={{
        background: "linear-gradient(135deg, #9B7FFF 0%, #5B3FDF 100%)",
        borderRadius: 20,
        padding: "16px 18px",
        width: 210,
        minHeight: 120,
        flexShrink: 0,
        boxShadow: "0px 8px 24px rgba(91,63,223,0.28)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 10,
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
      <div style={{ position: "relative" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", margin: "0 0 2px", fontWeight: 500 }}>
          {title}
        </p>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.60)", margin: 0, fontWeight: 400 }}>
          by {deadline}
        </p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
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
  const { groups } = useGroup();
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const questStatus = currentQuest?.status ?? "active";

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
          <button onClick={() => onNavigate("profile")} aria-label="View profile" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", borderRadius: "50%", flexShrink: 0 }}>
            <Avatar initials={user?.name ? user.name.trim().split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2) : "JL"} size={40} color="purple" />
          </button>
          <p style={{ flex: 1, fontSize: 20, fontWeight: 500, color: C.text, margin: 0 }}>
            Hello, {user?.name?.split(" ")[0] ?? "there"}
          </p>
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
            <SmallPillButton onClick={() => onNavigate("wallet")}>Wallet →</SmallPillButton>
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

        {/* GOALS */}
        <SectionLabel>Goals Progress</SectionLabel>
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
          <VaultCard title="Emergency fund" current="$696" target="$1,200" percent="58%" deadline="Dec 31, 2026" />
          <VaultCard title="Holiday savings" current="$320" target="$800" percent="40%" deadline="Aug 15, 2026" />
          <VaultCard title="New laptop" current="$150" target="$1,500" percent="10%" deadline="Mar 31, 2027" />
          <div style={{ width: 4, flexShrink: 0 }} />
        </div>

        {/* CHALLENGE */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9B9AB0", margin: 0 }}>Challenge</p>
          {currentQuest && (
            <SmallPillButton onClick={() => setGeneratorOpen(true)}>
              <Sparkles size={11} /> Regenerate
            </SmallPillButton>
          )}
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
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(123,97,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={20} color={C.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 10px" }}>No challenge yet</p>
                <SmallPillButton onClick={() => setGeneratorOpen(true)}>
                  <Sparkles size={11} /> Generate
                </SmallPillButton>
              </div>
            </div>
          </Card>
        )}

        {/* GOAL GROUPS */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>My Goal Groups</p>
          <SmallPillButton onClick={() => onNavigate("new")}>+ New</SmallPillButton>
        </div>
        <Card>
          {groups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "18px 8px" }}>
              <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 12px", lineHeight: 1.55 }}>
                No goal groups yet. Create one to get an invite code and save with friends.
              </p>
              <SmallPillButton onClick={() => onNavigate("new")}>Create a goal group →</SmallPillButton>
            </div>
          ) : (
            <>
              {groups.map((g, i) => (
                <div key={g.id}>
                  <PressableDiv
                    onClick={() => onNavigate("group", { groupId: g.id })}
                    style={{ padding: "12px 0", display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(123,97,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 16 }}>🎯</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.goalName}</p>
                      <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{g.members.length} member{g.members.length !== 1 ? "s" : ""}</p>
                    </div>
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
                      <path d="M1 1l5 5-5 5" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </PressableDiv>
                  {i < groups.length - 1 && <Divider />}
                </div>
              ))}
            </>
          )}
        </Card>
      </ScrollArea>

      <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, zIndex: 10 }}>
        <BottomNav active="home" onNavigate={onNavigate} />
      </div>

      <QuestGeneratorSheet isOpen={generatorOpen} onClose={() => setGeneratorOpen(false)} />
    </div>
  );
}

import React from "react";
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
  BackButton,
  OutlineButton,
  ScrollArea,
  type NavigateFn,
  type DotState,
  type AvatarColor,
} from "./Shared";

export function GroupScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const stats: { value: string; label: string; valueColor: string }[] = [
    { value: "$50", label: "pool", valueColor: C.text },
    { value: "6", label: "your streak", valueColor: C.primary },
    { value: "83%", label: "completion", valueColor: C.success },
  ];

  const members: {
    initials: string;
    color: AvatarColor;
    name: string;
    saved: string;
    dots: DotState[];
    status: "on track" | "behind";
    id: string;
    isCurrentUser: boolean;
  }[] = [
    {
      id: "JL",
      initials: "JL",
      color: "purple",
      name: "You",
      saved: "$696 saved",
      dots: ["green", "green", "green", "green", "green", "green", "empty"],
      status: "on track",
      isCurrentUser: true,
    },
    {
      id: "SR",
      initials: "SR",
      color: "teal",
      name: "Sarah R.",
      saved: "$580 saved",
      dots: ["green", "green", "green", "green", "red", "green", "empty"],
      status: "on track",
      isCurrentUser: false,
    },
    {
      id: "MT",
      initials: "MT",
      color: "amber",
      name: "Marcus T.",
      saved: "$310 saved",
      dots: ["green", "red", "green", "green", "red", "red", "empty"],
      status: "behind",
      isCurrentUser: false,
    },
  ];

  const history: { event: string; outcome: string; color: string }[] = [
    { event: "Week 6 — all completed", outcome: "+$0", color: C.success },
    { event: "Week 5 — Marcus missed", outcome: "$10 → savings", color: C.warning },
    { event: "Week 4 — all completed", outcome: "+$0", color: C.success },
    { event: "Week 3 — Sarah rescheduled", outcome: "reset", color: C.muted },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <StatusBar />
      <ScrollArea style={{ padding: "0 20px 110px" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <BackButton onPress={() => onNavigate("home")} />
          <Pill color="purple">Week 7</Pill>
        </div>

        {/* Header */}
        <p style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
          Emergency fund pact
        </p>
        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 20px" }}>
          3 members · 7 weeks · ends Dec 31
        </p>

        {/* Stat tiles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {stats.map(({ value, label, valueColor }) => (
            <div
              key={label}
              style={{
                background: "white",
                borderRadius: 14,
                padding: "14px 10px",
                boxShadow: C.cardShadow,
                textAlign: "center",
              }}
            >
              <p
                style={{ fontSize: 22, fontWeight: 700, color: valueColor, margin: "0 0 3px" }}
              >
                {value}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: C.muted,
                  margin: 0,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Members — full row is tappable */}
        <SectionLabel>Members</SectionLabel>
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          {members.map((m, i) => (
            <div key={m.id}>
              <PressableDiv
                onClick={() =>
                  onNavigate("member-profile", { memberId: m.id })
                }
                aria-label={`View ${m.name}'s profile`}
                style={{ padding: "12px 16px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar initials={m.initials} color={m.color} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: C.text,
                        margin: "0 0 5px",
                      }}
                    >
                      {m.name}
                    </p>
                    <StreakDots dots={m.dots} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{m.saved}</p>
                    <Pill color={m.status === "on track" ? "green" : "amber"}>{m.status}</Pill>
                  </div>
                  {/* Chevron hint */}
                  <svg
                    width="7"
                    height="12"
                    viewBox="0 0 7 12"
                    fill="none"
                    style={{ marginLeft: 4, flexShrink: 0 }}
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1l5 5-5 5"
                      stroke={C.muted}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </PressableDiv>
              {i < members.length - 1 && <Divider style={{ margin: 0 }} />}
            </div>
          ))}
        </Card>

        {/* Pool History */}
        <SectionLabel>Pool History</SectionLabel>
        <Card style={{ marginBottom: 24 }}>
          {history.map((row, i) => (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "11px 0",
                }}
              >
                <p style={{ fontSize: 14, color: C.text, margin: 0 }}>{row.event}</p>
                <p
                  style={{ fontSize: 14, fontWeight: 600, color: row.color, margin: 0 }}
                >
                  {row.outcome}
                </p>
              </div>
              {i < history.length - 1 && <Divider />}
            </div>
          ))}
        </Card>

        <OutlineButton>Invite someone new</OutlineButton>
      </ScrollArea>

      <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, zIndex: 10 }}>
        <BottomNav active="group" onNavigate={onNavigate} />
      </div>
    </div>
  );
}

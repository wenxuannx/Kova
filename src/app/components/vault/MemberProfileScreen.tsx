import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  C,
  StatusBar,
  Card,
  SectionLabel,
  Avatar,
  Divider,
  BottomNav,
  BackButton,
  ScrollArea,
  type NavigateFn,
  type AvatarColor,
  type DotState,
} from "./Shared";

type TileState = "completed" | "missed" | "rescheduled" | "upcoming";

interface MemberData {
  initials: string;
  color: AvatarColor;
  name: string;
  memberSince: string;
  savedAmount: string | "Private";
  completionRate: number;
  isCurrentUser: boolean;
  grid: TileState[];
}

const MEMBERS: Record<string, MemberData> = {
  JL: {
    initials: "JL",
    color: "purple",
    name: "James Liu",
    memberSince: "Mar 2024",
    savedAmount: "$696",
    completionRate: 86,
    isCurrentUser: true,
    grid: [
      "completed","completed","completed","rescheduled","completed","completed",
      "completed","missed","completed","completed","completed","upcoming",
    ],
  },
  SR: {
    initials: "SR",
    color: "teal",
    name: "Sarah R.",
    memberSince: "Apr 2024",
    savedAmount: "Private",
    completionRate: 71,
    isCurrentUser: false,
    grid: [
      "completed","completed","missed","completed","completed","rescheduled",
      "completed","completed","missed","completed","completed","upcoming",
    ],
  },
  MT: {
    initials: "MT",
    color: "amber",
    name: "Marcus T.",
    memberSince: "Apr 2024",
    savedAmount: "Private",
    completionRate: 57,
    isCurrentUser: false,
    grid: [
      "completed","missed","completed","completed","missed","completed",
      "missed","completed","missed","completed","missed","upcoming",
    ],
  },
};

const TILE_COLORS: Record<TileState, { bg: string; label: string }> = {
  completed: { bg: C.success, label: "completed" },
  missed: { bg: C.danger, label: "missed" },
  rescheduled: { bg: C.warning, label: "rescheduled" },
  upcoming: { bg: "#E5E7EB", label: "upcoming" },
};

function formatMemberSince(isoDate?: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function MemberProfileScreen({
  memberId,
  returnGroupId,
  onNavigate,
}: {
  memberId: string;
  returnGroupId?: string;
  onNavigate: NavigateFn;
}) {
  const { user: authUser } = useAuth();

  const isSelf = memberId === "me" || (MEMBERS[memberId]?.isCurrentUser ?? false);

  const member: MemberData = (() => {
    if (isSelf && authUser) {
      const base = MEMBERS[memberId] ?? MEMBERS.JL;
      return {
        ...base,
        name: authUser.name || base.name,
        initials: authUser.name
          ? authUser.name.trim().split(" ").map((p: string) => p[0]).join("").toUpperCase().slice(0, 2)
          : base.initials,
        memberSince: authUser.createdAt ? formatMemberSince(authUser.createdAt) : base.memberSince,
        isCurrentUser: true,
      };
    }
    return MEMBERS[memberId] ?? MEMBERS.SR;
  })();

  const [nudged, setNudged] = useState(false);

  const gridLabel = member.grid
    .map((t, i) => `Week ${i + 1}: ${TILE_COLORS[t].label}`)
    .join(", ");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <StatusBar />
      <ScrollArea style={{ padding: "0 20px 110px" }}>
        {/* Top row */}
        <div style={{ marginBottom: 20 }}>
          <BackButton onPress={() => onNavigate("group", returnGroupId ? { groupId: returnGroupId } : undefined)} />
        </div>

        {/* Profile header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <Avatar initials={member.initials} color={member.color} size={72} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
              {member.name}
              {member.isCurrentUser && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: C.primary,
                    background: "rgba(123,97,255,0.10)",
                    borderRadius: 50,
                    padding: "2px 8px",
                    marginLeft: 8,
                  }}
                >
                  You
                </span>
              )}
            </p>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
              Member since {member.memberSince}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: "14px",
              boxShadow: C.cardShadow,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 3px" }}>
              {member.savedAmount}
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
              {member.savedAmount === "Private" ? "saved (private)" : "saved"}
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: "14px",
              boxShadow: C.cardShadow,
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: member.completionRate >= 70 ? C.success : C.warning,
                margin: "0 0 3px",
              }}
            >
              {member.completionRate}%
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
              completion rate
            </p>
          </div>
        </div>

        {/* 12-week streak grid */}
        <SectionLabel>12-Week History</SectionLabel>
        <Card style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 8,
            }}
            role="img"
            aria-label={gridLabel}
          >
            {member.grid.map((tile, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  borderRadius: 8,
                  background: TILE_COLORS[tile].bg,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  padding: "6px 7px",
                }}
                title={`Week ${i + 1}: ${TILE_COLORS[tile].label}`}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)", lineHeight: 1 }}>
                  W{i + 1}
                </span>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 14,
              flexWrap: "wrap",
            }}
          >
            {(["completed", "missed", "rescheduled", "upcoming"] as TileState[]).map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: TILE_COLORS[t].bg,
                  }}
                />
                <span style={{ fontSize: 11, color: C.muted, textTransform: "capitalize" }}>
                  {t}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Nudge / Settings */}
        {!member.isCurrentUser ? (
          <>
            <SectionLabel>Actions</SectionLabel>
            <button
              onClick={() => !nudged && setNudged(true)}
              disabled={nudged}
              aria-label={nudged ? "Already nudged this week" : `Send a nudge to ${member.name}`}
              style={{
                width: "100%",
                background: nudged ? "white" : C.primary,
                color: nudged ? C.muted : "white",
                border: nudged ? `1.5px solid ${C.border}` : "none",
                borderRadius: 14,
                height: 52,
                fontSize: 15,
                fontWeight: 600,
                cursor: nudged ? "not-allowed" : "pointer",
                opacity: nudged ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: nudged ? "none" : "0px 4px 16px rgba(123,97,255,0.30)",
              }}
            >
              {nudged ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l4 4 6-7"
                      stroke={C.muted}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Nudged this week
                </>
              ) : (
                `👊 Nudge ${member.name.split(" ")[0]}`
              )}
            </button>
            {nudged && (
              <p
                style={{
                  fontSize: 12,
                  color: C.muted,
                  textAlign: "center",
                  margin: "8px 0 0",
                }}
              >
                {member.name.split(" ")[0]} was notified you're cheering them on.
              </p>
            )}
          </>
        ) : null}
      </ScrollArea>

      <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, zIndex: 10 }}>
        <BottomNav active="member-profile" onNavigate={onNavigate} />
      </div>
    </div>
  );
}

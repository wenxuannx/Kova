import { useState } from "react";
import { Copy, Check, RefreshCw, UserPlus, Users } from "lucide-react";
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
  PrimaryButton,
  BottomSheet,
  ScrollArea,
  SmallPillButton,
  type NavigateFn,
} from "./Shared";
import { useGroup } from "../../context/GroupContext";

export function GroupScreen({ groupId, onNavigate }: { groupId: string; onNavigate: NavigateFn }) {
  const { groups, getGroup, joinWithCode, rotateCode } = useGroup();
  const group = groupId ? getGroup(groupId) : undefined;
  const resolvedGroupId = group?.id ?? groupId;
  const members = group?.members ?? [];
  const inviteCode = group?.inviteCode ?? "";
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);

  const history: { event: string; outcome: string; color: string }[] = [
    { event: "Week 6 — all completed",     outcome: "$45 voucher shared",        color: C.success },
    { event: "Week 5 — Marcus missed",     outcome: "His $15 locked 30 days",    color: C.warning },
    { event: "Week 4 — all completed",     outcome: "$45 voucher shared",        color: C.success },
    { event: "Week 3 — Sarah rescheduled", outcome: "Challenge extended 7 days", color: C.muted   },
  ];

  function copyCode() {
    navigator.clipboard.writeText(inviteCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRefresh() {
    rotateCode(resolvedGroupId);
    setJoinInput("");
    setJoinError("");
    setJoinSuccess(null);
  }

  function handleJoin() {
    const result = joinWithCode(resolvedGroupId, joinInput);
    if (!result.ok) {
      setJoinError(result.error ?? "Something went wrong.");
    } else {
      setJoinSuccess(result.memberName ?? "Someone");
      setJoinInput("");
      setJoinError("");
    }
  }

  if (!group) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
        <StatusBar />
        <ScrollArea style={{ padding: "0 20px 110px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <BackButton onPress={() => onNavigate("home")} />
          </div>

          {groups.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 60, textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(123,97,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Users size={28} color={C.primary} />
              </div>
              <p style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 10px" }}>No goal groups yet</p>
              <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 28px", lineHeight: 1.6, maxWidth: 280 }}>
                Create a goal group to get an invite code and save with friends.
              </p>
              <SmallPillButton onClick={() => onNavigate("new")}>Create a goal group →</SmallPillButton>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>My Goal Groups</p>
                <p style={{ fontSize: 13, color: C.textSecondary, margin: 0 }}>{groups.length} active goal{groups.length !== 1 ? "s" : ""}</p>
              </div>
              <Card style={{ padding: 0, overflow: "hidden" }}>
                {groups.map((g, i) => (
                  <div key={g.id}>
                    <PressableDiv
                      onClick={() => onNavigate("group", { groupId: g.id })}
                      style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(123,97,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 18 }}>🎯</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.goalName}</p>
                        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{g.members.length} member{g.members.length !== 1 ? "s" : ""}</p>
                      </div>
                      <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
                        <path d="M1 1l5 5-5 5" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </PressableDiv>
                    {i < groups.length - 1 && <Divider style={{ margin: 0 }} />}
                  </div>
                ))}
              </Card>
            </>
          )}
        </ScrollArea>
        <BottomNav active="group" onNavigate={onNavigate} />
      </div>
    );
  }

  const stats: { value: string; label: string; valueColor: string }[] = [
    { value: "$50",  label: "pool",        valueColor: C.text    },
    { value: "6",    label: "your streak", valueColor: C.primary },
    { value: "83%",  label: "completion",  valueColor: C.success },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <StatusBar />
      <ScrollArea style={{ padding: "0 20px 110px" }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <BackButton onPress={() => onNavigate("group")} />
          <Pill color="purple">Week 7</Pill>
        </div>

        <p style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>{group.goalName}</p>
        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 20px" }}>
          {members.length} member{members.length !== 1 ? "s" : ""} · 7 weeks · ends Dec 31
        </p>

        {/* Stat tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
          {stats.map(({ value, label, valueColor }) => (
            <div key={label} style={{ background: "white", borderRadius: 14, padding: "14px 10px", boxShadow: C.cardShadow, textAlign: "center" }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: valueColor, margin: "0 0 3px" }}>{value}</p>
              <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Members */}
        <SectionLabel>Members</SectionLabel>
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          {members.map((m, i) => (
            <div key={m.id}>
              <PressableDiv onClick={() => onNavigate("member-profile", { memberId: m.id })} aria-label={`View ${m.name}'s profile`} style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar initials={m.initials} color={m.color} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 5px" }}>{m.name}</p>
                    <StreakDots dots={m.dots} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                    <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{m.saved}</p>
                    <Pill color={m.status === "on track" ? "green" : "amber"}>{m.status}</Pill>
                  </div>
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ marginLeft: 4, flexShrink: 0 }} aria-hidden="true">
                    <path d="M1 1l5 5-5 5" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </PressableDiv>
              {i < members.length - 1 && <Divider style={{ margin: 0 }} />}
            </div>
          ))}
        </Card>

        {/* Pool History — only shown once there are real activity rows */}
        {members.length > 1 && (
          <>
            <SectionLabel>Pool History</SectionLabel>
            <Card style={{ marginBottom: 24 }}>
              {history.map((row, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0" }}>
                    <p style={{ fontSize: 14, color: C.text, margin: 0 }}>{row.event}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: row.color, margin: 0 }}>{row.outcome}</p>
                  </div>
                  {i < history.length - 1 && <Divider />}
                </div>
              ))}
            </Card>
          </>
        )}

        <OutlineButton onClick={() => { setJoinSuccess(null); setInviteOpen(true); }}>
          Invite someone / Join a goal group
        </OutlineButton>
      </ScrollArea>

      <BottomNav active="group" onNavigate={onNavigate} />

      {/* ── Invite sheet ── */}
      <BottomSheet isOpen={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite to goal group">

        {/* Success banner */}
        {joinSuccess && (
          <div style={{ background: "rgba(34,197,94,0.08)", border: "1.5px solid rgba(34,197,94,0.20)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Check size={15} color={C.success} />
            <p style={{ fontSize: 13, fontWeight: 600, color: C.success, margin: 0 }}>{joinSuccess} joined the group!</p>
          </div>
        )}

        {/* Code display */}
        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 12px", lineHeight: 1.55 }}>
          Share this code with anyone you want to invite. Each code is single-use.
        </p>

        <div style={{ background: "rgba(123,97,255,0.06)", border: "1.5px solid rgba(123,97,255,0.18)", borderRadius: 16, padding: "18px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: C.primary, letterSpacing: "0.18em", fontVariantNumeric: "tabular-nums" }}>{inviteCode}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleRefresh} title="Generate new code" style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", alignItems: "center", padding: 6, borderRadius: 8 }}>
              <RefreshCw size={15} />
            </button>
            <button
              onClick={copyCode}
              style={{ display: "flex", alignItems: "center", gap: 5, background: copied ? C.success : C.primary, color: "white", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <p style={{ fontSize: 11, color: C.muted, margin: "0 0 24px", textAlign: "center" }}>
          Single-use · Tap the refresh icon to generate a new code
        </p>

        <Divider />

        {/* Join with a code (demo) */}
        <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: "16px 0 8px" }}>
          <UserPlus size={14} style={{ verticalAlign: "middle", marginRight: 5 }} />
          Have a code? Join a goal group
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <input
            type="text"
            value={joinInput}
            onChange={(e) => { setJoinInput(e.target.value.toUpperCase().slice(0, 6)); setJoinError(""); }}
            placeholder="Enter 6-digit code"
            maxLength={6}
            style={{ flex: 1, border: `1.5px solid ${joinError ? C.danger : "rgba(123,97,255,0.22)"}`, borderRadius: 10, height: 44, padding: "0 12px", fontSize: 15, fontWeight: 700, color: C.primary, letterSpacing: "0.12em", outline: "none", fontFamily: "inherit", background: "white" }}
          />
          <PrimaryButton style={{ height: 44, padding: "0 18px", borderRadius: 10, width: "auto" }} onClick={handleJoin}>
            Join
          </PrimaryButton>
        </div>
        {joinError && <p style={{ fontSize: 12, color: C.danger, margin: "0 0 4px" }}>{joinError}</p>}
        <p style={{ fontSize: 11, color: C.muted, margin: "4px 0 0", lineHeight: 1.5 }}>
          Each code is single-use — once someone joins, it can't be reused.
        </p>
      </BottomSheet>
    </div>
  );
}

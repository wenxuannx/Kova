import React, { useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import confetti from "canvas-confetti";
import {
  C,
  StatusBar,
  Card,
  SectionLabel,
  Avatar,
  BottomNav,
  PrimaryButton,
  BottomSheet,
  ScrollArea,
  type NavigateFn,
  type AvatarColor,
} from "./Shared";

interface Friend {
  id: string;
  initials: string;
  name: string;
  color: AvatarColor;
}

const ALL_FRIENDS: Friend[] = [
  { id: "SR", initials: "SR", name: "Sarah R.", color: "purple" },
  { id: "MT", initials: "MT", name: "Marcus T.", color: "teal" },
];

function FormField({
  label,
  value,
  placeholder,
  error,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 12,
          color: error ? C.danger : C.muted,
          margin: "0 0 5px",
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "#F9F8FF",
          border: `1.5px solid ${error ? C.danger : "rgba(123,97,255,0.12)"}`,
          borderRadius: 12,
          padding: "11px 14px",
          fontSize: 14,
          color: C.text,
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
      />
      {error && (
        <p style={{ fontSize: 12, color: C.danger, margin: "5px 0 0", fontWeight: 500 }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function NewVaultScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [goalName, setGoalName] = useState("Emergency fund");
  const [targetAmount, setTargetAmount] = useState("$1,200");
  const [deadline, setDeadline] = useState("Dec 31, 2025");
  const [friends, setFriends] = useState<Friend[]>(ALL_FRIENDS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [noFriendsWarning, setNoFriendsWarning] = useState(false);
  const [launching, setLaunching] = useState(false);

  const removeFriend = (id: string) => setFriends((f) => f.filter((x) => x.id !== id));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!goalName || goalName.trim().length < 2) e.goal = "Give your vault a name";
    const amt = parseFloat(targetAmount.replace(/[$,]/g, ""));
    if (isNaN(amt) || amt < 10) e.amount = "Enter a target amount (min $10)";
    if (!deadline.trim()) e.deadline = "Pick a date in the future";
    return e;
  };

  const doLaunch = () => {
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.55 },
        colors: ["#9B7FFF", "#7B61FF", "#5B3FDF", "#FFFFFF", "#C4B5FD"],
        gravity: 1.2,
        scalar: 0.9,
      });
      setTimeout(() => onNavigate("home"), 1100);
    }, 1400);
  };

  const handleLaunch = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    if (friends.length === 0) {
      setNoFriendsWarning(true);
      return;
    }
    doLaunch();
  };

  const summaryRows = [
    { label: "Group pool / week", value: "$45", valueColor: "white" },
    { label: "If you complete", value: "$45 voucher", valueColor: "#86EFAC" },
    { label: "If you miss", value: "$15 → your savings", valueColor: "#FCA5A5" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <StatusBar />
      <ScrollArea style={{ padding: "0 20px 110px" }}>
        <p style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 5px" }}>
          Create a vault
        </p>
        <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 24px", lineHeight: 1.55 }}>
          Set a goal, stake the pool, invite your group.
        </p>

        {/* YOUR GOAL */}
        <SectionLabel>Your Goal</SectionLabel>
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FormField
              label="Goal name"
              value={goalName}
              placeholder="Emergency fund…"
              error={errors.goal}
              onChange={(v) => {
                setGoalName(v);
                setErrors((e) => ({ ...e, goal: "" }));
              }}
            />
            <FormField
              label="Target amount"
              value={targetAmount}
              placeholder="$0"
              error={errors.amount}
              onChange={(v) => {
                setTargetAmount(v);
                setErrors((e) => ({ ...e, amount: "" }));
              }}
            />
            <FormField
              label="Deadline"
              value={deadline}
              placeholder="Select date"
              error={errors.deadline}
              onChange={(v) => {
                setDeadline(v);
                setErrors((e) => ({ ...e, deadline: "" }));
              }}
            />
            {/* Dropdown (static) */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  color: C.muted,
                  margin: "0 0 5px",
                  fontWeight: 500,
                }}
              >
                Goal type
              </label>
              <div
                style={{
                  background: "#F9F8FF",
                  border: "1.5px solid rgba(123,97,255,0.12)",
                  borderRadius: 12,
                  padding: "11px 14px",
                  fontSize: 14,
                  color: C.text,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <span>Savings target</span>
                <ChevronDown size={16} color={C.muted} />
              </div>
            </div>
          </div>
        </Card>

        {/* INVITE */}
        <SectionLabel>Invite Your Group</SectionLabel>
        <Card style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 14px", lineHeight: 1.55 }}>
            Add friends to unlock group streak tracking and the pool mechanic.
          </p>
          {friends.length === 0 && (
            <p
              style={{
                fontSize: 12,
                color: C.muted,
                margin: "0 0 12px",
                fontStyle: "italic",
              }}
            >
              No friends added yet — this vault will be solo.
            </p>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {friends.map((f) => (
              <div
                key={f.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "white",
                  borderRadius: 50,
                  padding: "5px 8px 5px 6px",
                  boxShadow: "0px 2px 10px rgba(123,97,255,0.10)",
                  border: "1px solid rgba(123,97,255,0.08)",
                }}
              >
                <Avatar initials={f.initials} color={f.color} size={28} />
                <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{f.name}</span>
                <button
                  onClick={() => removeFriend(f.id)}
                  aria-label={`Remove ${f.name}`}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 2,
                    color: C.muted,
                    display: "flex",
                    alignItems: "center",
                    minWidth: 20,
                    minHeight: 20,
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {friends.length < 6 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "white",
                  borderRadius: 50,
                  padding: "5px 14px 5px 6px",
                  border: `1.5px dashed ${C.primary}`,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(123,97,255,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={14} color={C.primary} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.primary }}>Add</span>
              </div>
            )}
          </div>
        </Card>

        {/* STAKE */}
        <SectionLabel>Stake the Pool</SectionLabel>
        <Card style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 14px", lineHeight: 1.55 }}>
            Each member contributes weekly. Miss a week and your stake moves to savings. Complete
            together and share the voucher reward.
          </p>
          <label
            style={{
              display: "block",
              fontSize: 12,
              color: C.muted,
              margin: "0 0 6px",
              fontWeight: 500,
            }}
          >
            Weekly contribution
          </label>
          <div
            style={{
              border: `2px solid ${C.primary}`,
              borderRadius: 12,
              padding: "11px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              cursor: "pointer",
              background: "rgba(123,97,255,0.03)",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>$15 / week</span>
            <ChevronDown size={16} color={C.primary} />
          </div>
          {/* Summary card */}
          <div
            style={{
              background: "linear-gradient(135deg, #9B7FFF 0%, #5B3FDF 100%)",
              borderRadius: 16,
              padding: "4px 16px",
              boxShadow: "0px 4px 16px rgba(91,63,223,0.25)",
            }}
          >
            {summaryRows.map((row, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                  }}
                >
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.80)", margin: 0 }}>
                    {row.label}
                  </p>
                  <p
                    style={{ fontSize: 14, fontWeight: 700, color: row.valueColor, margin: 0 }}
                  >
                    {row.value}
                  </p>
                </div>
                {i < summaryRows.length - 1 && (
                  <div style={{ height: 1, background: "rgba(255,255,255,0.12)" }} />
                )}
              </div>
            ))}
          </div>
        </Card>

        <PrimaryButton onClick={handleLaunch} loading={launching}>
          Launch vault
        </PrimaryButton>
      </ScrollArea>

      <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, zIndex: 10 }}>
        <BottomNav active="new" onNavigate={onNavigate} />
      </div>

      {/* No-friends soft warning */}
      <BottomSheet
        isOpen={noFriendsWarning}
        onClose={() => setNoFriendsWarning(false)}
      >
        <div
          style={{
            background: "#FFFBEB",
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 18,
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: "#B45309", margin: "0 0 5px" }}>
            Better together
          </p>
          <p style={{ fontSize: 13, color: "#92400E", margin: 0, lineHeight: 1.55 }}>
            Vaults work best with a group — add at least one friend?
          </p>
        </div>
        <PrimaryButton
          style={{ marginBottom: 10 }}
          onClick={() => setNoFriendsWarning(false)}
        >
          Add friend
        </PrimaryButton>
        <button
          onClick={() => {
            setNoFriendsWarning(false);
            doLaunch();
          }}
          style={{
            width: "100%",
            height: 52,
            background: "transparent",
            border: "none",
            fontSize: 15,
            fontWeight: 600,
            color: C.textSecondary,
            cursor: "pointer",
          }}
        >
          Continue solo
        </button>
      </BottomSheet>
    </div>
  );
}

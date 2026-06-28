import { useState } from "react";
import { ChevronDown, Copy, Check } from "lucide-react";
import confetti from "canvas-confetti";
import {
  C,
  StatusBar,
  Card,
  SectionLabel,
  BottomNav,
  BottomSheet,
  PrimaryButton,
  OutlineButton,
  ScrollArea,
  type NavigateFn,
} from "./Shared";
import { useGroup } from "../../context/GroupContext";
import { useAuth } from "../../context/AuthContext";

function FormField({ label, value, placeholder, error, onChange }: {
  label: string; value: string; placeholder?: string; error?: string; onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, color: error ? C.danger : C.muted, margin: "0 0 5px", fontWeight: 500 }}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", background: "#F9F8FF", border: `1.5px solid ${error ? C.danger : "rgba(123,97,255,0.12)"}`, borderRadius: 12, padding: "11px 14px", fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
      />
      {error && <p style={{ fontSize: 12, color: C.danger, margin: "5px 0 0", fontWeight: 500 }}>{error}</p>}
    </div>
  );
}

export function NewVaultScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const { user } = useAuth();
  const { createGroup } = useGroup();
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [goalType, setGoalType] = useState("savings");
  const [customGoalType, setCustomGoalType] = useState("");
  const [weeklyContrib, setWeeklyContrib] = useState(15);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [launching, setLaunching] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [createdGroupId, setCreatedGroupId] = useState("");
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!goalName || goalName.trim().length < 2) e.goal = "Give your goal a name";
    const amt = parseFloat(targetAmount.replace(/[$,]/g, ""));
    if (isNaN(amt) || amt < 10) e.amount = "Enter a target amount (min $10)";
    if (!deadline || new Date(deadline) <= new Date(new Date().toDateString())) e.deadline = "Pick a date in the future";
    return e;
  };

  const handleLaunch = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      const { groupId, inviteCode: code } = createGroup(goalName.trim() || "My Goal", user?.name ?? "Me");
      setCreatedGroupId(groupId);
      setInviteCode(code);
      confetti({ particleCount: 130, spread: 75, origin: { y: 0.55 }, colors: ["#9B7FFF", "#7B61FF", "#5B3FDF", "#FFFFFF", "#C4B5FD"], gravity: 1.2, scalar: 0.9 });
      setSuccessOpen(true);
    }, 1200);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const summaryRows = [
    { label: "Your weekly stake", value: `$${weeklyContrib} / week`, valueColor: "white" },
    { label: "Complete the challenge", value: `$${weeklyContrib} partner voucher`, valueColor: "#86EFAC" },
    { label: "Miss the challenge", value: `$${weeklyContrib} held, retrievable only after 30 days`, valueColor: "#FCA5A5" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <StatusBar />
      <ScrollArea style={{ padding: "0 20px 110px" }}>
        <p style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 5px" }}>Create a goal</p>
        <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 24px", lineHeight: 1.55 }}>
          Set a goal, stake the pool, invite your group.
        </p>

        {/* YOUR GOAL */}
        <SectionLabel>Your Goal</SectionLabel>
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FormField label="Goal name" value={goalName} placeholder="e.g. Emergency fund" error={errors.goal} onChange={(v) => { setGoalName(v); setErrors((e) => ({ ...e, goal: "" })); }} />
            <FormField label="Target amount" value={targetAmount} placeholder="$0" error={errors.amount} onChange={(v) => { setTargetAmount(v); setErrors((e) => ({ ...e, amount: "" })); }} />

            {/* Deadline */}
            <div>
              <label style={{ display: "block", fontSize: 12, color: errors.deadline ? C.danger : C.muted, margin: "0 0 5px", fontWeight: 500 }}>Deadline</label>
              <input
                type="date"
                value={deadline}
                min={(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })()}
                onChange={(e) => { setDeadline(e.target.value); setErrors((p) => ({ ...p, deadline: "" })); }}
                style={{ width: "100%", background: "#F9F8FF", border: `1.5px solid ${errors.deadline ? C.danger : "rgba(123,97,255,0.12)"}`, borderRadius: 12, padding: "11px 14px", fontSize: 14, color: deadline ? C.text : C.muted, outline: "none", boxSizing: "border-box", fontFamily: "inherit", cursor: "pointer" }}
              />
              {errors.deadline && <p style={{ fontSize: 12, color: C.danger, margin: "5px 0 0", fontWeight: 500 }}>{errors.deadline}</p>}
            </div>

            {/* Goal type */}
            <div>
              <label style={{ display: "block", fontSize: 12, color: C.muted, margin: "0 0 5px", fontWeight: 500 }}>Goal type</label>
              <div style={{ position: "relative" }}>
                <select value={goalType} onChange={(e) => setGoalType(e.target.value)} style={{ width: "100%", background: "#F9F8FF", border: "1.5px solid rgba(123,97,255,0.12)", borderRadius: 12, padding: "11px 40px 11px 14px", fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box", fontFamily: "inherit", appearance: "none", cursor: "pointer" }}>
                  <option value="savings">Savings target</option>
                  <option value="debt">Debt payoff</option>
                  <option value="emergency">Emergency fund</option>
                  <option value="investment">Investment</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown size={16} color={C.muted} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
              {goalType === "other" && (
                <input type="text" value={customGoalType} onChange={(e) => setCustomGoalType(e.target.value)} placeholder="Describe your goal type…" autoFocus
                  style={{ marginTop: 8, width: "100%", background: "#F9F8FF", border: "1.5px solid rgba(123,97,255,0.22)", borderRadius: 12, padding: "11px 14px", fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              )}
            </div>
          </div>
        </Card>

        {/* STAKE */}
        <SectionLabel>Stake the Pool</SectionLabel>
        <Card style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 14px", lineHeight: 1.55 }}>
            Your stake is always yours — complete your weekly challenge to earn a partner voucher, or miss it and your money is safely held for 30 days before being returned.
          </p>
          <label style={{ display: "block", fontSize: 12, color: C.muted, margin: "0 0 6px", fontWeight: 500 }}>Weekly contribution</label>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <select value={weeklyContrib} onChange={(e) => setWeeklyContrib(Number(e.target.value))} style={{ width: "100%", border: `2px solid ${C.primary}`, borderRadius: 12, padding: "11px 40px 11px 14px", fontSize: 14, fontWeight: 600, color: C.primary, background: "rgba(123,97,255,0.03)", outline: "none", boxSizing: "border-box", fontFamily: "inherit", appearance: "none", cursor: "pointer" }}>
              {[5, 10, 15, 20, 25, 30, 50].map((v) => <option key={v} value={v}>${v} / week</option>)}
            </select>
            <ChevronDown size={16} color={C.primary} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          </div>
          <div style={{ background: "linear-gradient(135deg, #9B7FFF 0%, #5B3FDF 100%)", borderRadius: 16, padding: "4px 16px", boxShadow: "0px 4px 16px rgba(91,63,223,0.25)" }}>
            {summaryRows.map((row, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.80)", margin: 0 }}>{row.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: row.valueColor, margin: 0 }}>{row.value}</p>
                </div>
                {i < summaryRows.length - 1 && <div style={{ height: 1, background: "rgba(255,255,255,0.12)" }} />}
              </div>
            ))}
          </div>
        </Card>

        <PrimaryButton onClick={handleLaunch} loading={launching}>Launch goal</PrimaryButton>
      </ScrollArea>

      <BottomNav active="new" onNavigate={onNavigate} />

      {/* Success + invite code sheet */}
      <BottomSheet isOpen={successOpen} onClose={() => {}} title="">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
          <p style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>Goal created!</p>
          <p style={{ fontSize: 14, color: C.textSecondary, margin: 0, lineHeight: 1.55 }}>
            Share your invite code so your group can join and hold each other accountable.
          </p>
        </div>

        {/* Code block */}
        <div style={{ background: "rgba(123,97,255,0.06)", border: "1.5px solid rgba(123,97,255,0.18)", borderRadius: 16, padding: "20px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: C.primary, letterSpacing: "0.18em" }}>{inviteCode}</span>
          <button
            onClick={copyCode}
            style={{ display: "flex", alignItems: "center", gap: 6, background: copied ? C.success : C.primary, color: "white", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s", flexShrink: 0 }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>
        <p style={{ fontSize: 11, color: C.muted, textAlign: "center", margin: "0 0 24px" }}>
          Single-use · expires once someone joins
        </p>

        <PrimaryButton style={{ marginBottom: 10 }} onClick={() => { setSuccessOpen(false); onNavigate("home"); }}>
          Go to dashboard
        </PrimaryButton>
        <OutlineButton onClick={() => { setSuccessOpen(false); onNavigate("group", { groupId: createdGroupId }); }}>
          View my group
        </OutlineButton>
      </BottomSheet>
    </div>
  );
}

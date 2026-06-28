import React, { useState } from "react";
import { Lock, Unlock, Gift, ChevronRight, Building2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  C,
  StatusBar,
  Card,
  SectionLabel,
  Pill,
  Divider,
  BottomNav,
  BackButton,
  BottomSheet,
  PrimaryButton,
  OutlineButton,
  ScrollArea,
  type NavigateFn,
} from "./Shared";
import { useAuth } from "../../context/AuthContext";

type EntryStatus = "available" | "locked" | "voucher" | "processing";

interface WalletEntry {
  id: string;
  amount: number;
  status: EntryStatus;
  daysRemaining: number | null;
  label: string;
  date: string;
}

const INITIAL_ENTRIES: WalletEntry[] = [
  { id: "e1", amount: 50,  status: "voucher",   daysRemaining: 83, label: "Challenge completed — Week 6", date: "Jun 23" },
  { id: "e2", amount: 15,  status: "locked",    daysRemaining: 18, label: "Challenge missed — Week 5",   date: "Jun 16" },
  { id: "e3", amount: 150, status: "available", daysRemaining: null, label: "30-day lock elapsed — Week 2", date: "May 28" },
  { id: "e4", amount: 15,  status: "available", daysRemaining: null, label: "Challenge completed — Week 1", date: "May 21" },
];

const STATUS_CONFIG: Record<EntryStatus, { icon: React.ElementType; iconBg: string; iconColor: string; pill: "green" | "amber" | "purple" | "gray" }> = {
  available:  { icon: Unlock,   iconBg: "rgba(34,197,94,0.10)",  iconColor: C.success,  pill: "green"  },
  locked:     { icon: Lock,     iconBg: "rgba(245,158,11,0.10)", iconColor: C.warning,  pill: "amber"  },
  voucher:    { icon: Gift,     iconBg: "rgba(123,97,255,0.10)", iconColor: C.primary,  pill: "purple" },
  processing: { icon: ArrowRight, iconBg: "rgba(34,197,94,0.08)", iconColor: C.success, pill: "green" },
};

function BalanceTile({ label, amount, sub, accentColor, iconBg, icon: Icon, onClick }: {
  label: string; amount: string; sub: string; accentColor: string; iconBg: string; icon: React.ElementType; onClick?: () => void;
}) {
  const Tag = onClick ? "button" : ("div" as React.ElementType);
  return (
    <Tag onClick={onClick} style={{ background: "white", borderRadius: 20, padding: 16, boxShadow: C.cardShadow, display: "flex", alignItems: "center", gap: 14, width: "100%", border: "none", fontFamily: "inherit", textAlign: "left", cursor: onClick ? "pointer" : "default" }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden="true">
        <Icon size={20} color={accentColor} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted, margin: "0 0 3px" }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 700, color: accentColor, margin: "0 0 2px" }} aria-label={`${label}: ${amount}`}>{amount}</p>
        <p style={{ fontSize: 12, color: C.textSecondary, margin: 0 }}>{sub}</p>
      </div>
      {onClick && <ChevronRight size={16} color={C.muted} style={{ flexShrink: 0 }} />}
    </Tag>
  );
}

type WithdrawStep = "amount" | "review" | "processing" | "success";

function arrivalDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function WalletScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WalletEntry[]>(INITIAL_ENTRIES);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<WithdrawStep>("amount");
  const [withdrawInput, setWithdrawInput] = useState("");
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [inputError, setInputError] = useState("");
  const [voucherOpen, setVoucherOpen] = useState(false);

  const available = entries.filter((e) => e.status === "available").reduce((s, e) => s + e.amount, 0);
  const locked    = entries.filter((e) => e.status === "locked").reduce((s, e) => s + e.amount, 0);
  const vouchers  = entries.filter((e) => e.status === "voucher").reduce((s, e) => s + e.amount, 0);

  const bankName = user?.bankName ?? "Connected bank";

  function openWithdraw() {
    setWithdrawInput(String(available));
    setInputError("");
    setWithdrawStep("amount");
    setWithdrawOpen(true);
  }

  function handleAmountNext() {
    const amt = parseFloat(withdrawInput);
    if (isNaN(amt) || amt <= 0) { setInputError("Enter a valid amount."); return; }
    if (amt > available) { setInputError(`Max available is $${available}.`); return; }
    setInputError("");
    setWithdrawnAmount(amt);
    setWithdrawStep("review");
  }

  function handleConfirm() {
    setWithdrawStep("processing");
    setTimeout(() => {
      // Mark available entries as processing and add a pending row
      setEntries((prev) => {
        let remaining = withdrawnAmount;
        return [
          { id: `w-${Date.now()}`, amount: withdrawnAmount, status: "processing", daysRemaining: null, label: `Withdrawal to ${bankName} — pending`, date: "Today" },
          ...prev.map((e) => {
            if (e.status !== "available" || remaining <= 0) return e;
            if (e.amount <= remaining) { remaining -= e.amount; return { ...e, status: "processing" as EntryStatus }; }
            const leftover = e.amount - remaining;
            remaining = 0;
            return { ...e, amount: leftover };
          }),
        ];
      });
      setWithdrawStep("success");
    }, 1600);
  }

  function handleClose() {
    setWithdrawOpen(false);
    setTimeout(() => setWithdrawStep("amount"), 300);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <StatusBar />
      <ScrollArea style={{ padding: "0 20px 110px" }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <BackButton onPress={() => onNavigate("home")} />
          <Pill color="purple">Kova Wallet</Pill>
        </div>

        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 24px", lineHeight: 1.6 }}>
          Your money never leaves your account — locked funds are yours, held for 30 days then released automatically.
        </p>

        {/* Balance tiles */}
        <SectionLabel>Balances</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <BalanceTile label="Available" amount={`$${available}`} sub="Ready to withdraw" accentColor={C.success} iconBg="rgba(34,197,94,0.10)" icon={Unlock} onClick={available > 0 ? openWithdraw : undefined} />
          <BalanceTile label="Locked" amount={`$${locked}`} sub="Held for 30 days · unlocks automatically" accentColor={C.warning} iconBg="rgba(245,158,11,0.10)" icon={Lock} />
          <BalanceTile label="Voucher credits" amount={`$${vouchers}`} sub="Valid for 90 days · redeemable at checkout" accentColor={C.primary} iconBg="rgba(123,97,255,0.10)" icon={Gift} onClick={() => setVoucherOpen(true)} />
        </div>

        {/* Transaction history */}
        <SectionLabel>History</SectionLabel>
        <Card>
          {entries.map((entry, i) => {
            const cfg = STATUS_CONFIG[entry.status];
            const Icon = cfg.icon;
            return (
              <div key={entry.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: cfg.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden="true">
                    <Icon size={16} color={cfg.iconColor} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.text, margin: "0 0 3px", lineHeight: 1.3 }}>{entry.label}</p>
                    <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                      {entry.date}{entry.daysRemaining !== null && ` · ${entry.daysRemaining} days remaining`}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: entry.status === "locked" ? C.warning : cfg.iconColor }}>${entry.amount}</span>
                    <Pill color={cfg.pill}>{entry.status}</Pill>
                  </div>
                </div>
                {i < entries.length - 1 && <Divider />}
              </div>
            );
          })}
        </Card>

        <p style={{ fontSize: 12, color: C.muted, margin: "16px 0 0", textAlign: "center", lineHeight: 1.6 }}>
          Balance information is private and never shared with your group.
        </p>
      </ScrollArea>

      <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, zIndex: 10 }}>
        <BottomNav active="home" onNavigate={onNavigate} />
      </div>

      {/* ── Withdrawal flow sheet ── */}
      <BottomSheet isOpen={withdrawOpen} onClose={withdrawStep === "processing" ? () => {} : handleClose} title="">
        <AnimatePresence mode="wait" initial={false}>

          {/* Step 1 — Enter amount */}
          {withdrawStep === "amount" && (
            <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Withdraw funds</p>
              <p style={{ fontSize: 13, color: C.muted, margin: "0 0 24px" }}>Transfers to your linked bank account.</p>

              {/* Amount input */}
              <p style={{ fontSize: 12, fontWeight: 500, color: C.muted, margin: "0 0 6px" }}>Amount</p>
              <div style={{ display: "flex", alignItems: "center", border: `2px solid ${inputError ? C.danger : C.primary}`, borderRadius: 14, height: 56, padding: "0 16px", background: "white", marginBottom: 6 }}>
                <span style={{ fontSize: 20, fontWeight: 600, color: C.muted, marginRight: 4 }}>$</span>
                <input
                  type="number"
                  min={1}
                  max={available}
                  value={withdrawInput}
                  onChange={(e) => { setWithdrawInput(e.target.value); setInputError(""); }}
                  autoFocus
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 20, fontWeight: 700, color: C.text, background: "transparent", fontFamily: "inherit" }}
                />
                <button onClick={() => setWithdrawInput(String(available))} style={{ background: "rgba(123,97,255,0.08)", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: C.primary, cursor: "pointer", fontFamily: "inherit" }}>
                  Max
                </button>
              </div>
              {inputError
                ? <p style={{ fontSize: 12, color: C.danger, margin: "0 0 16px" }}>{inputError}</p>
                : <p style={{ fontSize: 12, color: C.muted, margin: "0 0 16px" }}>${available} available</p>
              }

              {/* Destination */}
              <p style={{ fontSize: 12, fontWeight: 500, color: C.muted, margin: "0 0 8px" }}>Sending to</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F9F8FF", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#00C2A8,#0093C4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Building2 size={18} color="white" strokeWidth={1.6} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{bankName}</p>
                  <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Linked account · Read-only</p>
                </div>
              </div>

              {/* Arrival estimate */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, padding: "0 2px" }}>
                <span style={{ fontSize: 13, color: C.muted }}>Estimated arrival</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>1–3 business days</span>
              </div>

              <PrimaryButton onClick={handleAmountNext}>Continue →</PrimaryButton>
            </motion.div>
          )}

          {/* Step 2 — Review */}
          {withdrawStep === "review" && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Review withdrawal</p>
              <p style={{ fontSize: 13, color: C.muted, margin: "0 0 24px" }}>Confirm the details before sending.</p>

              {/* Summary card */}
              <div style={{ background: "linear-gradient(135deg,#9B7FFF 0%,#5B3FDF 100%)", borderRadius: 18, padding: "20px", marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500 }}>Withdrawing</p>
                <p style={{ fontSize: 36, fontWeight: 800, color: "white", margin: "0 0 16px", lineHeight: 1 }}>${withdrawnAmount}</p>
                <div style={{ height: 1, background: "rgba(255,255,255,0.15)", marginBottom: 14 }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>To</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{bankName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>Arrival by</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{arrivalDate()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>Remaining balance</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#86EFAC" }}>${available - withdrawnAmount}</span>
                </div>
              </div>

              <PrimaryButton style={{ marginBottom: 10 }} onClick={handleConfirm}>Confirm withdrawal</PrimaryButton>
              <OutlineButton onClick={() => setWithdrawStep("amount")}>Edit amount</OutlineButton>
            </motion.div>
          )}

          {/* Step 3 — Processing */}
          {withdrawStep === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "32px 0" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                style={{ width: 48, height: 48, border: `3px solid rgba(123,97,255,0.15)`, borderTop: `3px solid ${C.primary}`, borderRadius: "50%", margin: "0 auto 20px" }}
              />
              <p style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>Processing…</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Initiating transfer to your bank</p>
            </motion.div>
          )}

          {/* Step 4 — Success */}
          {withdrawStep === "success" && (
            <motion.div key="success" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ textAlign: "center", padding: "8px 0 0" }}>
              <div style={{ fontSize: 48, margin: "0 0 12px" }}>🎉</div>
              <p style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>Withdrawal requested!</p>
              <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 24px", lineHeight: 1.55 }}>
                <strong>${withdrawnAmount}</strong> is on its way to <strong>{bankName}</strong>.<br />
                Expected by <strong>{arrivalDate()}</strong>.
              </p>

              <div style={{ background: "rgba(34,197,94,0.06)", border: "1.5px solid rgba(34,197,94,0.18)", borderRadius: 14, padding: "12px 16px", marginBottom: 24, textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: C.muted }}>Amount sent</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.success }}>${withdrawnAmount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: C.muted }}>Remaining balance</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>${available}</span>
                </div>
              </div>

              <PrimaryButton onClick={handleClose}>Done</PrimaryButton>
            </motion.div>
          )}

        </AnimatePresence>
      </BottomSheet>

      {/* Voucher redemption sheet */}
      <BottomSheet isOpen={voucherOpen} onClose={() => setVoucherOpen(false)} title="Voucher credits">
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(123,97,255,0.06)", borderRadius: 16, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(123,97,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Gift size={22} color={C.primary} strokeWidth={1.8} />
          </div>
          <div>
            <p style={{ fontSize: 22, fontWeight: 700, color: C.primary, margin: "0 0 2px" }}>${vouchers}</p>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Valid for 90 days</p>
          </div>
        </div>

        <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>How to redeem</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {[
            { n: "1", text: "Shop at any Kova partner store" },
            { n: "2", text: "Select \"Pay with Kova voucher\" at checkout" },
            { n: "3", text: "Your credits are applied instantly — no code needed" },
          ].map(({ n, text }) => (
            <div key={n} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>{n}</span>
              </div>
              <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.55 }}>{text}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#FFFBEB", borderRadius: 12, padding: "10px 14px", marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: "#92400E", margin: 0, lineHeight: 1.55 }}>
            Vouchers expire 90 days after they are earned. Unused credits are forfeited after expiry.
          </p>
        </div>
        <OutlineButton onClick={() => setVoucherOpen(false)}>Got it</OutlineButton>
      </BottomSheet>
    </div>
  );
}

import React, { useState } from "react";
import { Lock, Unlock, Gift } from "lucide-react";
import {
  C,
  StatusBar,
  Card,
  SectionLabel,
  Pill,
  Divider,
  BottomNav,
  BackButton,
  ScrollArea,
  type NavigateFn,
} from "./Shared";

type EntryStatus = "available" | "locked" | "voucher";

interface WalletEntry {
  id: string;
  amount: number;
  status: EntryStatus;
  daysRemaining: number | null;
  label: string;
  date: string;
}

const ENTRIES: WalletEntry[] = [
  {
    id: "e1",
    amount: 50,
    status: "voucher",
    daysRemaining: 83,
    label: "Quest completed — Week 6",
    date: "Jun 23",
  },
  {
    id: "e2",
    amount: 15,
    status: "locked",
    daysRemaining: 18,
    label: "Quest missed — Week 5",
    date: "Jun 16",
  },
  {
    id: "e3",
    amount: 150,
    status: "available",
    daysRemaining: null,
    label: "30-day lock elapsed — Week 2",
    date: "May 28",
  },
  {
    id: "e4",
    amount: 15,
    status: "available",
    daysRemaining: null,
    label: "Quest completed — Week 1",
    date: "May 21",
  },
];

const STATUS_CONFIG: Record<
  EntryStatus,
  { icon: React.ElementType; iconBg: string; iconColor: string; pill: "green" | "amber" | "purple" }
> = {
  available: {
    icon: Unlock,
    iconBg: "rgba(34,197,94,0.10)",
    iconColor: C.success,
    pill: "green",
  },
  locked: {
    icon: Lock,
    iconBg: "rgba(245,158,11,0.10)",
    iconColor: C.warning,
    pill: "amber",
  },
  voucher: {
    icon: Gift,
    iconBg: "rgba(123,97,255,0.10)",
    iconColor: C.primary,
    pill: "purple",
  },
};

function BalanceTile({
  label,
  amount,
  sub,
  accentColor,
  iconBg,
  icon: Icon,
}: {
  label: string;
  amount: string;
  sub: string;
  accentColor: string;
  iconBg: string;
  icon: React.ElementType;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 20,
        padding: 16,
        boxShadow: C.cardShadow,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <Icon size={20} color={accentColor} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: C.muted,
            margin: "0 0 3px",
          }}
        >
          {label}
        </p>
        <p
          style={{ fontSize: 22, fontWeight: 700, color: accentColor, margin: "0 0 2px" }}
          aria-label={`${label}: ${amount}`}
        >
          {amount}
        </p>
        <p style={{ fontSize: 12, color: C.textSecondary, margin: 0 }}>{sub}</p>
      </div>
    </div>
  );
}

export function WalletScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const available = ENTRIES.filter((e) => e.status === "available").reduce(
    (s, e) => s + e.amount,
    0
  );
  const locked = ENTRIES.filter((e) => e.status === "locked").reduce(
    (s, e) => s + e.amount,
    0
  );
  const vouchers = ENTRIES.filter((e) => e.status === "voucher").reduce(
    (s, e) => s + e.amount,
    0
  );

  const [withdrawDone, setWithdrawDone] = useState(false);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}
    >
      <StatusBar />
      <ScrollArea style={{ padding: "0 20px 110px" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <BackButton onPress={() => onNavigate("home")} />
          <Pill color="purple">Kova Wallet</Pill>
        </div>

        {/* Explainer */}
        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 24px", lineHeight: 1.6 }}>
          Your money never leaves your account — locked funds are yours, held for 30 days then
          released automatically.
        </p>

        {/* Balance tiles */}
        <SectionLabel>Balances</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <BalanceTile
            label="Available"
            amount={`$${available}`}
            sub="Ready to withdraw"
            accentColor={C.success}
            iconBg="rgba(34,197,94,0.10)"
            icon={Unlock}
          />
          <BalanceTile
            label="Locked"
            amount={`$${locked}`}
            sub="Held for 30 days · unlocks automatically"
            accentColor={C.warning}
            iconBg="rgba(245,158,11,0.10)"
            icon={Lock}
          />
          <BalanceTile
            label="Voucher credits"
            amount={`$${vouchers}`}
            sub="Valid for 90 days · redeemable at checkout"
            accentColor={C.primary}
            iconBg="rgba(123,97,255,0.10)"
            icon={Gift}
          />
        </div>

        {/* Withdraw CTA — only shown when there's an available balance */}
        {available > 0 && (
          <div style={{ marginBottom: 24 }}>
            {withdrawDone ? (
              <div
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1.5px solid rgba(34,197,94,0.20)",
                  borderRadius: 14,
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                role="status"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8l4 4 6-7"
                    stroke={C.success}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.success }}>
                  Withdrawal initiated
                </span>
              </div>
            ) : (
              <button
                onClick={() => setWithdrawDone(true)}
                style={{
                  width: "100%",
                  height: 52,
                  background: C.primary,
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0px 4px 16px rgba(123,97,255,0.30)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label={`Withdraw ${available} dollars available balance`}
              >
                Withdraw ${available}
              </button>
            )}
          </div>
        )}

        {/* Transaction history */}
        <SectionLabel>History</SectionLabel>
        <Card>
          {ENTRIES.map((entry, i) => {
            const cfg = STATUS_CONFIG[entry.status];
            const Icon = cfg.icon;
            return (
              <div key={entry.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: cfg.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <Icon size={16} color={cfg.iconColor} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: C.text,
                        margin: "0 0 3px",
                        lineHeight: 1.3,
                      }}
                    >
                      {entry.label}
                    </p>
                    <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                      {entry.date}
                      {entry.daysRemaining !== null && ` · ${entry.daysRemaining} days remaining`}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: entry.status === "locked" ? C.warning : cfg.iconColor,
                      }}
                    >
                      ${entry.amount}
                    </span>
                    <Pill color={cfg.pill}>{entry.status}</Pill>
                  </div>
                </div>
                {i < ENTRIES.length - 1 && <Divider />}
              </div>
            );
          })}
        </Card>

        {/* Privacy note */}
        <p
          style={{
            fontSize: 12,
            color: C.muted,
            margin: "16px 0 0",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Balance information is private and never shared with your group.
        </p>
      </ScrollArea>

      <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, zIndex: 10 }}>
        <BottomNav active="home" onNavigate={onNavigate} />
      </div>
    </div>
  );
}

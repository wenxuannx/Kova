import React from "react";
import { Check, Lock, CheckCircle2, Sparkles } from "lucide-react";

const TRUST_POINTS = [
  {
    title: "Always your money",
    desc: "Kova never takes a cent.",
  },
  {
    title: "Always building your goal",
    desc: "Even a missed week moves you forward.",
  },
  {
    title: "Held securely",
    desc: "Partner bank sub-accounts, not Kova's balance sheet.",
  },
];

const WALLET_ROWS = [
  {
    Icon: Lock,
    iconColor: "#7B61FF",
    iconBg: "rgba(123,97,255,0.10)",
    label: "Locked — quest missed",
    sub: "unlocks Jan 27",
    amount: "$15",
    amountColor: "#EF4444",
  },
  {
    Icon: CheckCircle2,
    iconColor: "#22C55E",
    iconBg: "rgba(34,197,94,0.10)",
    label: "Available",
    sub: null,
    amount: "$120",
    amountColor: "#22C55E",
  },
  {
    Icon: Sparkles,
    iconColor: "#7B61FF",
    iconBg: "rgba(123,97,255,0.10)",
    label: "Voucher credit",
    sub: "from completed quests",
    amount: "$50",
    amountColor: "#7B61FF",
  },
];

export function EthicalMechanic() {
  return (
    <section style={{ background: "white" }}>
      <div
        style={{ maxWidth: 1440, margin: "0 auto", padding: "120px 80px" }}
        className="px-5 md:px-[80px] py-16 md:py-[120px]"
      >
        <div
          className="flex flex-col md:flex-row"
          style={{ gap: 80, alignItems: "center" }}
        >
          {/* ── Left column ── */}
          <div className="w-full md:w-1/2">
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#6B7280",
                margin: "0 0 20px",
              }}
            >
              The mechanic
            </p>
            <h2
              style={{
                fontSize: "clamp(26px, 2.8vw, 36px)",
                fontWeight: 800,
                color: "#1A1A2E",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                margin: "0 0 20px",
              }}
            >
              Your money never leaves your orbit.
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#6B7280",
                lineHeight: 1.75,
                margin: "0 0 36px",
                maxWidth: 520,
              }}
            >
              When you miss a quest, your stake isn't sent to a charity, taken by Kova, or given
              to your friends. It locks into your own savings pot for 30 days. The punishment is
              illiquidity, not loss. The worst case scenario is still progress.
            </p>

            {/* Trust points */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {TRUST_POINTS.map((p) => (
                <div key={p.title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#7B61FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <Check size={14} color="white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1A2E", margin: "0 0 3px" }}>
                      {p.title}
                    </p>
                    <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column — Wallet card ── */}
          <div className="w-full md:w-1/2">
            <div
              style={{
                background: "white",
                borderRadius: 20,
                padding: "28px",
                boxShadow: "0px 8px 40px rgba(123,97,255,0.16)",
                border: "1px solid rgba(123,97,255,0.08)",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <p style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E", margin: 0 }}>
                  Kova wallet
                </p>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#16A34A",
                    background: "rgba(34,197,94,0.10)",
                    padding: "4px 12px",
                    borderRadius: 50,
                  }}
                >
                  Secure
                </span>
              </div>

              {/* Wallet rows */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {WALLET_ROWS.map((row, i) => (
                  <div key={row.label}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "16px 0",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          background: row.iconBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <row.Icon size={18} color={row.iconColor} strokeWidth={1.8} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1A2E", margin: 0 }}>
                          {row.label}
                        </p>
                        {row.sub && (
                          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "3px 0 0" }}>
                            {row.sub}
                          </p>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: row.amountColor,
                          margin: 0,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {row.amount}
                      </p>
                    </div>
                    {i < WALLET_ROWS.length - 1 && (
                      <div style={{ height: 1, background: "rgba(123,97,255,0.07)" }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                style={{
                  borderTop: "1px solid rgba(123,97,255,0.07)",
                  paddingTop: 16,
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  🏦
                </div>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
                  Partner bank: <strong style={{ color: "#6B7280" }}>DBS Singapore</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

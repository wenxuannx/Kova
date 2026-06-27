import React from "react";
import { Sparkles, Clock } from "lucide-react";

const SPEND_ROWS = [
  { label: "Food delivery", amount: "$127", pct: 100, color: "#EF4444", badge: "Highest leak ↑", badgeColor: "#D97706", badgeBg: "rgba(245,158,11,0.12)" },
  { label: "Subscriptions", amount: "$84", pct: 66, color: "#7B61FF", badge: null, badgeColor: "", badgeBg: "" },
  { label: "Dining out", amount: "$61", pct: 48, color: "#8B5CF6", badge: null, badgeColor: "", badgeBg: "" },
  { label: "Transport", amount: "$38", pct: 30, color: "#22C55E", badge: null, badgeColor: "", badgeBg: "" },
];

const AI_PILLS = [
  "Adjusts difficulty with your streak",
  "Diagnoses behavioural patterns",
  "Never repeats the same category twice",
];

export function AIQuestEngine() {
  return (
    <section style={{ background: "#F0EFFE" }}>
      <div
        style={{ maxWidth: 1440, margin: "0 auto", padding: "120px 80px" }}
        className="px-5 md:px-[80px] py-16 md:py-[120px]"
      >
        {/* Label + heading */}
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 52px" }}>
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
            The AI layer
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 800,
              color: "#1A1A2E",
              letterSpacing: "-0.02em",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            Not a template list.
            <br />
            An engine that reads your life.
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>
            The quest engine analyses your actual spending patterns and generates a challenge
            calibrated to what you can actually achieve this specific week.
          </p>
        </div>

        {/* Main card */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "32px",
            boxShadow: "0px 8px 40px rgba(123,97,255,0.14)",
            maxWidth: 900,
            margin: "0 auto 32px",
          }}
        >
          <div
            className="flex flex-col md:flex-row"
            style={{ gap: 0 }}
          >
            {/* Left: Spending data */}
            <div className="w-full md:w-1/2" style={{ paddingRight: 0 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#9CA3AF",
                  margin: "0 0 20px",
                }}
              >
                Your spending data
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {SPEND_ROWS.map((row) => (
                  <div key={row.label}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#1A1A2E" }}>{row.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {row.badge && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 500,
                              color: row.badgeColor,
                              background: row.badgeBg,
                              padding: "2px 8px",
                              borderRadius: 50,
                            }}
                          >
                            {row.badge}
                          </span>
                        )}
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>
                          {row.amount}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 50,
                        background: "#F3F4F6",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${row.pct}%`,
                          background: row.color,
                          borderRadius: 50,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical divider */}
            <div
              className="hidden md:block"
              style={{
                width: 1,
                background: "rgba(123,97,255,0.08)",
                margin: "0 32px",
                flexShrink: 0,
              }}
            />

            {/* Right: AI quest */}
            <div className="w-full md:w-1/2 mt-6 md:mt-0">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(123,97,255,0.10)",
                  color: "#7B61FF",
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "4px 12px",
                  borderRadius: 50,
                  marginBottom: 16,
                }}
              >
                <Sparkles size={11} />
                AI-generated quest
              </div>

              {/* Quest card */}
              <div
                style={{
                  background: "white",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: "1.5px solid rgba(123,97,255,0.10)",
                  borderLeft: "4px solid #7B61FF",
                  boxShadow: "0px 2px 12px rgba(123,97,255,0.08)",
                }}
              >
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1A1A2E",
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                  }}
                >
                  Cut food delivery to under $60
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    margin: "0 0 16px",
                    lineHeight: 1.6,
                  }}
                >
                  You spent $127 on delivery last month — your biggest controllable leak.
                  Transfer the $67 difference to your vault before Sunday.
                </p>
                <div style={{ display: "flex", gap: 8 }}>
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
                    Saves you $67
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#6B7280",
                      background: "#F3F4F6",
                      padding: "4px 12px",
                      borderRadius: 50,
                    }}
                  >
                    <Clock size={11} />7 days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI capability pills */}
        <div
          className="flex flex-col sm:flex-row"
          style={{ gap: 10, justifyContent: "center", alignItems: "center" }}
        >
          {AI_PILLS.map((pill) => (
            <div
              key={pill}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "white",
                border: "1.5px solid #7B61FF",
                borderRadius: 50,
                padding: "8px 18px",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#7B61FF",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12, color: "#6B7280" }}>{pill}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

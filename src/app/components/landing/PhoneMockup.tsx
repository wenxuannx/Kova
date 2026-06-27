import React from "react";

// ─── Mini Dashboard screen ─────────────────────────────────────────────────────
function DashboardContent() {
  return (
    <div style={{ padding: "34px 14px 16px", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #9B7FFF, #5B3FDF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "white", fontSize: 9, fontWeight: 700 }}>JL</span>
        </div>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: "#1A1A2E" }}>
          Hello, James
        </span>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 6px rgba(123,97,255,0.15)",
            position: "relative",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
              stroke="#1A1A2E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 01-3.46 0"
              stroke="#1A1A2E"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 6,
              height: 6,
              background: "#EF4444",
              borderRadius: "50%",
              border: "1px solid #F0EFFE",
            }}
          />
        </div>
      </div>

      {/* Balance */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: "12px",
          marginBottom: 10,
          boxShadow: "0px 2px 10px rgba(123,97,255,0.10)",
        }}
      >
        <p
          style={{
            fontSize: 8,
            fontWeight: 500,
            color: "#9CA3AF",
            margin: "0 0 3px",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          Total Balance
        </p>
        <p style={{ fontSize: 22, fontWeight: 700, color: "#1A1A2E", margin: "0 0 2px", lineHeight: 1 }}>
          $1,200
        </p>
        <p style={{ fontSize: 9, color: "#9CA3AF", margin: 0 }}>target by Dec 31</p>
      </div>

      {/* Vault card */}
      <div
        style={{
          background: "linear-gradient(135deg, #9B7FFF 0%, #5B3FDF 100%)",
          borderRadius: 14,
          padding: "12px 14px",
          marginBottom: 10,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -16,
            right: -16,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <p style={{ fontSize: 8, color: "rgba(255,255,255,0.85)", margin: "0 0 14px", fontWeight: 500 }}>
          Emergency fund
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>$696 / $1,200</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>58%</span>
        </div>
      </div>

      {/* Streak */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: "8px 10px",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0px 2px 8px rgba(123,97,255,0.08)",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "#FEF3C7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14 }}>🔥</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#1A1A2E", margin: 0 }}>
            6-week streak
          </p>
          <p style={{ fontSize: 8, color: "#9CA3AF", margin: 0 }}>keep it going</p>
        </div>
        <span
          style={{
            fontSize: 8,
            color: "#16A34A",
            background: "rgba(34,197,94,0.12)",
            padding: "2px 7px",
            borderRadius: 50,
            fontWeight: 500,
          }}
        >
          on track
        </span>
      </div>

      {/* Quest */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: "10px",
          boxShadow: "0px 2px 8px rgba(123,97,255,0.08)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span
            style={{
              fontSize: 8,
              color: "#7B61FF",
              background: "rgba(123,97,255,0.10)",
              padding: "2px 7px",
              borderRadius: 50,
              fontWeight: 500,
            }}
          >
            ✦ AI quest
          </span>
          <span
            style={{
              fontSize: 8,
              color: "#D97706",
              background: "rgba(245,158,11,0.12)",
              padding: "2px 7px",
              borderRadius: 50,
              fontWeight: 500,
            }}
          >
            3 days left
          </span>
        </div>
        <p style={{ fontSize: 10, fontWeight: 600, color: "#1A1A2E", margin: "0 0 3px", lineHeight: 1.3 }}>
          Cut food delivery to under $60
        </p>
        <p style={{ fontSize: 8, color: "#9CA3AF", margin: 0 }}>Reward: $50 voucher</p>
      </div>
    </div>
  );
}

// ─── Mini Group screen ─────────────────────────────────────────────────────────
function GroupContent() {
  const members = [
    {
      initials: "JL",
      bg: "linear-gradient(135deg, #9B7FFF, #5B3FDF)",
      name: "You",
      dots: ["g", "g", "g", "g", "g", "g", "e"],
      status: "on track",
      statusColor: "#16A34A",
      statusBg: "rgba(34,197,94,0.12)",
    },
    {
      initials: "SR",
      bg: "linear-gradient(135deg, #2DD4BF, #0D9488)",
      name: "Sarah R.",
      dots: ["g", "g", "g", "g", "g", "r", "e"],
      status: "on track",
      statusColor: "#16A34A",
      statusBg: "rgba(34,197,94,0.12)",
    },
    {
      initials: "MT",
      bg: "linear-gradient(135deg, #FCD34D, #F59E0B)",
      name: "Marcus T.",
      dots: ["g", "r", "g", "g", "r", "r", "e"],
      status: "behind",
      statusColor: "#D97706",
      statusBg: "rgba(245,158,11,0.12)",
    },
  ];

  return (
    <div style={{ padding: "34px 14px 16px", height: "100%", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#7B61FF" }}>← Back</span>
        <span
          style={{
            fontSize: 8,
            color: "#7B61FF",
            background: "rgba(123,97,255,0.10)",
            padding: "2px 7px",
            borderRadius: 50,
            fontWeight: 500,
          }}
        >
          Week 7
        </span>
      </div>

      <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", margin: "0 0 3px" }}>
        Emergency pact
      </p>
      <p style={{ fontSize: 9, color: "#9CA3AF", margin: "0 0 14px" }}>3 members · 7 weeks</p>

      {/* Stats */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[
          ["$50", "pool", "#1A1A2E"],
          ["6", "streak", "#7B61FF"],
          ["83%", "done", "#22C55E"],
        ].map(([v, l, c]) => (
          <div
            key={l}
            style={{
              flex: 1,
              background: "white",
              borderRadius: 10,
              padding: "7px 5px",
              textAlign: "center",
              boxShadow: "0px 2px 8px rgba(123,97,255,0.10)",
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 700, color: c, margin: "0 0 1px" }}>{v}</p>
            <p style={{ fontSize: 7, color: "#9CA3AF", margin: 0 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Members */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0px 2px 8px rgba(123,97,255,0.10)",
        }}
      >
        {members.map((m, i) => (
          <div
            key={m.initials}
            style={{
              padding: "9px 12px",
              borderBottom: i < 2 ? "1px solid rgba(123,97,255,0.06)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: m.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 7, fontWeight: 700, color: "white" }}>{m.initials}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: "#1A1A2E", margin: "0 0 3px" }}>
                  {m.name}
                </p>
                <div style={{ display: "flex", gap: 2 }}>
                  {m.dots.map((d, j) => (
                    <div
                      key={j}
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background:
                          d === "g" ? "#22C55E" : d === "r" ? "#EF4444" : "transparent",
                        border: d === "e" ? "1px solid #D1D5DB" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
              <span
                style={{
                  fontSize: 7,
                  fontWeight: 500,
                  color: m.statusColor,
                  background: m.statusBg,
                  padding: "2px 5px",
                  borderRadius: 50,
                }}
              >
                {m.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Phone frame ───────────────────────────────────────────────────────────────
export function PhoneMockup({
  variant = "dashboard",
  tilt = 0,
  width = 270,
}: {
  variant?: "dashboard" | "group";
  tilt?: number;
  width?: number;
}) {
  const height = Math.round(width * 2.1);
  const radius = Math.round(width * 0.148);
  const inset = Math.round(width * 0.011);

  return (
    <div
      style={{
        width,
        height,
        background: "linear-gradient(160deg, #2C2C2E, #1C1C1E)",
        borderRadius: radius,
        boxShadow: `0 40px 80px rgba(91,63,223,0.28), 0 16px 32px rgba(0,0,0,0.20), 0 0 0 1px rgba(255,255,255,0.07)`,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        transform: tilt !== 0 ? `rotate(${tilt}deg)` : undefined,
      }}
    >
      {/* Side button */}
      <div
        style={{
          position: "absolute",
          right: -2,
          top: "20%",
          width: 3,
          height: "8%",
          background: "#3A3A3C",
          borderRadius: "0 2px 2px 0",
        }}
      />
      {["-14%", "-8%"].map((top) => (
        <div
          key={top}
          style={{
            position: "absolute",
            left: -2,
            top,
            width: 3,
            height: "5%",
            background: "#3A3A3C",
            borderRadius: "2px 0 0 2px",
          }}
        />
      ))}

      {/* Screen */}
      <div
        style={{
          position: "absolute",
          inset,
          borderRadius: radius - inset,
          background: "#F0EFFE",
          overflow: "hidden",
        }}
      >
        {/* Dynamic island */}
        <div
          style={{
            position: "absolute",
            top: Math.round(width * 0.033),
            left: "50%",
            transform: "translateX(-50%)",
            width: Math.round(width * 0.333),
            height: Math.round(width * 0.089),
            background: "#1C1C1E",
            borderRadius: Math.round(width * 0.052),
            zIndex: 10,
          }}
        />
        {/* Home indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            width: Math.round(width * 0.37),
            height: 4,
            background: "rgba(26,26,46,0.20)",
            borderRadius: 2,
            zIndex: 10,
          }}
        />
        {variant === "dashboard" ? <DashboardContent /> : <GroupContent />}
      </div>

      {/* Glare */}
      <div
        style={{
          position: "absolute",
          inset,
          borderRadius: radius - inset,
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </div>
  );
}

import React, { useState } from "react";

const STEPS = [
  {
    n: "01",
    title: "Set a goal",
    body: "Savings target, no-spend challenge, debt payoff, or investment habit. You choose what matters.",
  },
  {
    n: "02",
    title: "Stake the pool",
    body: "Your group each contributes $10–$25 per week. Skin in the game — together.",
  },
  {
    n: "03",
    title: "AI assigns your quest",
    body: "Each Monday, AI generates a personalised weekly challenge based on your actual spending patterns.",
  },
  {
    n: "04",
    title: "Complete or redirect",
    body: "Finish and unlock your reward. Miss and your stake locks into your own savings pot for 30 days.",
  },
];

function StepCard({ n, title, body }: { n: string; title: string; body: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        background: "white",
        borderRadius: 20,
        padding: "32px 28px",
        boxShadow: hovered
          ? "0px 12px 40px rgba(123,97,255,0.18)"
          : "0px 4px 24px rgba(123,97,255,0.10)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
      }}
    >
      {/* Step number circle */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #9B7FFF, #5B3FDF)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <span style={{ color: "white", fontSize: 16, fontWeight: 700, letterSpacing: "0.02em" }}>
          {n}
        </span>
      </div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#1A1A2E",
          margin: "0 0 10px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 14, color: "#6B7280", margin: 0, lineHeight: 1.65 }}>{body}</p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section style={{ background: "#F0EFFE" }}>
      <div
        style={{ maxWidth: 1440, margin: "0 auto" }}
        className="px-5 md:px-[80px] py-16 md:py-[120px]"
      >
        {/* Label + heading */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
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
            How it works
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 800,
              color: "#1A1A2E",
              letterSpacing: "-0.02em",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Four steps. One habit. Every week.
          </h2>
        </div>

        {/* Step cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: 20, marginBottom: 36 }}
        >
          {STEPS.map((s) => (
            <StepCard key={s.n} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

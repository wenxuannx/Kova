import React, { useState } from "react";

const STATS = [
  {
    number: "73%",
    label: "of Gen Z want to save more but don't follow through",
  },
  {
    number: "68%",
    label: "have no emergency fund despite intending to start one",
  },
  {
    number: "2×",
    label: "more likely to reach a goal with social accountability",
  },
];

function StatCard({ number, label }: { number: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        background: "white",
        borderRadius: 20,
        padding: "36px 28px",
        boxShadow: hovered
          ? "0px 12px 40px rgba(123,97,255,0.18)"
          : "0px 4px 24px rgba(123,97,255,0.10)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        textAlign: "center",
        cursor: "default",
      }}
    >
      <p
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: "#7B61FF",
          margin: "0 0 12px",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {number}
      </p>
      <p
        style={{
          fontSize: 14,
          color: "#6B7280",
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        {label}
      </p>
    </div>
  );
}

export function Problem() {
  return (
    <section style={{ background: "white" }}>
      <div
        style={{ maxWidth: 1440, margin: "0 auto" }}
        className="px-5 md:px-[80px] py-16 md:py-[120px]"
      >
        {/* Label + heading */}
        <div style={{ textAlign: "center", maxWidth: 860, margin: "0 auto 56px" }}>
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
            The problem
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 800,
              color: "#1A1A2E",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              margin: "0 0 20px",
            }}
          >
            You already know what to do.
            <br />
            The problem is doing it.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#6B7280",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Every financial app solves the knowledge problem. Budgeting tools track your
            spending. Frameworks give you a plan. Analytics show your patterns. None of them
            solve the behaviour problem.
          </p>
        </div>

        {/* Stat cards */}
        <div
          className="flex flex-col md:flex-row"
          style={{ gap: 20, maxWidth: 960, margin: "0 auto 28px" }}
        >
          {STATS.map((s) => (
            <StatCard key={s.number} {...s} />
          ))}
        </div>

              </div>
    </section>
  );
}

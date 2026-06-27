import React, { useState } from "react";

const QUOTES = [
  {
    text: "I've tried every budgeting app. Kova is the first one that made me actually feel something when I missed a week. In a good way.",
    name: "Sarah R.",
    role: "Designer, 28",
    initials: "SR",
    bg: "linear-gradient(135deg, #2DD4BF, #0D9488)",
  },
  {
    text: "The AI quest for week 3 called out exactly what I was doing with food delivery. I saved $340 in 6 weeks without feeling deprived.",
    name: "Marcus T.",
    role: "Engineer, 24",
    initials: "MT",
    bg: "linear-gradient(135deg, #FCD34D, #F59E0B)",
  },
  {
    text: "My friend group all joined the same vault. We haven't missed a combined streak in 9 weeks. It became a thing.",
    name: "Priya K.",
    role: "Graduate student, 23",
    initials: "PK",
    bg: "linear-gradient(135deg, #9B7FFF, #5B3FDF)",
  },
];

function Stars() {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ fontSize: 14, color: "#FBBF24" }}>
          ★
        </span>
      ))}
    </div>
  );
}

function QuoteCard({ text, name, role, initials, bg }: (typeof QUOTES)[0]) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        minWidth: 280,
        background: "white",
        borderRadius: 20,
        padding: "28px 24px",
        boxShadow: hovered
          ? "0px 12px 40px rgba(123,97,255,0.18)"
          : "0px 4px 24px rgba(123,97,255,0.10)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <Stars />
      <p
        style={{
          fontSize: 14,
          color: "#1A1A2E",
          lineHeight: 1.75,
          fontStyle: "italic",
          margin: "0 0 20px",
          flex: 1,
        }}
      >
        "{text}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>{initials}</span>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E", margin: 0 }}>{name}</p>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>{role}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section style={{ background: "#F0EFFE" }}>
      <div
        style={{ maxWidth: 1440, margin: "0 auto", padding: "100px 80px" }}
        className="px-5 md:px-[80px] py-16 md:py-[100px]"
      >
        {/* Label + heading */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
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
            What people say
          </p>
          <h2
            style={{
              fontSize: "clamp(26px, 2.8vw, 36px)",
              fontWeight: 800,
              color: "#1A1A2E",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Finally followed through.
          </h2>
        </div>

        {/* Cards */}
        <div
          className="flex flex-col md:flex-row overflow-x-auto"
          style={{ gap: 20 }}
        >
          {QUOTES.map((q) => (
            <QuoteCard key={q.name} {...q} />
          ))}
        </div>
      </div>
    </section>
  );
}

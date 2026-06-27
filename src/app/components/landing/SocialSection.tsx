import React from "react";
import { motion } from "motion/react";
import { PhoneMockup } from "./PhoneMockup";

const PRIVACY_ROWS = [
  { sees: "Your streak pips", private: "Exact balance" },
  { sees: "Completion badge", private: "Transaction history" },
  { sees: "Week-by-week history", private: "Quest details" },
  { sees: "Rescheduled status", private: "Amounts saved" },
];

export function SocialSection() {
  return (
    <section style={{ background: "white" }}>
      <div
        style={{ maxWidth: 1440, margin: "0 auto", padding: "120px 80px" }}
        className="px-5 md:px-[80px] py-16 md:py-[120px]"
      >
        <div
          className="flex flex-col-reverse md:flex-row"
          style={{ gap: 80, alignItems: "center" }}
        >
          {/* ── Left: Phone mockup ── */}
          <div
            className="w-full md:w-1/2 flex justify-center"
            style={{ position: "relative" }}
          >
            {/* Blob */}
            <div
              style={{
                position: "absolute",
                top: "10%",
                left: "5%",
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "#7B61FF",
                opacity: 0.07,
                filter: "blur(70px)",
                pointerEvents: "none",
              }}
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <PhoneMockup variant="group" tilt={2} width={260} />
            </motion.div>
          </div>

          {/* ── Right: Copy ── */}
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
              The social layer
            </p>
            <h2
              style={{
                fontSize: "clamp(26px, 2.8vw, 36px)",
                fontWeight: 800,
                color: "#1A1A2E",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                margin: "0 0 20px",
              }}
            >
              Your group sees your streak.
              <br />
              Not your balance.
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#6B7280",
                lineHeight: 1.75,
                margin: "0 0 32px",
              }}
            >
              Group members see whether you completed your quest this week — nothing more. No
              transaction history, no exact amounts, no private data. Just a streak that tells
              them everything they need to know.
            </p>

            {/* Privacy table */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0px 4px 20px rgba(123,97,255,0.10)",
                border: "1px solid rgba(123,97,255,0.08)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                <div
                  style={{
                    padding: "12px 20px",
                    background: "rgba(34,197,94,0.06)",
                    borderBottom: "1px solid rgba(123,97,255,0.07)",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#16A34A" }}>
                    What your group sees ✓
                  </span>
                </div>
                <div
                  style={{
                    padding: "12px 20px",
                    background: "#F9FAFB",
                    borderBottom: "1px solid rgba(123,97,255,0.07)",
                    borderLeft: "1px solid rgba(123,97,255,0.07)",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
                    What stays private
                  </span>
                </div>
              </div>
              {/* Rows */}
              {PRIVACY_ROWS.map((row, i) => (
                <div
                  key={i}
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
                >
                  <div
                    style={{
                      padding: "12px 20px",
                      borderBottom:
                        i < PRIVACY_ROWS.length - 1
                          ? "1px solid rgba(123,97,255,0.06)"
                          : "none",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#1A1A2E" }}>{row.sees}</span>
                  </div>
                  <div
                    style={{
                      padding: "12px 20px",
                      borderLeft: "1px solid rgba(123,97,255,0.06)",
                      borderBottom:
                        i < PRIVACY_ROWS.length - 1
                          ? "1px solid rgba(123,97,255,0.06)"
                          : "none",
                      background: "#FAFAFA",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#9CA3AF" }}>{row.private}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

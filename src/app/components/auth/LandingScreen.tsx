import React from "react";
import { motion } from "motion/react";
import { C, PrimaryButton, OutlineButton } from "../vault/Shared";
import kovaLogo from "../../../imgs/kova_logo.png";

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const FEATURES = [
  {
    emoji: "🎯",
    title: "AI-generated quests",
    desc: "Weekly spending challenges tailored to your habits",
  },
  {
    emoji: "👥",
    title: "Group accountability",
    desc: "Friends keep each other on track — streaks, stakes, results",
  },
  {
    emoji: "🔒",
    title: "Loss aversion by design",
    desc: "Miss a quest and your stake is locked for 30 days",
  },
];

export function LandingScreen({ onGetStarted, onSignIn }: Props) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        position: "relative",
      }}
      className="vault-scroll"
    >
      {/* ── Hero gradient block ── */}
      <div
        style={{
          background: `linear-gradient(160deg, #7B61FF 0%, #5B3FDF 60%, #4230B0 100%)`,
          padding: "0 28px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Status-bar spacer */}
        <div style={{ height: "max(env(safe-area-inset-top, 0px), 32px)", flexShrink: 0 }} />

        {/* Logo — white tint via brightness filter on the purple bg */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ marginBottom: 36, marginTop: 12 }}
        >
          <img
            src={kovaLogo}
            alt="Kova"
            style={{
              width: 140,
              height: "auto",
              filter: "brightness(0) invert(1)",
              opacity: 0.95,
            }}
          />
        </motion.div>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ textAlign: "center" }}
        >
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "white",
              margin: "0 0 12px",
              lineHeight: 1.15,
              letterSpacing: "-0.6px",
            }}
          >
            Your money,
            <br />
            your group,
            <br />
            your goal.
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.80)",
              margin: 0,
              lineHeight: 1.65,
              maxWidth: 300,
            }}
          >
            Turn your friend group into a financial accountability system — powered by AI quests and real stakes.
          </p>
        </motion.div>

        {/* Decorative circles */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 40,
            left: -80,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Wave divider ── */}
      <div style={{ marginTop: -1, lineHeight: 0, flexShrink: 0 }}>
        <svg viewBox="0 0 480 40" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 40 }}>
          <path d="M0,20 C120,40 360,0 480,20 L480,40 L0,40 Z" fill={C.bg} />
        </svg>
      </div>

      {/* ── Feature list ── */}
      <div style={{ padding: "4px 24px 28px", flex: 1 }}>
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.18 + i * 0.08,
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              background: "white",
              borderRadius: 16,
              padding: "14px 16px",
              marginBottom: 10,
              boxShadow: C.cardShadow,
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.3 }}>{f.emoji}</span>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.text,
                  margin: "0 0 3px",
                }}
              >
                {f.title}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: C.textSecondary,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CTAs ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ padding: "0 24px", flexShrink: 0 }}
      >
        <PrimaryButton onClick={onGetStarted}>
          Get started →
        </PrimaryButton>

        <OutlineButton onClick={onSignIn} style={{ marginTop: 12 }}>
          Sign in
        </OutlineButton>

        <p
          style={{
            fontSize: 11,
            color: C.muted,
            textAlign: "center",
            margin: "16px 0 0",
            lineHeight: 1.5,
          }}
        >
          Bank connection powered by Plaid · Read-only access
        </p>
      </motion.div>

      {/* Bottom safe-area spacer */}
      <div style={{ height: "max(env(safe-area-inset-bottom, 0px), 28px)", flexShrink: 0 }} />
    </div>
  );
}

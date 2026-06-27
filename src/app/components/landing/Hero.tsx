import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { PhoneMockup } from "./PhoneMockup";

interface HeroProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function Hero({ onGetStarted, onSignIn }: HeroProps) {
  return (
    <section style={{ background: "#F0EFFE", minHeight: 780, overflow: "hidden" }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: 780,
          display: "flex",
          alignItems: "center",
          padding: "0 80px",
          gap: 40,
        }}
        className="flex-col md:flex-row px-5 md:px-[80px] py-16 md:py-0"
      >
        {/* ── Left column ── */}
        <div
          className="w-full md:w-[55%]"
          style={{ display: "flex", flexDirection: "column", gap: 28 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#EDE9FF",
                color: "#7B61FF",
                fontSize: 11,
                fontWeight: 500,
                padding: "6px 14px",
                borderRadius: 50,
                letterSpacing: "0.02em",
              }}
            >
              <Sparkles size={12} color="#7B61FF" />
              AI-powered financial accountability
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 800,
              color: "#1A1A2E",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Your friend group is the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #7B61FF, #4B3FBF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              best financial tool
            </span>{" "}
            you're not using.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: 18,
              color: "#6B7280",
              lineHeight: 1.65,
              maxWidth: 480,
              margin: 0,
            }}
          >
            Kova combines social commitment contracts, loss aversion, and AI-generated
            challenges to help you follow through on financial goals you already want to achieve.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row"
            style={{ gap: 12 }}
          >
            <button
              onClick={onGetStarted}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#7B61FF",
                color: "white",
                fontSize: 15,
                fontWeight: 600,
                border: "none",
                borderRadius: 50,
                height: 52,
                padding: "0 28px",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 20px rgba(123,97,255,0.38)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(123,97,255,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(123,97,255,0.38)";
              }}
            >
              Start for free
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onSignIn}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "white",
                color: "#1A1A2E",
                fontSize: 15,
                fontWeight: 500,
                border: "1.5px solid #E5E7EB",
                borderRadius: 50,
                height: 52,
                padding: "0 28px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "border-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#7B61FF")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
            >
              Sign in
            </button>
          </motion.div>

        </div>

        {/* ── Right column — Phone mockup ── */}
        <div
          className="w-full md:w-[45%] hidden md:flex"
          style={{ justifyContent: "center", alignItems: "center", position: "relative", minHeight: 600 }}
        >
          {/* Background blobs */}
          <div
            style={{
              position: "absolute",
              top: "5%",
              right: "-5%",
              width: 380,
              height: 380,
              borderRadius: "50%",
              background: "#7B61FF",
              opacity: 0.08,
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              left: "5%",
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "#4B3FBF",
              opacity: 0.07,
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "40%",
              right: "15%",
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "#9B7FFF",
              opacity: 0.06,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          {/* Floating phone */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <PhoneMockup variant="dashboard" tilt={-3} width={280} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

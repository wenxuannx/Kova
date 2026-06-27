import React from "react";
import { Shield, Lock, EyeOff, ArrowRight } from "lucide-react";

const TRUST = [
  { Icon: Shield, label: "Bank-grade security" },
  { Icon: Lock, label: "Read-only access" },
  { Icon: EyeOff, label: "Never sells your data" },
];

interface CTABannerProps {
  onGetStarted: () => void;
}

export function CTABanner({ onGetStarted }: CTABannerProps) {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #7B61FF 0%, #4B3FBF 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "absolute",
          top: "-30%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-5%",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "100px 80px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
        className="px-5 md:px-[80px] py-16 md:py-[100px]"
      >
        <h2
          style={{
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            margin: "0 0 16px",
          }}
        >
          Your goals are already there.
          <br />
          Now make them stick.
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.80)",
            margin: "0 auto 40px",
            maxWidth: 460,
            lineHeight: 1.65,
          }}
        >
          Start free. No credit card required.
          <br />
          Your first quest is ready in 2 minutes.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row justify-center"
          style={{ gap: 12, marginBottom: 40 }}
        >
          <button
            onClick={onGetStarted}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "white",
              color: "#7B61FF",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              borderRadius: 50,
              height: 52,
              padding: "0 32px",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Get started free
            <ArrowRight size={16} />
          </button>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              color: "white",
              fontSize: 15,
              fontWeight: 500,
              border: "1.5px solid rgba(255,255,255,0.50)",
              borderRadius: 50,
              height: 52,
              padding: "0 32px",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "border-color 0.15s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.85)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.50)")
            }
          >
            See how it works
          </button>
        </div>

        {/* Trust row */}
        <div
          className="flex flex-col sm:flex-row justify-center"
          style={{ gap: 28, alignItems: "center" }}
        >
          {TRUST.map(({ Icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                color: "rgba(255,255,255,0.80)",
                fontSize: 12,
              }}
            >
              <Icon size={14} color="rgba(255,255,255,0.80)" strokeWidth={1.8} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

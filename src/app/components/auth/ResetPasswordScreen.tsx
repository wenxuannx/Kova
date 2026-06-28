import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, CheckCircle } from "lucide-react";
import { C, PrimaryButton } from "../vault/Shared";
import { useAuth } from "../../context/AuthContext";
import kovaLogo from "../../../imgs/kova_logo.png";

interface Props {
  onGoBack: () => void;
}

function fieldContainer(hasError: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    border: `1.5px solid ${hasError ? C.danger : "rgba(123,97,255,0.22)"}`,
    borderRadius: 14,
    background: "white",
    height: 54,
    marginTop: 6,
    overflow: "hidden",
    transition: "border-color 0.15s",
  };
}

const iconSlot: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "0 10px 0 16px",
  flexShrink: 0,
};

const inputEl: React.CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: 15,
  color: C.text,
  background: "transparent",
  padding: "0 16px 0 0",
  fontFamily: "inherit",
  minWidth: 0,
};

export function ResetPasswordScreen({ onGoBack }: Props) {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function validate() {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address";
    return "";
  }

  async function handleSubmit() {
    const err = validate();
    setEmailError(err);
    setApiError(null);
    if (err) return;
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (!result.ok) {
      setApiError(result.error ?? "Something went wrong. Please try again.");
    } else {
      setSent(true);
    }
  }

  return (
    <div
      style={{ height: "100%", display: "flex", flexDirection: "column", overflowY: "auto", padding: "0 24px" }}
      className="vault-scroll"
    >
      <div style={{ height: "max(env(safe-area-inset-top, 0px), 28px)", flexShrink: 0 }} />

      {/* Back */}
      <div style={{ marginBottom: 4 }}>
        <button
          type="button"
          onClick={onGoBack}
          aria-label="Go back"
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "4px 0", minHeight: 44, color: C.primary }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>Back</span>
        </button>
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20, marginBottom: 32 }}
      >
        <img src={kovaLogo} alt="Kova" style={{ width: 160, height: "auto", mixBlendMode: "multiply" }} />
        <p style={{ fontSize: 11, fontWeight: 600, color: C.primary, margin: "6px 0 0", letterSpacing: "0.13em" }}>
          GOALS. TOGETHER.
        </p>
      </motion.div>

      {sent ? (
        /* ── Success state ── */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ textAlign: "center", padding: "20px 0" }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <CheckCircle size={52} color={C.primary} strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 10px" }}>
            Check your email
          </h2>
          <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, margin: "0 0 32px" }}>
            We sent a password reset link to{" "}
            <strong style={{ color: C.text }}>{email}</strong>.
            <br />
            The link expires in 1 hour.
          </p>
          <p style={{ fontSize: 13, color: C.muted, margin: "0 0 4px" }}>Didn't receive it?</p>
          <button
            type="button"
            onClick={() => { setSent(false); setApiError(null); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.primary, padding: 0, fontFamily: "inherit" }}
          >
            Resend email
          </button>
        </motion.div>
      ) : (
        /* ── Request form ── */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07, duration: 0.35 }}
          style={{ flex: 1 }}
        >
          <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 8px", letterSpacing: "-0.4px", lineHeight: 1.2 }}>
            Forgot your password?
          </h1>
          <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 28px", lineHeight: 1.55 }}>
            Enter your email and we'll send a secure reset link.
          </p>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="reset-email"
              style={{ display: "block", fontSize: 13, fontWeight: 500, color: emailError ? C.danger : C.text, userSelect: "none" }}
            >
              Email
            </label>
            <div style={fieldContainer(!!emailError)}>
              <div style={iconSlot}>
                <Mail size={18} color={emailError ? C.danger : C.muted} strokeWidth={1.8} />
              </div>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); setApiError(null); }}
                placeholder="james@example.com"
                autoComplete="email"
                style={inputEl}
              />
            </div>
            {emailError && <p style={{ fontSize: 12, color: C.danger, margin: "5px 0 0" }}>{emailError}</p>}
          </div>

          {apiError && (
            <div
              role="alert"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", borderRadius: 12, padding: "12px 16px", marginBottom: 18 }}
            >
              <p style={{ fontSize: 13, color: C.danger, margin: 0 }}>{apiError}</p>
            </div>
          )}

          <PrimaryButton onClick={handleSubmit} loading={loading}>
            Send reset link
          </PrimaryButton>
        </motion.div>
      )}

      <div style={{ height: 40, flexShrink: 0 }} />
    </div>
  );
}

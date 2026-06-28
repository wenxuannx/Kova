import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { C, PrimaryButton } from "../vault/Shared";
import { useAuth } from "../../context/AuthContext";
import kovaLogo from "../../../imgs/kova_logo.png";

interface Props {
  onGoToRegister: () => void;
  onGoBack?: () => void;
  onForgotPassword: () => void;
}

// ─── Field wrapper style ──────────────────────────────────────────────────────

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
  padding: "0 10px 0 0",
  fontFamily: "inherit",
  minWidth: 0,
};

const fieldError: React.CSSProperties = {
  fontSize: 12,
  color: C.danger,
  margin: "5px 0 0",
};

const labelStyle = (hasError: boolean): React.CSSProperties => ({
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: hasError ? C.danger : C.text,
  userSelect: "none",
});

// ─── Component ────────────────────────────────────────────────────────────────

export function LoginScreen({ onGoToRegister, onGoBack, onForgotPassword }: Props) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  function clearField(field: "email" | "password") {
    setFieldErrors((p) => ({ ...p, [field]: undefined }));
    setApiError(null);
  }

  function validate(): typeof fieldErrors {
    const e: typeof fieldErrors = {};
    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Enter a valid email address";
    }
    if (!password) {
      e.password = "Password is required";
    } else if (password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }
    return e;
  }

  async function handleSignIn() {
    const errs = validate();
    setFieldErrors(errs);
    setApiError(null);
    if (Object.keys(errs).length) return;
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (!result.ok) setApiError(result.error ?? "Sign in failed. Please try again.");
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        padding: "0 24px",
      }}
      className="vault-scroll"
    >
      {/* Status-bar spacer */}
      <div style={{ height: "max(env(safe-area-inset-top, 0px), 28px)", flexShrink: 0 }} />

      {/* ── Back button (shown when coming from landing) ── */}
      {onGoBack && (
        <div style={{ marginBottom: 4 }}>
          <button
            type="button"
            onClick={onGoBack}
            aria-label="Go back"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              minHeight: 44,
              color: C.primary,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>Back</span>
          </button>
        </div>
      )}

      {/* ── Logo ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20, marginBottom: 32 }}
      >
        <img
          src={kovaLogo}
          alt="Kova"
          style={{
            width: 160,
            height: "auto",
            mixBlendMode: "multiply",
          }}
        />
        <p style={{ fontSize: 11, fontWeight: 600, color: C.primary, margin: "6px 0 0", letterSpacing: "0.13em" }}>
          GOALS. TOGETHER.
        </p>
      </motion.div>

      {/* ── Heading ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ marginBottom: 28 }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: C.text,
            margin: "0 0 7px",
            letterSpacing: "-0.5px",
            lineHeight: 1.15,
          }}
        >
          Welcome back 👋
        </h1>
        <p style={{ fontSize: 14, color: C.textSecondary, margin: 0 }}>
          Sign in to your account
        </p>
      </motion.div>

      {/* ── Form ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ flex: 1 }}
      >
        {/* Email */}
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="login-email" style={labelStyle(!!fieldErrors.email)}>
            Email
          </label>
          <div style={fieldContainer(!!fieldErrors.email)}>
            <div style={iconSlot}>
              <Mail size={18} color={fieldErrors.email ? C.danger : C.muted} strokeWidth={1.8} />
            </div>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearField("email"); }}
              placeholder="james@example.com"
              autoComplete="email"
              style={inputEl}
            />
          </div>
          {fieldErrors.email && <p style={fieldError}>{fieldErrors.email}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="login-password" style={labelStyle(!!fieldErrors.password)}>
            Password
          </label>
          <div style={fieldContainer(!!fieldErrors.password)}>
            <div style={iconSlot}>
              <Lock size={18} color={fieldErrors.password ? C.danger : C.muted} strokeWidth={1.8} />
            </div>
            <input
              id="login-password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearField("password"); }}
              placeholder="••••••••"
              autoComplete="current-password"
              style={inputEl}
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              aria-label={showPw ? "Hide password" : "Show password"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 16px 0 8px",
                display: "flex",
                alignItems: "center",
                color: C.muted,
                flexShrink: 0,
              }}
            >
              {showPw ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
            </button>
          </div>
          {fieldErrors.password && <p style={fieldError}>{fieldErrors.password}</p>}
        </div>

        {/* Remember me + Forgot password */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26, marginTop: 12 }}>
          <label
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}
          >
            <div
              onClick={() => setRememberMe((v) => !v)}
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: `2px solid ${rememberMe ? C.primary : "rgba(123,97,255,0.35)"}`,
                background: rememberMe ? C.primary : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s",
                cursor: "pointer",
              }}
            >
              {rememberMe && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: C.textSecondary }}>Remember me</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              color: C.primary,
              padding: "4px 0",
              minHeight: 44,
            }}
          >
            Forgot password?
          </button>
        </div>

        {/* API error banner */}
        {apiError && (
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.22)",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 18,
            }}
            role="alert"
          >
            <p style={{ fontSize: 13, color: C.danger, margin: 0 }}>{apiError}</p>
          </div>
        )}

        {/* Sign in button */}
        <PrimaryButton onClick={handleSignIn} loading={loading}>
          Sign in
        </PrimaryButton>

        {/* Sign up link */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <p style={{ fontSize: 14, color: C.textSecondary, margin: 0 }}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onGoToRegister}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: C.primary,
                padding: 0,
                fontFamily: "inherit",
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </motion.div>

      <div style={{ height: 40, flexShrink: 0 }} />
    </div>
  );
}

import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, UserRound } from "lucide-react";
import { C, PrimaryButton } from "../vault/Shared";
import { useAuth } from "../../context/AuthContext";
import kovaLogo from "../../../imgs/kova_logo.png";

interface Props {
  onGoToLogin: () => void;
  onGoBack?: () => void;
}

// ─── Shared styles ────────────────────────────────────────────────────────────

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

export function RegisterScreen({ onGoToLogin, onGoBack }: Props) {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function clearField(field: keyof typeof fieldErrors) {
    setFieldErrors((p) => ({ ...p, [field]: undefined }));
    setApiError(null);
  }

  function validate(): typeof fieldErrors {
    const e: typeof fieldErrors = {};
    if (!name.trim()) {
      e.name = "Name is required";
    }
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
    if (!confirmPassword) {
      e.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }
    return e;
  }

  async function handleRegister() {
    const errs = validate();
    setFieldErrors(errs);
    setApiError(null);
    if (Object.keys(errs).length) return;
    setLoading(true);
    const result = await register(name.trim(), email.trim(), password);
    setLoading(false);
    if (!result.ok) {
      setApiError(result.error ?? "Registration failed. Please try again.");
    } else {
      setRegistered(true);
    }
  }

  if (registered) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 32px",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(123,97,255,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mail size={32} color={C.primary} strokeWidth={1.6} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: 0, letterSpacing: "-0.3px" }}>
            Check your email
          </h2>
          <p style={{ fontSize: 14, color: C.textSecondary, margin: 0, lineHeight: 1.6 }}>
            We sent a confirmation link to{" "}
            <span style={{ fontWeight: 600, color: C.text }}>{email}</span>. Click it to activate your account.
          </p>
          <p style={{ fontSize: 13, color: C.muted, margin: "8px 0 0", lineHeight: 1.5 }}>
            Once confirmed, come back and sign in.
          </p>
          <button
            type="button"
            onClick={onGoToLogin}
            style={{
              marginTop: 8,
              background: C.primary,
              color: "white",
              border: "none",
              borderRadius: 14,
              height: 52,
              width: "100%",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Go to sign in
          </button>
        </motion.div>
      </div>
    );
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

      {/* ── Logo + brand ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16, marginBottom: 28 }}
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
        style={{ marginBottom: 24 }}
      >
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: C.text,
            margin: "0 0 7px",
            letterSpacing: "-0.4px",
            lineHeight: 1.15,
          }}
        >
          Create your account
        </h1>
        <p style={{ fontSize: 14, color: C.textSecondary, margin: 0 }}>
          Start your financial accountability journey
        </p>
      </motion.div>

      {/* ── Form ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ flex: 1 }}
      >
        {/* Full name */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="reg-name" style={labelStyle(!!fieldErrors.name)}>
            Full name
          </label>
          <div style={fieldContainer(!!fieldErrors.name)}>
            <div style={iconSlot}>
              <UserRound size={18} color={fieldErrors.name ? C.danger : C.muted} strokeWidth={1.8} />
            </div>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); clearField("name"); }}
              placeholder="Jane Doe"
              autoComplete="name"
              style={inputEl}
            />
          </div>
          {fieldErrors.name && <p style={fieldError}>{fieldErrors.name}</p>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="reg-email" style={labelStyle(!!fieldErrors.email)}>
            Email
          </label>
          <div style={fieldContainer(!!fieldErrors.email)}>
            <div style={iconSlot}>
              <Mail size={18} color={fieldErrors.email ? C.danger : C.muted} strokeWidth={1.8} />
            </div>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearField("email"); }}
              placeholder="jane@example.com"
              autoComplete="email"
              style={inputEl}
            />
          </div>
          {fieldErrors.email && <p style={fieldError}>{fieldErrors.email}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="reg-password" style={labelStyle(!!fieldErrors.password)}>
            Password
          </label>
          <div style={fieldContainer(!!fieldErrors.password)}>
            <div style={iconSlot}>
              <Lock size={18} color={fieldErrors.password ? C.danger : C.muted} strokeWidth={1.8} />
            </div>
            <input
              id="reg-password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearField("password"); }}
              placeholder="Enter password"
              autoComplete="new-password"
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

        {/* Confirm password */}
        <div style={{ marginBottom: 26 }}>
          <label htmlFor="reg-confirm" style={labelStyle(!!fieldErrors.confirmPassword)}>
            Confirm password
          </label>
          <div style={fieldContainer(!!fieldErrors.confirmPassword)}>
            <div style={iconSlot}>
              <Lock size={18} color={fieldErrors.confirmPassword ? C.danger : C.muted} strokeWidth={1.8} />
            </div>
            <input
              id="reg-confirm"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearField("confirmPassword"); }}
              placeholder="Re-enter password"
              autoComplete="new-password"
              style={inputEl}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
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
              {showConfirm ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
            </button>
          </div>
          {fieldErrors.confirmPassword && <p style={fieldError}>{fieldErrors.confirmPassword}</p>}
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

        {/* Create account button */}
        <PrimaryButton onClick={handleRegister} loading={loading}>
          Create account
        </PrimaryButton>

        {/* Sign in link */}
        <div style={{ textAlign: "center", marginTop: 24, paddingBottom: 8 }}>
          <p style={{ fontSize: 14, color: C.textSecondary, margin: 0 }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onGoToLogin}
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
              Sign in
            </button>
          </p>
        </div>
      </motion.div>

      <div style={{ height: 32, flexShrink: 0 }} />
    </div>
  );
}

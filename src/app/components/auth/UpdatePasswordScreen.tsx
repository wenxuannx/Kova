import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { C, PrimaryButton } from "../vault/Shared";
import { useAuth } from "../../context/AuthContext";
import kovaLogo from "../../../imgs/kova_logo.png";

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

const labelStyle = (hasError: boolean): React.CSSProperties => ({
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: hasError ? C.danger : C.text,
  userSelect: "none",
});

export function UpdatePasswordScreen() {
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});

  function validate() {
    const e: typeof fieldErrors = {};
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (!confirm) e.confirm = "Please confirm your password";
    else if (confirm !== password) e.confirm = "Passwords do not match";
    return e;
  }

  async function handleSubmit() {
    const errs = validate();
    setFieldErrors(errs);
    setApiError(null);
    if (Object.keys(errs).length) return;
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (!result.ok) {
      setApiError(result.error ?? "Could not update password. Please try again.");
    } else {
      setDone(true);
    }
  }

  return (
    <div
      style={{ height: "100%", display: "flex", flexDirection: "column", overflowY: "auto", padding: "0 24px" }}
      className="vault-scroll"
    >
      <div style={{ height: "max(env(safe-area-inset-top, 0px), 28px)", flexShrink: 0 }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20, marginBottom: 32 }}
      >
        <img src={kovaLogo} alt="Kova" style={{ width: 160, height: "auto", mixBlendMode: "multiply" }} />
        <p style={{ fontSize: 11, fontWeight: 600, color: C.primary, margin: "6px 0 0", letterSpacing: "0.13em" }}>
          GOALS. TOGETHER.
        </p>
      </motion.div>

      {done ? (
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
            Password updated
          </h2>
          <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
            Your password has been changed successfully.
            <br />
            You can now sign in with your new password.
          </p>
        </motion.div>
      ) : (
        /* ── Update form ── */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07, duration: 0.35 }}
          style={{ flex: 1 }}
        >
          <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 8px", letterSpacing: "-0.4px" }}>
            Set a new password
          </h1>
          <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 28px", lineHeight: 1.55 }}>
            Choose a strong password — at least 6 characters.
          </p>

          {/* New password */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="update-password" style={labelStyle(!!fieldErrors.password)}>
              New password
            </label>
            <div style={fieldContainer(!!fieldErrors.password)}>
              <div style={iconSlot}>
                <Lock size={18} color={fieldErrors.password ? C.danger : C.muted} strokeWidth={1.8} />
              </div>
              <input
                id="update-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); setApiError(null); }}
                placeholder="••••••••"
                autoComplete="new-password"
                style={inputEl}
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                aria-label={showPw ? "Hide password" : "Show password"}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0 16px 0 8px", display: "flex", alignItems: "center", color: C.muted, flexShrink: 0 }}
              >
                {showPw ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
              </button>
            </div>
            {fieldErrors.password && <p style={{ fontSize: 12, color: C.danger, margin: "5px 0 0" }}>{fieldErrors.password}</p>}
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="update-confirm" style={labelStyle(!!fieldErrors.confirm)}>
              Confirm password
            </label>
            <div style={fieldContainer(!!fieldErrors.confirm)}>
              <div style={iconSlot}>
                <Lock size={18} color={fieldErrors.confirm ? C.danger : C.muted} strokeWidth={1.8} />
              </div>
              <input
                id="update-confirm"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setFieldErrors((p) => ({ ...p, confirm: undefined })); setApiError(null); }}
                placeholder="••••••••"
                autoComplete="new-password"
                style={inputEl}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0 16px 0 8px", display: "flex", alignItems: "center", color: C.muted, flexShrink: 0 }}
              >
                {showConfirm ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
              </button>
            </div>
            {fieldErrors.confirm && <p style={{ fontSize: 12, color: C.danger, margin: "5px 0 0" }}>{fieldErrors.confirm}</p>}
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
            Update password
          </PrimaryButton>
        </motion.div>
      )}

      <div style={{ height: 40, flexShrink: 0 }} />
    </div>
  );
}

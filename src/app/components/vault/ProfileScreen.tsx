import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Eye, EyeOff, Building2, CheckCircle2 } from "lucide-react";
import {
  C,
  StatusBar,
  Card,
  SectionLabel,
  Avatar,
  PrimaryButton,
  BackButton,
  ScrollArea,
  Pill,
  type NavigateFn,
} from "./Shared";
import { useAuth } from "../../context/AuthContext";
import { PlaidLinkSimulator } from "../onboarding/OnboardingScreen";

export function ProfileScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const { user, updateName, updatePassword, completeOnboarding } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const [showPlaid, setShowPlaid] = useState(false);

  const initials = user?.name
    ? user.name.trim().split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  async function handleSaveName() {
    if (!name.trim() || name.trim() === user?.name) return;
    setNameSaving(true);
    setNameError(null);
    const result = await updateName(name.trim());
    setNameSaving(false);
    if (!result.ok) {
      setNameError(result.error ?? "Failed to update name.");
    } else {
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 2500);
    }
  }

  async function handleSavePassword() {
    if (newPassword.length < 6) { setPwError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setPwError("Passwords do not match."); return; }
    setPwSaving(true);
    setPwError(null);
    const result = await updatePassword(newPassword);
    setPwSaving(false);
    if (!result.ok) {
      setPwError(result.error ?? "Failed to update password.");
    } else {
      setPwSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwSuccess(false), 3000);
    }
  }

  const inputStyle = (hasError = false): React.CSSProperties => ({
    flex: 1,
    border: "none",
    outline: "none",
    padding: "0 12px",
    fontSize: 14,
    color: C.text,
    background: "transparent",
    fontFamily: "inherit",
    borderColor: hasError ? C.danger : undefined,
  });

  const fieldWrap = (hasError = false): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    border: `1.5px solid ${hasError ? C.danger : "rgba(123,97,255,0.22)"}`,
    borderRadius: 10,
    height: 44,
    background: C.bg,
    overflow: "hidden",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <StatusBar />
      <ScrollArea style={{ padding: "0 20px 40px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <BackButton onPress={() => onNavigate("home")} />
          <Pill color="purple">Profile</Pill>
        </div>

        {/* Identity */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
          <Avatar initials={initials} size={72} color="purple" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>{user?.name}</p>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{user?.email}</p>
        </div>

        {/* Name */}
        <SectionLabel>Display name</SectionLabel>
        <Card style={{ marginBottom: 20 }}>
          <label htmlFor="profile-name" style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>
            Full name
          </label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              id="profile-name"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(null); setNameSuccess(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              style={{ ...fieldWrap(!!nameError), flex: 1, padding: "0 12px", fontSize: 14, color: C.text, fontFamily: "inherit" }}
            />
            <button
              onClick={handleSaveName}
              disabled={nameSaving || !name.trim() || name.trim() === user?.name}
              style={{
                height: 44, padding: "0 16px", borderRadius: 10, background: nameSuccess ? C.success : C.primary,
                color: "white", border: "none", fontSize: 13, fontWeight: 600,
                cursor: nameSaving || name.trim() === user?.name ? "not-allowed" : "pointer",
                opacity: !name.trim() || name.trim() === user?.name ? 0.4 : 1,
                fontFamily: "inherit", flexShrink: 0, transition: "background 0.2s",
              }}
            >
              {nameSaving ? "Saving…" : nameSuccess ? "Saved ✓" : "Save"}
            </button>
          </div>
          {nameError && <p style={{ fontSize: 12, color: C.danger, margin: "6px 0 0" }}>{nameError}</p>}
        </Card>

        {/* Bank */}
        <SectionLabel>Linked bank</SectionLabel>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #00C2A8, #0093C4)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Building2 size={20} color="white" strokeWidth={1.6} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 2px" }}>
                {user?.bankConnected ? user.bankName : "No bank connected"}
              </p>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                {user?.bankConnected ? "Read-only · Plaid sandbox" : "Connect to enable challenge generation"}
              </p>
            </div>
            <button
              onClick={() => setShowPlaid(true)}
              style={{ fontSize: 13, fontWeight: 600, color: C.primary, background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "inherit", flexShrink: 0 }}
            >
              {user?.bankConnected ? "Change" : "Connect"}
            </button>
          </div>
        </Card>

        {/* Password */}
        <SectionLabel>Password</SectionLabel>
        <Card style={{ marginBottom: 20 }}>
          {pwSuccess ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
              <CheckCircle2 size={18} color={C.success} />
              <p style={{ fontSize: 14, color: C.success, fontWeight: 500, margin: 0 }}>Password updated</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 12 }}>
                <label htmlFor="new-pw" style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>New password</label>
                <div style={fieldWrap(!!pwError)}>
                  <input
                    id="new-pw"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setPwError(null); }}
                    placeholder="New password"
                    style={inputStyle(!!pwError)}
                  />
                  <button type="button" onClick={() => setShowNew((p) => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 12px", color: C.muted, display: "flex", alignItems: "center" }}>
                    {showNew ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="confirm-pw" style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>Confirm password</label>
                <div style={fieldWrap(!!pwError)}>
                  <input
                    id="confirm-pw"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setPwError(null); }}
                    placeholder="Confirm password"
                    style={inputStyle(!!pwError)}
                  />
                  <button type="button" onClick={() => setShowConfirm((p) => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 12px", color: C.muted, display: "flex", alignItems: "center" }}>
                    {showConfirm ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                  </button>
                </div>
              </div>
              {pwError && <p style={{ fontSize: 12, color: C.danger, margin: "0 0 10px" }}>{pwError}</p>}
              <PrimaryButton onClick={handleSavePassword} loading={pwSaving} disabled={!newPassword || !confirmPassword}>
                Update password
              </PrimaryButton>
            </>
          )}
        </Card>
      </ScrollArea>

      <AnimatePresence>
        {showPlaid && (
          <PlaidLinkSimulator
            onSuccess={(bankName) => { completeOnboarding(bankName); setShowPlaid(false); }}
            onClose={() => setShowPlaid(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

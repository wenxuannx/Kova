import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Building2, ChevronRight, X } from "lucide-react";
import { C, PrimaryButton, OutlineButton } from "../vault/Shared";
import { useAuth } from "../../context/AuthContext";

// ─── Plaid sandbox bank list ──────────────────────────────────────────────────

const BANKS = [
  { name: "Chase", color: "#003087", abbr: "CH" },
  { name: "Bank of America", color: "#E31837", abbr: "BA" },
  { name: "Wells Fargo", color: "#D71E28", abbr: "WF" },
  { name: "Citi", color: "#003B8E", abbr: "CI" },
  { name: "Capital One", color: "#C11E3C", abbr: "CO" },
  { name: "TD Bank", color: "#00A950", abbr: "TD" },
];

type PlaidStep = "select-bank" | "credentials" | "connecting" | "select-account" | "success";

// ─── Plaid Link Simulation (rendered as a bottom-sheet-style overlay) ─────────

export function PlaidLinkSimulator({
  onSuccess,
  onClose,
}: {
  onSuccess: (bankName: string) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<PlaidStep>("select-bank");
  const [selectedBank, setSelectedBank] = useState<(typeof BANKS)[0] | null>(null);
  const [username, setUsername] = useState("user_good");
  const [password, setPassword] = useState("pass_good");
  const [connError, setConnError] = useState<string | null>(null);

  function selectBank(bank: (typeof BANKS)[0]) {
    setSelectedBank(bank);
    setStep("credentials");
  }

  async function handleConnect() {
    setConnError(null);
    if (!username.trim() || !password.trim()) {
      setConnError("Please enter your credentials.");
      return;
    }
    setStep("connecting");
    // Simulate Plaid API latency
    await new Promise((r) => setTimeout(r, 1800));
    setStep("select-account");
  }

  function handleSelectAccount() {
    setStep("success");
  }

  function handleContinue() {
    if (selectedBank) onSuccess(selectedBank.name);
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step !== "connecting" ? onClose : undefined}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 320 }}
        style={{
          position: "relative",
          zIndex: 1,
          background: "white",
          borderRadius: "24px 24px 0 0",
          padding: "0 20px 40px",
          maxHeight: "88%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        className="vault-scroll"
      >
        {/* Drag handle */}
        <div style={{ padding: "14px 0 16px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, background: "#E5E7EB", borderRadius: 2 }} />
        </div>

        {/* Plaid header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #00C2A8, #0093C4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 size={16} color="white" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>Plaid</p>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Sandbox mode</p>
            </div>
          </div>
          {step !== "connecting" && (
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* ── Step: Select bank ── */}
        {step === "select-bank" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
              Choose your bank
            </p>
            <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 20px" }}>
              Select your financial institution
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {BANKS.map((bank) => (
                <button
                  key={bank.name}
                  onClick={() => selectBank(bank)}
                  aria-label={bank.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    border: "1.5px solid rgba(123,97,255,0.12)",
                    borderRadius: 12,
                    background: "white",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: bank.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: "white", fontSize: 10, fontWeight: 800 }}>{bank.abbr}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>
                    {bank.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Step: Credentials ── */}
        {step === "credentials" && selectedBank && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: selectedBank.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "white", fontSize: 12, fontWeight: 800 }}>{selectedBank.abbr}</span>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{selectedBank.name}</p>
                <p style={{ fontSize: 12, color: C.textSecondary, margin: 0 }}>Enter your online credentials</p>
              </div>
            </div>

            {/* Sandbox note */}
            <div
              style={{
                background: "rgba(123,97,255,0.07)",
                border: "1px solid rgba(123,97,255,0.18)",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 18,
              }}
            >
              <p style={{ fontSize: 12, color: C.primary, margin: 0, fontWeight: 500 }}>
                🧪 Sandbox mode — test credentials pre-filled
              </p>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label htmlFor="plaid-user" style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 5 }}>
                Username
              </label>
              <input
                id="plaid-user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  height: 48,
                  border: "1.5px solid rgba(123,97,255,0.22)",
                  borderRadius: 12,
                  padding: "0 14px",
                  fontSize: 15,
                  color: C.text,
                  background: "white",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="plaid-pass" style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 5 }}>
                Password
              </label>
              <input
                id="plaid-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  height: 48,
                  border: "1.5px solid rgba(123,97,255,0.22)",
                  borderRadius: 12,
                  padding: "0 14px",
                  fontSize: 15,
                  color: C.text,
                  background: "white",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {connError && (
              <p style={{ fontSize: 12, color: C.danger, margin: "0 0 12px" }}>{connError}</p>
            )}

            <PrimaryButton onClick={handleConnect}>Connect</PrimaryButton>
            <button
              onClick={() => setStep("select-bank")}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.muted, marginTop: 12, padding: "8px 0" }}
            >
              ← Choose a different bank
            </button>
          </motion.div>
        )}

        {/* ── Step: Connecting ── */}
        {step === "connecting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0 10px" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
              style={{
                width: 48,
                height: 48,
                border: `3px solid rgba(123,97,255,0.15)`,
                borderTop: `3px solid ${C.primary}`,
                borderRadius: "50%",
                marginBottom: 20,
              }}
            />
            <p style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>
              Connecting to {selectedBank?.name}…
            </p>
            <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, textAlign: "center" }}>
              Securely verifying your credentials via Plaid
            </p>
          </motion.div>
        )}

        {/* ── Step: Account selection ── */}
        {step === "select-account" && selectedBank && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
              Select an account
            </p>
            <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 18px" }}>
              Choose which account to link with Kova
            </p>

            {/* Mock account */}
            <button
              onClick={handleSelectAccount}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                border: "1.5px solid rgba(123,97,255,0.18)",
                borderRadius: 14,
                background: "white",
                cursor: "pointer",
                marginBottom: 10,
                textAlign: "left",
              }}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 3px" }}>
                  {selectedBank.name} Checking ••••4782
                </p>
                <p style={{ fontSize: 12, color: C.textSecondary, margin: 0 }}>
                  Checking · $4,230.00 available
                </p>
              </div>
              <ChevronRight size={18} color={C.primary} />
            </button>

            <button
              onClick={handleSelectAccount}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                border: "1.5px solid rgba(123,97,255,0.12)",
                borderRadius: 14,
                background: "white",
                cursor: "pointer",
                marginBottom: 10,
                textAlign: "left",
              }}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 3px" }}>
                  {selectedBank.name} Savings ••••2019
                </p>
                <p style={{ fontSize: 12, color: C.textSecondary, margin: 0 }}>
                  Savings · $12,800.00 available
                </p>
              </div>
              <ChevronRight size={18} color={C.primary} />
            </button>
          </motion.div>
        )}

        {/* ── Step: Success ── */}
        {step === "success" && selectedBank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 8px" }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            >
              <CheckCircle2 size={64} color={C.success} strokeWidth={1.5} />
            </motion.div>
            <p style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "16px 0 6px", textAlign: "center" }}>
              {selectedBank.name} connected!
            </p>
            <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 28px", textAlign: "center", lineHeight: 1.55 }}>
              Kova can now track your spending and generate personalised quests.
            </p>
            <PrimaryButton onClick={handleContinue}>Continue</PrimaryButton>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Step indicators ──────────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === current ? 20 : 8, background: i === current ? C.primary : "rgba(123,97,255,0.25)" }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          style={{ height: 8, borderRadius: 4 }}
        />
      ))}
    </div>
  );
}

// ─── OnboardingScreen ─────────────────────────────────────────────────────────

export function OnboardingScreen() {
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);
  const [showPlaid, setShowPlaid] = useState(false);
  const [connectedBank, setConnectedBank] = useState<string | undefined>(undefined);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  function handlePlaidSuccess(bankName: string) {
    setConnectedBank(bankName);
    setShowPlaid(false);
    // advance to completion step immediately
    setStep(2);
  }

  function handleSkip() {
    completeOnboarding(undefined);
  }

  function handleFinish() {
    completeOnboarding(connectedBank);
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "0 24px",
          overflowY: "auto",
        }}
        className="vault-scroll"
      >
        <div style={{ height: "max(env(safe-area-inset-top, 0px), 36px)", flexShrink: 0 }} />

        {/* Step dots */}
        <StepDots current={step} total={3} />

        <AnimatePresence mode="wait">
          {/* ── Step 0: Welcome ── */}
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              {/* Illustration */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 30,
                  background: `linear-gradient(135deg, ${C.gradStart}, ${C.gradEnd})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 28,
                  boxShadow: "0 14px 36px rgba(123,97,255,0.28)",
                }}
              >
                <span style={{ fontSize: 44 }}>🏦</span>
              </div>

              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: C.text,
                  margin: "0 0 12px",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2,
                }}
              >
                Welcome, {firstName}! 🎉
              </h1>
              <p style={{ fontSize: 15, color: C.textSecondary, margin: "0 0 28px", lineHeight: 1.65 }}>
                Kova uses social accountability and{" "}
                <strong style={{ color: C.text }}>loss aversion</strong> to help you and your
                friends hit financial goals — together.
              </p>

              {/* Feature list */}
              {[
                { icon: "🎯", title: "AI-generated quests", desc: "Personalised weekly spending challenges" },
                { icon: "👥", title: "Group accountability", desc: "Friends keep each other on track" },
                { icon: "💰", title: "Stake-based rewards", desc: "Miss a quest and your stake is locked" },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    gap: 14,
                    marginBottom: 16,
                    background: "white",
                    borderRadius: 14,
                    padding: "12px 14px",
                    boxShadow: C.cardShadow,
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 3px" }}>{title}</p>
                    <p style={{ fontSize: 12, color: C.textSecondary, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}

              <div style={{ flex: 1 }} />
              <PrimaryButton
                onClick={() => setStep(1)}
                style={{ marginTop: 20 }}
              >
                Get started →
              </PrimaryButton>
              <div style={{ height: 32 }} />
            </motion.div>
          )}

          {/* ── Step 1: Connect bank ── */}
          {step === 1 && (
            <motion.div
              key="bank"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  background: "linear-gradient(135deg, #00C2A8, #0093C4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  boxShadow: "0 10px 28px rgba(0,147,196,0.28)",
                }}
              >
                <Building2 size={36} color="white" strokeWidth={1.6} />
              </div>

              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: C.text,
                  margin: "0 0 10px",
                  letterSpacing: "-0.4px",
                  lineHeight: 1.2,
                }}
              >
                Connect your bank
              </h2>
              <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 28px", lineHeight: 1.65 }}>
                Link your account so Kova can track spending and generate personalised quests. Uses{" "}
                <strong style={{ color: C.text }}>bank-level encryption</strong> via Plaid.
              </p>

              {/* Trust badges */}
              <div
                style={{
                  background: "white",
                  borderRadius: 14,
                  padding: "14px 16px",
                  marginBottom: 24,
                  boxShadow: C.cardShadow,
                }}
              >
                {[
                  "🔒 256-bit AES encryption",
                  "🏛️ Read-only access — Kova cannot move funds",
                  "✅ Plaid used by thousands of apps worldwide",
                ].map((txt) => (
                  <p key={txt} style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 8px", lineHeight: 1.5 }}>
                    {txt}
                  </p>
                ))}
                <p style={{ fontSize: 13, color: C.textSecondary, margin: 0 }}>
                  🧪 <strong style={{ color: C.text }}>Sandbox mode:</strong> no real banking data used
                </p>
              </div>

              <div style={{ flex: 1 }} />

              <PrimaryButton onClick={() => setShowPlaid(true)}>
                Connect with Plaid
              </PrimaryButton>
              <OutlineButton
                onClick={handleSkip}
                style={{ marginTop: 12 }}
              >
                Skip for now
              </OutlineButton>
              <div style={{ height: 32 }} />
            </motion.div>
          )}

          {/* ── Step 2: All set ── */}
          {step === 2 && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                style={{ marginBottom: 24 }}
              >
                <CheckCircle2 size={80} color={C.success} strokeWidth={1.4} />
              </motion.div>

              <h2 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 10px", letterSpacing: "-0.4px" }}>
                You're all set! 🚀
              </h2>
              <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 20px", lineHeight: 1.65 }}>
                {connectedBank
                  ? `${connectedBank} is connected. Kova will generate your first quest once you join or create a vault.`
                  : "You can connect a bank account any time from your wallet settings."}
              </p>

              {connectedBank && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    borderRadius: 12,
                    padding: "10px 16px",
                    marginBottom: 20,
                  }}
                >
                  <CheckCircle2 size={16} color={C.success} />
                  <p style={{ fontSize: 13, color: "#16A34A", margin: 0, fontWeight: 500 }}>
                    {connectedBank} account linked
                  </p>
                </div>
              )}

              <div style={{ flex: 1 }} />
              <PrimaryButton onClick={handleFinish} style={{ marginTop: 20 }}>
                Enter Kova →
              </PrimaryButton>
              <div style={{ height: 32 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Plaid simulator overlay */}
      <AnimatePresence>
        {showPlaid && (
          <PlaidLinkSimulator
            onSuccess={handlePlaidSuccess}
            onClose={() => setShowPlaid(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { motion } from "motion/react";
import { useQuest } from "../../context/QuestContext";
import { QuestGeneratorSheet } from "./QuestGeneratorSheet";
import {
  C,
  StatusBar,
  Card,
  SectionLabel,
  Pill,
  Divider,
  BottomNav,
  BackButton,
  PrimaryButton,
  OutlineButton,
  BottomSheet,
  DisabledTooltip,
  NumberedStep,
  ScrollArea,
  type NavigateFn,
  type QuestStatus,
} from "./Shared";

export function QuestDetailScreen({
  onNavigate,
  isUrgent = false,
}: {
  onNavigate: NavigateFn;
  isUrgent?: boolean;
}) {
  const {
    currentQuest,
    setQuestStatus,
    setHasRescheduled,
  } = useQuest();

  const questStatus = currentQuest?.status ?? "active";
  const hasRescheduledThisMonth = currentQuest?.hasRescheduled ?? false;
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [urgentDismissed, setUrgentDismissed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPhase, setConfirmPhase] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleText, setRescheduleText] = useState("");
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);

  const showUrgentBanner = isUrgent && !urgentDismissed;

  const handleConfirm = () => {
    setConfirmPhase("submitting");
    setTimeout(() => setConfirmPhase("success"), 1400);
  };

  const handleReschedule = () => {
    setRescheduleSubmitting(true);
    setTimeout(() => {
      setRescheduleSubmitting(false);
      setRescheduleOpen(false);
      setQuestStatus("rescheduled");
      setHasRescheduled(true);
    }, 1200);
  };

  const contextualBadge = () => {
    if (questStatus === "completed") return <Pill color="green">✓ Completed</Pill>;
    if (questStatus === "rescheduled") return <Pill color="amber">Rescheduled · 7 days</Pill>;
    if (questStatus === "expired") return <Pill color="red">Expired</Pill>;
    return <Pill color="amber">3 days left</Pill>;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <StatusBar />
      <ScrollArea style={{ padding: "0 20px 110px" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <BackButton onPress={() => onNavigate("home")} />
          {currentQuest && contextualBadge()}
        </div>

        {/* Urgent banner */}
        {showUrgentBanner && (
          <div
            style={{
              background: "rgba(245,158,11,0.10)",
              border: "1.5px solid rgba(245,158,11,0.25)",
              borderRadius: 14,
              padding: "12px 14px",
              marginBottom: 16,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
            role="alert"
          >
            <span style={{ fontSize: 16 }}>⚠️</span>
            <p style={{ flex: 1, fontSize: 13, color: "#B45309", margin: 0, lineHeight: 1.5 }}>
              Deadline tomorrow — complete by 11:59pm or your stake is redirected.
            </p>
            <button
              onClick={() => setUrgentDismissed(true)}
              aria-label="Dismiss urgent notice"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                color: "#D97706",
                flexShrink: 0,
                minWidth: 24,
                minHeight: 24,
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Hero card */}
        <div
          style={{
            background: "linear-gradient(135deg, #9B7FFF 0%, #5B3FDF 100%)",
            borderRadius: 20,
            padding: "20px",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0px 8px 28px rgba(91,63,223,0.30)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -32,
              right: -32,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -18,
              left: -18,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
          <div style={{ position: "relative" }}>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.80)",
                margin: "0 0 10px",
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontWeight: 500,
              }}
            >
              <Sparkles size={10} color="rgba(255,255,255,0.80)" />
              AI-generated ✦
            </p>
            <p
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "white",
                margin: "0 0 8px",
                lineHeight: 1.25,
              }}
            >
              {currentQuest?.title ?? "No challenge yet"}
            </p>
            {currentQuest ? (
              <>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.80)",
                    margin: "0 0 20px",
                    lineHeight: 1.55,
                  }}
                >
                  {currentQuest.rationale}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "rgba(255,255,255,0.13)", borderRadius: 12, padding: "12px 14px" }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.70)", margin: "0 0 4px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Complete</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "white", margin: 0 }}>{currentQuest.reward}</p>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.13)", borderRadius: 12, padding: "12px 14px" }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.70)", margin: "0 0 4px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Miss it</p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.82)", margin: 0 }}>{currentQuest.stake}</p>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.70)", margin: "0 0 16px", lineHeight: 1.55 }}>
                  Generate your first AI challenge to get started.
                </p>
                <button
                  onClick={() => setGeneratorOpen(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "white",
                    color: C.primary,
                    border: "none",
                    borderRadius: 50,
                    height: 36,
                    padding: "0 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <Sparkles size={13} /> Generate challenge
                </button>
              </div>
            )}
          </div>
        </div>

        {currentQuest && (
          <>
            {/* Progress */}
            <SectionLabel>Your Progress</SectionLabel>
            <Card style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <p style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: 0 }}>$38 spent</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: C.success, margin: 0 }}>$22 left</p>
              </div>
              <div
                style={{ height: 8, borderRadius: 20, background: "rgba(123,97,255,0.10)", marginBottom: 12, overflow: "hidden" }}
                role="progressbar" aria-valuenow={63} aria-valuemin={0} aria-valuemax={100} aria-label="63% of spending limit used"
              >
                <div style={{ height: "100%", width: "63%", background: C.success, borderRadius: 20 }} />
              </div>
              <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.55 }}>
                On track — you've used 63% of your limit with 3 days to go.
              </p>
            </Card>

            {/* Steps */}
            <SectionLabel>How to Complete</SectionLabel>
            <Card style={{ marginBottom: 24 }}>
              {currentQuest.steps?.map((step, i, arr) => (
                <React.Fragment key={i}>
                  <NumberedStep n={i + 1} title={step.title} description={step.description} />
                  {i < arr.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Card>
          </>
        )}

        {/* Action buttons — only when a challenge is active */}
        {currentQuest && questStatus === "completed" ? (
          <div
            style={{
              width: "100%",
              height: 52,
              background: "rgba(34,197,94,0.10)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 12,
            }}
            aria-label="Quest completed this week"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10l5 5 7-8"
                stroke={C.success}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.success }}>
              Completed this week
            </span>
          </div>
        ) : currentQuest && questStatus === "expired" ? (
          <div
            style={{
              width: "100%",
              height: 52,
              background: "rgba(239,68,68,0.08)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: C.danger }}>Challenge expired</span>
          </div>
        ) : currentQuest ? (
          <PrimaryButton
            style={{ marginBottom: 12 }}
            onClick={() => setConfirmOpen(true)}
            disabled={questStatus === "rescheduled"}
          >
            Confirm completion
          </PrimaryButton>
        ) : null}

        {currentQuest && (hasRescheduledThisMonth ? (
          <DisabledTooltip message="One reschedule per month — resets on the 1st.">
            <OutlineButton disabled>Request reschedule</OutlineButton>
          </DisabledTooltip>
        ) : (
          questStatus !== "completed" &&
          questStatus !== "expired" && (
            <OutlineButton onClick={() => setRescheduleOpen(true)}>
              Request reschedule
            </OutlineButton>
          )
        ))}

        {/* Error state */}
        {confirmPhase === "error" && (
          <div
            style={{
              marginTop: 12,
              background: "rgba(239,68,68,0.08)",
              border: "1.5px solid rgba(239,68,68,0.25)",
              borderRadius: 10,
              padding: "10px 14px",
            }}
            role="alert"
          >
            <p style={{ fontSize: 13, color: C.danger, margin: 0 }}>
              We couldn't verify this — try again or contact support.
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Bottom nav */}
      <BottomNav active="quest" onNavigate={onNavigate} />

      {/* Confirm completion bottom sheet */}
      <BottomSheet
        isOpen={confirmOpen && confirmPhase === "idle"}
        onClose={() => setConfirmOpen(false)}
        title="Confirm your challenge"
      >
        <p style={{ fontSize: 14, color: C.textSecondary, margin: "4px 0 20px", lineHeight: 1.55 }}>
          Your group will be notified. The $50 voucher will be unlocked within 24 hours.
        </p>
        <PrimaryButton
          style={{ marginBottom: 10 }}
          onClick={handleConfirm}
          loading={confirmPhase === "submitting"}
        >
          Yes, I did it
        </PrimaryButton>
        <OutlineButton onClick={() => setConfirmOpen(false)}>Cancel</OutlineButton>
      </BottomSheet>

      {/* Reschedule bottom sheet */}
      <BottomSheet
        isOpen={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title="Reschedule this challenge"
      >
        <p style={{ fontSize: 14, color: C.textSecondary, margin: "4px 0 16px", lineHeight: 1.55 }}>
          Your group won't be penalised. You get one reschedule per month. The challenge timer resets
          to 7 days.
        </p>
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="reschedule-reason"
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 500,
              color: C.muted,
              marginBottom: 6,
            }}
          >
            Reason (optional)
          </label>
          <div style={{ position: "relative" }}>
            <textarea
              id="reschedule-reason"
              value={rescheduleText}
              onChange={(e) => setRescheduleText(e.target.value.slice(0, 120))}
              placeholder="Unexpected expense, illness, travel…"
              rows={3}
              style={{
                width: "100%",
                background: "#F9F8FF",
                border: `1.5px solid ${rescheduleText.length >= 100 ? C.warning : "rgba(123,97,255,0.12)"}`,
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 14,
                color: C.text,
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: 8,
                right: 12,
                fontSize: 11,
                color: rescheduleText.length >= 100 ? C.warning : C.muted,
                fontWeight: 500,
              }}
            >
              {rescheduleText.length}/120
            </span>
          </div>
        </div>
        <PrimaryButton
          style={{ marginBottom: 10 }}
          onClick={handleReschedule}
          loading={rescheduleSubmitting}
        >
          Reschedule
        </PrimaryButton>
        <OutlineButton onClick={() => setRescheduleOpen(false)}>Cancel</OutlineButton>
      </BottomSheet>

      <QuestGeneratorSheet isOpen={generatorOpen} onClose={() => setGeneratorOpen(false)} />

      {/* Full-screen success overlay */}
      {confirmPhase === "success" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 300,
            background: "linear-gradient(135deg, #9B7FFF 0%, #5B3FDF 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 28px",
          }}
        >
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.1 }}
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
                d="M 10 24 L 20 34 L 38 14"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "white",
              margin: "0 0 12px",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            Challenge complete
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78 }}
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.82)",
              textAlign: "center",
              lineHeight: 1.6,
              margin: "0 0 48px",
            }}
          >
            Your group has been notified.{"\n"}Voucher incoming.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{ width: "100%" }}
          >
            <OutlineButton
              style={{
                borderColor: "rgba(255,255,255,0.50)",
                color: "white",
                background: "transparent",
              }}
              onClick={() => {
                setQuestStatus("completed");
                setConfirmOpen(false);
                setConfirmPhase("idle");
                onNavigate("home");
              }}
            >
              Back to home
            </OutlineButton>
          </motion.div>
        </div>
      )}
    </div>
  );
}

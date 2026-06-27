import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { C, PrimaryButton, BottomSheet } from "./Shared";
import { useQuest } from "../../context/QuestContext";
import type { QuestInput } from "../../../lib/gemini";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Food delivery",
  "Dining out",
  "Groceries",
  "Shopping",
  "Subscriptions",
  "Entertainment",
  "Transport",
  "Coffee & drinks",
];

const GOALS = [
  "Emergency fund",
  "Holiday savings",
  "Pay off debt",
  "New gadget / purchase",
  "Investment",
  "General savings",
];

function Chip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        padding: "7px 14px",
        borderRadius: 50,
        border: `1.5px solid ${selected ? C.primary : "rgba(123,97,255,0.20)"}`,
        background: selected ? "rgba(123,97,255,0.10)" : "white",
        color: selected ? C.primary : C.textSecondary,
        fontSize: 13,
        fontWeight: selected ? 600 : 400,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.12s ease",
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, fontWeight: 500, color: C.text, margin: "0 0 8px" }}>{children}</p>
  );
}

function AmountInput({
  id, value, onChange, placeholder,
}: { id: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", border: "1.5px solid rgba(123,97,255,0.22)", borderRadius: 12, background: "white", height: 48, overflow: "hidden" }}>
      <span style={{ padding: "0 12px", fontSize: 15, color: C.muted, fontWeight: 500, flexShrink: 0 }}>$</span>
      <input
        id={id}
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: C.text, background: "transparent", padding: "0 12px 0 0", fontFamily: "inherit" }}
      />
    </div>
  );
}

export function QuestGeneratorSheet({ isOpen, onClose }: Props) {
  const { generateQuest, isGenerating, generateError, currentQuest } = useQuest();

  const [step, setStep] = useState<"form" | "generating" | "done">("form");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");
  const [overSpend, setOverSpend] = useState("");
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");
  const [formError, setFormError] = useState("");

  function reset() {
    setStep("form");
    setBudget("");
    setCategory("");
    setOverSpend("");
    setGoal("");
    setContext("");
    setFormError("");
  }

  async function handleGenerate() {
    if (!budget || Number(budget) <= 0) { setFormError("Enter your weekly budget."); return; }
    if (!category) { setFormError("Select a spending category."); return; }
    if (!overSpend || Number(overSpend) <= 0) { setFormError("Enter your weekly overspend amount."); return; }
    if (!goal) { setFormError("Select a savings goal."); return; }
    setFormError("");
    setStep("generating");

    const input: QuestInput = {
      weeklyBudget: Number(budget),
      overspendCategory: category,
      weeklyOverspend: Number(overSpend),
      savingsGoal: goal,
      context: context.trim() || undefined,
    };

    await generateQuest(input);
    setStep("done");
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="">
      <AnimatePresence mode="wait" initial={false}>
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(123,97,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={18} color={C.primary} />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>Generate my quest</p>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Powered by Gemini AI</p>
              </div>
            </div>

            {/* Weekly budget */}
            <div style={{ marginBottom: 18 }}>
              <FieldLabel>Weekly spending budget</FieldLabel>
              <AmountInput id="gen-budget" value={budget} onChange={setBudget} placeholder="e.g. 300" />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 18 }}>
              <FieldLabel>Biggest overspend category</FieldLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CATEGORIES.map((c) => (
                  <Chip key={c} label={c} selected={category === c} onToggle={() => setCategory(c === category ? "" : c)} />
                ))}
              </div>
            </div>

            {/* Overspend amount */}
            <div style={{ marginBottom: 18 }}>
              <FieldLabel>Weekly overspend in that category</FieldLabel>
              <AmountInput id="gen-overspend" value={overSpend} onChange={setOverSpend} placeholder="e.g. 60" />
            </div>

            {/* Savings goal */}
            <div style={{ marginBottom: 18 }}>
              <FieldLabel>Savings goal</FieldLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {GOALS.map((g) => (
                  <Chip key={g} label={g} selected={goal === g} onToggle={() => setGoal(g === goal ? "" : g)} />
                ))}
              </div>
            </div>

            {/* Optional context */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Anything else? <span style={{ fontWeight: 400, color: C.muted }}>(optional)</span></FieldLabel>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value.slice(0, 200))}
                placeholder="e.g. I have a big event next weekend, tend to spend more on weekends…"
                rows={2}
                style={{ width: "100%", background: "#F9F8FF", border: "1.5px solid rgba(123,97,255,0.12)", borderRadius: 12, padding: "10px 12px", fontSize: 13, color: C.text, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
              />
              <p style={{ fontSize: 11, color: C.muted, margin: "4px 0 0", textAlign: "right" }}>{context.length}/200</p>
            </div>

            {formError && (
              <p style={{ fontSize: 13, color: C.danger, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                <AlertCircle size={14} /> {formError}
              </p>
            )}

            <PrimaryButton onClick={handleGenerate}>
              <Sparkles size={15} style={{ marginRight: 6 }} /> Generate quest
            </PrimaryButton>
          </motion.div>
        )}

        {step === "generating" && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center", padding: "32px 0" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              style={{ width: 48, height: 48, border: "3px solid rgba(123,97,255,0.15)", borderTop: `3px solid ${C.primary}`, borderRadius: "50%", margin: "0 auto 20px" }}
            />
            <p style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>
              Crafting your quest…
            </p>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
              Gemini is analysing your spending profile
            </p>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {generateError ? (
              /* Error state */
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <AlertCircle size={40} color={C.danger} style={{ marginBottom: 16 }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>Something went wrong</p>
                <p style={{ fontSize: 13, color: C.muted, margin: "0 0 24px", lineHeight: 1.5 }}>{generateError}</p>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: `1.5px solid ${C.primary}`, borderRadius: 50, padding: "10px 24px", color: C.primary, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                >
                  <RefreshCw size={14} /> Try again
                </button>
              </div>
            ) : currentQuest ? (
              /* Success state */
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                      <path d="M1 6l4 4 8-9" stroke={C.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.success, margin: 0 }}>Quest generated!</p>
                </div>

                <div style={{ background: "linear-gradient(135deg, #9B7FFF 0%, #5B3FDF 100%)", borderRadius: 16, padding: "16px", marginBottom: 16, color: "white" }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                    <Sparkles size={10} /> AI-generated · {currentQuest.difficulty}
                  </p>
                  <p style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.25 }}>{currentQuest.title}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.80)", margin: "0 0 12px", lineHeight: 1.5 }}>{currentQuest.rationale}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ background: "rgba(255,255,255,0.13)", borderRadius: 10, padding: "8px 12px", flex: 1 }}>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>Reward</p>
                      <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{currentQuest.reward}</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.13)", borderRadius: 10, padding: "8px 12px", flex: 1 }}>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>Save est.</p>
                      <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>${currentQuest.estimatedSavings}</p>
                    </div>
                  </div>
                </div>

                <PrimaryButton onClick={handleClose}>View my quest →</PrimaryButton>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  style={{ width: "100%", marginTop: 10, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.muted, fontFamily: "inherit", padding: "8px 0" }}
                >
                  Regenerate with different settings
                </button>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </BottomSheet>
  );
}

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  C,
  StatusBar,
  Card,
  SectionLabel,
  Pill,
  Divider,
  PressableDiv,
  BottomNav,
  BackButton,
  OutlineButton,
  PrimaryButton,
  BottomSheet,
  NumberedStep,
  ScrollArea,
  type NavigateFn,
} from "./Shared";

interface QuestOption {
  id: string;
  title: string;
  description: string;
  rationale: string;
}

const NEXT_QUESTS: QuestOption[] = [
  {
    id: "q1",
    title: "$25 index fund micro-invest",
    description: "One ETF, 4 minutes. Build the habit before the amount.",
    rationale: "Targets your investment avoidance",
  },
  {
    id: "q2",
    title: "Set up $50 autopay on the 18th",
    description: "Moves your commitment before the month-end crunch.",
    rationale: "Based on your month-end pattern",
  },
];

const ALTERNATIVE_QUESTS: QuestOption[] = [
  {
    id: "alt1",
    title: "Reduce café spend to $30",
    description: "3 café visits max this week.",
    rationale: "Based on your month-end pattern",
  },
  {
    id: "alt2",
    title: "Set up $100 savings auto-transfer",
    description: "One setup, recurring every fortnight.",
    rationale: "Targets your investment avoidance",
  },
  {
    id: "alt3",
    title: "Cancel one unused subscription",
    description: "You have 3 active subscriptions over $8/mo.",
    rationale: "Identified from your linked account",
  },
];

function BarRow({
  label,
  percent,
  numericPct,
  textColor,
  barColor,
}: {
  label: string;
  percent: string;
  numericPct: number;
  textColor: string;
  barColor: string;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 7,
        }}
      >
        <span style={{ fontSize: 13, color: C.text }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: textColor }}>{percent}</span>
      </div>
      <div
        style={{ height: 8, borderRadius: 20, background: "#F0F0F3", overflow: "hidden" }}
        role="progressbar"
        aria-valuenow={numericPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${percent}`}
      >
        <div
          style={{ height: "100%", width: `${numericPct}%`, background: barColor, borderRadius: 20 }}
        />
      </div>
    </div>
  );
}

export function InsightsScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  const [previewQuest, setPreviewQuest] = useState<QuestOption | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showAIInfo, setShowAIInfo] = useState(false);

  const bars = [
    { label: "Savings challenges", percent: "85%", numericPct: 85, textColor: C.success, barColor: C.success },
    { label: "Spending reduction", percent: "71%", numericPct: 71, textColor: C.primary, barColor: C.primary },
    { label: "Investment challenges", percent: "28%", numericPct: 28, textColor: C.warning, barColor: C.warning },
    { label: "Month-end challenges", percent: "17%", numericPct: 17, textColor: C.danger, barColor: C.danger },
  ];

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
          <Pill color="purple">
            <Sparkles size={10} />✦ AI diagnosis
          </Pill>
        </div>

        <p style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
          Your behaviour, week 7
        </p>
        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 24px" }}>
          From 6 weeks of challenge data
        </p>

        {/* Completion bars */}
        <SectionLabel>Completion by Type</SectionLabel>
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {bars.map((b) => (
              <BarRow key={b.label} {...b} />
            ))}
          </div>
        </Card>

        {/* Next challenges — tappable rows */}
        <SectionLabel>Next Challenges</SectionLabel>
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          {NEXT_QUESTS.map((q, i) => (
            <div key={q.id}>
              <PressableDiv
                onClick={() => {
                  setPreviewQuest(q);
                  setShowAlternatives(false);
                }}
                aria-label={`Preview challenge: ${q.title}`}
                style={{ padding: "12px 16px" }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #9B7FFF, #5B3FDF)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 3px" }}>
                      {q.title}
                    </p>
                    <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.55 }}>
                      {q.description}
                    </p>
                  </div>
                  <svg
                    width="7"
                    height="12"
                    viewBox="0 0 7 12"
                    fill="none"
                    style={{ marginTop: 4, flexShrink: 0 }}
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1l5 5-5 5"
                      stroke={C.muted}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </PressableDiv>
              {i < NEXT_QUESTS.length - 1 && <Divider style={{ margin: 0 }} />}
            </div>
          ))}
        </Card>

        <OutlineButton onClick={() => setShowAIInfo(true)}>How does the AI work?</OutlineButton>
      </ScrollArea>

      <BottomNav active="insights" onNavigate={onNavigate} />

      {/* Quest preview bottom sheet */}
      <BottomSheet
        isOpen={!!previewQuest}
        onClose={() => {
          setPreviewQuest(null);
          setShowAlternatives(false);
        }}
      >
        {previewQuest && (
          <>
            <Pill color="purple" style={{ marginBottom: 12 }}>
              <Sparkles size={10} />
              Recommended for you
            </Pill>
            <p style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 6px", lineHeight: 1.3 }}>
              {previewQuest.title}
            </p>
            <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 6px", lineHeight: 1.55 }}>
              {previewQuest.description}
            </p>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 20px", fontStyle: "italic" }}>
              {previewQuest.rationale}
            </p>

            {!showAlternatives ? (
              <>
                <PrimaryButton
                  style={{ marginBottom: 10 }}
                  onClick={() => {
                    setPreviewQuest(null);
                    onNavigate("quest");
                  }}
                >
                  Add to this week
                </PrimaryButton>
                <OutlineButton onClick={() => setShowAlternatives(true)}>
                  See other options
                </OutlineButton>
              </>
            ) : (
              <>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: C.muted,
                    margin: "0 0 12px",
                  }}
                >
                  3 alternatives
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 }}>
                  {ALTERNATIVE_QUESTS.map((alt, i) => (
                    <PressableDiv
                      key={alt.id}
                      onClick={() => {
                        setPreviewQuest(alt);
                        setShowAlternatives(false);
                      }}
                      style={{
                        padding: "12px 14px",
                        background: "#F9F8FF",
                        borderRadius: 12,
                      }}
                    >
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 2px" }}>
                        {alt.title}
                      </p>
                      <p style={{ fontSize: 12, color: C.muted, margin: 0, fontStyle: "italic" }}>
                        {alt.rationale}
                      </p>
                    </PressableDiv>
                  ))}
                </div>
                <OutlineButton onClick={() => setShowAlternatives(false)}>Back</OutlineButton>
              </>
            )}
          </>
        )}
      </BottomSheet>

      {/* How does the AI work? */}
      <BottomSheet isOpen={showAIInfo} onClose={() => setShowAIInfo(false)} title="How the AI works">
        <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 20px", lineHeight: 1.65 }}>
          Kova's challenge engine analyses your spending patterns and savings pace, then generates a
          personalised weekly challenge — something achievable but slightly uncomfortable.
        </p>
        <NumberedStep
          n={1}
          title="Reads your profile"
          description="The AI looks at your vault goal, current balance, and weekly streak to understand where you're at."
        />
        <NumberedStep
          n={2}
          title="Finds the friction"
          description="It identifies one spending category where small changes have the highest impact on your goal."
        />
        <NumberedStep
          n={3}
          title="Generates a challenge"
          description="A specific, time-boxed challenge is created — with a clear reward if you complete it with your group."
        />
        <div style={{ height: 8 }} />
        <OutlineButton onClick={() => setShowAIInfo(false)}>Got it</OutlineButton>
      </BottomSheet>
    </div>
  );
}

// Gemini 2.0 Flash — called directly from the client for prototyping.
// In production, proxy through a Supabase Edge Function or Vercel serverless
// function to keep VITE_GEMINI_API_KEY off the client bundle.

export interface QuestInput {
  weeklyBudget: number;           // total weekly spending budget in USD
  overspendCategory: string;      // e.g. "food delivery"
  weeklyOverspend: number;        // how much over budget in that category
  savingsGoal: string;            // e.g. "emergency fund", "holiday"
  context?: string;               // optional free-text from user
}

export interface GeneratedQuest {
  title: string;
  rationale: string;
  category: string;
  targetAmount: number;
  unit: "currency" | "count" | "percentage";
  reward: string;
  stake: string;
  steps: Array<{ title: string; description: string }>;
  difficulty: "easy" | "medium" | "hard";
  estimatedSavings: number;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    title:           { type: "string" },
    rationale:       { type: "string" },
    category:        { type: "string" },
    targetAmount:    { type: "number" },
    unit:            { type: "string", enum: ["currency", "count", "percentage"] },
    reward:          { type: "string" },
    stake:           { type: "string" },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title:       { type: "string" },
          description: { type: "string" },
        },
        required: ["title", "description"],
      },
      minItems: 2,
      maxItems: 4,
    },
    difficulty:        { type: "string", enum: ["easy", "medium", "hard"] },
    estimatedSavings:  { type: "number" },
  },
  required: [
    "title", "rationale", "category", "targetAmount", "unit",
    "reward", "stake", "steps", "difficulty", "estimatedSavings",
  ],
};

function buildPrompt(input: QuestInput): string {
  return `You are Kova's AI financial quest engine. Generate a single personalised weekly financial challenge.

User profile:
- Weekly spending budget: $${input.weeklyBudget}
- Category they overspend in: ${input.overspendCategory}
- How much they overspend in that category per week: $${input.weeklyOverspend}
- Savings goal: ${input.savingsGoal}${input.context ? `\n- Additional context: ${input.context}` : ""}

Rules:
- The quest must be achievable within 7 days.
- Target should be specific, realistic, and measurable — not too easy, not impossible.
- Reward is a voucher or cash-back proportional to difficulty (e.g. easy → $10–20, medium → $20–50, hard → $50–80).
- Stake is what happens if they miss (small amount redirected to savings pool).
- Steps must be practical (2–4 steps).
- Title max 10 words, active voice (e.g. "Limit coffee spend to $20 this week").
- Rationale must reference their actual numbers.
- EstimatedSavings is how much they'll save vs their current pattern.
- Keep tone positive and motivating.`;
}

export async function generateQuest(input: QuestInput): Promise<GeneratedQuest> {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "VITE_GEMINI_API_KEY is not set. Add it to your .env.local file."
    );
  }

  const body = {
    contents: [{ parts: [{ text: buildPrompt(input) }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.8,
      maxOutputTokens: 1024,
    },
  };

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`;
    throw new Error(`Gemini API error: ${msg}`);
  }

  const data = await res.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");

  return JSON.parse(text) as GeneratedQuest;
}

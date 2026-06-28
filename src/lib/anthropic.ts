// Claude API — called via Vite proxy to avoid CORS.
// In production, proxy through a Supabase Edge Function to keep
// VITE_ANTHROPIC_API_KEY off the client bundle.

export interface QuestInput {
  weeklyBudget: number;
  overspendCategory: string;
  weeklyOverspend: number;
  savingsGoal: string;
  context?: string;
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

// Only used in dev — in production the key lives server-side in the Vercel function
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
const IS_DEV = import.meta.env.DEV;

function buildPrompt(input: QuestInput): string {
  return `Generate a single personalised weekly financial challenge for a Kova user.

User profile:
- Weekly spending budget: $${input.weeklyBudget}
- Category they overspend in: ${input.overspendCategory}
- Weekly overspend in that category: $${input.weeklyOverspend}
- Savings goal: ${input.savingsGoal}${input.context ? `\n- Additional context: ${input.context}` : ""}

Rules:
- Quest must be achievable within 7 days.
- Target must be specific, realistic, and measurable.
- Reward is a voucher proportional to difficulty (easy → $10–20, medium → $20–50, hard → $50–80).
- Stake is what locks into savings if they miss.
- Steps must be practical (2–4 steps).
- Title max 10 words, active voice.
- Rationale must reference their actual numbers.
- estimatedSavings is how much they save vs current pattern.
- Tone: positive and motivating.

Respond with this exact JSON structure and nothing else:
{
  "title": string,
  "rationale": string,
  "category": string,
  "targetAmount": number,
  "unit": "currency" | "count" | "percentage",
  "reward": string,
  "stake": string,
  "steps": [{ "title": string, "description": string }],
  "difficulty": "easy" | "medium" | "hard",
  "estimatedSavings": number
}`;
}

export async function generateQuest(input: QuestInput): Promise<GeneratedQuest> {
  if (IS_DEV && !ANTHROPIC_API_KEY) {
    throw new Error("VITE_ANTHROPIC_API_KEY is not set. Add it to your .env file.");
  }

  const url = IS_DEV ? "/anthropic/v1/messages" : "/api/anthropic";
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (IS_DEV && ANTHROPIC_API_KEY) {
    headers["x-api-key"] = ANTHROPIC_API_KEY;
    headers["anthropic-version"] = "2023-06-01";
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: "You are Kova's AI financial quest engine. Respond with valid JSON only — no markdown, no code fences, just the raw JSON object.",
      messages: [{ role: "user", content: buildPrompt(input) }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`;
    throw new Error(`Claude API error: ${msg}`);
  }

  const data = await res.json() as {
    content?: Array<{ type: string; text?: string }>;
  };

  const raw = data.content?.find((b) => b.type === "text")?.text;
  if (!raw) throw new Error("Claude returned an empty response.");

  const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  return JSON.parse(text) as GeneratedQuest;
}

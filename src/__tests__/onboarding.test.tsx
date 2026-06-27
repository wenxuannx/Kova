import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { AuthContext, type AuthContextValue } from "../app/context/AuthContext";
import { OnboardingScreen } from "../app/components/onboarding/OnboardingScreen";

function makeAuthCtx(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    user: { id: "test@example.com", name: "Jane Doe", email: "test@example.com", bankConnected: false, onboardingComplete: false },
    isLoading: false,
    isPasswordRecovery: false,
    login: vi.fn().mockResolvedValue({ ok: true }),
    register: vi.fn().mockResolvedValue({ ok: true }),
    logout: vi.fn().mockResolvedValue(undefined),
    completeOnboarding: vi.fn().mockResolvedValue(undefined),
    resetPassword: vi.fn().mockResolvedValue({ ok: true }),
    updatePassword: vi.fn().mockResolvedValue({ ok: true }),
    ...overrides,
  };
}

function renderOnboarding(ctx: AuthContextValue) {
  return render(
    <AuthContext.Provider value={ctx}>
      <OnboardingScreen />
    </AuthContext.Provider>
  );
}

describe("OnboardingScreen", () => {
  let ctx: AuthContextValue;
  beforeEach(() => { ctx = makeAuthCtx(); });

  it("shows welcome step with the user's first name", () => {
    renderOnboarding(ctx);
    expect(screen.getByText(/welcome, jane/i)).toBeInTheDocument();
  });

  it("advances to the bank-connection step on Get Started click", async () => {
    const user = userEvent.setup();
    renderOnboarding(ctx);
    await user.click(screen.getByRole("button", { name: /get started/i }));
    expect(await screen.findByText(/connect your bank/i)).toBeInTheDocument();
  });

  it("shows the Plaid link sheet when Connect button is clicked", async () => {
    const user = userEvent.setup();
    renderOnboarding(ctx);
    await user.click(screen.getByRole("button", { name: /get started/i }));
    await user.click(await screen.findByRole("button", { name: /connect.*plaid/i }));
    expect(await screen.findByText(/choose your bank/i)).toBeInTheDocument();
  });

  it("skip button calls completeOnboarding without a bank name", async () => {
    const user = userEvent.setup();
    renderOnboarding(ctx);
    await user.click(screen.getByRole("button", { name: /get started/i }));
    await user.click(await screen.findByRole("button", { name: /skip/i }));
    expect(ctx.completeOnboarding).toHaveBeenCalledWith(undefined);
  });

  it("completes onboarding with bank name after simulating Plaid flow", async () => {
    const user = userEvent.setup();
    renderOnboarding(ctx);

    await user.click(screen.getByRole("button", { name: /get started/i }));
    await user.click(await screen.findByRole("button", { name: /connect.*plaid/i }));

    // Select Chase
    const chaseBtn = await screen.findByRole("button", { name: /chase/i });
    await user.click(chaseBtn);

    // Connect with pre-filled sandbox credentials
    await user.click(await screen.findByRole("button", { name: /^connect$/i }));

    // Wait for the 1800ms connecting animation to resolve, then account selection appears
    const checkingBtn = await screen.findByRole("button", { name: /checking/i }, { timeout: 4000 });
    await user.click(checkingBtn);

    // Plaid success step — "Continue" closes the Plaid sheet and advances to onboarding step 2
    const continueBtn = await screen.findByRole("button", { name: /continue/i });
    await user.click(continueBtn);

    // Onboarding step 2 "All set" — "Enter Kova →" calls completeOnboarding
    const enterBtn = await screen.findByRole("button", { name: /enter kova/i });
    await user.click(enterBtn);

    expect(ctx.completeOnboarding).toHaveBeenCalledWith("Chase");
  }, 10_000); // 10s to accommodate the 1800ms connecting animation
});

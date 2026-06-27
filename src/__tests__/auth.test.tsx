import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { AuthContext, type AuthContextValue } from "../app/context/AuthContext";
import { LoginScreen } from "../app/components/auth/LoginScreen";
import { RegisterScreen } from "../app/components/auth/RegisterScreen";
import { ResetPasswordScreen } from "../app/components/auth/ResetPasswordScreen";

// ─── Mock auth context factory ─────────────────────────────────────────────────

function makeAuthCtx(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    user: null,
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

function renderLogin(
  ctx: AuthContextValue,
  onGoToRegister = vi.fn(),
  onForgotPassword = vi.fn(),
) {
  return render(
    <AuthContext.Provider value={ctx}>
      <LoginScreen onGoToRegister={onGoToRegister} onForgotPassword={onForgotPassword} />
    </AuthContext.Provider>
  );
}

function renderRegister(ctx: AuthContextValue, onGoToLogin = vi.fn()) {
  return render(
    <AuthContext.Provider value={ctx}>
      <RegisterScreen onGoToLogin={onGoToLogin} />
    </AuthContext.Provider>
  );
}

function renderReset(ctx: AuthContextValue, onGoBack = vi.fn()) {
  return render(
    <AuthContext.Provider value={ctx}>
      <ResetPasswordScreen onGoBack={onGoBack} />
    </AuthContext.Provider>
  );
}

// ─── LoginScreen ──────────────────────────────────────────────────────────────

describe("LoginScreen", () => {
  let ctx: AuthContextValue;
  beforeEach(() => { ctx = makeAuthCtx(); });

  it("renders email field, password field and sign-in button", () => {
    renderLogin(ctx);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows email required error when submitted empty", async () => {
    const user = userEvent.setup();
    renderLogin(ctx);
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it("shows password required error when submitted empty", async () => {
    const user = userEvent.setup();
    renderLogin(ctx);
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it("shows email format error for invalid email", async () => {
    const user = userEvent.setup();
    renderLogin(ctx);
    await user.type(screen.getByLabelText(/email/i), "notanemail");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it("shows password length error for short password", async () => {
    const user = userEvent.setup();
    renderLogin(ctx);
    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "abc");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/at least 6/i)).toBeInTheDocument();
  });

  it("calls login with trimmed email and password on valid submit", async () => {
    const user = userEvent.setup();
    renderLogin(ctx);
    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => expect(ctx.login).toHaveBeenCalledWith("user@example.com", "password123"));
  });

  it("shows API error message when login fails", async () => {
    const user = userEvent.setup();
    const errorCtx = makeAuthCtx({
      login: vi.fn().mockResolvedValue({ ok: false, error: "Incorrect email or password." }),
    });
    renderLogin(errorCtx);
    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/incorrect email or password/i)).toBeInTheDocument();
  });

  it("calls onGoToRegister when sign up link is clicked", async () => {
    const user = userEvent.setup();
    const onGoToRegister = vi.fn();
    renderLogin(ctx, onGoToRegister);
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    expect(onGoToRegister).toHaveBeenCalledOnce();
  });

  it("calls onForgotPassword when forgot password is clicked", async () => {
    const user = userEvent.setup();
    const onForgotPassword = vi.fn();
    renderLogin(ctx, vi.fn(), onForgotPassword);
    await user.click(screen.getByRole("button", { name: /forgot password/i }));
    expect(onForgotPassword).toHaveBeenCalledOnce();
  });

  it("toggles password visibility when eye button is pressed", async () => {
    const user = userEvent.setup();
    renderLogin(ctx);
    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(passwordInput).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});

// ─── RegisterScreen ──────────────────────────────────────────────────────────

describe("RegisterScreen", () => {
  let ctx: AuthContextValue;
  beforeEach(() => { ctx = makeAuthCtx(); });

  it("renders name, email, password and confirm password fields", () => {
    renderRegister(ctx);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
  });

  it("shows required errors for all empty fields on submit", async () => {
    const user = userEvent.setup();
    renderRegister(ctx);
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/confirm your password/i)).toBeInTheDocument();
  });

  it("shows passwords do not match error", async () => {
    const user = userEvent.setup();
    renderRegister(ctx);
    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "different123");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("calls register with name, email, password on valid submit", async () => {
    const user = userEvent.setup();
    renderRegister(ctx);
    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() =>
      expect(ctx.register).toHaveBeenCalledWith("Jane Doe", "jane@example.com", "password123")
    );
  });

  it("shows API error when registration fails", async () => {
    const user = userEvent.setup();
    const errorCtx = makeAuthCtx({
      register: vi.fn().mockResolvedValue({ ok: false, error: "An account with this email already exists." }),
    });
    renderRegister(errorCtx);
    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
  });

  it("calls onGoToLogin when sign in link is clicked", async () => {
    const user = userEvent.setup();
    const onGoToLogin = vi.fn();
    renderRegister(ctx, onGoToLogin);
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(onGoToLogin).toHaveBeenCalledOnce();
  });
});

// ─── ResetPasswordScreen ─────────────────────────────────────────────────────

describe("ResetPasswordScreen", () => {
  let ctx: AuthContextValue;
  beforeEach(() => { ctx = makeAuthCtx(); });

  it("renders email field and send reset link button", () => {
    renderReset(ctx);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("shows email required error when submitted empty", async () => {
    const user = userEvent.setup();
    renderReset(ctx);
    await user.click(screen.getByRole("button", { name: /send reset link/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it("shows format error for invalid email", async () => {
    const user = userEvent.setup();
    renderReset(ctx);
    await user.type(screen.getByLabelText(/email/i), "notvalid");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it("calls resetPassword with trimmed email on valid submit", async () => {
    const user = userEvent.setup();
    renderReset(ctx);
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));
    await waitFor(() => expect(ctx.resetPassword).toHaveBeenCalledWith("jane@example.com"));
  });

  it("shows success state after email is sent", async () => {
    const user = userEvent.setup();
    renderReset(ctx);
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));
    expect(await screen.findByText(/check your email/i)).toBeInTheDocument();
    expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
  });

  it("shows API error when resetPassword fails", async () => {
    const user = userEvent.setup();
    const errorCtx = makeAuthCtx({
      resetPassword: vi.fn().mockResolvedValue({ ok: false, error: "Too many attempts. Please wait a moment and try again." }),
    });
    renderReset(errorCtx);
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));
    expect(await screen.findByText(/too many attempts/i)).toBeInTheDocument();
  });

  it("calls onGoBack when back button is clicked", async () => {
    const user = userEvent.setup();
    const onGoBack = vi.fn();
    renderReset(ctx, onGoBack);
    await user.click(screen.getByRole("button", { name: /go back/i }));
    expect(onGoBack).toHaveBeenCalledOnce();
  });
});

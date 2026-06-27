import React, { createContext, useContext, useState, useEffect } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  bankConnected: boolean;
  bankName?: string;
  onboardingComplete: boolean;
}

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: (bankName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<{ ok: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ ok: boolean; error?: string }>;
}

// Exported so tests can provide a mock value directly
export const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapUser(su: SupabaseUser): User {
  const m = su.user_metadata as Record<string, unknown>;
  return {
    id: su.id,
    email: su.email ?? "",
    name: (m.name as string) ?? "",
    bankConnected: (m.bank_connected as boolean) ?? false,
    bankName: (m.bank_name as string | undefined) ?? undefined,
    onboardingComplete: (m.onboarding_complete as boolean) ?? false,
  };
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    // Hydrate from existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? mapUser(session.user) : null);
      setIsLoading(false);
    });

    // Keep state in sync and handle special auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
      } else if (event === "USER_UPDATED") {
        setIsPasswordRecovery(false);
        setUser(session?.user ? mapUser(session.user) : null);
      } else {
        setUser(session?.user ? mapUser(session.user) : null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { ok: false as const, error: friendlyError(error.message) };
    return { ok: true as const };
  };

  const register = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
          bank_connected: false,
          onboarding_complete: false,
        },
      },
    });
    if (error) return { ok: false as const, error: friendlyError(error.message) };
    return { ok: true as const };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const completeOnboarding = async (bankName?: string) => {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        bank_connected: !!bankName,
        bank_name: bankName ?? null,
        onboarding_complete: true,
      },
    });
    if (!error && data.user) {
      setUser(mapUser(data.user));
    } else {
      // Optimistic fallback so the UI transitions even if the request failed
      setUser((u) =>
        u ? { ...u, bankConnected: !!bankName, bankName, onboardingComplete: true } : null
      );
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}${window.location.pathname}`,
    });
    if (error) return { ok: false as const, error: friendlyError(error.message) };
    return { ok: true as const };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false as const, error: friendlyError(error.message) };
    setIsPasswordRecovery(false);
    return { ok: true as const };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isPasswordRecovery,
        login,
        register,
        logout,
        completeOnboarding,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

// ─── Error normalisation ──────────────────────────────────────────────────────

function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials"))
    return "Incorrect email or password.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "An account with this email already exists.";
  if (m.includes("password should be at least"))
    return "Password must be at least 6 characters.";
  if (m.includes("unable to validate email address"))
    return "Enter a valid email address.";
  if (m.includes("email rate limit"))
    return "Too many attempts. Please wait a moment and try again.";
  return msg;
}

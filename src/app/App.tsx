import { useState, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { DashboardScreen } from "./components/vault/DashboardScreen";
import { QuestDetailScreen } from "./components/vault/QuestDetailScreen";
import { GroupScreen } from "./components/vault/GroupScreen";
import { NewVaultScreen } from "./components/vault/NewVaultScreen";
import { InsightsScreen } from "./components/vault/InsightsScreen";
import { MemberProfileScreen } from "./components/vault/MemberProfileScreen";
import { WalletScreen } from "./components/vault/WalletScreen";
import { LandingPage } from "./components/landing/LandingPage";
import kovaLogo from "../imgs/kova_logo.png";
import { LoginScreen } from "./components/auth/LoginScreen";
import { RegisterScreen } from "./components/auth/RegisterScreen";
import { ResetPasswordScreen } from "./components/auth/ResetPasswordScreen";
import { UpdatePasswordScreen } from "./components/auth/UpdatePasswordScreen";
import { OnboardingScreen } from "./components/onboarding/OnboardingScreen";
import { DesktopSidebar } from "./components/layout/DesktopSidebar";
import { useAuth } from "./context/AuthContext";
import { useIsDesktop } from "./components/vault/Shared";
import type { Screen, NavigateFn } from "./components/vault/Shared";

// ─── Constants ────────────────────────────────────────────────────────────────

const BG = "linear-gradient(150deg, #E4DEFF 0%, #D0C8F5 50%, #C4BBEE 100%)";
const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";

const SCREEN_LEVEL: Record<Screen, number> = {
  home: 0,
  quest: 1,
  group: 1,
  new: 1,
  insights: 1,
  wallet: 1,
  "member-profile": 2,
};

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const { user, isLoading, isPasswordRecovery, logout } = useAuth();
  const isDesktop = useIsDesktop();
  const prefersReduced = useReducedMotion();

  const [authView, setAuthView] = useState<"landing" | "login" | "register" | "reset-password">("landing");

  // App navigation state
  const [screen, setScreen] = useState<Screen>("home");
  const [navDirection, setNavDirection] = useState<1 | -1>(1);
  const [selectedMember, setSelectedMember] = useState<string>("SR");

  // Reset to home when user logs in fresh
  useEffect(() => {
    if (user?.onboardingComplete) setScreen("home");
  }, [user?.id]);

  // ── Derived phase ──────────────────────────────────────────────────────────
  type Phase = "loading" | "auth" | "onboarding" | "app";
  const phase: Phase = isLoading
    ? "loading"
    : !user
    ? "auth"
    : !user.onboardingComplete
    ? "onboarding"
    : "app";

  // ── Navigation ─────────────────────────────────────────────────────────────
  const navigate: NavigateFn = (s, payload) => {
    const direction = SCREEN_LEVEL[s] < SCREEN_LEVEL[screen] ? -1 : 1;
    setNavDirection(direction);
    if (payload?.memberId) setSelectedMember(payload.memberId);
    setScreen(s);
  };

  // ── Slide variants ─────────────────────────────────────────────────────────
  const variants = {
    enter: (dir: number) => ({
      x: prefersReduced ? 0 : `${dir * 100}%`,
      opacity: prefersReduced ? 0 : 1,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: prefersReduced ? 0 : `${dir * -100}%`,
      opacity: prefersReduced ? 0 : 1,
    }),
  };

  const slideTransition = prefersReduced
    ? { duration: 0.15 }
    : { type: "tween" as const, ease: [0.25, 0.46, 0.45, 0.94], duration: 0.32 };

  // ── Screen renderer ────────────────────────────────────────────────────────
  function renderAppScreen() {
    switch (screen) {
      case "home":
        return <DashboardScreen onNavigate={navigate} />;
      case "quest":
        return <QuestDetailScreen onNavigate={navigate} />;
      case "group":
        return <GroupScreen onNavigate={navigate} />;
      case "new":
        return <NewVaultScreen onNavigate={navigate} />;
      case "insights":
        return <InsightsScreen onNavigate={navigate} />;
      case "member-profile":
        return <MemberProfileScreen memberId={selectedMember} onNavigate={navigate} />;
      case "wallet":
        return <WalletScreen onNavigate={navigate} />;
    }
  }

  // ── Loading splash ─────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: 36,
            height: 36,
            border: "3px solid rgba(123,97,255,0.2)",
            borderTop: "3px solid #7B61FF",
            borderRadius: "50%",
          }}
        />
      </div>
    );
  }

  // ── Shared desktop branding panel (used by auth + password recovery) ─────────
  const brandingPanel = (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        flex: 1,
        background: "linear-gradient(150deg, #7B61FF 0%, #4B3FBF 55%, #2E1F8F 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "-10%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440 }}>
        <img src={kovaLogo} alt="Kova" style={{ height: 48, width: "auto", filter: "brightness(0) invert(1)", marginBottom: 40, display: "block" }} />
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "white", lineHeight: 1.2, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          Banking, the way it should be.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 0 48px" }}>
          Set goals. Stake the pool. Complete AI-generated quests with your group — and actually follow through.
        </p>
        {["AI quests tailored to your spending habits", "Group accountability that actually works", "Loss aversion mechanics that keep you on track"].map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // ── Password recovery (user clicked reset link in email) ─────────────────────
  if (isPasswordRecovery) {
    const panel = (
      <div style={{ width: "100%", maxWidth: 480, height: "100vh", background: "#F0EFFE", position: "relative", overflow: "hidden", flex: isDesktop ? "0 0 480px" : undefined }}>
        <UpdatePasswordScreen />
      </div>
    );
    return (
      <MotionConfig reducedMotion="user">
        {isDesktop ? (
          <div style={{ display: "flex", height: "100vh", fontFamily: FONT, overflow: "hidden" }}>
            {brandingPanel}
            {panel}
          </div>
        ) : (
          <div style={{ minHeight: "100vh", background: BG, display: "flex", justifyContent: "center", fontFamily: FONT }}>
            {panel}
          </div>
        )}
      </MotionConfig>
    );
  }

  // ── Landing page (full-width marketing site) ─────────────────────────────────
  if (phase === "auth" && authView === "landing") {
    return (
      <MotionConfig reducedMotion="user">
        <motion.div
          key="landing-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontFamily: FONT, height: "100vh", overflowY: "auto", overflowX: "hidden", background: "white" }}
        >
          <LandingPage
            onGetStarted={() => setAuthView("register")}
            onSignIn={() => setAuthView("login")}
          />
        </motion.div>
      </MotionConfig>
    );
  }

  // ── Auth screens (login / register / reset-password) ────────────────────────
  if (phase === "auth") {
    const formPanel = (
      <div
        style={{
          width: "100%",
          maxWidth: isDesktop ? 480 : undefined,
          height: "100vh",
          background: "#F0EFFE",
          position: "relative",
          overflow: "hidden",
          flex: isDesktop ? "0 0 480px" : undefined,
          boxShadow: isDesktop ? "none" : "0 0 60px rgba(91,63,223,0.12)",
        }}
      >
        <AnimatePresence mode="popLayout">
          {authView === "login" && (
            <motion.div
              key="login"
              initial={prefersReduced ? { opacity: 0 } : { x: "100%" }}
              animate={{ x: 0, opacity: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { x: "100%" }}
              transition={slideTransition}
              style={{ position: "absolute", inset: 0 }}
            >
              <LoginScreen
                onGoToRegister={() => setAuthView("register")}
                onGoBack={() => setAuthView("landing")}
                onForgotPassword={() => setAuthView("reset-password")}
              />
            </motion.div>
          )}
          {authView === "register" && (
            <motion.div
              key="register"
              initial={prefersReduced ? { opacity: 0 } : { x: "100%" }}
              animate={{ x: 0, opacity: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { x: "100%" }}
              transition={slideTransition}
              style={{ position: "absolute", inset: 0 }}
            >
              <RegisterScreen
                onGoToLogin={() => setAuthView("login")}
                onGoBack={() => setAuthView("landing")}
              />
            </motion.div>
          )}
          {authView === "reset-password" && (
            <motion.div
              key="reset-password"
              initial={prefersReduced ? { opacity: 0 } : { x: "100%" }}
              animate={{ x: 0, opacity: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { x: "100%" }}
              transition={slideTransition}
              style={{ position: "absolute", inset: 0 }}
            >
              <ResetPasswordScreen onGoBack={() => setAuthView("login")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );

    if (isDesktop) {
      return (
        <MotionConfig reducedMotion="user">
          <div style={{ display: "flex", height: "100vh", fontFamily: FONT, overflow: "hidden" }}>
            {brandingPanel}
            {formPanel}
          </div>
        </MotionConfig>
      );
    }

    return (
      <MotionConfig reducedMotion="user">
        <div style={{ minHeight: "100vh", background: BG, display: "flex", justifyContent: "center", fontFamily: FONT }}>
          {formPanel}
        </div>
      </MotionConfig>
    );
  }

  // ── Onboarding ─────────────────────────────────────────────────────────────
  if (phase === "onboarding") {
    return (
      <MotionConfig reducedMotion="user">
        <div
          style={{
            minHeight: "100vh",
            background: BG,
            display: "flex",
            justifyContent: "center",
            fontFamily: FONT,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              height: "100vh",
              background: "#F0EFFE",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 0 60px rgba(91,63,223,0.12)",
            }}
          >
            <OnboardingScreen />
          </div>
        </div>
      </MotionConfig>
    );
  }

  // ── Main app ───────────────────────────────────────────────────────────────
  // Desktop: sidebar (240px) + app column (480px max, centered in remaining space)
  // Mobile:  app column full-width, centered
  return (
    <MotionConfig reducedMotion="user">
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          display: "flex",
          justifyContent: isDesktop ? "flex-start" : "center",
          alignItems: "stretch",
          fontFamily: FONT,
        }}
      >
        {/* Desktop sidebar */}
        {isDesktop && (
          <DesktopSidebar
            active={screen}
            onNavigate={navigate}
            user={user}
            onLogout={logout}
          />
        )}

        {/* App column */}
        <div
          style={{
            flex: isDesktop ? 1 : undefined,
            width: isDesktop ? undefined : "100%",
            maxWidth: 480,
            height: "100vh",
            background: "#F0EFFE",
            position: "relative",
            overflow: "hidden",
            boxShadow: isDesktop ? "none" : "0 0 60px rgba(91,63,223,0.12)",
            // Centre the column in the remaining space on desktop
            marginLeft: isDesktop ? "auto" : undefined,
            marginRight: isDesktop ? "auto" : undefined,
          }}
        >
          <AnimatePresence mode="popLayout" custom={navDirection}>
            <motion.div
              key={screen}
              custom={navDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              style={{ position: "absolute", inset: 0 }}
            >
              {renderAppScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}

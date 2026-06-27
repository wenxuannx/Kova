import React from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Problem } from "./Problem";
import { HowItWorks } from "./HowItWorks";
import { AIQuestEngine } from "./AIQuestEngine";
import { EthicalMechanic } from "./EthicalMechanic";
import { SocialSection } from "./SocialSection";
import { Testimonials } from "./Testimonials";
import { CTABanner } from "./CTABanner";
import { Footer } from "./Footer";

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onGetStarted, onSignIn }: Props) {
  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        overflowX: "hidden",
      }}
    >
      <Navbar onGetStarted={onGetStarted} onSignIn={onSignIn} />
      <Hero onGetStarted={onGetStarted} onSignIn={onSignIn} />
      <Problem />
      <HowItWorks />
      <AIQuestEngine />
      <EthicalMechanic />
      <SocialSection />
      <Testimonials />
      <CTABanner onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}

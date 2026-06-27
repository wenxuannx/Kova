import React, { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import kovaLogo from "../../../imgs/kova_logo.png";

interface NavbarProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

export function Navbar({ onSignIn, onGetStarted }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "white",
        borderBottom: "0.5px solid #E5E7EB",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
        }}
        className="px-5 md:px-[80px]"
      >
        {/* Logo image */}
        <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img
            src={kovaLogo}
            alt="Kova"
            style={{ height: 32, width: "auto", display: "block" }}
          />
        </a>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onSignIn}
            style={{
              background: "none",
              border: "none",
              fontSize: 14,
              color: "#1A1A2E",
              cursor: "pointer",
              padding: "8px 12px",
              fontFamily: "inherit",
              fontWeight: 500,
            }}
          >
            Log in
          </button>
          <button
            onClick={onGetStarted}
            style={{
              background: "#7B61FF",
              border: "none",
              color: "white",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              padding: "0 20px",
              height: 40,
              borderRadius: 50,
              fontFamily: "inherit",
              boxShadow: "0 2px 12px rgba(123,97,255,0.30)",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#6B52E8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#7B61FF")}
          >
            Get started free
          </button>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#1A1A2E" }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: "white",
            borderTop: "0.5px solid #E5E7EB",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <button
            onClick={onSignIn}
            style={{
              background: "none",
              border: "1px solid #E5E7EB",
              fontSize: 15,
              color: "#1A1A2E",
              cursor: "pointer",
              padding: "12px",
              borderRadius: 50,
              fontFamily: "inherit",
            }}
          >
            Log in
          </button>
          <button
            onClick={onGetStarted}
            style={{
              background: "#7B61FF",
              border: "none",
              color: "white",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              padding: "12px",
              borderRadius: 50,
              fontFamily: "inherit",
            }}
          >
            Get started free
          </button>
        </div>
      )}
    </nav>
  );
}

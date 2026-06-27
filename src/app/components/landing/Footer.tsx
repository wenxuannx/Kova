import React from "react";
import kovaLogo from "../../../imgs/kova_logo.png";

export function Footer() {
  return (
    <footer style={{ background: "#1A1A2E" }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "32px 80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
        className="px-5 md:px-[80px]"
      >
        <img
          src={kovaLogo}
          alt="Kova"
          style={{ height: 28, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.85 }}
        />
        <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
          © {new Date().getFullYear()} Kova. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

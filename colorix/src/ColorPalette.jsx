import React from "react";
import { gsap } from "gsap";

export default function ColorPalette({ palette, setColorData }) {
  if (!palette.length) return null;

  // Handle click on a saved color
  const handleClick = (color) => {
    // Update app-wide color data
    setColorData({
      hex: { value: color.hex },
      name: { value: color.name || "(saved color)" },
    });

    // Animate bubbles
    gsap.to(".bubble", {
      backgroundColor: color.hex,
      boxShadow: `0 8px 24px ${color.hex}33`,
      duration: 1,
      ease: "power2.out",
    });
  };

  return (
    <div className="color-palette" style={{ marginTop: 20 }}>
      <h2>🎨 Saved Palette</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginTop: 8,
          justifyContent: "center",
        }}
      >
        {palette.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
            }}
            onClick={() => handleClick(c)}
            title={`Click to apply ${c.name || c.hex}`}
          >
            {/* Color swatch */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: c.hex,
                border: "2px solid #333",
                boxShadow: "0 0 6px rgba(0,0,0,0.3)",
              }}
            />
            {/* Hex code */}
            <div
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#222",
                textAlign: "center",
              }}
            >
              {c.hex}
            </div>
            {/* Optional name */}
            {c.name && (
              <div
                style={{
                  fontSize: 10,
                  color: "#555",
                  textAlign: "center",
                  marginTop: 2,
                }}
              >
                {c.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

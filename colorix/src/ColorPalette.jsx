import React from "react";
import { gsap } from "gsap";

export default function ColorPalette({ palette, setColorData, setPalette }) {
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

  // Handle remove palette item
  const handleRemove = (index) => {
    setPalette(palette.filter((_, i) => i !== index));
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
            {/* Component colors */}
            {c.components && (
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                {c.components.map((comp, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: comp,
                      border: "1px solid #333",
                    }}
                  />
                ))}
              </div>
            )}
            {/* Description of mixed colors */}
            {c.componentNames && (
              <div
                style={{
                  fontSize: 8,
                  color: "#666",
                  textAlign: "center",
                  marginTop: 2,
                }}
              >
                Mixed from:{" "}
                {c.componentNames
                  .map((name, idx) => `${name} (${c.components[idx]})`)
                  .join(", ")}
              </div>
            )}
            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(i);
              }}
              style={{
                fontSize: 10,
                marginTop: 4,
                padding: "2px 6px",
                background: "#f00",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

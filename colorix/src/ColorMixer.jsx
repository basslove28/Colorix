import React, { useState, useEffect } from "react";
import { gsap } from "gsap";

// Convert hex → RGB
const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const bigint = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

// Convert RGB → hex
const rgbToHex = (r, g, b) =>
  "#" +
  [r, g, b]
    .map((x) => {
      const s = x.toString(16);
      return s.length === 1 ? "0" + s : s;
    })
    .join("");

// Fetch color name from API
async function fetchColorName(hex) {
  try {
    const res = await fetch(
      `https://www.thecolorapi.com/id?hex=${hex.replace("#", "")}`
    );
    const data = await res.json();
    return data?.name?.value ?? "Unknown";
  } catch {
    return "Unknown";
  }
}

export default function ColorMixer({ setColorData, palette, setPalette }) {
  const [mode, setMode] = useState(2);
  const [color1, setColor1] = useState("#ff6b6b");
  const [color2, setColor2] = useState("#4dabf7");
  const [color3, setColor3] = useState("#ffd166");

  const [color1Name, setColor1Name] = useState("");
  const [color2Name, setColor2Name] = useState("");
  const [color3Name, setColor3Name] = useState("");

  const [mixedColor, setMixedColor] = useState(null);
  const [suggestedName, setSuggestedName] = useState(null);

  // Update color names whenever user picks a new color
  useEffect(() => {
    fetchColorName(color1).then(setColor1Name);
  }, [color1]);

  useEffect(() => {
    fetchColorName(color2).then(setColor2Name);
  }, [color2]);

  useEffect(() => {
    if (mode === 3) {
      fetchColorName(color3).then(setColor3Name);
    }
  }, [color3, mode]);

  // Mix function
  const mixAndFetch = async () => {
    const rgbs = [hexToRgb(color1), hexToRgb(color2)];
    if (mode === 3) rgbs.push(hexToRgb(color3));

    const mixed = {
      r: Math.round(rgbs.reduce((s, c) => s + c.r, 0) / rgbs.length),
      g: Math.round(rgbs.reduce((s, c) => s + c.g, 0) / rgbs.length),
      b: Math.round(rgbs.reduce((s, c) => s + c.b, 0) / rgbs.length),
    };

    const newHex = rgbToHex(mixed.r, mixed.g, mixed.b);
    setMixedColor(newHex);

    gsap.to(".bubble", {
      backgroundColor: newHex,
      boxShadow: `0 8px 24px ${newHex}33`,
      duration: 1,
      ease: "power2.out",
    });

    try {
      const res = await fetch(
        `https://www.thecolorapi.com/id?hex=${newHex.replace("#", "")}`
      );
      const data = await res.json();
      setColorData(data);
      setSuggestedName(data?.name?.value ?? null);
    } catch (err) {
      console.error("Color API error:", err);
      setColorData({
        hex: { value: newHex },
        name: { value: "(mixed color)" },
        rgb: { value: `rgb(${mixed.r}, ${mixed.g}, ${mixed.b})` },
      });
      setSuggestedName("(mixed color)");
    }
  };

  const addToPalette = () => {
    if (!mixedColor) return;
    const entry = { hex: mixedColor, name: suggestedName || "Custom Color" };
    setPalette([...palette, entry]);
  };

  return (
    <div className="color-mixer">
      <h2>🎨 Color Mixer</h2>

      <div className="mode-toggle">
        <label>
          <input
            type="radio"
            checked={mode === 2}
            onChange={() => setMode(2)}
          />{" "}
          Mix 2 Colors
        </label>
        <label style={{ marginLeft: 12 }}>
          <input
            type="radio"
            checked={mode === 3}
            onChange={() => setMode(3)}
          />{" "}
          Mix 3 Colors
        </label>
      </div>

      {/* Color Pickers */}
      <div
        className="inputs"
        style={{ display: "flex", gap: 24, marginTop: 16 }}
      >
        {/* Color 1 */}
        <div style={{ textAlign: "center" }}>
          <input
            type="color"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
          />
          <div style={{ marginTop: 6, fontSize: 12 }}>
            <div>{color1.toUpperCase()}</div>
            <div style={{ color: "#666" }}>{color1Name}</div>
          </div>
        </div>

        {/* Color 2 */}
        <div style={{ textAlign: "center" }}>
          <input
            type="color"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
          />
          <div style={{ marginTop: 6, fontSize: 12 }}>
            <div>{color2.toUpperCase()}</div>
            <div style={{ color: "#666" }}>{color2Name}</div>
          </div>
        </div>

        {/* Color 3 (if enabled) */}
        {mode === 3 && (
          <div style={{ textAlign: "center" }}>
            <input
              type="color"
              value={color3}
              onChange={(e) => setColor3(e.target.value)}
            />
            <div style={{ marginTop: 6, fontSize: 12 }}>
              <div>{color3.toUpperCase()}</div>
              <div style={{ color: "#666" }}>{color3Name}</div>
            </div>
          </div>
        )}
      </div>

      {/* Mix button */}
      <div style={{ marginTop: 12 }}>
        <button onClick={mixAndFetch}>Mix Colors</button>
      </div>

      {/* Mixed Color Preview */}
      {mixedColor && (
        <div className="mixed-result" style={{ marginTop: 12 }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 40,
                borderRadius: 8,
                background: mixedColor,
                border: "2px solid #eee",
              }}
            />
            <div>
              <div style={{ fontWeight: 700 }}>{mixedColor}</div>
              <div style={{ fontSize: 12, color: "#444" }}>
                {suggestedName ?? "Loading..."}
              </div>
            </div>
          </div>
          <button style={{ marginTop: 10 }} onClick={addToPalette}>
            ➕ Add to Palette
          </button>
        </div>
      )}
    </div>
  );
}

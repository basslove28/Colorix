import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import SearchBar from "./SearchBar.jsx";
import ColorWheel from "./ColorWheel.jsx";
import ColorResults from "./ColorResults.jsx";
import ColorMixer from "./ColorMixer.jsx";
import ColorPalette from "./ColorPalette.jsx"; // ✅ new component
import "./styles.css";

export default function App() {
  const [colorData, setColorData] = useState(null);
  const [palette, setPalette] = useState([]); // ✅ store saved colors

  useEffect(() => {
    const bubbles = gsap.utils.toArray(".bubble");
    bubbles.forEach((b) => {
      gsap.to(b, {
        y: -window.innerHeight - 200,
        duration: 8 + Math.random() * 8,
        repeat: -1,
        delay: Math.random() * 6,
        ease: "sine.inOut",
      });
    });

    gsap.from(".app-container", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (!colorData?.hex?.value) return;
    const hex = colorData.hex.value;
    gsap.to(".bubble", {
      backgroundColor: hex,
      boxShadow: `0 8px 24px ${hex}33`,
      duration: 0.9,
      ease: "power2.out",
    });
  }, [colorData]);

  return (
    <div className="app-wrapper">
      <div className="bubbles" aria-hidden>
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="bubble" />
        ))}
      </div>

      <div className="app-container">
        <h1 className="title">🎨 Colorix</h1>
        <p className="lead">
          Search, pick, mix 2–3 colors — save your favorites to the palette.
        </p>
        <SearchBar setColorData={setColorData} />
        <ColorWheel setColorData={setColorData} />
        <ColorMixer
          setColorData={setColorData}
          palette={palette}
          setPalette={setPalette}
        />{" "}
        {/* ✅ */}
        {colorData && <ColorResults colorData={colorData} />}
        <ColorPalette palette={palette} /> {/* ✅ */}
      </div>
    </div>
  );
}

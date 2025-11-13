import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import WelcomePage from "./WelcomePage.jsx";
import SearchBar from "./SearchBar.jsx";
import ColorWheel from "./ColorWheel.jsx";
import ColorResults from "./ColorResults.jsx";
import ColorMixer from "./ColorMixer.jsx";
import ColorPalette from "./ColorPalette.jsx"; // ✅ new component
import "./styles.css";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [colorData, setColorData] = useState(null);
  const [palette, setPalette] = useState([]); // ✅ store saved colors

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  useEffect(() => {
    gsap.from(".app-container", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (!showWelcome) {
      // Small delay to ensure bubbles are rendered
      setTimeout(() => {
        const bubbles = gsap.utils.toArray(".bubble");
        if (bubbles.length > 0) {
          bubbles.forEach((b) => {
            // Set initial random position
            gsap.set(b, {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            });

            // Function to animate to new random position
            const animateBubble = (bubble) => {
              gsap.to(bubble, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                duration: 4 + Math.random() * 4,
                ease: "sine.inOut",
                onComplete: () => animateBubble(bubble),
              });
            };

            // Start animation
            animateBubble(b);
          });
        }
      }, 100);
    }
  }, [showWelcome]);

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

  if (showWelcome) {
    return <WelcomePage onComplete={handleWelcomeComplete} />;
  }

  return (
    <>
      <div className="bubbles" aria-hidden>
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="bubble" />
        ))}
      </div>
      <div className="app-wrapper">
        <div className="app-container">
          <h1 className="title">🎨 Mixaroo</h1>
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
          <ColorPalette palette={palette} setPalette={setPalette} /> {/* ✅ */}
        </div>
      </div>
    </>
  );
}

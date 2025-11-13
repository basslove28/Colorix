import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function WelcomePage({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const logoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Bubble animation - random movement
    const bubbles = gsap.utils.toArray(".bubble");
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

    const text = "Mixaroo";
    const letters = text.split("");

    // Clear existing content
    textRef.current.innerHTML = "";

    // Create spans for each letter
    letters.forEach((letter) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateY(20px)";
      textRef.current.appendChild(span);
    });

    // Animation timeline
    const tl = gsap.timeline();

    // Play audio at the start
    tl.call(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.play().catch((error) => {
          console.log("Audio play failed:", error);
        });
      }
    });

    // Logo animation
    tl.fromTo(
      logoRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: "back.out(1.7)" }
    );

    // Text animation - stagger letters
    tl.fromTo(
      textRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.5"
    );

    // Wait a bit then call onComplete
    tl.to({}, { duration: 2, onComplete: onComplete });
  }, [onComplete]);

  return (
    <div ref={containerRef} className="welcome-page">
      <div className="bubbles" aria-hidden>
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="bubble" />
        ))}
      </div>
      <div className="welcome-content">
        <div
          ref={logoRef}
          className="welcome-logo"
          onClick={() => {
            const audio = audioRef.current;
            if (audio) {
              audio.play().catch((error) => {
                console.log("Audio play failed:", error);
              });
            }
          }}
          style={{ cursor: "pointer" }}
        >
          🎨
        </div>
        <h1 ref={textRef} className="welcome-text"></h1>
      </div>
      <audio
        ref={audioRef}
        src="/679064__divingboard__happy-melody.m4a"
        preload="auto"
      />
    </div>
  );
}

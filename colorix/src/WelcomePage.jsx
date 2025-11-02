import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function WelcomePage({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
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
      <div className="welcome-content">
        <div ref={logoRef} className="welcome-logo">
          🎨
        </div>
        <h1 ref={textRef} className="welcome-text"></h1>
      </div>
    </div>
  );
}

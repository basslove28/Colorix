import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ColorResults({ colorData }) {
  const ref = useRef(null);
  const hex = colorData?.hex?.value;
  const name = colorData?.name?.value ?? "(unknown)";

  // Animation: run every time hex changes (hook always called; early return inside effect)
  useEffect(() => {
    if (!hex || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1,0.5)" }
    );
  }, [hex]);

  if (!hex) return null;

  return (
    <div className="color-results" aria-live="polite">
      <div
        ref={ref}
        className="color-swatch"
        style={{
          background: hex,
          boxShadow: `0 12px 36px ${hex}33` /* subtle glow */,
        }}
      />
      <div className="meta">
        <div>
          <strong>HEX:</strong> {hex}
        </div>
        <div>
          <strong>Name:</strong> {name}
        </div>
        <div>
          <strong>RGB:</strong> {colorData?.rgb?.value}
        </div>
      </div>
    </div>
  );
}

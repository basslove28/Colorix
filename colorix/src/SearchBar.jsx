import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

/**
 * Try to convert CSS color name (or hex) to a 6-char hex (uppercase).
 * Returns null if invalid.
 */
function cssToHex(input) {
  if (!input) return null;
  const s = input.trim().toLowerCase();

  // Hex pattern
  const hexMatch = s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let raw = hexMatch[1];
    if (raw.length === 3) {
      raw = raw
        .split("")
        .map((c) => c + c)
        .join("");
    }
    return raw.toUpperCase();
  }

  // Try browser parsing
  const el = document.createElement("div");
  el.style.color = s;
  document.body.appendChild(el);
  const cs = getComputedStyle(el).color;
  document.body.removeChild(el);

  const m = cs.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return null;
  const r = parseInt(m[1], 10);
  const g = parseInt(m[2], 10);
  const b = parseInt(m[3], 10);
  const hex = ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase();
  return hex;
}

export default function SearchBar({ setColorData }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const errorRef = useRef(null);

  // Animate error when it changes
  useEffect(() => {
    if (error && errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [error]);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) {
      setError("Please enter a color name or hex.");
      return;
    }

    setError("");

    // Determine hex from query
    const maybeHex = cssToHex(q);
    if (!maybeHex) {
      setError("Invalid color input. Try a name or hex like '#3498db'.");
      return;
    }

    // First try using name-based API (if user typed a non-hex)
    let data = null;
    try {
      if (!q.startsWith("#") && isNaN(parseInt(q.replace("#", ""), 16))) {
        // user entered name — try name endpoint
        const nameRes = await fetch(
          `https://www.thecolorapi.com/id?name=${encodeURIComponent(q)}`
        );
        const nameData = await nameRes.json();
        if (
          nameData &&
          nameData.hex &&
          nameData.hex.value &&
          nameData.hex.value.toLowerCase() !== "#000000"
        ) {
          data = nameData;
        }
      }
    } catch (err) {
      console.warn("Name-based lookup failed:", err);
    }

    // If name lookup failed or gave default, fallback to hex lookup
    if (!data) {
      try {
        const hexRes = await fetch(
          `https://www.thecolorapi.com/id?hex=${maybeHex}`
        );
        const hexData = await hexRes.json();
        if (hexData && hexData.hex && hexData.hex.value) {
          data = hexData;
        }
      } catch (err) {
        console.error("Hex lookup failed:", err);
      }
    }

    if (data && data.hex && data.hex.value) {
      setColorData(data);
      setError("");
    } else {
      setError("❌ Color not found. Try a valid name or hex.");
    }
  };

  const onEnter = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter color name or hex (#3498db or blue)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onEnter}
      />
      <button onClick={handleSearch}>Search</button>
      {error && (
        <div
          ref={errorRef}
          style={{
            marginTop: 6,
            color: "#e74c3c",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

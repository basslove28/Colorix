import React, { useState } from "react";

/**
 * Helper: convert CSS color name / hex / rgb to 6-char HEX (no #).
 * Returns uppercase HEX string like "FF5733" or null if invalid.
 */
function cssColorToHex(input) {
  if (!input) return null;
  const str = input.trim();

  // direct hex (#fff or #ffffff or fff)
  if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(str)) {
    const raw = str.replace("#", "");
    const hex =
      raw.length === 3
        ? raw
            .split("")
            .map((c) => c + c)
            .join("")
        : raw;
    return hex.toUpperCase();
  }

  // use browser to parse named colors / rgb
  const el = document.createElement("div");
  el.style.color = str;
  document.body.appendChild(el);
  const cs = getComputedStyle(el).color; // "rgb(r,g,b)" or "rgba(...)"
  document.body.removeChild(el);

  const m = cs.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return null;
  const r = Number(m[1]),
    g = Number(m[2]),
    b = Number(m[3]);
  const hex = ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase();
  return hex;
}

export default function SearchBar({ setColorData }) {
  const [query, setQuery] = useState("");

  const search = async () => {
    if (!query) return;
    const hex = cssColorToHex(query);
    if (!hex) {
      alert(
        "Couldn't parse that color. Try a CSS color name (e.g., skyblue) or a hex like #ff5733."
      );
      return;
    }
    try {
      const res = await fetch(`https://www.thecolorapi.com/id?hex=${hex}`);
      const data = await res.json();
      setColorData(data);
    } catch (err) {
      console.error(err);
      alert("Network error fetching color info.");
    }
  };

  const onEnter = (e) => {
    if (e.key === "Enter") search();
  };

  return (
    <div className="search-row">
      <input
        type="text"
        placeholder="CSS color name or hex (e.g., lavender / #ff5733)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onEnter}
      />
      <button onClick={search}>Search</button>
    </div>
  );
}

import React, { useState } from "react";

export default function ColorWheel({ setColorData }) {
  const [selected, setSelected] = useState("#FF6B6B");

  const pick = async (e) => {
    const hex = e.target.value.replace("#", "");
    setSelected(`#${hex.toUpperCase()}`);
    try {
      const res = await fetch(`https://www.thecolorapi.com/id?hex=${hex}`);
      const data = await res.json();
      setColorData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="wheel-row">
      <input
        type="color"
        value={selected}
        onChange={pick}
        aria-label="color picker"
      />
      <div className="selected-hex">
        Selected: <strong>{selected}</strong>
      </div>
    </div>
  );
}

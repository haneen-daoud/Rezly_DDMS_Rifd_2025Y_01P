import React from "react";
import ColorIcon from "../../icons/color.svg?react";

export default function ColorSelector({ selectedColor, setSelectedColor }) {
  const colors = [
    { bg: "#DCFCE7", border: "#22C55E", text: "#14532D" },
    { bg: "#EDE9FE", border: "#8B5CF6", text: "#4C1D95" },
    { bg: "#DBEAFE", border: "#3B82F6", text: "#1E3A8A" },
    { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" },
  ];

  return (
    <div className="flex items-center gap-4 w-full h-10">
      {/* أيقونة اللون + كلمة اللون */}
      <div className="flex items-center gap-2">
        <ColorIcon className="w-4 h-4 text-[var(--color-purple)]" />
        <span className="text-[12px] font-bold text-[#000] leading-[18px]">
          اللون
        </span>
      </div>

      {/* الدوائر */}
      <div className="flex items-center gap-3">
        {colors.map((c, i) => {
          const isSelected = selectedColor?.bg === c.bg;
          return (
            <button
              key={i}
              onClick={() => setSelectedColor(c)}
              className="relative w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ padding: 0, border: "none" }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: c.border }}
              />
              {isSelected && (
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "130%",
                    height: "130%",
                    border: `2px solid ${c.border}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

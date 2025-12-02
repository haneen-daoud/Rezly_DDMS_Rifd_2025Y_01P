import React from "react";

export const LABEL_BASE_CLASS =
  "text-[14px] font-bold text-[#000000] whitespace-nowrap";

export default function SettingsLinkRow({
  label,
  isExpanded,
  onToggle,
  children,
}) {
  return (
    <div className="w-full rounded-[8px] border border-[#E5E7EB] bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full h-[48px] px-3 flex items-center justify-between text-[14px] font-bold text-[#000000]
                   hover:bg-[#F9FAFF] transition-colors"
      >
        <span>{label}</span>

        <span
          className={[
            "inline-flex items-center justify-center w-[22px] h-[22px] rounded-full",
            "transition-transform",
            isExpanded ? "rotate-90" : "rotate-0",
          ].join(" ")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 15.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L9.414 10l3.293 3.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isExpanded && <div className="px-3 pt-2 pb-3 bg-white">{children}</div>}
    </div>
  );
}

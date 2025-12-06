import React from "react";
import DownArrowIcon from "../../icons/downarrow.svg";

export const LABEL_BASE_CLASS =
  "text-[14px] font-bold text-[#000000]";

export default function SettingsLinkRow({
  label,
  isExpanded,
  onToggle,
  children,
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-[#E5E7EB] pb-3 last:border-b-0 last:pb-0">
      {/* صف العنوان القابل للضغط */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-right"
      >
        <span className="text-[16px] font-medium text-[#000000]">
          {label}
        </span>

        {/* سهم بسيط يوضح الفتح/الإغلاق */}
        <span
          className={`text-[18px] leading-none transform transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <img src={DownArrowIcon} alt="اختر" />
        </span>
      </button>

      {/* المحتوى: نخلّيه دايماً موجود، بس نعمله hidden لما يكون القسم مسكّر */}
      <div className={isExpanded ? "mt-2" : "mt-2 hidden"}>
        {children}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import downarrowIcon from "../../icons/downarrow.svg";
import MembersIcon from "../../icons/members.svg?react";
import { toast } from "react-toastify";

export default function MaxParticipantsSelector({
  selectedMax,
  setSelectedMax,
  borderColor = "#7E818C",
  options,
  showLabel = true,
  showIcon = false,
  variant = "booking",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const ref = useRef(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // لو كان المستخدم مختار قيمة مخصصة من قبل، نخليها ظاهرة
  useEffect(() => {
    // افحص هل selectedMax من الخيارات الأساسية
    const isPredefined = options.some(
      (opt) =>
        opt.value === selectedMax ||
        (opt.value === Infinity && selectedMax === 9999)
    );

    if (selectedMax && !isPredefined) {
      // القيمة مخصصة
      setCustomValue(selectedMax.toString());
    } else {
      // خيار جاهز → ما نكتب إشي بخانة المخصص
      setCustomValue("");
    }
  }, [selectedMax, options]);

  const handleCustomSubmit = (e) => {
    if (e) e.preventDefault();
    if (disabled) return;

    const value = Number(customValue);

    if (!customValue || Number.isNaN(value)) {
      toast.error("يرجى إدخال رقم صحيح");
      return;
    }

    if (value <= 0) {
      toast.error("يرجى إدخال رقم صحيح");
      return;
    }

    setSelectedMax(value);
    setOpen(false);
  };

  const [openUp, setOpenUp] = useState(false);

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // إذا المساحة تحت أقل من 230px نفتح لفوق
      setOpenUp(spaceBelow < 230 && spaceAbove > spaceBelow);
    }
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      {showLabel && (
        <label className="block font-bold text-sm mb-2">
          الحد الأقصى للمشتركين
        </label>
      )}

      {/* الزر الرئيسي */}
      <div
        className={`w-full h-10 rounded-md flex items-center justify-between p-3 relative ${
          disabled
            ? "cursor-not-allowed bg-gray-100"
            : "cursor-pointer bg-white"
        }`}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
        style={{ border: `1px solid ${borderColor}` }}
      >
        {showIcon && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            <MembersIcon className="w-5 h-5 text-[var(--color-purple)]" />
          </span>
        )}

        <div
          className={`flex items-center justify-between w-full ${
            showIcon ? "pr-6" : ""
          }`}
        >
          <span
            className={`h-10 flex items-center ${
              selectedMax
                ? variant === "event"
                  ? "font-bold text-[14px] text-[#000]"
                  : "font-normal text-[14px] text-[#000]"
                : "text-gray-400 font-normal text-[14px]"
            } ${disabled ? "text-gray-500" : ""}`}
          >
            {selectedMax
              ? selectedMax === 9999
                ? "غير محدود"
                : `${selectedMax} مشترك${selectedMax > 1 ? "ين" : ""}`
              : "اختر العدد"}
          </span>

          <img src={downarrowIcon} alt="downarrow" className="w-4 h-4" />
        </div>
      </div>

      {/* الدروب داون */}
      {open && !disabled && (
        <div
          className={`absolute left-0 w-full bg-white rounded-[16px] border border-gray-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-50
  ${
    openUp
      ? showLabel
        ? "bottom-[calc(100%-28px)] mb-1"
        : "bottom-full mb-1"
      : "top-full mt-1"
  }
`}
        >
          <div className="overflow-visible">
            {options.map((option, idx) => {
              if (option.value !== "custom") {
                const isSelected =
                  selectedMax === option.value ||
                  (option.value === Infinity && selectedMax === 9999);

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between h-[40px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                    onClick={() => {
                      if (disabled) return;
                      const value =
                        option.value === Infinity ? 9999 : option.value;
                      setSelectedMax(value);
                      setCustomValue("");
                      setOpen(false);
                    }}
                  >
                    <span
                      className={`text-[12px] ${
                        isSelected
                          ? "font-bold text-[#000]"
                          : "font-normal text-[#000]"
                      }`}
                    >
                      {option.label}
                    </span>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-[var(--color-purple)]"
                          : "border-gray-400"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-purple)]"></div>
                      )}
                    </div>
                  </div>
                );
              }

              // خيار أدخل عدداً مخصصاً
              const isPredefined = options.some(
                (opt) =>
                  opt.value === selectedMax ||
                  (opt.value === Infinity && selectedMax === 9999)
              );

              const isSelected = selectedMax && !isPredefined;

              return (
                <div
                  key={idx}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between h-[60px] px-3 py-2 border-t border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-[12px] font-semibold text-[#000] whitespace-nowrap">
                      أو أدخل عدداً مخصصاً:
                    </span>
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="number"
                        min="1"
                        placeholder="أدخل العدد"
                        value={customValue}
                        onChange={(e) => {
                          if (disabled) return;
                          setCustomValue(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleCustomSubmit(e);
                          }
                        }}
                        className="w-[114px] h-[32px] border border-gray-300 rounded-md px-2 py-1 text-right focus:outline-none text-[12px] font-normal text-[#7E818C] placeholder-[#7E818C]"
                      />
                    </div>
                  </div>

                  <div
                    onClick={(e) => {
                      if (disabled) return;
                      e.stopPropagation();
                      handleCustomSubmit(e);
                    }}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? "border-[var(--color-purple)]"
                        : "border-gray-400"
                    }`}
                  >
                    {isSelected && customValue && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-purple)]"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

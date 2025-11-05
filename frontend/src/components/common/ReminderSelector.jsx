import React, { useState, useEffect, useRef } from "react";
import DownArrowIcon from "../../icons/downarrow.svg?react";
import MuteIcon from "../../icons/mute.svg?react";
import NotificationIcon from "../../icons/notification.svg?react";

const ReminderSelector = ({
  selectedReminders = [],
  setSelectedReminders,
  showIconInInput = false,
  placeholder = "اختر موعد التذكير",
  borderStyle = "#D1D5DB",
  placeholderColor = "text-gray-400",
  variant = "booking",
  showLabel = true,
}) => {
  const [openReminder, setOpenReminder] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef(null);

  // إغلاق عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenReminder(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تحديد الاتجاه (لفوق أو لتحت)
  useEffect(() => {
    if (openReminder && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(spaceBelow < 200 && spaceAbove > spaceBelow);
    }
  }, [openReminder]);

  const options = [
    { value: "0", label: "عدم التذكير", icon: MuteIcon },
    { value: "30m", label: "قبل 30 دقيقة", icon: NotificationIcon },
    { value: "1h", label: "قبل ساعة", icon: NotificationIcon },
    { value: "1d", label: "قبل 1 يوم", icon: NotificationIcon },
  ];

  const displayLabel =
    selectedReminders.length === 0
      ? "عدم التذكير"
      : selectedReminders
          .map((r) => options.find((o) => o.value === r)?.label || r)
          .join(", ");

  return (
    <div ref={ref} className="relative w-full">
      {showLabel && (
        <label className="block font-bold text-sm mb-2">
          وقت إرسال التذكير
        </label>
      )}

      {/* الحقل الرئيسي */}
      <div
        className="w-full h-10 flex items-center justify-between cursor-pointer px-3 rounded-md"
        style={{ border: `1px solid ${borderStyle}` }}
        onClick={() => setOpenReminder(!openReminder)}
      >
        <div className="flex items-center gap-2">
          {showIconInInput && selectedReminders.length > 0 && (
            <NotificationIcon className="w-4 h-4 text-[var(--color-purple)]" />
          )}
          <span
            className={`${
              selectedReminders.length > 0 || displayLabel === "عدم التذكير"
                ? variant === "event"
                  ? "font-bold text-[14px] text-[#000]"
                  : "font-normal text-[14px] text-[#000]"
                : "text-gray-400 font-normal text-[14px]"
            }`}
          >
            {displayLabel}
          </span>
        </div>
        <DownArrowIcon className="w-4 h-4 text-[var(--color-purple)]" />
      </div>

      {/* القائمة */}
      {openReminder && (
        <div
          className={`absolute left-0 w-full bg-white border border-gray-300 rounded-[16px] shadow-lg z-50 ${
            openUp
              ? showLabel
                ? "bottom-[calc(100%-28px)] mb-1"
                : "bottom-full mb-1"
              : "top-full mt-1"
          }`}
        >
          <div className="max-h-[160px] overflow-y-auto p-3 box-border">
            {options.map((option) => {
              const isSelected =
                (option.value === "0" && selectedReminders.length === 0) ||
                selectedReminders.includes(option.value);
              const Icon = option.icon;

              return (
                <div
                  key={option.value}
                  className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    let updated = [...selectedReminders];
                    if (option.value === "0") {
                      updated = [];
                    } else {
                      updated = updated.filter((r) => r !== "0");
                      if (updated.includes(option.value)) {
                        updated = updated.filter((r) => r !== option.value);
                      } else {
                        updated.push(option.value);
                      }
                    }
                    setSelectedReminders(updated);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[var(--color-purple)]" />
                    <span
                      className={`text-[12px] ${
                        isSelected
                          ? "font-semibold text-black"
                          : "font-normal text-black"
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-[var(--color-purple)] flex items-center justify-center`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-[var(--color-purple)]"></div>
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
};

export default ReminderSelector;

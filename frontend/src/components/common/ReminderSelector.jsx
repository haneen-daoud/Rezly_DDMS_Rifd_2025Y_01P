import React, { useState } from "react";
import DownArrowIcon from "../../icons/downarrow.svg?react";
import MuteIcon from "../../icons/mute.svg?react";
import NotificationIcon from "../../icons/notification.svg?react";

const ReminderSelector = ({
  selectedReminder,
  setSelectedReminder,
  showIconInInput = false,
  placeholder = "قبل 30 دقيقة",
  borderStyle = "#D1D5DB",
  placeholderColor = "text-gray-400",
  variant = "event",
}) => {
  const [openReminder, setOpenReminder] = useState(false);

  const options = [
    { value: "0", label: "عدم التذكير", icon: MuteIcon },
    { value: "30", label: "قبل 30 دقيقة", icon: NotificationIcon },
    { value: "60", label: "قبل ساعة", icon: NotificationIcon },
    { value: "24", label: "قبل 1 يوم", icon: NotificationIcon },
  ];

  const selectedOption = options.find((o) => o.value === selectedReminder);

  const displayLabel =
    variant === "booking" && !selectedOption
      ? "اختر موعد التذكير"
      : selectedOption?.label || placeholder;

  const displayColor =
    variant === "booking" && !selectedOption ? placeholderColor : "text-black";

  return (
    <div className="relative w-full">
      <label className="block font-bold text-sm mb-2">تذكير</label>

      <div
        className="w-full h-10 flex items-center justify-between cursor-pointer px-3 rounded-md"
        style={{ border: `1px solid ${borderStyle}` }}
        onClick={() => setOpenReminder(!openReminder)}
      >
        <div className="flex items-center gap-2">
          {showIconInInput && selectedOption && (
            <selectedOption.icon className="w-4 h-4 text-[var(--color-purple)]" />
          )}
          <span
            className={`${
              variant === "booking" && !selectedOption
                ? "text-gray-400 font-normal" // placeholder
                : "text-black font-normal"
            }`}
          >
            {variant === "booking" && !selectedOption
              ? "اختر موعد التذكير"
              : selectedOption?.label || placeholder}
          </span>
        </div>
        <DownArrowIcon className="w-4 h-4 text-[var(--color-purple)]" />
      </div>

      {/* قائمة الخيارات */}
      {openReminder && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-[16px] mt-1 z-50 shadow-lg">
          <div className="w-full h-full p-4 box-border overflow-y-auto">
            {options.map((option) => {
              const isSelected = selectedReminder === option.value;
              const Icon = option.icon;
              return (
                <div
                  key={option.value}
                  className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                  onClick={() => {
                    setSelectedReminder(option.value);
                    setOpenReminder(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[var(--color-purple)]" />
                    <span>{option.label}</span>
                  </div>

                  {/* الدائرة */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-[var(--color-purple)]"
                        : "border-gray-400"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-[var(--color-purple)]"></div>
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

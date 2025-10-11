import React, { useState } from "react";
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
}) => {
  const [openReminder, setOpenReminder] = useState(false);

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

  const displayColor = "text-black";

  return (
    <div className="relative w-full">
      <label className="block font-bold text-sm mb-2">تذكير</label>

      <div
        className="w-full h-10 flex items-center justify-between cursor-pointer px-3 rounded-md"
        style={{ border: `1px solid ${borderStyle}` }}
        onClick={() => setOpenReminder(!openReminder)}
      >
        <div className="flex items-center gap-2">
          {showIconInInput && selectedReminders.length > 0 && (
            <NotificationIcon className="w-4 h-4 text-[var(--color-purple)]" />
          )}
          <span className={`${displayColor} font-normal`}>{displayLabel}</span>
        </div>
        <DownArrowIcon className="w-4 h-4 text-[var(--color-purple)]" />
      </div>

      {/* قائمة الخيارات */}
      {openReminder && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-[16px] mt-1 z-50 shadow-lg">
          <div className="w-full h-full p-4 box-border overflow-y-auto">
            {options.map((option) => {
              const isSelected =
                (option.value === "0" && selectedReminders.length === 0) ||
                selectedReminders.includes(option.value);
              const Icon = option.icon;

              return (
                <div
                  key={option.value}
                  className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                  onClick={() => {
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
                    setOpenReminder(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[var(--color-purple)]" />
                    <span>{option.label}</span>
                  </div>

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

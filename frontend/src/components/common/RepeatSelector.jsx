import React from "react";

export default function RepeatSelector({
  selectedRepeat,
  selectedDays,
  setRepeatAndDays,
  variant = "booking",
}) {
  const days = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-black font-bold text-sm">تكرار</span>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedRepeat === "daily"}
            onChange={(e) => {
              if (e.target.checked) setRepeatAndDays("daily", [...days]);
              else setRepeatAndDays("", []);
            }}
            className="sr-only peer"
          />

          <div className="relative w-10 h-5 bg-gray-300 rounded-full transition-colors duration-300 peer-checked:bg-[var(--color-purple)]">
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5"></div>
          </div>

          <span
            className={
              variant === "event"
                ? "text-[#000] text-[13px] font-bold"
                : "text-[#000] text-[14px] font-normal"
            }
          >
            يوميًا
          </span>
        </label>
      </div>

      {/* أيام الأسبوع */}
      <div className="grid grid-cols-4 gap-2">
        {days.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <label
              key={day}
              className="flex items-center gap-2 text-xs cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {
                  let newDays;
                  if (!isSelected) newDays = [...selectedDays, day];
                  else newDays = selectedDays.filter((d) => d !== day);
                  const repeatValue =
                    newDays.length === days.length
                      ? "daily"
                      : newDays.length > 0
                      ? "weekly"
                      : "";
                  setRepeatAndDays(repeatValue, newDays);
                }}
                className="hidden peer"
              />
              <span
                className={`w-4 h-4 flex items-center justify-center border rounded-sm transition-colors duration-300 peer-checked:bg-[var(--color-purple)] peer-checked:border-[var(--color-purple)]`}
              >
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              <span
                className={
                  variant === "event"
                    ? "text-[#000] text-[13px] font-bold"
                    : "text-[#000] text-[14px] font-normal"
                }
              >
                {day}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

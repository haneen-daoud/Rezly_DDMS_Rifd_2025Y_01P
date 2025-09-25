import React from "react";

export default function RepeatSelector({ selectedRepeat, selectedDays, setRepeatAndDays }) {
  const days = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];

  return (
    <div>
      <label className="block font-bold text-sm mb-2">تكرار</label>
      <div className="flex items-center justify-between mb-2">
        <span>يوميًا</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedRepeat === "daily"}
            onChange={(e) => {
              if (e.target.checked) setRepeatAndDays("daily", [...days]);
              else setRepeatAndDays("", []);
            }}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-300 peer-checked:bg-[#6A0EAD] rounded-full peer transition-colors duration-300"></div>
          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5"></div>
        </label>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {days.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <label key={day} className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  let newDays;
                  if (e.target.checked) newDays = [...selectedDays, day];
                  else newDays = selectedDays.filter(d => d !== day);
                  const repeatValue = newDays.length === days.length ? "daily" : newDays.length > 0 ? "weekly" : "";
                  setRepeatAndDays(repeatValue, newDays);
                }}
                className="hidden peer"
              />
              <span className="w-4 h-4 flex items-center justify-center border rounded-sm peer-checked:bg-[#6A0EAD] peer-checked:border-[#6A0EAD]">
                {isSelected && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              {day}
            </label>
          );
        })}
      </div>
    </div>
  );
}

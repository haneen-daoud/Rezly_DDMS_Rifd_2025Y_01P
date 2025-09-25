import React, { useState, useEffect } from "react";
import leftarrowIcon from "../../icons/arrow-left.svg"; // السهم بين البداية والنهاية
import hourIcon from "../../icons/hour.svg"; // أيقونة الساعة

const TimeRangePicker = ({ startTime: initialStart, endTime: initialEnd, onChange }) => {
  const [startTime, setStartTime] = useState(initialStart || "08:00");
  const [endTime, setEndTime] = useState(initialEnd || "09:00");
  const [manualEnd, setManualEnd] = useState(false);

  // ضبط النهاية تلقائي ساعة بعد البداية لو المستخدم ما غيرها
  useEffect(() => {
    if (!manualEnd) {
      const [hour, minute] = startTime.split(":").map(Number);
      let endHour = hour + 1;
      if (endHour > 24) endHour = 24;
      setEndTime(`${String(endHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }, [startTime]);

  // أي تغيير يرسل للوالد
  useEffect(() => {
    onChange({ start: startTime, end: endTime });
  }, [startTime, endTime]);

  // بناء الخيارات: 08:00 → 20:30
  const generateOptions = () => {
    const arr = [];
    for (let i = 8; i <= 20; i++) {
      arr.push({ value: `${String(i).padStart(2, "0")}:00`, label: `${i % 12 || 12}:00 ${i < 12 ? "ص" : "م"}` });
      arr.push({ value: `${String(i).padStart(2, "0")}:30`, label: `${i % 12 || 12}:30 ${i < 12 ? "ص" : "م"}` });
    }
    return arr;
  };
  const options = generateOptions();

  return (
    <div className="flex items-center gap-2">
      {/* البداية */}
      <div className="relative w-[136px] h-11">
        <img src={hourIcon} alt="hour" className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5" />
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] focus:outline-none appearance-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* السهم */}
      <img src={leftarrowIcon} alt="leftarrow" />

      {/* النهاية */}
      <div className="relative w-[136px] h-11">
        <img src={hourIcon} alt="hour" className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5" />
        <select
          value={endTime}
          onChange={(e) => {
            setEndTime(e.target.value);
            setManualEnd(true);
          }}
          className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] focus:outline-none appearance-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TimeRangePicker;

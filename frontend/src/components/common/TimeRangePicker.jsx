import React, { useState, useEffect } from "react";

const TimeRangePicker = ({
  startTime: initialStart,
  endTime: initialEnd,
  onChange,
  variant = "event",
}) => {
  const [startTime, setStartTime] = useState(initialStart || "08:00");
  const [endTime, setEndTime] = useState(initialEnd || "09:00");

  const [manualEnd, setManualEnd] = useState(false);

  useEffect(() => {
    if (initialEnd) {
      setEndTime(initialEnd);
      setManualEnd(true);
    } else if (initialStart) {
      const [hour, minute] = initialStart.split(":").map(Number);
      let endHour = hour + 1;
      if (endHour > 24) endHour = 24;
      setEndTime(
        `${String(endHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
      );
      setManualEnd(false);
    } else {
      setEndTime("");
    }

    if (initialStart) setStartTime(initialStart);
  }, [initialStart, initialEnd]);

  useEffect(() => {
    if (!manualEnd && !initialEnd && startTime) {
      const [hour, minute] = startTime.split(":").map(Number);
      let endHour = hour + 1;
      if (endHour > 24) endHour = 24;
      setEndTime(
        `${String(endHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
      );
    }
  }, [startTime, manualEnd, initialEnd]);

  useEffect(() => {
    onChange({ start: startTime, end: endTime });
  }, [startTime, endTime]);

  const generateOptions = () => {
    const arr = [];
    for (let i = 8; i <= 20; i++) {
      arr.push({
        value: `${String(i).padStart(2, "0")}:00`,
        label: `${i % 12 || 12}:00 ${i < 12 ? "ص" : "م"}`,
      });
      arr.push({
        value: `${String(i).padStart(2, "0")}:30`,
        label: `${i % 12 || 12}:30 ${i < 12 ? "ص" : "م"}`,
      });
    }
    return arr;
  };
  const options = generateOptions();

  const borderColor =
    variant === "booking" ? "border-black/10" : "border-[#7E818C]";

  return (
    <div className="flex items-center gap-2">
      {/* البداية */}
      <div className="relative flex-1 h-11">
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <path
            d="M8.5 0C12.9183 1.61064e-08 16.5 3.58172 16.5 8C16.5 12.4183 12.9183 16 8.5 16C4.08172 16 0.5 12.4183 0.5 8C0.5 3.58172 4.08172 0 8.5 0ZM8.5 4.2793C8.089 4.2793 7.75586 4.61243 7.75586 5.02344V8C7.75586 8.19737 7.83407 8.38681 7.97363 8.52637L9.46191 10.0146C9.75254 10.3053 10.224 10.3053 10.5146 10.0146C10.8053 9.72403 10.8053 9.25254 10.5146 8.96191L9.24414 7.69141V5.02344C9.24414 4.61243 8.911 4.2793 8.5 4.2793Z"
            fill=" var(--color-purple) "
          />
        </svg>
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className={`h-10 pr-8 pl-2 w-full rounded-md border ${borderColor} focus:outline-none appearance-none ${
            variant === "booking" && startTime
              ? "text-black font-normal"
              : "text-black"
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* السهم */}
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.79297 6.29297C9.18349 5.90247 9.81651 5.90246 10.207 6.29297C10.5975 6.68349 10.5975 7.31651 10.207 7.70703L6.91406 11H20.5C21.0523 11 21.5 11.4477 21.5 12C21.5 12.5523 21.0523 13 20.5 13H6.91406L10.207 16.293C10.5976 16.6835 10.5976 17.3165 10.207 17.707C9.81651 18.0976 9.18349 18.0976 8.79297 17.707L3.79297 12.707C3.69263 12.6067 3.61811 12.4904 3.56934 12.3662C3.52584 12.2556 3.50114 12.1346 3.5 12.0088V11.9971C3.50041 11.8551 3.53022 11.7199 3.58398 11.5977C3.6236 11.5074 3.67756 11.4214 3.74512 11.3438C3.7619 11.3245 3.77965 11.306 3.79785 11.2881L8.79297 6.29297Z"
          fill=" var(--color-purple) "
        />
      </svg>

      {/* النهاية */}
      <div className="relative flex-1 h-11">
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <path
            d="M8.5 0C12.9183 1.61064e-08 16.5 3.58172 16.5 8C16.5 12.4183 12.9183 16 8.5 16C4.08172 16 0.5 12.4183 0.5 8C0.5 3.58172 4.08172 0 8.5 0ZM8.5 4.2793C8.089 4.2793 7.75586 4.61243 7.75586 5.02344V8C7.75586 8.19737 7.83407 8.38681 7.97363 8.52637L9.46191 10.0146C9.75254 10.3053 10.224 10.3053 10.5146 10.0146C10.8053 9.72403 10.8053 9.25254 10.5146 8.96191L9.24414 7.69141V5.02344C9.24414 4.61243 8.911 4.2793 8.5 4.2793Z"
            fill=" var(--color-purple) "
          />
        </svg>
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className={`h-10 pr-8 pl-2 w-full rounded-md border ${borderColor} focus:outline-none appearance-none ${
            variant === "booking" && endTime
              ? "text-black font-normal"
              : "text-black"
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TimeRangePicker;

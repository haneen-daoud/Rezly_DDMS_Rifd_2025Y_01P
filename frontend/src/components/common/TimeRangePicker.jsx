// TimeRangePicker.jsx
import React, { useState, useEffect } from "react";
import HourIcon from "../../icons/hour.svg?react";
import Dropdown from "../Dropdown"; // عدلي المسار إذا الملف في مجلد مختلف

const TimeRangePicker = ({
  startTime: initialStart,
  endTime: initialEnd,
  onChange,
  variant = "event",
  showIcons = false,
  isAddMode = false,
  showArrow = true,
  disabled = false,
}) => {
  const [startTime, setStartTime] = useState(
    isAddMode ? "" : initialStart || ""
  );
  const [endTime, setEndTime] = useState(isAddMode ? "" : initialEnd || "");

  const [userChangedEnd, setUserChangedEnd] = useState(false);

  const isStartPlaceholder = !startTime;
  const isEndPlaceholder = !endTime;

  useEffect(() => {
    // إذا في تعديل حجز موجود (initialEnd موجودة) → ما نغير النهاية
    if (initialEnd && !isAddMode) return;

    // فقط للحجز الجديد أو إذا المستخدم ما عدّل النهاية
    if (!userChangedEnd && startTime) {
      const [hour, minute] = startTime.split(":").map(Number);
      let endHour = hour + 1;
      if (endHour >= 24) endHour = 23;

      const newEnd = `${String(endHour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;

      setEndTime(newEnd);
    }
  }, [startTime]);

  // ضبط أن النهاية دومًا بعد البداية
  useEffect(() => {
    if (!startTime || !endTime) return;

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;

    if (endMins <= startMins) {
      const newEndMins = startMins + 60;
      const newEndHour = Math.floor(newEndMins / 60);
      const newEndMin = newEndMins % 60;

      const newEnd = `${String(newEndHour).padStart(2, "0")}:${String(
        newEndMin
      ).padStart(2, "0")}`;

      setEndTime(newEnd);
    }
  }, [startTime, endTime]);

  useEffect(() => {
    onChange({ start: startTime, end: endTime });
  }, [startTime, endTime]);

  // خيارات وقت البداية
  const generateStartOptions = () => {
    const arr = [];
    for (let i = 8; i <= 23; i++) {
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

  // خيارات وقت النهاية
  const generateEndOptions = (start) => {
    if (!start) return []; // يمنع أي خطأ

    const arr = [];

    const [sh, sm] = start.split(":").map(Number);
    const startMins = sh * 60 + sm;

    for (let i = 8; i <= 23; i++) {
      const opt00 = i * 60;
      const opt30 = i * 60 + 30;

      if (opt00 > startMins) {
        arr.push({
          value: `${String(i).padStart(2, "0")}:00`,
          label: `${i % 12 || 12}:00 ${i < 12 ? "ص" : "م"}`,
        });
      }

      if (opt30 > startMins) {
        arr.push({
          value: `${String(i).padStart(2, "0")}:30`,
          label: `${i % 12 || 12}:30 ${i < 12 ? "ص" : "م"}`,
        });
      }
    }

    // 12:00 ص لنهاية اليوم
    arr.push({
      value: "00:00",
      label: "12:00 ص",
    });

    return arr;
  };

  const startOptions = generateStartOptions();
  const endOptions = startTime ? generateEndOptions(startTime) : [];

  const borderColor =
    variant === "filter"
      ? "border-[#E5E7EB]" // مثل باقي الحقول
      : variant === "booking"
      ? "border-black/10"
      : "border-[#7E818C]";

  const isDefault =
    isAddMode &&
    startTime === "08:00" &&
    endTime === "09:00" &&
    !userChangedEnd;

  return (
    <div
      className={`flex items-center 
    ${variant === "filter" ? "h-[32px] w-full" : "h-10"}
    ${!showArrow ? "gap-2" : ""}
    
  `}
    >
      {/* وقت البداية */}
      <div className="relative w-full">
        {showIcons && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[var(--color-purple)]">
            <HourIcon className="w-4 h-4 text-[var(--color-purple)]" />
          </span>
        )}

        <Dropdown
          options={startOptions}
          value={startTime}
          onChange={(val) => {
            if (disabled) return;
            setStartTime(val);
          }}
          placeholder="اختر وقت البداية"
          disabled={disabled}
          className="w-full"
          hideArrow={true} // مهم: ما بدنا سهم الدروب داون في الـ TimeRangePicker
          fieldClassName={`w-full rounded-md border ${borderColor}
    ${variant === "filter" ? "h-[32px]" : "h-10"}
    pr-${showIcons ? 8 : 2} focus:outline-none appearance-none
    flex items-center
    max-h-56 overflow-y-auto custom-scrollbar
    ${
      disabled
        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
        : "cursor-pointer"
    }
    ${
      // هنا منفرّق بين placeholder وباقي الحالات
      isStartPlaceholder
        ? // placeholder → رمادي، أصغر، ويلف سطرين
          "whitespace-normal break-words leading-[1.2] text-right text-gray-400 text-[12px] font-normal"
        : variant === "filter"
        ? "font-normal text-[12px] text-[#000]"
        : isDefault
        ? "text-gray-400 font-normal text-[14px]"
        : variant === "event"
        ? "font-bold text-[14px] text-[#000]"
        : "font-normal text-[14px] text-[#000]"
    }
  `}
          menuClassName="dropdown-menu-scroll custom-scrollbar"
        />
      </div>

      {/* السهم بين البداية والنهاية – هذا هو السهم اللي في النص، يضل زي ما هو */}
      {showArrow && (
        <svg
          width="60"
          height="60"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.79297 6.29297C9.18349 5.90247 9.81651 5.90246 10.207 6.29297C10.5975 6.68349 10.5975 7.31651 10.207 7.70703L6.91406 11H20.5C21.0523 11 21.5 11.4477 21.5 12C21.5 12.5523 21.0523 13 20.5 13H6.91406L10.207 16.293C10.5976 16.6835 10.5976 17.3165 10.207 17.707C9.81651 18.0976 9.18349 18.0976 8.79297 17.707L3.79297 12.707C3.69263 12.6067 3.61811 12.4904 3.56934 12.3662C3.52584 12.2556 3.50114 12.1346 3.5 12.0088V11.9971C3.50041 11.8551 3.53022 11.7199 3.58398 11.5977C3.6236 11.5074 3.67756 11.4214 3.74512 11.3438C3.7619 11.3245 3.77965 11.306 3.79785 11.2881L8.79297 6.29297Z"
            fill=" var(--color-purple) "
          />
        </svg>
      )}

      {/* وقت النهاية */}
      <div className="relative w-full">
        {showIcons && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[var(--color-purple)]">
            <HourIcon className="w-4 h-4 text-[var(--color-purple)]" />
          </span>
        )}

        <Dropdown
          options={endOptions}
          value={endTime}
          onChange={(val) => {
            if (disabled || !startTime) return;
            setEndTime(val);
            setUserChangedEnd(true);
          }}
          placeholder={
            startTime ? "اختر وقت النهاية" : "اختر وقت النهاية "
          }
          disabled={disabled || !startTime}
          className="w-full"
          hideArrow={true}
          fieldClassName={`w-full rounded-md border ${borderColor}
    ${variant === "filter" ? "h-[32px]" : "h-10"}
    pr-${showIcons ? 8 : 2} focus:outline-none appearance-none
    flex items-center
    max-h-56 overflow-y-auto custom-scrollbar
    ${
      disabled
        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
        : "cursor-pointer"
    }
    ${
      isEndPlaceholder
        ? "whitespace-normal break-words leading-[1.2] text-right text-gray-400 text-[12px] font-normal"
        : variant === "filter"
        ? "font-normal text-[12px] text-[#000]"
        : isDefault
        ? "text-gray-400 font-normal text-[14px]"
        : variant === "event"
        ? "font-bold text-[14px] text-[#000]"
        : "font-normal text-[14px] text-[#000]"
    }
  `}
          menuClassName="dropdown-menu-scroll custom-scrollbar"
        />
      </div>
    </div>
  );
};

export default TimeRangePicker;

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
  baseDateTime,
  disabled = false,
}) => {
  const [openReminder, setOpenReminder] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [customHours, setCustomHours] = useState("");
  const [localReminders, setLocalReminders] = useState(
    Array.isArray(selectedReminders) && selectedReminders.length > 0
      ? selectedReminders
      : ["none"]
  );
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState(256);
  const [customError, setCustomError] = useState("");

  const ref = useRef(null);

  useEffect(() => {
    const safe =
      Array.isArray(selectedReminders) && selectedReminders.length > 0
        ? selectedReminders
        : ["none"];

    if (JSON.stringify(safe) !== JSON.stringify(localReminders)) {
      setLocalReminders(safe);
    }
  }, [selectedReminders]);

  useEffect(() => {
    if (
      !Array.isArray(selectedReminders) ||
      JSON.stringify(localReminders) !== JSON.stringify(selectedReminders)
    ) {
      setSelectedReminders?.(localReminders);
    }
  }, [localReminders]);

  const getBoundingParent = (element) => {
    if (!element) return null;

    let parent = element.parentElement;

    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      const overflowY = style.overflowY;

      if (
        overflowY === "auto" ||
        overflowY === "scroll" ||
        overflowY === "hidden" ||
        overflowY === "clip"
      ) {
        return parent;
      }

      parent = parent.parentElement;
    }

    return window;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenReminder(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "none", label: "عدم التذكير", icon: MuteIcon },
    { value: "30min", label: "قبل 30 دقيقة", icon: NotificationIcon },
    { value: "1hour", label: "قبل ساعة", icon: NotificationIcon },
    { value: "1day", label: "قبل 1 يوم", icon: NotificationIcon },
  ];

  const formatHoursBefore = (h) => {
    if (!Number.isFinite(h) || h <= 0) return "";
    if (h === 1) return "قبل ساعة";
    if (h === 2) return "قبل ساعتين";
    return `قبل ${h} ساعات`;
  };

  const formatReminderLabel = (r) => {
    if (typeof r === "string") {
      return options.find((o) => o.value === r)?.label || r;
    }

    if (typeof r === "object") {
      if (typeof r.hoursBefore === "number") {
        return formatHoursBefore(r.hoursBefore);
      }

      if (r.date && r.time && baseDateTime) {
        try {
          const reminderDate = new Date(`${r.date}T${r.time}`);
          const bookingDate = new Date(baseDateTime);
          const diffMs = bookingDate - reminderDate;
          const diffHours = Math.round(diffMs / (1000 * 60 * 60));
          const label = formatHoursBefore(diffHours);
          return label || "تذكير مخصّص";
        } catch {
          return "تذكير مخصّص";
        }
      }
    }

    return "";
  };

  const nonNoneReminders = Array.isArray(localReminders)
    ? localReminders.filter(
        (r) => !(typeof r === "string" && r === "none")
      )
    : [];

  const hasNoReminder =
    !Array.isArray(localReminders) ||
    localReminders.length === 0 ||
    (localReminders.length === 1 && localReminders[0] === "none");

  const displayLabel = (() => {
    if (hasNoReminder) return "عدم التذكير";

    if (nonNoneReminders.length === 1) {
      return formatReminderLabel(nonNoneReminders[0]) || placeholder;
    }

    return `${nonNoneReminders.length} تذكيرات مفعّلة`;
  })();

  const getHoursBeforeFromReminder = (r) => {
    if (!r) return null;

    if (typeof r === "string") {
      switch (r) {
        case "30min":
          return 0.5;
        case "1hour":
          return 1;
        case "1day":
          return 24;
        default:
          return null;
      }
    }

    if (typeof r !== "object") return null;

    if (typeof r.hoursBefore === "number") {
      return r.hoursBefore;
    }

    if (r.date && r.time && baseDateTime) {
      try {
        const reminderDate = new Date(`${r.date}T${r.time}`);
        const bookingDate = new Date(baseDateTime);
        const diffMs = bookingDate - reminderDate;
        const diffHours = Math.round(diffMs / (1000 * 60 * 60));
        return diffHours > 0 ? diffHours : null;
      } catch {
        return null;
      }
    }

    return null;
  };

  const isCustomInvalid =
    !customHours ||
    Number.isNaN(Number(customHours)) ||
    Number(customHours) <= 0;

  const handleAddCustomReminder = () => {
    if (!customHours) {
      setCustomError("أدخل عدد الساعات قبل الموعد");
      return;
    }

    const hours = Number(customHours);

    if (Number.isNaN(hours) || hours <= 0) {
      setCustomError("أدخل عدد ساعات صحيح أكبر من 0");
      return;
    }

    setCustomError("");

    setLocalReminders((prev) => {
      const baseArray = Array.isArray(prev) ? prev : [];

      let filtered = baseArray.filter(
        (r) => !(typeof r === "string" && r === "none")
      );

      const alreadyExists = filtered.some((r) => {
        const existing = getHoursBeforeFromReminder(r);
        return existing === hours;
      });

      if (alreadyExists) {
        return filtered.length > 0 ? filtered : ["none"];
      }

      filtered = [...filtered, { hoursBefore: hours }];
      return filtered.length === 0 ? ["none"] : filtered;
    });

    setCustomHours(String(hours));
  };

  useEffect(() => {
    if (openReminder && Array.isArray(localReminders)) {
      let found = "";

      const custom = localReminders.find((r) => typeof r === "object");

      if (custom) {
        if (typeof custom.hoursBefore === "number") {
          found = String(custom.hoursBefore);
        } else if (custom.date && custom.time && baseDateTime) {
          try {
            const reminderDate = new Date(`${custom.date}T${custom.time}`);
            const bookingDate = new Date(baseDateTime);
            const diff = Math.round(
              (bookingDate - reminderDate) / (1000 * 60 * 60)
            );
            if (diff > 0) found = String(diff);
          } catch {}
        }
      }

      setCustomHours(found);
    }
  }, [openReminder, localReminders, baseDateTime]);

  useEffect(() => {
    if (!openReminder || !ref.current) return;

    const updatePosition = () => {
      if (!ref.current) return;

      const triggerRect = ref.current.getBoundingClientRect();
      const boundingParent = getBoundingParent(ref.current);
      const margin = 8;

      const containerRect =
        boundingParent === window || !boundingParent
          ? { top: 0, bottom: window.innerHeight }
          : boundingParent.getBoundingClientRect();

      const spaceBelow = containerRect.bottom - triggerRect.bottom - margin;
      const spaceAbove = triggerRect.top - containerRect.top - margin;

      const baseHeight = 160;
      const extraForTags = nonNoneReminders.length > 0 ? 80 : 0;
      const expectedHeight = baseHeight + extraForTags;

      const shouldOpenUp =
        spaceBelow < expectedHeight && spaceAbove > spaceBelow;

      setOpenUp(shouldOpenUp);

      const availableSpace = shouldOpenUp ? spaceAbove : spaceBelow;
      const max = Math.max(Math.min(availableSpace, 260), 140);

      setDropdownMaxHeight(max);
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [openReminder, nonNoneReminders.length]);

  const toggleOption = (optionValue) => {
    setLocalReminders((prev) => {
      let updated = Array.isArray(prev) ? [...prev] : [];

      if (optionValue === "none") return ["none"];

      updated = updated.filter(
        (r) => !(typeof r === "string" && r === "none")
      );

      if (updated.includes(optionValue)) {
        updated = updated.filter((r) => r !== optionValue);
      } else {
        const optionHours = getHoursBeforeFromReminder(optionValue);

        if (optionHours != null) {
          const hasSame = updated.some(
            (r) => getHoursBeforeFromReminder(r) === optionHours
          );
          if (hasSame) {
            return updated.length > 0 ? updated : ["none"];
          }
        }

        updated.push(optionValue);
      }

      return updated.length === 0 ? ["none"] : updated;
    });
  };

  const removeReminder = (remToRemove) => {
    setLocalReminders((prev) => {
      if (!Array.isArray(prev)) return ["none"];

      let updated = prev.filter((r) => {
        if (typeof r === "string" && typeof remToRemove === "string") {
          return r !== remToRemove;
        }

        if (
          typeof r === "object" &&
          typeof remToRemove === "object" &&
          typeof r.hoursBefore === "number" &&
          typeof remToRemove.hoursBefore === "number"
        ) {
          return r.hoursBefore !== remToRemove.hoursBefore;
        }

        if (
          typeof r === "object" &&
          typeof remToRemove === "object" &&
          r.date &&
          r.time &&
          remToRemove.date &&
          remToRemove.time
        ) {
          return !(r.date === remToRemove.date && r.time === remToRemove.time);
        }

        return true;
      });

      if (
        updated.length === 0 ||
        updated.every((r) => typeof r === "string" && r === "none")
      ) {
        updated = ["none"];
      }

      return updated;
    });
  };

  return (
    <div ref={ref} className="relative w-full">
      {showLabel && (
        <label className="block font-bold text-sm mb-2">
          وقت إرسال التذكير
        </label>
      )}

      <div className="relative w-full">
        <div
          className={`w-full h-10 flex items-center justify-between p-3 rounded-md
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white cursor-pointer"
            }
          `}
          style={{ border: `1px solid ${borderStyle}` }}
          onClick={() => !disabled && setOpenReminder((prev) => !prev)}
        >
          <div className="flex items-center gap-2">
            {showIconInInput && !hasNoReminder && (
              <NotificationIcon className="w-4 h-4 text-[var(--color-purple)]" />
            )}

            <span
              className={`text-[14px] text-black truncate 
                ${variant === "event" ? "font-bold" : "font-normal"}
                ${disabled ? "text-gray-500" : ""}
              `}
            >
              {displayLabel || placeholder}
            </span>
          </div>

          <DownArrowIcon
            className={`w-4 h-4 ${
              disabled ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </div>

        {customError && (
          <p className="text-red-500 text-[11px] mt-[4px]">{customError}</p>
        )}

        {openReminder && (
          <div
            className={`absolute z-50 w-full bg-white rounded-md shadow-lg border border-gray-200 ${
              openUp ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            <div
              className="py-2 overflow-y-auto custom-scrollbar"
              style={{ maxHeight: dropdownMaxHeight }}
            >
              {options.map((option) => {
                const Icon = option.icon;
                const isSelected = Array.isArray(localReminders)
                  ? localReminders.includes(option.value)
                  : false;

                return (
                  <div
                    key={option.value}
                    className="flex items-center justify-between h-9 px-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option.value);
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
                      className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all duration-150 ${
                        isSelected
                          ? "bg-[var(--color-purple)] border-[var(--color-purple)]"
                          : "border-gray-400 bg-gray-100"
                      }`}
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
                    </div>
                  </div>
                );
              })}

              {nonNoneReminders.length > 0 && (
                <div className="px-3 pt-2 pb-1 border-t border-gray-100 mt-1">
                  <p className="text-[11px] text-gray-500 mb-1">
                    التذكيرات المختارة:
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {nonNoneReminders.map((r, index) => {
                      const label = formatReminderLabel(r);

                      const key =
                        typeof r === "string"
                          ? r
                          : typeof r.hoursBefore === "number"
                          ? `custom-${r.hoursBefore}-${index}`
                          : r.date && r.time
                          ? `${r.date}-${r.time}-${index}`
                          : `rem-${index}`;

                      return (
                        <div
                          key={key}
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-purple-light,#F3E8FF)] text-[11px]"
                        >
                          <span className="text-[11px] text-[var(--color-purple,#7C3AED)]">
                            {label}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeReminder(r);
                            }}
                            className="w-4 h-4 flex items-center justify-center rounded-full bg-[var(--color-purple)] text-white text-[10px] leading-none"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="px-3 pt-2 pb-3 border-t border-gray-100 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-700 font-semibold">
                    تذكير مخصّص
                  </span>

                  <div className="flex flex-col">
                    <input
                      type="number"
                      min="1"
                      value={customHours}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomHours(value);

                        if (!value) {
                          setCustomError("");
                          return;
                        }

                        const hours = Number(value);
                        if (Number.isNaN(hours) || hours <= 0) {
                          setCustomError("أدخل عدد ساعات صحيح أكبر من 0");
                        } else {
                          setCustomError("");
                        }
                      }}
                      className="w-14 h-8 border border-gray-300 rounded-md text-center text-[12px] focus:outline-none focus:ring-1 focus:ring-[var(--color-purple)]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <span className="text-[12px] text-gray-600">
                    ساعة قبل الموعد
                  </span>

                  <button
                    type="button"
                    disabled={isCustomInvalid}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCustomInvalid) return;
                      handleAddCustomReminder();
                    }}
                    className={`flex items-center gap-1 px-3 h-8 rounded-full text-[12px] font-semibold
                      ${
                        isCustomInvalid
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[var(--color-purple)] text-white cursor-pointer"
                      }
                    `}
                  >
                    <span className="text-[16px] leading-none">+</span>
                    <span>إضافة</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderSelector;

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
}) => {
  const [openReminder, setOpenReminder] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [customHours, setCustomHours] = useState("");
  const [localReminders, setLocalReminders] = useState(
    Array.isArray(selectedReminders) && selectedReminders.length > 0
      ? selectedReminders
      : ["none"]
  );

  const ref = useRef(null);

  // مزامنة من الأب → المحلي
  useEffect(() => {
    const safe =
      Array.isArray(selectedReminders) && selectedReminders.length > 0
        ? selectedReminders
        : ["none"];

    if (JSON.stringify(safe) !== JSON.stringify(localReminders)) {
      setLocalReminders(safe);
    }
  }, [selectedReminders]);

  // مزامنة من المحلي → الأب
  useEffect(() => {
    if (
      !Array.isArray(selectedReminders) ||
      JSON.stringify(localReminders) !== JSON.stringify(selectedReminders)
    ) {
      setSelectedReminders?.(localReminders);
    }
  }, [localReminders]);

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

  // تحديد اتجاه المنسدلة (فوق/تحت)
  useEffect(() => {
    if (openReminder && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(spaceBelow < 260 && spaceAbove > spaceBelow);
    }
  }, [openReminder]);

  const options = [
    { value: "none", label: "عدم التذكير", icon: MuteIcon },
    { value: "30min", label: "قبل 30 دقيقة", icon: NotificationIcon },
    { value: "1hour", label: "قبل ساعة", icon: NotificationIcon },
    { value: "1day", label: "قبل 1 يوم", icon: NotificationIcon },
  ];

  // فورمات نص حسب عدد الساعات
  const formatHoursBefore = (h) => {
    if (!Number.isFinite(h) || h <= 0) return "";
    if (h === 1) return "قبل ساعة";
    if (h === 2) return "قبل ساعتين";
    return `قبل ${h} ساعات`;
  };

  // فورمات نص التذكير الواحد
  const formatReminderLabel = (r) => {
    if (typeof r === "string") {
      return options.find((o) => o.value === r)?.label || r;
    }

    if (typeof r === "object") {
      // لو مخزون مباشرة كـ hoursBefore
      if (typeof r.hoursBefore === "number") {
        return formatHoursBefore(r.hoursBefore);
      }

      // لو جاي من الباك كـ { date, time } نحسب الفرق عن baseDateTime
      if (r.date && r.time && baseDateTime) {
        try {
          const reminderDate = new Date(`${r.date}T${r.time}`);
          const bookingDate = new Date(baseDateTime);
          const diffMs = bookingDate - reminderDate;
          const diffHours = Math.round(diffMs / (1000 * 60 * 60));
          const label = formatHoursBefore(diffHours);
          return label || "تذكير مخصّص";
        } catch (err) {
          console.warn("فشل حساب فرق الساعات لعرض التذكير:", err);
          return "تذكير مخصّص";
        }
      }
    }

    return "";
  };

  // العناصر بدون "عدم التذكير"
  const nonNoneReminders = Array.isArray(localReminders)
    ? localReminders.filter((r) => !(typeof r === "string" && r === "none"))
    : [];

  const hasNoReminder =
    !Array.isArray(localReminders) ||
    localReminders.length === 0 ||
    (localReminders.length === 1 && localReminders[0] === "none");

  // النص اللي ببين في الحقل الرئيسي
  const displayLabel = (() => {
    if (hasNoReminder) return "عدم التذكير";

    if (nonNoneReminders.length === 1) {
      return formatReminderLabel(nonNoneReminders[0]) || placeholder;
    }

    return `${nonNoneReminders.length} تذكيرات مفعّلة`;
  })();

  //استخراج عدد الساعات قبل الموعد من أي تذكير
    // استخراج عدد الساعات قبل الموعد من أي تذكير
    //استخراج عدد الساعات قبل الموعد من أي تذكير
  const getHoursBeforeFromReminder = (r) => {
    if (!r) return null;

    // لو التذكير قيمة جاهزة (سترنغ) مثل 30min / 1hour / 1day
    if (typeof r === "string") {
      switch (r) {
        case "30min":
          return 0.5; // نص ساعة
        case "1hour":
          return 1; // ساعة
        case "1day":
          return 24; // 24 ساعة
        default:
          return null;
      }
    }

    if (typeof r !== "object") return null;

    // لو مخزون مباشرة كـ hoursBefore
    if (typeof r.hoursBefore === "number") {
      return r.hoursBefore;
    }

    // لو جاي من الباك كـ { date, time } نحسب الفرق عن baseDateTime
    if (r.date && r.time && baseDateTime) {
      try {
        const reminderDate = new Date(`${r.date}T${r.time}`);
        const bookingDate = new Date(baseDateTime);
        const diffMs = bookingDate - reminderDate;
        const diffHours = Math.round(diffMs / (1000 * 60 * 60));
        return diffHours > 0 ? diffHours : null;
      } catch (err) {
        console.warn(
          "فشل حساب فرق الساعات في getHoursBeforeFromReminder:",
          err
        );
        return null;
      }
    }

    return null;
  };



  const handleAddCustomReminder = () => {
    if (!customHours) return;

    const hours = Number(customHours);
    if (Number.isNaN(hours) || hours <= 0) return;

    setLocalReminders((prev) => {
      const baseArray = Array.isArray(prev) ? prev : [];

      // شيل "none"
      let filtered = baseArray.filter(
        (r) => !(typeof r === "string" && r === "none")
      );

      // لو موجود تذكير بنفس عدد الساعات (سواء hoursBefore أو date/time) ما نكرره
      const alreadyExists = filtered.some((r) => {
        const existingHours = getHoursBeforeFromReminder(r);
        return existingHours === hours;
      });

      if (alreadyExists) {
        return filtered.length > 0 ? filtered : ["none"];
      }

      filtered = [...filtered, { hoursBefore: hours }];
      if (filtered.length === 0) return ["none"];
      return filtered;
    });

    setCustomHours(String(hours));
  };

  // لما تفتح المنسدلة، نحاول نعبّي حقل الساعات من أول تذكير مخصص إن وجد
  useEffect(() => {
    if (openReminder && Array.isArray(localReminders)) {
      let foundHours = "";

      const custom = localReminders.find((r) => typeof r === "object");

      if (custom) {
        if (typeof custom.hoursBefore === "number") {
          foundHours = String(custom.hoursBefore);
        } else if (custom.date && custom.time && baseDateTime) {
          try {
            const reminderDate = new Date(`${custom.date}T${custom.time}`);
            const bookingDate = new Date(baseDateTime);
            const diffMs = bookingDate - reminderDate;
            const diffHours = Math.round(diffMs / (1000 * 60 * 60));
            if (diffHours > 0) foundHours = String(diffHours);
          } catch (err) {
            console.warn("فشل حساب فرق الساعات:", err);
          }
        }
      }

      setCustomHours(foundHours);
    }
  }, [openReminder, localReminders, baseDateTime]);

    const toggleOption = (optionValue) => {
    setLocalReminders((prev) => {
      let updated = Array.isArray(prev) ? [...prev] : [];

      // لو اخترنا "عدم التذكير"
      if (optionValue === "none") {
        return ["none"];
      }

      // شيل none
      updated = updated.filter(
        (r) => !(typeof r === "string" && r === "none")
      );

      // لو الخيار نفسه أصلاً موجود → شيله (تبديل تشغيل/إيقاف عادي)
      if (updated.includes(optionValue)) {
        updated = updated.filter((r) => r !== optionValue);
      } else {
        // قبل ما نضيف الخيار، نتأكد إنه ما في تذكير بنفس عدد الساعات
        const optionHours = getHoursBeforeFromReminder(optionValue);

        if (optionHours != null) {
          const hasSameHours = updated.some((r) => {
            const h = getHoursBeforeFromReminder(r);
            return h === optionHours;
          });

          // لو فيه تذكير بنفس الساعات (سواء كستوم أو جاهز) ما نضيفه
          if (hasSameHours) {
            return updated.length > 0 ? updated : ["none"];
          }
        }

        // ما في تكرار → نضيفه عادي
        updated.push(optionValue);
      }

      if (updated.length === 0) {
        updated = ["none"];
      }

      return updated;
    });
  };


  const removeReminder = (remToRemove) => {
    setLocalReminders((prev) => {
      if (!Array.isArray(prev)) return ["none"];

      let updated = prev.filter((r) => {
        // مقارنة النصوص
        if (typeof r === "string" && typeof remToRemove === "string") {
          return r !== remToRemove;
        }

        // مقارنة المخصص بالساعة
        if (
          typeof r === "object" &&
          typeof remToRemove === "object" &&
          typeof r.hoursBefore === "number" &&
          typeof remToRemove.hoursBefore === "number"
        ) {
          return r.hoursBefore !== remToRemove.hoursBefore;
        }

        // مقارنة تاريخ/وقت
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

  const isPlaceholder = hasNoReminder;

  return (
    <div ref={ref} className="relative w-full">
      {showLabel && (
        <label className="block font-bold text-sm mb-2">
          وقت إرسال التذكير
        </label>
      )}
      <div className="relative w-full">
        {/* الحقل الرئيسي */}
        <div
          className="w-full h-10 flex items-center justify-between cursor-pointer p-3 rounded-md bg-white"
          style={{ border: `1px solid ${borderStyle}` }}
          onClick={() => setOpenReminder((prev) => !prev)}
        >
          <div className="flex items-center gap-2">
            {showIconInInput && !hasNoReminder && (
              <NotificationIcon className="w-4 h-4 text-[var(--color-purple)]" />
            )}
            <span
              className={`text-[12px] truncate ${
                isPlaceholder ? placeholderColor : "text-black"
              }`}
            >
              {displayLabel || placeholder}
            </span>
          </div>
          <DownArrowIcon className="w-4 h-4 text-gray-500" />
        </div>

        {/* المنسدلة */}
        {openReminder && (
          <div
            className={`absolute z-50 w-full bg-white rounded-md shadow-lg border border-gray-200 ${
              openUp ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            <div className="py-2 max-h-64 overflow-y-auto custom-scrollbar">
              {/* الخيارات الجاهزة */}
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

              {/* التذكيرات المختارة (تاغز) */}
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

              {/* التذكير المخصّص بالساعات - صف واحد */}
              <div className="px-3 pt-2 pb-3 border-t border-gray-100 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-700 font-semibold">
                    تذكير مخصّص
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                    className="w-14 h-8 border border-gray-300 rounded-md text-center text-[12px] focus:outline-none focus:ring-1 focus:ring-[var(--color-purple)]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-[12px] text-gray-600">
                    ساعة قبل الموعد
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddCustomReminder();
                    }}
                    className="flex items-center gap-1 px-3 h-8 rounded-full bg-[var(--color-purple)] text-white text-[12px] font-semibold"
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

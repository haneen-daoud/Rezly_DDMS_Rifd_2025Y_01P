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
  const [localReminders, setLocalReminders] = useState([]);
  const ref = useRef(null);

  // أول مرة: خذ القيمة من الأب أو "none"
  useEffect(() => {
    if (Array.isArray(selectedReminders) && selectedReminders.length > 0) {
      setLocalReminders(selectedReminders);
    } else {
      setLocalReminders(["none"]);
      setSelectedReminders(["none"]);
    }
  }, []);

  // لما تتغيّر القيمة المحلية، حدث الأب
  useEffect(() => {
    if (JSON.stringify(localReminders) !== JSON.stringify(selectedReminders)) {
      setSelectedReminders(localReminders);
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
    { value: "none", label: "عدم التذكير", icon: MuteIcon },
    { value: "30min", label: "قبل 30 دقيقة", icon: NotificationIcon },
    { value: "1hour", label: "قبل ساعة", icon: NotificationIcon },
    { value: "1day", label: "قبل 1 يوم", icon: NotificationIcon },
  ];

  // عرض الاسم بالحقل
  const displayLabel =
  !localReminders || localReminders.length === 0
    ? "عدم التذكير"
    : localReminders.some(
        (r) =>
          (typeof r === "string" && r !== "none") ||
          (typeof r === "object" &&
            (r.hoursBefore || (r.date && r.time)))
      )
    ? localReminders
        .map((r) => {
          if (typeof r === "string") {
            return options.find((o) => o.value === r)?.label || r;
          } else if (typeof r === "object" && typeof r.hoursBefore === "number") {
            return `تذكير مخصّص (قبل ${r.hoursBefore} س)`;
          } else if (typeof r === "object" && r.date && r.time) {
            return `تذكير مخصّص (${r.time})`; // 🕓 نعرض الساعة بس
          }
          return "";
        })
        .join(", ")
    : "عدم التذكير";


  const handleAddCustomReminder = () => {
    if (!customHours) return;
    const hours = Number(customHours);

    // خزّن التذكير الجديد وأزِل "عدم التذكير"
    setLocalReminders((prev) => {
      const filtered = Array.isArray(prev)
        ? prev.filter((r) => !(typeof r === "string" && r === "none"))
        : [];
      return [...filtered, { hoursBefore: hours }];
    });

    setCustomHours(String(hours)); // خلي الرقم يظل ظاهر بالحقل
    setTimeout(() => setOpenReminder(false), 200);
  };

  // لما تفتح المنسدلة، عبّي حقل الساعات سواء كان مخزون كـ hoursBefore أو {date,time}
  useEffect(() => {
    if (openReminder && Array.isArray(localReminders)) {
      let foundHours = "";

      const custom = localReminders.find((r) => typeof r === "object");

      if (custom) {
        // لو عنده hoursBefore مباشرة
        if (typeof custom.hoursBefore === "number") {
          foundHours = String(custom.hoursBefore);
        }
        // لو عنده date/time (راجع من الباك)، نحسب الفرق بالساعات
        else if (custom.date && custom.time && window?.formData?.start) {
          try {
            const reminderDate = new Date(`${custom.date}T${custom.time}`);
            const bookingDate = new Date(window.formData.start);
            const diffMs = bookingDate - reminderDate;
            const diffHours = Math.round(diffMs / (1000 * 60 * 60));
            if (diffHours > 0) foundHours = String(diffHours);
          } catch (err) {
            console.warn("⚠️ فشل حساب فرق الساعات للتذكير:", err);
          }
        }
      }

      setCustomHours(foundHours);
    }
  }, [openReminder, localReminders]);

  // لما تفتح المنسدلة، احسب عدد الساعات السابقة من وقت الحجز (baseDateTime)
  useEffect(() => {
    if (openReminder && Array.isArray(selectedReminders)) {
      let foundHours = "";

      const custom = selectedReminders.find((r) => typeof r === "object");

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
            console.warn("⚠️ فشل حساب فرق الساعات:", err);
          }
        }
      }

      setCustomHours(foundHours);
    }
  }, [openReminder, selectedReminders, baseDateTime]);

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
          {showIconInInput && localReminders.length > 0 && (
            <NotificationIcon className="w-4 h-4 text-[var(--color-purple)]" />
          )}
          <span
            className={`${
              localReminders.length > 0 || displayLabel === "عدم التذكير"
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
          <div className="max-h-[200px] overflow-y-auto p-3 box-border">
            {options.map((option) => {
              const isSelected = localReminders.some(
                (r) => typeof r === "string" && r === option.value
              );
              const Icon = option.icon;
              return (
                <div
                  key={option.value}
                  className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    let updated = Array.isArray(localReminders)
                      ? [...localReminders]
                      : [];
                    if (option.value === "none") {
                      updated = ["none"];
                    } else {
                      updated = updated.filter(
                        (r) => r !== "none" && typeof r === "string"
                      );
                      if (updated.includes(option.value)) {
                        updated = updated.filter((r) => r !== option.value);
                      } else {
                        updated.push(option.value);
                      }
                      if (updated.length === 0) {
                        updated = ["none"];
                      }
                    }
                    setLocalReminders(updated);
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

            {/* إدخال يدوي */}
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-t mt-2 pt-2">
              <span className="text-sm">أو التذكير قبل:</span>
              <input
                type="number"
                min="1"
                placeholder="عدد الساعات"
                value={customHours}
                onChange={(e) => setCustomHours(e.target.value)}
                className="w-[100px] h-8 border border-gray-300 rounded-md text-center text-sm focus:outline-none"
              />
              <button
                onClick={handleAddCustomReminder}
                className="text-[var(--color-purple)] font-semibold text-sm"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderSelector;

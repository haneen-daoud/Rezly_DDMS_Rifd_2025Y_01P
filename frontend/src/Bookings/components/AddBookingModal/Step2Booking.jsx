import React, { useState, useEffect } from "react";
import MiniCalender from "../../../components/MiniCalender/MiniCalender";
import TimeRangePicker from "../../../components/common/TimeRangePicker";
import ReminderSelector from "../../../components/common/ReminderSelector";
import CalenderIcon from "../../../icons/calender.svg?react";
import downarrowIcon from "../../../icons/downarrow.svg";
import durationIcon from "../../../icons/duration.svg";
import DeleteIcon from "../../../icons/Delete.svg?react";

export default function Step2Booking({
  formData,
  setFormData,
  errors,
  setErrors,
  isEditing,
  isIndividual = false,
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [openDuration, setOpenDuration] = useState(false);
  const [openUpDuration, setOpenUpDuration] = useState(false);
  const [daysSchedule, setDaysSchedule] = useState(
    Array.isArray(formData?.daysSchedule) && formData.daysSchedule.length
      ? formData.daysSchedule
      : []
  );

  // حافظ على مزامنة daysSchedule مع formData (من غير تغيير الشكل)
  useEffect(() => {
    if (Array.isArray(formData?.daysSchedule)) {
      setDaysSchedule(formData.daysSchedule);
    }
  }, [formData.daysSchedule]);

  useEffect(() => {
    setFormData((prev) => {
      if (JSON.stringify(prev.daysSchedule) === JSON.stringify(daysSchedule)) {
        return prev;
      }
      return { ...prev, daysSchedule };
    });
  }, [daysSchedule, setFormData]);

  const allDays = [
    { short: "سبت", full: "السبت" },
    { short: "أحد", full: "الأحد" },
    { short: "إثنين", full: "الإثنين" },
    { short: "ثلاثاء", full: "الثلاثاء" },
    { short: "أربعاء", full: "الأربعاء" },
    { short: "خميس", full: "الخميس" },
    { short: "جمعة", full: "الجمعة" },
  ];

  //  تعديل بسيط: نخزن التاريخ للباك في startDate أيضًا (غير إضافة dateOnly)
  const handleDateChange = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      dateOnly: dateString,
      startDate: dateString,
    }));
    setShowCalendar(false);
    if (errors?.dateOnly || !dateString)
      setErrors((prev) => ({
        ...prev,
        dateOnly: dateString ? null : "تاريخ البدء مطلوب",
      }));
  };

  const handleAddDay = () => {
    if (daysSchedule.length >= 7) return;
    setDaysSchedule([
      ...daysSchedule,
      { day: "", start: "08:00", end: "09:00" },
    ]);
  };

  const handleDeleteDay = (index) => {
    setDaysSchedule(daysSchedule.filter((_, i) => i !== index));
  };

  const handleChange = (index, key, value) => {
    const updated = [...daysSchedule];
    updated[index][key] = value;
    setDaysSchedule(updated);
    if (key === "day" && !value) {
      setErrors((prev) => ({ ...prev, daysSchedule: "اختر اليوم" }));
    } else if ((key === "start" || key === "end") && !value) {
      setErrors((prev) => ({
        ...prev,
        daysSchedule: "وقت البداية والنهاية مطلوب",
      }));
    } else {
      setErrors((prev) => ({ ...prev, daysSchedule: null }));
    }
  };

  const durationOptions = [
    "أسبوع",
    "أسبوعين",
    "3 أسابيع",
    "شهر",
    "3 أشهر",
    "6 أشهر",
    "سنة",
  ];

  const dateDisplay =
    formData.dateOnly ||
    (formData.start ? formData.start.split("T")[0] : "") ||
    "";

  // إغلاق القوائم عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isInsideCalendar = e.target.closest(".calendar-popup");
      const isInsideDuration = e.target.closest(".duration-dropdown");
      const isInsideReminder = e.target.closest(".reminder-dropdown");
      const isInsideStep2 = e.target.closest(".dropdown-step2");

      if (
        !isInsideCalendar &&
        !isInsideDuration &&
        !isInsideReminder &&
        !isInsideStep2
      ) {
        setShowCalendar(false);
        setOpenDuration(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    window.formData = formData; // عشان يعرف وقت الحجز عند الفتح
  }, [formData]);

  return (
    <div className="flex flex-col gap-4 w-full items-center font-bold text-black text-[14px]">
      {/* تاريخ البدء */}
      <div className="relative w-[344px] flex flex-col calendar-popup">
        <label className="block font-bold text-sm mb-2">
          {isIndividual ? "تاريخ الحجز" : "تاريخ البدء"}
          {!isEditing && <span className="text-red-500"> *</span>}
        </label>

        <div className="relative flex flex-col w-full">
          <div
            className={`relative flex items-center w-full border rounded-md h-10 ${
              errors?.dateOnly ? "border-red-500" : "border-gray-300"
            }`}
          >
            <span className="absolute right-2 top-1/2 -translate-y-1/2">
              <CalenderIcon className="w-5 h-5 text-[var(--color-purple)]" />
            </span>

            <input
              type="text"
              value={dateDisplay}
              placeholder="اختر تاريخ البدء"
              readOnly
              onClick={() => setShowCalendar(!showCalendar)}
              className="h-10 w-full pr-8 pl-2 rounded-md focus:outline-none font-normal"
            />
            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-30 w-60">
                <MiniCalender
                  variant="step2"
                  hideTodayHighlight={false}
                  currentDate={
                    formData.dateOnly ? new Date(formData.dateOnly) : new Date()
                  }
                  handleDateChange={handleDateChange}
                />
              </div>
            )}
          </div>
          {errors?.dateOnly && (
            <p className="text-red-500 text-xs mt-1">{errors.dateOnly}</p>
          )}
        </div>
      </div>

      {/* مدة الاشتراك */}
      {!isIndividual && (
        <div className="relative w-[344px] dropdown-step2">
          <label className="block font-bold text-sm mb-2">
            مدة الاشتراك{" "}
            {!isEditing && <span className="text-red-500"> *</span>}
          </label>

          {/* الحقل الرئيسي */}
          <div
            onClick={() => setOpenDuration(!openDuration)}
            className={`w-full h-10 rounded-md flex items-center justify-between px-2 cursor-pointer border ${
              errors?.subscriptionDuration
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <span
              className={`h-10 w-full flex items-center pl-2 ${
                formData.subscriptionDuration ? "text-black" : "text-gray-400"
              } font-normal text-[14px]`}
            >
              {formData.subscriptionDuration || "اختر مدة الاشتراك"}
            </span>
            <img
              src={downarrowIcon}
              alt="downarrow"
              className="w-4 h-4 opacity-80"
            />
          </div>

          {/* القائمة المنسدلة */}
          {openDuration && (
            <div
              className={`absolute left-0 w-full bg-white rounded-[16px] border border-gray-300 shadow-lg z-50 ${
                openUpDuration
                  ? "bottom-[calc(100%-28px)] mb-1"
                  : "top-full mt-1"
              }`}
            >
              <div className="p-3">
                {durationOptions.map((option) => {
                  const selected = formData.subscriptionDuration === option;
                  return (
                    <div
                      key={option}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          subscriptionDuration: option,
                        }));
                        setOpenDuration(false);
                        setErrors((prev) => ({
                          ...prev,
                          subscriptionDuration: option
                            ? null
                            : "مدة الاشتراك مطلوبة",
                        }));
                      }}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <img src={durationIcon} alt="" className="w-4 h-4" />
                        <span
                          className={
                            selected
                              ? "font-semibold text-[#000]"
                              : "font-normal text-[#000]"
                          }
                        >
                          {option}
                        </span>
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selected
                            ? "border-[var(--color-purple)]"
                            : "border-gray-400"
                        }`}
                      >
                        {selected && (
                          <div className="w-2 h-2 rounded-full bg-[var(--color-purple)]"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* رسالة الخطأ */}
          {errors?.subscriptionDuration && (
            <p className="text-red-500 text-xs mt-1">
              {errors.subscriptionDuration}
            </p>
          )}
        </div>
      )}

      {/* جدول الأيام أو تعديل فردي */}
      <div
        className={`w-[344px] flex flex-col gap-3 max-h-[220px] pr-1 ${
          daysSchedule.length > 4
            ? "overflow-y-auto custom-scrollbar"
            : "overflow-y-hidden"
        }`}
      >
        {!isIndividual && (
          <div className="flex items-center justify-between mb-1">
            <label className="block font-bold text-sm">
              جدول المواعيد{" "}
              {!isEditing && <span className="text-red-500"> *</span>}
            </label>

            <button
              onClick={handleAddDay}
              type="button"
              className="text-[var(--color-purple)] font-semibold text-sm flex items-center gap-1 hover:underline"
            >
              <span className="text-lg leading-none">＋</span>
              <span>إضافة يوم جديد</span>
            </button>
          </div>
        )}

        {/* تعديل حجز فردي */}
        {isIndividual ? (
          <div className="flex flex-col gap-2">
            <label className="block font-bold text-sm mb-1">وقت الحجز</label>
            <TimeRangePicker
              startTime={formData.start?.split("T")[1]?.slice(0, 5) || "08:00"}
              endTime={formData.end?.split("T")[1]?.slice(0, 5) || "09:00"}
              onChange={({ start, end }) => {
                const dateBase =
                  formData.dateOnly || new Date().toISOString().split("T")[0];
                setFormData({
                  ...formData,
                  start: `${dateBase}T${start}`,
                  end: `${dateBase}T${end}`,
                });
                // 🟣 تحقق فوري أثناء اختيار الوقت
                if (!start || !end) {
                  setErrors((prev) => ({
                    ...prev,
                    start: !start ? "وقت البداية مطلوب" : prev.start,
                    end: !end ? "وقت النهاية مطلوب" : prev.end,
                  }));
                } else {
                  setErrors((prev) => ({ ...prev, start: null, end: null }));
                }
              }}
              variant="booking"
            />
          </div>
        ) : (
          <>
            {daysSchedule.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-3">
                لم تتم إضافة أي يوم بعد
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {daysSchedule.map((row, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-[13px] font-normal"
                  >
                    {/* اليوم */}
                    <select
                      value={row.day}
                      onChange={(e) =>
                        handleChange(index, "day", e.target.value)
                      }
                      className="flex-1 h-9 rounded-md border border-gray-300 px-2 text-sm focus:outline-none"
                    >
                      <option value="">اختر اليوم</option>
                      {allDays.map((d) => (
                        <option key={d.short} value={d.short}>
                          {d.full}
                        </option>
                      ))}
                    </select>

                    {/* الوقت */}
                    <div className="flex-[1.5]">
                      <TimeRangePicker
                        isAddMode={!isEditing}
                        startTime={row.start}
                        endTime={row.end}
                        onChange={({ start, end }) => {
                          handleChange(index, "start", start);
                          handleChange(index, "end", end);
                        }}
                        variant="booking"
                      />
                    </div>

                    {/* حذف اليوم */}
                    <button
                      onClick={() => handleDeleteDay(index)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      <DeleteIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* 🟣 عرض رسالة الخطأ تحت جدول الأيام (لو جاية من AddBookingModal) */}
        {errors?.daysSchedule && (
          <p className="text-red-500 text-xs mt-1 text-center">
            {errors.daysSchedule}
          </p>
        )}
      </div>

      {/* التذكير */}
      <div className="w-[344px] mt-3 dropdown-step2 reminder-dropdown">
        <div className="relative w-full">
          <ReminderSelector
            selectedReminders={formData.reminders || []}
            setSelectedReminders={(newReminders) => {
              setFormData((prev) => ({
                ...prev,
                reminders: newReminders,
              }));
              setErrors((prev) => ({
                ...prev,
                reminders:
                  Array.isArray(newReminders) && newReminders.length > 0
                    ? null
                    : "اختيار التذكير مطلوب",
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import MiniCalender from "../../../components/MiniCalender/MiniCalender";
import TimeRangePicker from "../../../components/common/TimeRangePicker";
import ReminderSelector from "../../../components/common/ReminderSelector";
import calenderIcon from "../../../icons/calender.svg";
import downarrowIcon from "../../../icons/downarrow.svg";
import durationIcon from "../../../icons/duration.svg";
import DeleteIcon from "../../../icons/Delete.svg?react";

export default function Step2Booking({
  formData,
  setFormData,
  errors,
  setErrors,
  isEditing,
  isIndividual = false, // ← بيجي من AddBookingModal لتحديد نوع التعديل
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [openDuration, setOpenDuration] = useState(false);
  const [daysSchedule, setDaysSchedule] = useState(
    formData.daysSchedule?.length ? formData.daysSchedule : []
  );

  useEffect(() => {
  console.log("🟡 [Step2Booking] formData.daysSchedule عند الدخول:", formData.daysSchedule);
  console.log("🟡 [Step2Booking] state daysSchedule قبل التحديث:", daysSchedule);
}, [formData]);

  // 🟣 كل ما يتغير formData.daysSchedule، نحدّث state الداخلي
// ✅ إعادة تهيئة الخطوة كل ما يتغير formData بالكامل (مش بس daysSchedule)
// ✅ يشغل مرة واحدة عند الدخول أو لو تغيّر daysSchedule من الخارج
useEffect(() => {
  if (Array.isArray(formData?.daysSchedule)) {
    setDaysSchedule(formData.daysSchedule);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [formData.daysSchedule]);

// ✅ لما نغيّر داخليًا، نحدّث formData بدون حلقة
useEffect(() => {
  setFormData((prev) => {
    if (JSON.stringify(prev.daysSchedule) === JSON.stringify(daysSchedule)) {
      return prev; // ما نحدّث لو ما تغيّر فعليًا
    }
    return { ...prev, daysSchedule };
  });
}, [daysSchedule]);




  // ✅ خريطة اليوم العربي الكاملة لتوحيد العرض والقيمة
  const allDays = [
    { short: "سبت", full: "السبت" },
    { short: "أحد", full: "الأحد" },
    { short: "إثنين", full: "الإثنين" },
    { short: "ثلاثاء", full: "الثلاثاء" },
    { short: "أربعاء", full: "الأربعاء" },
    { short: "خميس", full: "الخميس" },
    { short: "جمعة", full: "الجمعة" },
  ];

  const handleDateChange = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, dateOnly: dateString }));
    setShowCalendar(false);
    if (errors?.start) setErrors((prev) => ({ ...prev, start: null }));
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
    formData.dateOnly || (formData.start ? formData.start.split("T")[0] : "");

useEffect(() => {
  // ✅ أول ما يتغير formData، نحدّث daysSchedule والتواريخ داخلياً
  if (formData) {
    setDaysSchedule(formData.daysSchedule || []);
  }
}, [formData]);


  return (
    <div className="flex flex-col gap-4 w-full items-center font-bold text-black text-[14px]">
      {/* 📅 تاريخ البدء */}
      <div className="w-[344px]">
        <label className="block font-bold text-sm mb-2">
          تاريخ البدء <span className="text-red-500">*</span>
        </label>
        <div className="relative flex flex-col w-full">
          <div
            className={`relative flex items-center w-full border rounded-md h-10 ${
              errors?.dateOnly ? "border-red-500" : "border-gray-300"
            }`}
          >
            <img
              src={calenderIcon}
              alt="calender"
              className="absolute right-2"
            />
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

      {/* ⌛ مدة الاشتراك */}
      {!isIndividual && (
        <div className="relative w-[344px]">
          <label className="block font-bold text-sm mb-2">
            مدة الاشتراك <span className="text-red-500">*</span>
          </label>
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
              } font-normal`}
            >
              {formData.subscriptionDuration || "اختر مدة الاشتراك"}
            </span>
            <img
              src={downarrowIcon}
              alt="downarrow"
              className="absolute left-2 w-4 h-4 pointer-events-none"
            />
          </div>
          {openDuration && (
            <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-300 mt-1 shadow z-50">
              {durationOptions.map((option, idx) => {
                const selected = formData.subscriptionDuration === option;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        duration: option,
                        subscriptionDuration: option,
                      });
                      setOpenDuration(false);
                      if (errors?.subscriptionDuration)
                        setErrors((prev) => ({
                          ...prev,
                          subscriptionDuration: null,
                        }));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={durationIcon}
                        alt="duration"
                        className="w-4 h-4"
                      />
                      <span
                        className={
                          selected
                            ? "font-bold text-black"
                            : "font-normal text-gray-800"
                        }
                      >
                        {option}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {errors?.subscriptionDuration && (
            <p className="text-red-500 text-xs mt-1">
              {errors.subscriptionDuration}
            </p>
          )}
        </div>
      )}

      {/* 🗓️ جدول الأيام أو تعديل فردي */}
<div className="w-[344px] flex flex-col gap-3">
  {!isIndividual && (
    <div className="flex items-center justify-between mb-1">
      <label className="block font-bold text-sm">
        جدول المواعيد <span className="text-red-500">*</span>
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

  {isIndividual && (
    <label className="block font-bold text-sm mb-1">
      تعديل وقت الحجز <span className="text-red-500">*</span>
    </label>
  )}

  {/* ✅ تعديل حجز فردي */}
  {isIndividual ? (
    <div className="flex flex-col gap-2">
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
                onChange={(e) => handleChange(index, "day", e.target.value)}
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
</div>


      {/* 🔔 التذكير */}
      <div className="w-[344px] mt-3">
        <ReminderSelector
          selectedReminders={formData.reminders || []}
    setSelectedReminders={(reminders) => {
      setFormData((prev) => ({ ...prev, reminders }));
    }}
        />
      </div>
    </div>
  );
}

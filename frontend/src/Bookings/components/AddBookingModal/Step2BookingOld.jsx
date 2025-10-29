import React, { useState, useEffect } from "react";
import MiniCalender from "../../../components/MiniCalender/MiniCalender";
import TimeRangePicker from "../../../components/common/TimeRangePicker";
import ReminderSelector from "../../../components/common/ReminderSelector";
import calenderIcon from "../../../icons/calender.svg";
import durationIcon from "../../../icons/duration.svg";
import downarrowIcon from "../../../icons/downarrow.svg";

export default function Step2BookingOld({
  formData,
  setFormData,
  errors,
  setErrors,
  isEditing,
  isIndividual = false, // جديد: لتعطيل الحقول للفردي
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [openDuration, setOpenDuration] = useState(false);
  const [openRepeat, setOpenRepeat] = useState(false);

  const durationOptions = [
    "أسبوع",
    "أسبوعين",
    "3 أسابيع",
    "شهر",
    "3 أشهر",
    "6 أشهر",
    "سنة",
  ];

  const allDays = ["سبت", "أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"];

 useEffect(() => {
  // ما نعمل أي تعديل لو التاريخ أصلاً جاي من formData
  if (formData.dateOnly) return;

  // فقط لو ما فيه dateOnly
  if (formData.start) {
    const dateStr = formData.start.split("T")[0];
    setFormData((prev) => ({ ...prev, dateOnly: dateStr }));
  }
}, [formData.start]);


  const getDateString = (dt) => (dt ? dt.split("T")[0] : "");
  const getTimeString = (dt) => (dt ? dt.split("T")[1]?.slice(0, 5) : "");
  const dateChosen = Boolean(formData.dateOnly);

  const handleDateChange = (date) => {
  const dateString = date.toISOString().split("T")[0];

  setFormData((prev) => {
    // نحتفظ بالوقت القديم إذا موجود
    const oldStartTime = prev.start?.split("T")[1] || "09:00";
    const oldEndTime = prev.end?.split("T")[1] || "10:00";

    return {
      ...prev,
      dateOnly: dateString,
      start: `${dateString}T${oldStartTime}`,
      end: `${dateString}T${oldEndTime}`,
    };
  });

  if (errors?.start) setErrors((prev) => ({ ...prev, start: null }));
  setShowCalendar(false);
};


  const handleStartTimeChange = (start) => {
  setFormData((prev) => {
    const dateBase = prev.dateOnly || new Date().toISOString().split("T")[0];
    const [hour, minute] = start.split(":").map(Number);
    const endHour = (hour + 1) % 24;
    const formattedEnd = `${endHour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    return {
      ...prev,
      start: `${dateBase}T${start}`,
      end: `${dateBase}T${formattedEnd}`,
    };
  });

  if (errors?.start) setErrors((prev) => ({ ...prev, start: null }));
};



  const dateDisplay =
    formData.dateOnly || (formData.start ? formData.start.split("T")[0] : "");

  return (
    <div className="flex flex-col gap-4 w-full items-center font-bold text-black text-[14px]">
      {/* 📅 التاريخ */}
      <div className="w-[344px]">
        <label className="block font-bold text-sm mb-2">
          تاريخ البدء <span className="text-red-500">*</span>
        </label>
        <div className="relative flex flex-col w-full">
          <div
            className={`relative flex items-center w-full border rounded-md h-10 ${
              errors?.start ? "border-red-500" : "border-gray-300"
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
              className={`h-10 w-full pr-8 pl-2 rounded-md focus:outline-none font-normal`}
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
          {errors?.start && (
            <p className="text-red-500 text-xs mt-1">{errors.start}</p>
          )}
        </div>
      </div>

      {/* ⏰ وقت البداية */}
      <div className="w-[344px]">
        <label className="block font-bold text-sm mb-2">
          وقت البداية <span className="text-red-500">*</span>
        </label>
        <TimeRangePicker
          startTime={getTimeString(formData.start) || ""}
  endTime={getTimeString(formData.end) || ""}
          variant="booking"
          onChange={({ start }) => handleStartTimeChange(start)}
          borderColor={errors?.start ? "red" : "#D1D5DB"}
        />
        <p className="text-red-500 text-xs mt-1">
          {errors?.start ? "اختر وقت البداية" : ""}
        </p>
      </div>

      {/* ⌛ مدة الاشتراك */}
      <div className="relative w-[344px]">
        <label className="block font-bold text-sm mb-2">
          مدة الاشتراك <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => !isIndividual && setOpenDuration(!openDuration)}
          className={`w-full h-10 rounded-md flex items-center justify-between px-2 cursor-pointer border ${
            errors?.subscriptionDuration ? "border-red-500" : "border-gray-300"
          } ${isIndividual ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
        {openDuration && !isIndividual && (
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
                      setErrors((prev) => ({ ...prev, subscriptionDuration: null }));
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={durationIcon}
                      alt="duration"
                      className="w-4 h-4"
                    />
                    <span
                      className={selected ? "font-bold text-black" : "font-normal text-gray-800"}
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
          <p className="text-red-500 text-xs mt-1">{errors.subscriptionDuration}</p>
        )}
      </div>

      {/* 🔁 أيام التكرار */}
      <div className="relative w-[344px]">
        <label className="block font-bold text-sm mb-2">
          أيام التكرار <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => !isIndividual && setOpenRepeat(!openRepeat)}
          className={`w-full h-10 rounded-md flex items-center justify-between cursor-pointer border px-2 ${
            errors?.repeatDays ? "border-red-500" : "border-gray-300"
          } ${isIndividual ? "bg-gray-100 cursor-not-allowed" : ""}`}
        >
          <span
            className={`h-10 w-full flex items-center ${
              formData.repeatDays?.length ? "text-black" : "text-gray-400"
            } font-normal`}
          >
            {formData.repeatDays?.length
              ? formData.repeatDays.join(" / ")
              : "اختر أيام التكرار"}
          </span>
          <img
            src={downarrowIcon}
            alt="downarrow"
            className="absolute left-2"
          />
        </div>
        {openRepeat && !isIndividual && (
          <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-300 mt-1 shadow z-50 p-3">
            {["يوميًا", ...allDays].map((day, idx) => {
              const allSelected = formData.repeatDays?.length === allDays.length;
              const isSelected = formData.repeatDays?.includes(day);

              const handleSelect = () => {
                let updated = formData.repeatDays || [];
                if (day === "يوميًا") {
                  updated = allSelected ? [] : [...allDays];
                } else {
                  if (isSelected) updated = updated.filter((d) => d !== day);
                  else updated = [...updated, day];
                }
                setFormData({
                  ...formData,
                  repeatDays: updated,
                  recurrence: updated,
                });
                if (errors?.repeatDays)
                  setErrors((prev) => ({ ...prev, repeatDays: null }));
              };

              const checked = day === "يوميًا" ? allSelected : isSelected;
              return (
                <div
                  key={idx}
                  onClick={handleSelect}
                  className="flex items-center justify-between h-[32px] px-3 py-1 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  <span className={checked ? "text-black" : "text-gray-800"}>
                    {day}
                  </span>
                  <div
                    className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm ${
                      checked
                        ? "bg-[var(--color-purple)] border-[var(--color-purple)]"
                        : "border-gray-400"
                    }`}
                  >
                    {checked && (
                      <svg
                        className="w-3 h-3 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {errors?.repeatDays && (
          <p className="text-red-500 text-xs mt-1">{errors.repeatDays}</p>
        )}
      </div>

      {/* 🔔 التذكير */}
      <div className="w-[344px]">
        <ReminderSelector
          selectedReminders={formData.reminders || []}
          setSelectedReminders={(reminders) =>
            setFormData({ ...formData, reminders })
          }
          variant="booking"
        />
      </div>
    </div>
  );
}

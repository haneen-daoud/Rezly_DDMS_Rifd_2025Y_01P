import React, { useState } from "react";
import MiniCalender from "../MiniCalender/MiniCalender";
import TimeRangePicker from "../common/TimeRangePicker";
import calenderIcon from "../../icons/calender.svg";
import ReminderSelector from "../common/ReminderSelector";
import durationIcon from "../../icons/duration.svg";
import downarrowIcon from "../../icons/downarrow.svg";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Step2Booking = ({ bookingData, setBookingData }) => {

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

  if (!bookingData) return null;

  const allDays = ["سبت", "أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"];

  const handleDateChange = (date) => {
    const dateString = date.toISOString().split("T")[0];

    const currentStartTime = bookingData.start?.split("T")[1] || "08:00";
    const currentEndTime = bookingData.end?.split("T")[1] || "09:00";

    setBookingData({
      ...bookingData,
      start: `${dateString}T${currentStartTime}`,
      end: `${dateString}T${currentEndTime}`,
    });

    setShowCalendar(false);
  };

  const getDateString = (dt) =>
    typeof dt === "string" && dt.includes("T") ? dt.split("T")[0] : "";

  const getTimeString = (dt) =>
    typeof dt === "string" && dt.includes("T") ? dt.split("T")[1] : "";

  const dateChosen = Boolean(
    bookingData.start && getDateString(bookingData.start)
  );

  return (
    <div className="flex flex-col gap-4 w-full items-center font-bold text-black text-[14px]">
      {/* التاريخ */}
      <div className="w-[344px]">
        <label className="block font-bold text-sm mb-2">تاريخ البدء</label>
        <div className="relative flex items-center w-full">
          <img src={calenderIcon} alt="calender" className="absolute right-2" />
          <input
            type="text"
            value={dateChosen ? getDateString(bookingData.start) : ""}
            placeholder="اختر تاريخ"
            readOnly
            className={`h-10 w-full pr-8 pl-2 rounded-md border border-[#D1D5DB] focus:outline-none ${
              dateChosen ? "text-black" : "text-gray-400"
            } font-normal`}
            onClick={() => setShowCalendar(!showCalendar)}
          />
          {showCalendar && (
            <div className="absolute top-full left-0 mt-2 z-30 w-60">
              <MiniCalender
                currentDate={
                  bookingData.start ? new Date(bookingData.start) : new Date()
                }
                handleDateChange={handleDateChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* الوقت */}
      <div className="w-[344px]">
        <label className="block font-bold text-sm mb-2">الوقت</label>
        <TimeRangePicker
          startTime={getTimeString(bookingData.start) || "08:00"}
          endTime={getTimeString(bookingData.end) || "09:00"}
          variant="booking"
          onChange={({ start, end }) => {
            const date = bookingData.start?.split("T")[0];
            setBookingData({
              ...bookingData,
              start: date ? `${date}T${start}` : "",
              end: date ? `${date}T${end}` : "",
            });
          }}
        />
      </div>

      {/* مدة الاشتراك */}
      <div className="relative w-[344px]">
        <label className="block font-bold text-sm mb-2">مدة الاشتراك</label>
        <div
          className="w-full h-10 rounded-md flex items-center justify-between cursor-pointer px-2 relative"
          style={{ border: `1px solid #D1D5DB` }}
          onClick={() => setOpenDuration((prev) => !prev)}
        >
          <span
            className={`h-10 w-full flex items-center pl-2 ${
              bookingData.subscriptionDuration ? "text-black" : "text-gray-400"
            } font-normal`}
          >
            {bookingData.subscriptionDuration || "اختر مدة الاشتراك"}
          </span>
          <img
            src={downarrowIcon}
            alt="downarrow"
            className="absolute left-2 w-4 h-4 pointer-events-none"
          />
        </div>

        {/* قائمة المدة */}
        {openDuration && (
          <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-400 mt-1 shadow z-[1000]">
            {durationOptions.map((option, idx) => {
              const isSelected = bookingData.subscriptionDuration === option;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                  onClick={() => {
                    setBookingData({
                      ...bookingData,
                      duration: option,
                      subscriptionDuration: option,
                    });
                    setOpenDuration(false);
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
                        isSelected
                          ? "font-bold text-black"
                          : "font-normal text-gray-800"
                      }
                    >
                      {option}
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-[#6A0EAD]" : "border-gray-400"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 bg-[#6A0EAD] rounded-full"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* التكرار */}
      <div className="relative w-[344px]">
        <label className="block font-bold text-sm w-full h-[18px] mb-2">
          أيام التكرار
        </label>
        <div
          className="w-full h-10 rounded-[8px] flex items-center justify-between cursor-pointer relative"
          onClick={() => setOpenRepeat(!openRepeat)}
          style={{ border: "1px solid rgba(0,0,0,0.1)" }}
        >
          <span
            className={`h-10 pr-3 pl-2 w-full flex items-center font-normal ${
              bookingData.repeatDays?.length ? "text-black" : "text-gray-400"
            }`}
          >
            {bookingData.repeatDays?.length
              ? bookingData.repeatDays.join("/ ")
              : "اختر أيام التكرار"}
          </span>
          <img
            src={downarrowIcon}
            alt="downarrow"
            className="absolute left-2"
          />
        </div>

        {openRepeat && (
          <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-50 text-[#000000]">
            <div className="w-full h-full p-4 box-border overflow-y-auto">
              {["يوميًا", ...allDays].map((day, idx) => {
                const dailySelected =
                  bookingData.repeatDays?.length === allDays.length;
                const isSelected = bookingData.repeatDays?.includes(day);

                const handleSelect = () => {
                  let updated = bookingData.repeatDays || [];

                  if (day === "يوميًا") {
                    if (dailySelected) {
                      updated = [];
                    } else {
                      updated = [...allDays];
                    }
                  } else {
                    if (isSelected) {
                      updated = updated.filter((d) => d !== day);
                    } else {
                      updated = [...updated, day];
                    }

                    if (updated.length === allDays.length) {
                      updated = [...allDays];
                    }
                  }

                  setBookingData({
                    ...bookingData,
                    repeatDays: updated,
                    recurrence: updated,
                  });
                };

                const checked = day === "يوميًا" ? dailySelected : isSelected;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                    onClick={handleSelect}
                  >
                    <span
                      className={
                        checked ? "text-black" : "font-normal text-gray-800"
                      }
                    >
                      {day}
                    </span>
                    <div
                      className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm ${
                        checked
                          ? "bg-[var(--color-purple)] border-[var(--color-purple)]"
                          : "border-gray-400 bg-white"
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
          </div>
        )}
      </div>

      {/* التذكير */}
      <div className="w-[344px]">
        <ReminderSelector
          selectedReminders={bookingData.reminders || []}
          setSelectedReminders={(reminders) =>
            setBookingData({ ...bookingData, reminders })
          }
          variant="booking"
        />
      </div>
    </div>
  );
};

export default Step2Booking;

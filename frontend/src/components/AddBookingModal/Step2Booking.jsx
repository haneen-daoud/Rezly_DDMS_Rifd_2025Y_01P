import React, { useState } from "react";
import MiniCalender from "../MiniCalender/MiniCalender";
import TimeRangePicker from "../common/TimeRangePicker";
import calenderIcon from "../../icons/calender.svg";
import ReminderSelector from "../common/ReminderSelector";
import durationIcon from "../../icons/duration.svg"; // أيقونة الاختيارات
import downarrowIcon from "../../icons/downarrow.svg";

const Step2Booking = ({ bookingData, setBookingData }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [openDuration, setOpenDuration] = useState(false);

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

  const handleDateChange = (date) => {
    const dateString = date.toISOString().split("T")[0];
    // ضبط البداية 08:00 والنهاية 09:00 عند اختيار التاريخ
    setBookingData({
      ...bookingData,
      start: `${dateString}T08:00`,
      end: `${dateString}T09:00`,
    });
    setShowCalendar(false);
  };

  const getDateString = (dt) => {
    if (!dt) return "";
    if (typeof dt === "string" && dt.includes("T")) return dt.split("T")[0];
    return "";
  };

  const getTimeString = (dt) => {
    if (!dt) return "";
    if (typeof dt === "string" && dt.includes("T")) return dt.split("T")[1];
    return "";
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center font-bold text-black text-[14px]">
      {/* التاريخ */}
      <div className="w-[344px]">
        <label className="block font-bold text-sm mb-2">التاريخ</label>
        <div className="relative flex items-center w-full">
          <img src={calenderIcon} alt="calender" className="absolute right-2" />
          <input
            type="text"
            value={getDateString(bookingData.start)}
            placeholder="اختر تاريخ"
            readOnly
            className={`h-10 w-full pr-8 pl-2 rounded-md border border-gray-400 focus:outline-none ${
              !bookingData.start ? "text-gray-400" : "text-black"
            }`}
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
          startTime={getTimeString(bookingData.start)}
          endTime={getTimeString(bookingData.end)}
          onChange={({ start, end }) => {
            const date =
              getDateString(bookingData.start) ||
              new Date().toISOString().split("T")[0];
            setBookingData({
              ...bookingData,
              start: `${date}T${start}`,
              end: `${date}T${end}`,
            });
          }}
        />
      </div>

      <div className="relative w-[344px]">
  <label className="block font-bold text-sm mb-2">مدة الاشتراك</label>

  {/* الحقل */}
  <div
    className="w-full h-10 rounded-md flex items-center justify-between cursor-pointer px-2 relative"
    style={{ border: `1px solid #D1D5DB` }}
    onClick={() => setOpenDuration((prev) => !prev)}
  >
    <span
      className={`h-10 w-full flex items-center pl-2 ${
        bookingData.duration ? "text-black" : "text-gray-400"
      } font-normal`}
    >
      {bookingData.duration || "اختر مدة الاشتراك"}
    </span>
    <img
      src={downarrowIcon}
      alt="downarrow"
      className="absolute left-2 w-4 h-4 pointer-events-none"
    />
  </div>

  {/* القائمة */}
  {openDuration && (
    <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-400 mt-1 shadow z-[1000]">
      {durationOptions.map((option, idx) => {
        const isSelected = bookingData.duration === option;
        return (
          <div
            key={idx}
            className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
            onClick={() => {
              setBookingData({ ...bookingData, duration: option });
              setOpenDuration(false);
            }}
          >
            <div className="flex items-center gap-2">
              <img src={durationIcon} alt="duration" className="w-4 h-4" />
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


      {/* التذكير */}
      <div className="w-[344px]">
       <ReminderSelector
  selectedReminder={bookingData.reminder}
  setSelectedReminder={(rem) => setBookingData({ ...bookingData, reminder: rem })}
  showIconInInput={false}
  borderStyle="#D1D5DB"
  placeholderColor="text-gray-400"
/>


      </div>
    </div>
  );
};

export default Step2Booking;

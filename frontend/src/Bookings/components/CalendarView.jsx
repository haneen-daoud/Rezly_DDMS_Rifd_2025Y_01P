// src/Bookings/components/CalendarPage.jsx
import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-toastify";
import { updateBookingAPI, deleteBookingAPI } from "../../api/bookingsApi";
import { useBookings } from "../BookingsContext";
import EventModal from "./EventModal";
import MiniCalender from "../../components/MiniCalender/MiniCalender";

import "./Calender.css";

import CalenderIcon from "../../icons/calender.svg";
import ReSizeIcon from "../../icons/resize.svg";
import RightArrowIcon from "../../icons/rightarrow.svg";
import LeftArrowIcon from "../../icons/leftarrow.svg";
import DownArrowIcon from "../../icons/downarrow.svg";

export default function CalendarView() {
  // بيانات الحجوزات من الكونتكس
  const { bookings, setBookings } = useBookings();

  // مودال / اختيار حدث
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ريڤرنس الكالندر
  const calendarRef = useRef(null);

  // ستايتات للواجهة (عرض/تاريخ/فيو)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("timeGridDay");
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fullScreenMode, setFullScreenMode] = useState(false);

  // ---- تحويل الحجوزات إلى أحداث FullCalendar ----
  // دالة مساعدة لتحويل الوقت العربي "9:30 ص" -> "09:30"
  const parseArabicTime = (timeStr) => {
    if (!timeStr) return "00:00";
    // بعض الحجوزات عندك تخزّن "1:30 م" (space) أو "1:30م" - نغطي الحالتين
    const cleaned = timeStr.replace(/\u200E/g, "").replace(/\s+/g, " ").trim();
    const parts = cleaned.split(" ");
    let timePart = parts[0] ?? cleaned;
    let period = parts[1] ?? "";

    // إذا الفترة مدموِجة (مثلاً "2:30م") نفصل الأرقام عن الحرف
    if (!period && /[ابتثجحخدذرزسشصضطظعغفقكلمنهويمص]/i.test(timePart.slice(-1))) {
      // لو آخر حرف عربي افصل
      const match = timePart.match(/^(.+?)([^\d:]+)$/);
      if (match) {
        timePart = match[1];
        period = match[2];
      }
    }

    // normalize AM/PM arabic letters
    period = period.trim();
    if (period === "م" || period.toLowerCase() === "م") period = "PM";
    else if (period === "ص" || period.toLowerCase() === "ص") period = "AM";
    else if (!period) period = ""; // unknown

    let [hourStr, minStr] = timePart.split(":");
    let hour = parseInt(hourStr || "0", 10);
    let minute = parseInt(minStr || "0", 10);

    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    // pad
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  const events = (bookings || [])
    .filter((b) => b && b.date)
    .map((b) => {
      const baseDate = new Date(b.date);
      // استخدم start/end إذا موجودين بصيغة ISO، وإلا نبنيها من timeStart/timeEnd
      const safeDateStr = baseDate.toISOString().split("T")[0];

      const getStartISO = () => {
        if (b.start) return b.start; // لو موجودة بصيغة ISO
        const t = parseArabicTime(b.timeStart);
        return `${safeDateStr}T${t}`;
      };
      const getEndISO = () => {
        if (b.end) return b.end;
        const t = parseArabicTime(b.timeEnd);
        return `${safeDateStr}T${t}`;
      };

      const startIso = getStartISO();
      const endIso = getEndISO();

      // Extended props للعرض داخل الـ eventContent
      return {
        id: b._id,
        title: b.service || b.className || "بدون اسم",
        start: startIso,
        end: endIso,
        extendedProps: {
          coach: b.coach?.name || (b.coach?.id && b.coach?.name) || "لا يوجد مدرب",
          participants: b.membersCount ?? b.participants?.length ?? 0,
          room: b.location || b.room || "",
          rawBooking: b, // نحفظ النسخة الأصلية لو احتجنا
        },
      };
    });

  // ---- دوال التحكم ----
  const handleChangeView = (newView) => {
    setView(newView);
    setShowViewMenu(false);
    calendarRef.current?.getApi().changeView(newView);
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
    setShowDatePicker(false);
    calendarRef.current?.getApi().gotoDate(date);
  };

  // حفظ تعديل الحجز (يستدعى من EventModal عبر prop)
  const handleSaveBooking = async (updatedBooking) => {
    try {
      const cleanedData = {
        ...updatedBooking,
        coachId:
          typeof updatedBooking.coach === "object"
            ? updatedBooking.coach.id
            : updatedBooking.coachId || "",
        timeStart: updatedBooking.timeStart || updatedBooking.start?.split("T")[1]?.slice(0,5) || "",
        timeEnd: updatedBooking.timeEnd || updatedBooking.end?.split("T")[1]?.slice(0,5) || "",
        recurrence: updatedBooking.recurrence || updatedBooking.days || [],
        repeat: updatedBooking.repeat || "",
      };

      await updateBookingAPI(updatedBooking._id, cleanedData);

      // تحديث محلي
      setBookings((prev) => prev.map((b) => (b._id === updatedBooking._id ? { ...b, ...cleanedData } : b)));

      toast.success("تم تعديل الحجز بنجاح ✅");
      setSelectedBooking(null);
    } catch (err) {
      console.error("❌ خطأ أثناء التعديل:", err);
      toast.error("حدث خطأ أثناء تعديل الحجز");
    }
  };

  const handleDeleteBooking = async (bookingToDelete) => {
    try {
      await deleteBookingAPI(bookingToDelete._id);
      setBookings((prev) => prev.filter((b) => b._id !== bookingToDelete._id));
      toast.success("تم حذف الحجز ✅");
      setSelectedBooking(null);
    } catch (err) {
      console.error("خطأ أثناء الحذف:", err);
      toast.error("حدث خطأ أثناء حذف الحجز");
    }
  };

  // عرض الحدث عند النقر عليه
  const onEventClick = (info) => {
    const clicked = bookings.find((b) => b._id === info.event.id);
    if (clicked) setSelectedBooking(clicked);
  };

  return (
    <>
      <div
        className={`${
          fullScreenMode ? "fixed inset-0 z-50 p-4 bg-white flex flex-col" : "relative w-full h-full"
        }`}
      >
        <div className="bg-white rounded-[16px] overflow-hidden flex-1 flex flex-col" dir="rtl">
          {/* الهيدر */}
          <div className="grid grid-cols-[50px_1fr]">
            <div className="border-l border-[#eee] w-[46px] pt-[12px]"></div>
            <div className="flex justify-between items-center px-[12px] pb-[12px] pt-[12px]">
              <div className="flex items-center gap-[12px]">
                {/* التاريخ وmini calendar */}
                <div className="relative">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="h-[32px] w-auto px-2 flex items-center gap-2 rounded-[8px] font-semibold bg-[#F8F9FA] border-0 outline-none"
                  >
                    <img src={CalenderIcon} alt="calender" />
                    <span className="font-cairo text-[14px] font-bold text-black truncate">
                      {currentDate.toLocaleDateString("ar-en", { day: "numeric", month: "short" })}
                    </span>
                    <img src={DownArrowIcon} alt="downarrow" />
                  </button>
                  {showDatePicker && (
                    <div className="absolute top-full left-0 z-30">
                      <MiniCalender currentDate={currentDate} handleDateChange={handleDateChange} />
                    </div>
                  )}
                </div>

                {/* زر تبديل العرض */}
                <div className="relative">
                  <button
                    onClick={() => setShowViewMenu(!showViewMenu)}
                    className="bg-[#F8F9FA] w-[111px] h-[32px] px-[8px] py-2 rounded-[8px] font-semibold flex items-center justify-between gap-x-[12px]"
                  >
                    <img src={RightArrowIcon} alt="rightarrow" />
                    <span className="font-cairo text-[14px] font-[700] text-black">
                      {view === "timeGridDay" ? "اليوم" : view === "timeGridWeek" ? "أسبوع" : "شهر"}
                    </span>
                    <img src={LeftArrowIcon} alt="leftarrow" />
                  </button>

                  {showViewMenu && (
                    <div className="absolute z-30 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-24">
                      <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black" onClick={() => handleChangeView("timeGridDay")}>يوم</div>
                      <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black" onClick={() => handleChangeView("timeGridWeek")}>أسبوع</div>
                      <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black" onClick={() => handleChangeView("dayGridMonth")}>شهر</div>
                    </div>
                  )}
                </div>
              </div>

              {/* زر تكبير الشاشة */}
              <div>
                <img
                  src={ReSizeIcon}
                  alt="resize"
                  className="cursor-pointer"
                  onClick={() => {
                    setFullScreenMode(!fullScreenMode);
                    setTimeout(() => calendarRef.current?.getApi().render(), 0);
                  }}
                />
              </div>
            </div>
          </div>

          {/* الكاليندر */}
          <FullCalendar
            key={fullScreenMode ? "fullscreen" : "dashboard"}
            height={fullScreenMode ? "100%" : "auto"}
            contentHeight={fullScreenMode ? "100%" : "auto"}
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={false}
            locale="ar"
            direction="rtl"
            slotMinTime="08:00:00"
            slotMaxTime="24:00:00"
            slotDuration="00:30:00"
            events={events}
            eventClick={onEventClick}
            eventContent={(eventInfo) => {
              
              return (
                <div
                  className="p-2 rounded border-r-4 w-full h-full truncate"
                  style={{
                    background: "#DBEAFE",
                    borderColor: "#3B82F6",
                    color: "#1E3A8A",
                    fontFamily: "Cairo",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  <div className="opacity-90">{eventInfo.timeText}</div>
                  <div className="truncate">{eventInfo.event.title}</div>
                  
                </div>
              );
            }}
            allDaySlot={false}
            eventOverlap={true}
            slotEventOverlap={true}
            slotLabelContent={(arg) =>
              arg.date
                .toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
                .replace("AM", "")
                .replace("PM", "")
                .trim()
            }
          />
        </div>
      </div>

      {/* مودال الحدث */}
      {selectedBooking && (
        <EventModal
          booking={selectedBooking}
          setBooking={setSelectedBooking}
          handleSaveBooking={handleSaveBooking}
          handleDeleteBooking={() => handleDeleteBooking(selectedBooking)}
          closeModal={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
}

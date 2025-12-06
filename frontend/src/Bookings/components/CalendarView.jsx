// src/Bookings/components/CalendarPage.jsx
import React, { useRef, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-toastify";
import { useBookings } from "../BookingsContext";
import EventModal from "./EventModal";
import MiniCalender from "../../components/MiniCalender/MiniCalender";

import "./Calender.css";

import CalenderIcon from "../../icons/calender.svg?react";
import ReSizeIcon from "../../icons/resize.svg?react";
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

  // 🎨 ألوان الحجز الأربعة
  const bookingColors = [
    { bg: "#DCFCE7", border: "#22C55E", text: "#14532D" }, // أخضر
    { bg: "#EDE9FE", border: "#8B5CF6", text: "#4C1D95" }, // بنفسجي
    { bg: "#DBEAFE", border: "#3B82F6", text: "#1E3A8A" }, // أزرق
    { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" }, // أصفر
  ];

  // 🎨 توزيع الألوان الأربعة بشكل دائري وثابت بالكاش
  const getBookingColor = (bookingId) => {
    const storedColors = JSON.parse(
      localStorage.getItem("bookingColors") || "{}"
    );
    const colorList = bookingColors;

    // لو الحجز له لون مسبق، رجّعه مباشرة
    if (storedColors[bookingId]) return storedColors[bookingId];

    // نقرأ العدّاد الحالي من الكاش
    let colorCounter = parseInt(
      localStorage.getItem("colorCounter") || "0",
      10
    );

    // نحدد اللون بناءً على العداد (0 → أول لون، 1 → ثاني...)
    const color = colorList[colorCounter % colorList.length];

    // نحدّث العدّاد ونسجّله بالكاش
    colorCounter = (colorCounter + 1) % colorList.length;
    localStorage.setItem("colorCounter", colorCounter.toString());

    // نخزّن اللون لهذا الحجز
    storedColors[bookingId] = color;
    localStorage.setItem("bookingColors", JSON.stringify(storedColors));

    return color;
  };

  // ---- تحويل الحجوزات إلى أحداث FullCalendar ----
  // دالة مساعدة لتحويل الوقت العربي "9:30 ص" -> "09:30"
  const parseArabicTime = (timeStr) => {
    if (!timeStr) return "00:00";
    // بعض الحجوزات عندك تخزّن "1:30 م" (space) أو "1:30م" - نغطي الحالتين
    const cleaned = timeStr
      .replace(/\u200E/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const parts = cleaned.split(" ");
    let timePart = parts[0] ?? cleaned;
    let period = parts[1] ?? "";

    // إذا الفترة مدموِجة (مثلاً "2:30م") نفصل الأرقام عن الحرف
    if (
      !period &&
      /[ابتثجحخدذرزسشصضطظعغفقكلمنهويمص]/i.test(timePart.slice(-1))
    ) {
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
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}`;
  };

  // 🟣 الآن كل schedule داخل booking يتحول إلى Event مستقل
  const events = (bookings || []).flatMap((booking, index) => {
    if (!booking.schedules || booking.schedules.length === 0) return [];

    return booking.schedules.map((s, sIndex) => {
      // 🎨 كل schedule له لون خاص حسب الـ _id
      const colorData = getBookingColor(s._id);

      const parseArabicTime = (timeStr) => {
        if (!timeStr) return "00:00";
        const hasPM = /م/.test(timeStr);
        const hasAM = /ص/.test(timeStr);
        const clean = timeStr.replace(/[^\d:]/g, "");
        const [hStr, mStr] = clean.split(":");
        let h = parseInt(hStr || "0", 10);
        const m = parseInt(mStr || "0", 10);
        if (hasPM && h < 12) h += 12;
        if (hasAM && h === 12) h = 0;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      };

      const safeDate = new Date(s.date);
      const dateStr = safeDate.toISOString().split("T")[0];
      const start = `${dateStr}T${parseArabicTime(s.timeStart)}`;
      const end = `${dateStr}T${parseArabicTime(s.timeEnd)}`;

      return {
        id: s._id,
        title: booking.service || "حجز",
        start,
        end,
        extendedProps: {
          coach: booking.coach?.name || "لا يوجد مدرب",
          participants: booking.membersCount ?? 0,
          room: s.location || booking.location || "",
          rawBooking: booking,
          color: colorData, // 🎨 كل schedule الآن له لون خاص
        },
      };
    });
  });

  // ---- دوال التحكم ----

  // حفظ تعديل الحجز (يستدعى من EventModal عبر prop)
  const handleSaveBooking = async (updatedBooking) => {
    try {
      const cleanedData = {
        ...updatedBooking,
        coachId:
          typeof updatedBooking.coach === "object"
            ? updatedBooking.coach.id
            : updatedBooking.coachId || "",
        timeStart:
          updatedBooking.timeStart ||
          updatedBooking.start?.split("T")[1]?.slice(0, 5) ||
          "",
        timeEnd:
          updatedBooking.timeEnd ||
          updatedBooking.end?.split("T")[1]?.slice(0, 5) ||
          "",
        recurrence: updatedBooking.recurrence || updatedBooking.days || [],
        repeat: updatedBooking.repeat || "",
      };

      await updateBookingAPI(updatedBooking._id, cleanedData);

      // تحديث محلي
      setBookings((prev) =>
        prev.map((b) =>
          b._id === updatedBooking._id ? { ...b, ...cleanedData } : b
        )
      );

      toast.success("تم تعديل الحجز بنجاح ✅");
      setSelectedBooking(null);
    } catch (err) {
      console.error("❌ خطأ أثناء التعديل:", err);
      toast.error("حدث خطأ أثناء تعديل الحجز");
    }
  };

  // 🟣 حذف الحجز الفردي من الكاليندر (schedule واحد فقط)
  // 🟣 حذف الحجز الفردي من الكاليندر (schedule واحد فقط)
  const handleDeleteBooking = async (bookingToDelete) => {
    try {
      const token =
        (localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : `Bearer ${import.meta.env.VITE_API_TOKEN}`) || "";

      const scheduleId = bookingToDelete?.selectedScheduleId;
      const bookingId = bookingToDelete?._id;

      if (!bookingId || !scheduleId) {
        toast.error("لم يتم تحديد الحجز الفردي بشكل صحيح ❌");
        return;
      }

      // 🚀 طلب حذف فردي فعلي من الباك
      const url = `https://rezly-ddms-rifd-2025y-01p.onrender.com/booking/${bookingId}?scheduleId=${scheduleId}`;
      const res = await axios.delete(url, {
        headers: {
          Authorization: token.startsWith("Bearer") ? token : `Bearer ${token}`,
        },
      });

      console.log("🟢 تم حذف الحجز الفردي بنجاح:", res.data);

      // 🧹 حذف الجدول من الواجهة مباشرة
      setBookings((prev) => {
        const updated = prev
          .map((b) =>
            b._id === bookingId
              ? {
                  ...b,
                  schedules: b.schedules?.filter((s) => s._id !== scheduleId),
                }
              : b
          )
          .filter((b) => b.schedules?.length > 0);

        // ✅ نحفظ نسخة مباشرة بالكاش المحلي
        localStorage.setItem("cachedBookings", JSON.stringify(updated));
        return updated;
      });

      // ❌ ما منعمل fetchBookings مباشرة بعد الحذف
      // 🕐 نعطي السيرفر وقت يسجل التغيير
      setTimeout(() => {
        // تحديث خفيف بعد 2 ثانية
        fetchBookings();
      }, 2000);

      toast.success("تم حذف الحجز لليوم المحدد ✅");
      setSelectedBooking(null);
    } catch (err) {
      console.error(
        "❌ خطأ أثناء حذف الحجز الفردي:",
        err.response?.data || err.message
      );
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء حذف الحجز الفردي ❌"
      );
    }
  };

  // عرض الحدث عند النقر عليه
  const onEventClick = (info) => {
    const clicked = bookings.find((b) => b._id === info.event.id);
    if (clicked) setSelectedBooking(clicked);
  };

  const handleChangeView = (newView) => {
    setView(newView);
    setShowViewMenu(false);
    const api = calendarRef.current?.getApi();
    if (api) {
      api.changeView(newView);
      // نحدّث التاريخ المعروض حسب موقع الكاليندر بعد تغيير الفيو
      setCurrentDate(api.getDate());
    }
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
    setShowDatePicker(false);
    calendarRef.current?.getApi().gotoDate(date);
  };

  // 👇 جديد: التنقّل بالسهم اليمين (اليوم/الأسبوع/الشهر التالي)
  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.next();
    setCurrentDate(api.getDate());
  };

  // 👈 جديد: التنقّل بالسهم اليسار (اليوم/الأسبوع/الشهر السابق)
  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.prev();
    setCurrentDate(api.getDate());
  };

  return (
    <>
      <div
        className={`${
          fullScreenMode ? "calendar-fullscreen" : "relative w-full h-full"
        }`}
      >
        <div
          className={`bg-white rounded-[16px] overflow-hidden flex-1 flex flex-col h-full ${
            view === "timeGridWeek" ? "" : "hide-fc-header"
          }`}
          dir="rtl"
        >
          {/* الهيدر */}
          <div className="grid grid-cols-[50px_1fr]">
            <div className="border-l border-[#eee] w-[46px] pt-[12px]"></div>
            <div className="flex justify-between items-center px-[12px] pb-[12px] pt-[12px] gap-[8px]">
              <div className="flex items-center gap-[6px]">
                {/* التاريخ وmini calendar */}
                <div className="relative">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="h-[32px] w-auto px-2 flex items-center gap-1 rounded-[8px] font-semibold bg-[#F8F9FA] border-0 outline-none whitespace-nowrap"

                  >
                    <CalenderIcon className="w-5 h-5 text-[var(--color-purple)]" />
                    <span className="font-cairo text-[14px] font-bold text-black truncate">
                      {currentDate.toLocaleDateString("ar-en", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <img src={DownArrowIcon} alt="downarrow" />
                  </button>
                  {showDatePicker && (
                    <div className="absolute top-full left-0 z-30">
                      <MiniCalender
                        currentDate={currentDate}
                        handleDateChange={handleDateChange}
                        variant="calender"
                        hideTodayHighlight={false}
                      />
                    </div>
                  )}
                </div>

                {/* أزرار التنقّل + اختيار نوع العرض */}
                <div className="flex items-center gap-[8px]">
                  {/* زر السهم اليسار → اليوم/الأسبوع/الشهر السابق */}
                  <button
                    onClick={handlePrev}
                    className="bg-[#F8F9FA] w-[32px] h-[32px] flex items-center justify-center rounded-[8px]"
                  >
                    <img src={RightArrowIcon} alt="السابق" />
                  </button>

                  {/* زر اختيار (يوم / أسبوع / شهر) */}
                  <div className="relative">
                    <button
                      onClick={() => setShowViewMenu(!showViewMenu)}
                      className="bg-[#F8F9FA] w-[32px] h-[32px] rounded-[8px] flex items-center justify-center sm:min-w-[100px] sm:px-[8px]"
                    >
                      {/* موبايل: أيقونة ثلاث خطوط صغيرة */}
                      <span className="block sm:hidden text-[18px] font-bold text-[var(--color-purple)]">
                        ⋮
                      </span>

                      {/* شاشات كبيرة: النص العادي */}
                      <span className="hidden sm:flex font-cairo text-[14px] font-[700] text-black">
                        {view === "timeGridDay"
                          ? "اليوم"
                          : view === "timeGridWeek"
                          ? "أسبوع"
                          : "شهر"}
                      </span>

                      {/* السهم */}
                      <img
                        src={DownArrowIcon}
                        alt="اختر العرض"
                        className="hidden sm:block"
                      />
                    </button>

                    {showViewMenu && (
                      <div className="absolute z-30 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-24">
                        <div
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                          onClick={() => handleChangeView("timeGridDay")}
                        >
                          يوم
                        </div>
                        <div
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                          onClick={() => handleChangeView("timeGridWeek")}
                        >
                          أسبوع
                        </div>
                        <div
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                          onClick={() => handleChangeView("dayGridMonth")}
                        >
                          شهر
                        </div>
                      </div>
                    )}
                  </div>

                  {/* زر السهم اليمين → اليوم/الأسبوع/الشهر التالي */}
                  <button
                    onClick={handleNext}
                    className="bg-[#F8F9FA] w-[32px] h-[32px] flex items-center justify-center rounded-[8px]"
                  >
                    <img src={LeftArrowIcon} alt="التالي" />
                  </button>
                </div>
              </div>

              {/* زر تكبير الشاشة */}
              <div>
                <ReSizeIcon
                  className="cursor-pointer w-8 h-8 text-[var(--color-purple)]"
                  onClick={() => {
                    const api = calendarRef.current?.getApi();

                    // 🟣 نحفظ التاريخ الحالي من الكاليندر نفسه
                    const current = api?.getDate();
                    if (current) {
                      setCurrentDate(current);
                    }

                    // نبدّل وضع الفل سكرين فقط
                    setFullScreenMode((prev) => !prev);

                    // بعد ما يعيد رندر، نرجّعه على نفس التاريخ ونحدّث الحجم
                    setTimeout(() => {
                      const apiAfter = calendarRef.current?.getApi();
                      if (apiAfter && current) {
                        apiAfter.gotoDate(current);
                        apiAfter.updateSize();
                      }
                    }, 0);
                  }}
                />
              </div>
            </div>
          </div>

          {/* الكاليندر */}
          <FullCalendar
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
            dayMaxEvents={view === "dayGridMonth" ? 3 : false}
            eventMaxStack={
              view === "timeGridDay"
                ? fullScreenMode
                  ? 6 // 👈 في عرض اليوم + فل سكرين → 6
                  : 4 // 👈 في عرض اليوم العادي → 4
                : 4 // باقي العروض نخليها 4 زي ما هي
            }
            eventClick={(info) => {
              const scheduleId = info.event.id;
              const foundBooking = bookings.find((b) =>
                b.schedules?.some((s) => s._id === scheduleId)
              );

              console.log("🟣 [CalendarView] تم الضغط على الإيفنت:", {
                scheduleId,
                foundBooking,
                selectedSchedule: foundBooking?.schedules.find(
                  (s) => s._id === scheduleId
                ),
              });

              if (foundBooking) {
                setSelectedBooking({
                  ...foundBooking,
                  selectedScheduleId: scheduleId,
                  selectedSchedule: foundBooking.schedules.find(
                    (s) => s._id === scheduleId
                  ),
                });
              } else {
                console.warn(
                  "❌ لم يتم العثور على الحجز لهذا الـ schedule:",
                  scheduleId
                );
              }
            }}
            eventContent={(eventInfo) => {
              const color = eventInfo.event.extendedProps.color || {};
              return (
                <div
                  className="
    w-full h-full rounded border-r-4 
    flex flex-col items-center justify-center text-center 
    px-1 py-0.5
    leading-tight
  "
                  style={{
                    background: color.bg || "#DBEAFE",
                    borderColor: color.border || "#3B82F6",
                    color: color.text || "#1E3A8A",
                    fontFamily: "Cairo",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  <div className="opacity-90 leading-tight">
                    {eventInfo.timeText}
                  </div>
                  <div className="leading-tight whitespace-normal break-words">
                    {eventInfo.event.title}
                  </div>
                </div>
              );
            }}
            allDaySlot={false}
            eventOverlap={view !== "timeGridWeek"}
            slotEventOverlap={view !== "timeGridWeek"}
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

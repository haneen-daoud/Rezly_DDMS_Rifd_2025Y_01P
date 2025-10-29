import React, { useState, useEffect } from "react";
import axios from "axios";

import TimeRangePicker from "../../components/common/TimeRangePicker";
import CoachSelector from "../../components/common/CoachSelector";
import LocationSelector from "../../components/common/LocationSelector";
import RepeatSelector from "../../components/common/RepeatSelector";
import ReminderSelector from "../../components/common/ReminderSelector";
import ColorSelector from "../../components/common/ColorSelector";
import ParticipantsSelector from "../../components/common/ParticipantsSelector";

import MembersIcon from "../../icons/members.svg?react";
import AddCircleIcon from "../../icons/addcircle.svg?react";
import SearchIcon from "../../icons/search.svg?react";
import MiniCalender from "../../components/MiniCalender/MiniCalender";
import DeleteIcon from "../../icons/Delete.svg?react";
import CloseIcon from "../../icons/close.svg";

import { toast } from "react-toastify";
import { updateBookingAPI } from "../../api/bookingsApi";
import { useBookings } from "../BookingsContext";

export default function EventModal({
  booking, // ✅ استقبل الحجز مباشرة
  setBooking, // لتحديث الحجز من هنا
  handleSaveBooking, // دالة الحفظ
  handleDeleteBooking, // دالة الحذف
  closeModal,
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [openMembers, setOpenMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [coaches, setCoaches] = useState([]);

  const { bookings, setBookings } = useBookings(); // من الكونتست

  const locations = ["قاعة 1", "قاعة 2", "قاعة 3", "قاعة 4"];
  const members = ["مشترك 1", "مشترك 2", "مشترك 3", "مشترك 4", "مشترك 5"];

  useEffect(() => {
    if (!booking) return;

    // لو ما في start/end نشتقهم من timeStart / timeEnd
    if (!booking.start && booking.timeStart) {
      const dateStr = new Date(booking.date).toISOString().split("T")[0];

      const convertTime = (timeStr) => {
        if (!timeStr) return "00:00";
        let [time, period] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (period === "م" && hours < 12) hours += 12;
        if (period === "ص" && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
      };

      const start = convertTime(booking.timeStart);
      const end = convertTime(booking.timeEnd);

      setBooking({
        ...booking,
        start: `${dateStr}T${start}`,
        end: `${dateStr}T${end}`,
        repeat: booking.recurrence ? "weekly" : "none",
        days: booking.recurrence || [],
      });
    }
  }, [booking]);

  console.log("Event is: ", booking);
  // جلب المدربين من الباك
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const token = import.meta.env.VITE_API_TOKEN;
        const res = await axios.get(
          "https://rezly-ddms-rifd-2025y-01p.onrender.com/auth/getAllEmployees",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const coachList = res.data.employees
          .filter((emp) => emp.role === "Coach")
          .map((emp) => ({
            id: emp._id,
            name: `${emp.firstName} ${emp.lastName}`,
          }));
        setCoaches(coachList);
      } catch (err) {
        console.error("خطأ في جلب المدربين:", err);
      }
    };
    fetchCoaches();
  }, []);

  // تحديث المدرب لو كان ID فقط
  useEffect(() => {
    if (!booking || coaches.length === 0) return;
    let updatedCoach = booking.coach;
    if (typeof booking.coach === "string") {
      const found = coaches.find((c) => c.id === booking.coach);
      if (found) updatedCoach = found;
    } else if (booking.coach?.id) {
      const found = coaches.find((c) => c.id === booking.coach.id);
      if (found) updatedCoach = found;
    }
    if (updatedCoach !== booking.coach)
      setBooking({ ...booking, coach: updatedCoach });
  }, [coaches]);

  // تغيير التاريخ
  const handleDateChange = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const startTime = booking.start?.split("T")[1] || "08:00";
    const endTime = booking.end?.split("T")[1] || "09:00";
    setBooking({
      ...booking,
      start: `${dateStr}T${startTime}`,
      end: `${dateStr}T${endTime}`,
    });
    setShowCalendar(false);
  };

  // الوقت
  const handleTimeChange = ({ start, end }) => {
    const date =
      booking.start?.split("T")[0] || new Date().toISOString().split("T")[0];
    setBooking({
      ...booking,
      start: `${date}T${start}`,
      end: `${date}T${end}`,
    });
  };

  // تعديل مشتركين
  const toggleMember = (member) => {
    const updated = booking.participants?.includes(member)
      ? booking.participants.filter((m) => m !== member)
      : [...(booking.participants || []), member];
    setBooking({ ...booking, participants: updated });
  };

  // فوق داخل المكون EventModal
  const formatTo12Hour = (time24) => {
    if (!time24) return "";
    let [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "م" : "ص";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h}:${m.toString().padStart(2, "0")} ${period}`;
  };

  console.log("🌀 Repeat props:", booking.repeat, booking.days);

  // 🟣 خريطة ترجمة الأيام
  const daysMap = {
    Sun: "أحد",
    Mon: "إثنين",
    Tue: "ثلاثاء",
    Wed: "أربعاء",
    Thu: "خميس",
    Fri: "جمعة",
    Sat: "سبت",
  };

  // 🔁 دالة لتحويل أيام الإنجليزي للعربي
  const convertDaysToArabic = (days = []) => {
    return days.map((d) => daysMap[d] || d);
  };

  // 🔁 تحويل الوقت من "1:30 م" إلى "13:30"
  const normalizeTime = (timeStr) => {
    if (!timeStr) return "08:00";
    let [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    period = period?.trim();

    if (period === "م" && hours < 12) hours += 12;
    if (period === "ص" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[4000] flex justify-center items-center">
      <div className="w-[361px] h-full bg-white rounded-[16px] flex flex-col overflow-hidden p-6 gap-2 shadow-lg text-right text-black font-bold font-cairo">
        {/* Header */}
        <div className="w-full h-8 flex items-center justify-between">
          <h3 className="text-[16px] font-bold">تفاصيل الموعد</h3>
          <div className="flex items-center gap-2">
            <DeleteIcon
              className="w-8 h-8 text-red-500"
              onClick={handleDeleteBooking}
            />
            <img
              src={CloseIcon}
              alt="close"
              className="w-8 h-8"
              onClick={closeModal}
            />
          </div>
        </div>

        {/* المحتوى */}
        <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
          {/* العنوان */}
          <div className="h-[66px] flex flex-col justify-between">
            <label className="block font-bold text-sm">العنوان</label>
            <input
              type="text"
              value={booking.service || ""}
              onChange={(e) =>
                setBooking({ ...booking, service: e.target.value })
              }
              placeholder="مثال: يوغا"
              className="h-10 w-full pr-2 pl-2 rounded-md border border-gray-400 focus:outline-none"
            />
          </div>

          {/* الوصف */}
          <div className="h-[66px] flex flex-col justify-between">
            <label className="block font-bold text-sm">الوصف (اختياري)</label>
            <textarea
              value={booking.description || ""}
              onChange={(e) =>
                setBooking({ ...booking, description: e.target.value })
              }
              placeholder="....."
              className="h-10 w-full pr-2 pl-2 rounded-md border border-gray-400 focus:outline-none"
            />
          </div>

          {/* التاريخ */}
          <div className="h-[66px] flex flex-col justify-between">
            <label className="block font-bold text-sm">التاريخ</label>
            <input
              type="text"
              value={booking.start?.split("T")[0] || ""}
              readOnly
              onClick={() => setShowCalendar(!showCalendar)}
              className="h-10 w-full pr-2 pl-2 rounded-md border border-gray-400 focus:outline-none"
            />
            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <MiniCalender
                  currentDate={
                    booking.start ? new Date(booking.start) : new Date()
                  }
                  handleDateChange={handleDateChange}
                />
              </div>
            )}
          </div>

          {/* الوقت */}
          <div className="h-[66px] flex flex-col justify-between">
            <label className="block font-bold text-sm">الوقت</label>
            <TimeRangePicker
              startTime={
                booking.start
                  ? booking.start.split("T")[1]?.slice(0, 5)
                  : normalizeTime(booking.timeStart)
              }
              endTime={
                booking.end
                  ? booking.end.split("T")[1]?.slice(0, 5)
                  : normalizeTime(booking.timeEnd)
              }
              onChange={handleTimeChange}
            />
          </div>

          <div className="h-[66px] flex flex-col justify-between">
            {/* المكان */}
            <LocationSelector
              selectedLocation={booking.location}
              setSelectedLocation={(room) =>
                setBooking({ ...booking, location: room })
              }
              locationsList={locations}
            />
          </div>

          <div className="h-[66px] flex flex-col justify-between">
            {/* المدرب */}
            <CoachSelector
            variant="event"
              selectedCoach={booking.coach}
              setSelectedCoach={(coach) =>
                setBooking({ ...booking, coach, coachId: coach.id })
              }
              coachesList={coaches}
            />
          </div>

          <div className="h-[66px] flex flex-col justify-between">
            {/* المشتركين */}
            <ParticipantsSelector booking={booking} setBooking={setBooking} />
          </div>

          <div className="h-[40px]">
            {/* اللون */}
            <ColorSelector
              selectedColor={{
                bg: booking.bg,
                border: booking.border,
                text: booking.text,
              }}
              setSelectedColor={(c) => setBooking({ ...booking, ...c })}
            />
          </div>

          <div className="h-[70px] flex flex-col justify-between">
            {/* التكرار */}
            <RepeatSelector
              selectedRepeat={booking.repeat || "none"}
              selectedDays={convertDaysToArabic(
                booking.days || booking.recurrence || []
              )}
              setRepeatAndDays={(repeat, daysArabic) => {
                // نحول الأيام من عربي لإنجليزي وقت الحفظ
                const reverseDaysMap = Object.fromEntries(
                  Object.entries(daysMap).map(([en, ar]) => [ar, en])
                );
                const daysEnglish = daysArabic.map(
                  (d) => reverseDaysMap[d] || d
                );

                setBooking({
                  ...booking,
                  repeat,
                  days: daysEnglish,
                  recurrence: daysEnglish,
                });
              }}
            />
          </div>

          <div className="h-[66px] flex flex-col justify-between">
            {/* التذكير */}
            <ReminderSelector
              selectedReminders={booking.reminders || []}
              setSelectedReminders={(rem) =>
                setBooking({ ...booking, reminders: rem })
              }
              showIconInInput
              borderStyle="#7E818C"
              placeholderColor="text-gray-400"
            />
          </div>
        </div>

        {/* حفظ */}
        <div className="pt-2">
          <button
            className="w-full h-10 bg-purple-600 text-white rounded-md hover:bg-purple-800 font-semibold"
            onClick={() => handleSaveBooking(booking)}
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}

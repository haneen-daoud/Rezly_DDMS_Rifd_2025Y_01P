import React, { useState, useEffect } from "react";
import axios from "axios";

import TimeRangePicker from "../../components/common/TimeRangePicker";
import CoachSelector from "../../components/common/CoachSelector";
import LocationSelector from "../../components/common/LocationSelector";
import ReminderSelector from "../../components/common/ReminderSelector";
import ColorSelector from "../../components/common/ColorSelector";
import MaxParticipantsSelector from "../../components/common/MaxParticipantsSelector";
import ParticipantsSelector from "../../components/common/ParticipantsSelector";
import { getAllCoachesAPI } from "../../api/coachesApi"; // تأكدي إنه مستورد فوق
import { updateSingleScheduleAPI } from "../../api/bookingsApi";

import MembersIcon from "../../icons/members.svg?react";
import AddCircleIcon from "../../icons/addcircle.svg?react";
import SearchIcon from "../../icons/search.svg?react";
import MiniCalender from "../../components/MiniCalender/MiniCalender";
import DeleteIcon from "../../icons/Delete.svg?react";
import CloseIcon from "../../icons/close.svg";
import AddressIcon from "../../icons/address.svg?react";
import DiscIcon from "../../icons/disc.svg?react";
import CalenderIcon from "../../icons/calender.svg?react";

import ConfirmDeleteModal from "./ConfirmDeleteModal";

import { toast } from "react-toastify";
import { useBookings } from "../BookingsContext";
import { getAllMembers } from "../../api";

export default function EventModal({
  booking,
  setBooking,
  handleSaveBooking,
  handleDeleteBooking,
  closeModal,
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [openMembers, setOpenMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [coaches, setCoaches] = useState([]);

  // من الكونتِكست: بنستفيد من isAdmin, isCoach الجاهزين
  const {
    bookings,
    setBookings,
    role,
    isAdmin,
    isCoach,
    isReceptionist,
    currentUser,
  } = useBookings();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);

  const locations = ["قاعة 1", "قاعة 2", "قاعة 3", "قاعة 4"];

  // تحت useState:
  const [members, setMembers] = useState([]);

  // داخل useEffect جديد:
  useEffect(() => {
    const fetchMembersSmart = async () => {
      try {
        // 🟣 التوكن من اللوكل ستورج
        const token =
          localStorage.getItem("authToken") ||
          localStorage.getItem("token") ||
          "";

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // 🟣 أول صفحة فورية
        const firstRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL2}/auth/getAllMembers?page=1`,
          { headers }
        );
        const firstList = firstRes.data?.members || firstRes.data?.data || [];

        const formattedFirst = firstList.map((m) => ({
          id: m._id,
          name:
            `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
            m.userName ||
            "مشترك بدون اسم",
        }));
        setMembers(formattedFirst);

        console.log("⚡ تم جلب الصفحة الأولى:", formattedFirst.length);

        // 🟣 نكمّل باقي الصفحات بالخلفية
        let page = 2;
        let all = [...firstList];
        let hasMore = true;

        while (hasMore) {
          const res = await axios.get(
            `${
              import.meta.env.VITE_API_BASE_URL2
            }/auth/getAllMembers?page=${page}`,
            { headers }
          );
          const list = res.data?.members || res.data?.data || [];
          if (Array.isArray(list) && list.length > 0) {
            all = [...all, ...list];
            page++;
          } else {
            hasMore = false;
          }
        }

        const formattedAll = all.map((m) => ({
          id: m._id,
          name:
            `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
            m.userName ||
            "مشترك بدون اسم",
        }));

        setMembers(formattedAll);
        console.log("✅ تم جلب جميع الصفحات:", formattedAll.length);
      } catch (err) {
        console.error("❌ فشل جلب المشتركين:", err.response?.data || err);
      }
    };

    fetchMembersSmart();
  }, []);

  // 🟣 إكمال أسماء المشتركين بعد جلبهم من الباك
  useEffect(() => {
    if (!Array.isArray(booking?.members) || booking.members.length === 0)
      return;
    if (!Array.isArray(members) || members.length === 0) return;

    const enriched = booking.members.map((m) => {
      const id = typeof m === "object" ? m.id || m._id : m;
      const full = members.find((mm) => mm.id === id || mm._id === id);

      // 🟣 نحاول أولاً من قاعدة members العامة
      if (full) {
        return {
          ...m,
          id,
          name:
            `${full.firstName || ""} ${full.lastName || ""}`.trim() ||
            full.userName ||
            full.name ||
            "مشترك بدون اسم",
        };
      }

      // 🟣 ولو مش موجود أصلاً في القائمة العامة — fallback من البيانات الأصلية نفسها
      const safeName =
        typeof m === "object"
          ? m.name ||
            `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
            m.userName ||
            "مشترك بدون اسم"
          : "مشترك بدون اسم";

      return typeof m === "object"
        ? { ...m, id, name: safeName }
        : { id, name: safeName };
    });

    setBooking((prev) => ({ ...prev, members: enriched }));
  }, [members, booking?.members?.length]);

  useEffect(() => {
    // 🟣 إذا المودال لسه ما فتح أو تم تهيئته مسبقاً، ما نعيد التحميل
    if (!booking || initialized) return;

    console.log("🟢 [EventModal] البيانات اللي وصلت للمودال:", booking);

    const s = booking.selectedSchedule || {};
    const dateOnly = s.date ? s.date.split("T")[0] : "";

    const parseTime = (t) => {
      if (!t) return "00:00";
      const trimmed = t.trim();
      let [time, period] = trimmed.split(" ");
      if (!period && /م/.test(trimmed)) period = "م";
      if (!period && /ص/.test(trimmed)) period = "ص";
      const [hStr, mStr] = time.split(":");
      let h = parseInt(hStr || "0", 10);
      const m = parseInt(mStr || "0", 10);
      if (period === "م" && h < 12) h += 12;
      if (period === "ص" && h === 12) h = 0;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const startTime = parseTime(s.timeStart);
    const endTime = parseTime(s.timeEnd);

    // 🔹 تحديد المدرب الصحيح
    // 🔹 استخرج كائن المدرب الصحيح
    let coachObj = null;

    // 🟣 أولاً: لو عندنا مدرب في الـ booking نفسه، استخدمه مباشرة لتفادي التأخير
    if (booking.coach && booking.coach.name) {
      coachObj = booking.coach;
    }
    // 🟣 أو لو عندنا كائن داخل schedule
    else if (typeof s.coach === "object" && s.coach !== null) {
      coachObj = {
        id: s.coach._id || s.coach.id,
        name:
          s.coach.name ||
          `${s.coach.firstName || ""} ${s.coach.lastName || ""}`.trim() ||
          "مدرب غير معروف",
      };
    }
    // 🟣 أو لو الـ coach جاي كـ ID
    else if (typeof s.coach === "string" && s.coach.trim() !== "") {
      // نحاول نلاقيه من القائمة الحالية لو جاهزة
      const foundCoach = coaches.find(
        (c) => String(c.id).trim() === String(s.coach).trim()
      );
      coachObj = foundCoach
        ? foundCoach
        : { id: s.coach, name: "مدرب غير معروف" };
    }
    // 🟣 وأخيرًا fallback
    else {
      coachObj = { id: "", name: "مدرب غير معروف" };
    }

    // 🎨 استرجاع اللون من الكاش
    let colorFromCache = {};
    try {
      const storedColors = JSON.parse(
        localStorage.getItem("bookingColors") || "{}"
      );
      const key = booking.selectedScheduleId || booking._id;
      const colorData = storedColors[key];
      if (colorData) {
        colorFromCache = {
          bg: colorData.bg,
          border: colorData.border,
          text: colorData.text,
        };
      }
    } catch (err) {
      console.warn("⚠️ فشل جلب اللون من الكاش:", err);
    }

    // ✅ تحديث booking مرة واحدة فقط
    setBooking((prev) => ({
      ...prev,
      coach: coachObj,
      coachId: coachObj.id,
      location: s.location || prev.location || "",
      room: s.location || prev.location || "",
      reminders: s.reminders || prev.reminders || [],
      maxMembers: s.maxMembers || prev.maxMembers || 0,
      members: s.members || prev.members || [],
      participants: s.members || prev.participants || [],
      date: dateOnly,
      timeStart: startTime,
      timeEnd: endTime,
      start: `${dateOnly}T${startTime}`,
      end: `${dateOnly}T${endTime}`,
      ...colorFromCache,
    }));

    // ✅ علّمي إنه تم تحميل المودال لمرة واحدة فقط
    setInitialized(true);
  }, [booking, coaches]);

  console.log("Event is: ", booking);

  // ✅ جلب قائمة المدربين (نفس منطق Step1Booking)
  useEffect(() => {
    // لو المستخدم الحالي مدرب، ما في داعي نجيب المدربين ولا نضرب صلاحيات الباك
    if (isCoach) {
      setCoaches([]);
      return;
    }

    const loadCoachesInstantly = async () => {
      try {
        // من localStorage
        const local = JSON.parse(localStorage.getItem("allEmployees") || "[]");
        if (Array.isArray(local) && local.length > 0) {
          const formattedLocal = local.map((c) => ({
            id: c._id || c.id,
            name:
              c.name ||
              `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
              "مدرب غير معروف",
          }));
          setCoaches(formattedLocal);
          console.log(
            "⚡ [EventModal] المدربين من localStorage:",
            formattedLocal
          );
        }

        // ✅ ثانياً: تحديث من السيرفر
        const remote = await getAllCoachesAPI();
        if (Array.isArray(remote) && remote.length > 0) {
          const formattedRemote = remote.map((c) => ({
            id: c._id || c.id,
            name:
              c.name ||
              `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
              "مدرب غير معروف",
          }));
          setCoaches(formattedRemote);
          console.log(
            "✅ [EventModal] المدربين بعد تحديث السيرفر:",
            formattedRemote
          );
          localStorage.setItem("allEmployees", JSON.stringify(remote));
        }
      } catch (err) {
        console.error("[EventModal] فشل جلب المدربين:", err);
      }
    };

    loadCoachesInstantly();
  }, [isCoach]);

  // تغيير التاريخ
  const handleDateChange = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const startTime = booking.start?.split("T")[1] || "08:00";
    const endTime = booking.end?.split("T")[1] || "09:00";

    setBooking({
      ...booking,
      date: dateStr, // ✅ نخزن التاريخ الجديد
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

  const [updatedMembers, setUpdatedMembers] = useState([]);

  // 🟣 تعديل الحجز الفردي (schedule)
  // 🟣 تعديل الحجز الفردي (schedule)
  const handleUpdateSingleSchedule = async () => {
    // لو الضغط مزدوج على الزر، ما نعيد الطلب
    if (saving) return;

    try {
      setSaving(true);

      const bookingId = booking._id;
      const scheduleId = booking.selectedScheduleId;

      if (!bookingId || !scheduleId) {
        toast.error("لم يتم تحديد الحجز أو اليوم بشكل صحيح ❌");
        return;
      }

      // 🔹 تحويل الوقت لصيغة الباك
      const toArabic12h = (time24) => {
        if (!time24) return "";
        let [h, m] = time24.split(":").map(Number);
        const isPM = h >= 12;
        if (h === 0) h = 12;
        else if (h > 12) h -= 12;
        const suffix = isPM ? "م" : "ص";
        return `${h}:${String(m).padStart(2, "0")} ${suffix}`;
      };

      // 🟣 قبل بناء الـ updateBody، نظّف المشتركين من اللي عليهم _tempRemoved
      if (Array.isArray(booking.members)) {
        booking.members = booking.members.filter((m) => {
          const memberObj =
            typeof m === "object"
              ? m
              : (booking.allMembers || []).find(
                  (mm) => mm._id === m || mm.id === m
                );
          return !memberObj?._tempRemoved;
        });
      }

      // 🟣 تنظيف المشتركين قبل الإرسال للبك
      let cleanedMembers = Array.isArray(booking.members)
        ? [...booking.members]
        : [];

      // 1️⃣ احذف أي عضو عليه _tempRemoved
      cleanedMembers = cleanedMembers.filter((m) => {
        const obj = typeof m === "object" ? m : null;
        return !obj?._tempRemoved;
      });

      // 2️⃣ خذ فقط الـ IDs (حتى لو العضو كائن)
      cleanedMembers = cleanedMembers
        .map((m) => (typeof m === "object" ? m._id || m.id : m))
        .filter(Boolean);

      // 3️⃣ لو في duplicates بسبب الإضافة المحلية، نشيلهم
      cleanedMembers = [...new Set(cleanedMembers)];

      // ✅ خزّنيهم بالـ booking نفسه قبل البناء
      booking.members = cleanedMembers;

      // 🟣 تحويل التذكيرات {hoursBefore} إلى {date,time} بناءً على وقت الحجز الحالي
      // 🟣 تحويل التذكيرات {hoursBefore} إلى {date,time} بناءً على وقت الحجز الحالي (محلي)
      let transformedReminders = [];
      if (Array.isArray(booking.reminders)) {
        transformedReminders = booking.reminders.map((r) => {
          if (typeof r === "object" && typeof r.hoursBefore === "number") {
            const bookingDate = new Date(booking.start);
            const reminderDate = new Date(
              bookingDate.getTime() - r.hoursBefore * 60 * 60 * 1000
            );

            // 🕒 استخدم التوقيت المحلي بدل UTC
            const year = reminderDate.getFullYear();
            const month = String(reminderDate.getMonth() + 1).padStart(2, "0");
            const day = String(reminderDate.getDate()).padStart(2, "0");
            const hours = String(reminderDate.getHours()).padStart(2, "0");
            const minutes = String(reminderDate.getMinutes()).padStart(2, "0");

            return {
              date: `${year}-${month}-${day}`,
              time: `${hours}:${minutes}`,
            };
          }
          return r;
        });
      }

      // 🔹 بناء جسم الطلب مثل ما بدو الباك
      const updateBody = {
        coach:
          typeof booking.coach === "object"
            ? booking.coach.id
            : booking.coachId || "",
        location: booking.location || "",
        maxMembers: Number(booking.maxMembers) || 0,
        reminders: transformedReminders,
        timeStart: toArabic12h(booking.start?.split("T")[1]?.slice(0, 5)),
        timeEnd: toArabic12h(booking.end?.split("T")[1]?.slice(0, 5)),
        date: booking.date || booking.start?.split("T")[0], // ✅ نرسل التاريخ الجديد
        dayOfWeek: new Date(booking.date || booking.start).getDay(), // ✅ رقم اليوم ليتحدث بالباك
        members: (updatedMembers.length
          ? updatedMembers
          : booking.members || []
        )
          .filter((m) => !m._tempRemoved)
          .map((m) => (typeof m === "object" ? m._id || m.id : m))
          .filter(Boolean),
      };

      console.log("🚀 إرسال تعديل فردي:", updateBody);

      await updateSingleScheduleAPI(bookingId, updateBody, scheduleId);

      toast.success("تم تعديل الحجز الفردي بنجاح ✅");

      // 🔄 تحديث الحالة محليًا
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? {
                ...b,
                schedules: b.schedules.map((s) =>
                  s._id === scheduleId
                    ? {
                        ...s,
                        ...updateBody,
                        coach: booking.coach, // ✅ نحدّث كائن المدرب الجديد كلياً
                      }
                    : s
                ),
                // ✅ ولو عندنا كائن coach عام للحجز نفسه نحدّثه أيضاً
                coach: booking.coach,
              }
            : b
        )
      );

      // 🎨 حفظ اللون بالكاش فقط عند الحفظ
      try {
        const storedColors = JSON.parse(
          localStorage.getItem("bookingColors") || "{}"
        );
        const key = booking.selectedScheduleId || booking._id;
        if (key && booking.bg) {
          storedColors[key] = {
            bg: booking.bg,
            border: booking.border,
            text: booking.text,
          };
          localStorage.setItem("bookingColors", JSON.stringify(storedColors));
        }
      } catch (err) {
        console.warn("⚠️ فشل حفظ اللون عند الحفظ:", err);
      }

      closeModal();
    } catch (err) {
      const msg = err.response?.data?.message || "حدث خطأ أثناء التعديل ❌";
      if (msg.includes("conflict") || msg.includes("محجوز")) {
        toast.error("⚠️ لا يمكن تغيير التاريخ، في تعارض بنفس الوقت!");
      } else {
        toast.error(msg);
      }
      console.error(
        "❌ فشل تعديل الحجز الفردي:",
        err.response?.data || err.message
      );
    } finally {
      setSaving(false);
    }
  };

  // ✅ تحديث اسم المدرب تلقائيًا بعد جلب قائمة المدربين
  useEffect(() => {
    if (!booking || !booking.coach || !booking.coach.id) return;

    // إذا الاسم الحالي "مدرب غير معروف" وكان عندنا قائمة مدربين
    if (booking.coach.name === "مدرب غير معروف" && coaches.length > 0) {
      const foundCoach = coaches.find(
        (c) => String(c.id).trim() === String(booking.coach.id).trim()
      );

      if (foundCoach) {
        console.log("🔁 تحديث اسم المدرب تلقائيًا:", foundCoach.name);
        setBooking((prev) => ({
          ...prev,
          coach: foundCoach,
          coachId: foundCoach.id,
        }));
      }
    }
  }, [coaches]);

  return (
    <div className="fixed inset-0 z-[4000] flex justify-center items-center">
  {/* الخلفية الغامقة */}
  <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[3990]"></div>
       <div className="relative z-[4001] w-[361px] h-full bg-white rounded-[16px] flex flex-col overflow-hidden shadow-lg text-right text-black font-cairo p-[24px]">
        {/* Header */}
        <div className="w-[313px] h-[40px] flex items-center justify-between mb-[8px]">
          <h3 className="text-[16px] font-bold">تفاصيل الحجز</h3>
          <div className="flex items-center gap-2">
            {/* زر الحذف متاح لكل الأدوار */}
            <DeleteIcon
              className="w-8 h-8 text-red-500 cursor-pointer rounded-[8px] bg-gray-100"
              onClick={() => setShowConfirm(true)}
            />

            <img
              src={CloseIcon}
              alt="close"
              className="w-8 h-8 rounded-[8px] bg-gray-100"
              onClick={closeModal}
            />
          </div>
        </div>

        {/* المحتوى */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center gap-[16px] scrollbar-hide">
          {/* العنوان */}
          <div className="h-[66px] w-[313px] flex flex-col justify-between gap-[8px]">
            <label className="text-[12px] font-bold leading-[18px]">
              اسم الحصة
            </label>
            <div className="relative">
              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                <AddressIcon className="w-5 h-5 text-[var(--color-purple)]" />
              </span>

              <input
                type="text"
                value={booking.service || ""}
                readOnly
                disabled
                className="h-10 w-[313px] rounded-[8px] border border-[#7E818C] pr-8 pl-2 text-[14px] font-bold text-[#000] bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* الوصف */}
          <div className="h-[66px] w-[313px] flex flex-col justify-between gap-[8px]">
            <label className="text-[12px] font-bold leading-[18px]">
              الوصف
            </label>
            <div className="relative">
              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                <DiscIcon className="w-5 h-5 text-[var(--color-purple)]" />
              </span>

              <input
                type="text"
                value={booking.description || ""}
                readOnly
                disabled
                className="h-10 w-[313px] rounded-[8px] border border-[#7E818C] pr-8 pl-2 text-[14px] font-bold text-[#000] bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* التاريخ */}
          <div className="h-[66px] w-[313px] flex flex-col justify-between gap-[8px]">
            <label className="text-[12px] font-bold leading-[18px]">
              التاريخ
            </label>
            <div className="relative">
              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                <CalenderIcon className="w-5 h-5 text-[var(--color-purple)]" />
              </span>

              <input
                type="text"
                value={booking.start?.split("T")[0] || ""}
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
                className="h-10 w-[313px] rounded-[8px] border border-[#7E818C] pr-8 pl-2 text-[14px] font-bold text-[#000] bg-white focus:outline-none cursor-pointer"
              />

              {showCalendar && (
                <div
                  className="absolute top-full left-0 z-50"
                  onClick={() => setShowCalendar(false)}
                >
                  <div
                    className="bg-white p-2 rounded-lg shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MiniCalender
                      variant="event"
                      hideTodayHighlight={false}
                      currentDate={
                        booking.start ? new Date(booking.start) : new Date()
                      }
                      handleDateChange={handleDateChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* الوقت */}
          <div className="h-[66px] w-[313px] flex flex-col justify-between gap-[8px]">
            <label className="text-[12px] font-bold leading-[18px]">
              الوقت
            </label>
            <div className="relative">
              {/* مساحة أيقونة يمين لو بدك تضيفي لاحقًا */}
              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              <div className="w-[313px]">
                <TimeRangePicker
                  key={`${booking.start}-${booking.end}`}
                  startTime={
                    booking.start
                      ? booking.start.split("T")[1]?.slice(0, 5)
                      : booking.timeStart
                  }
                  endTime={
                    booking.end
                      ? booking.end.split("T")[1]?.slice(0, 5)
                      : booking.timeEnd
                  }
                  onChange={handleTimeChange}
                  showIcons={true} // ✅ رح يفعّل الأيقونات داخل الحقول فقط في الإيفنت مودال
                />
              </div>
            </div>
          </div>

          {/* القاعة */}
          <div className="h-[66px] w-[313px] flex flex-col justify-between gap-[8px]">
            <label className="text-[12px] font-bold leading-[18px]">
              القاعة
            </label>
            <div className="relative">
              {/* مساحة الأيقونة يمين */}
              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4" />
              <LocationSelector
                variant="event"
                showLabel={false}
                selectedLocation={booking.location}
                setSelectedLocation={(room) =>
                  setBooking({ ...booking, location: room })
                }
                locationsList={locations}
              />
            </div>
          </div>

          {/* المدرب */}
          {!isCoach && (
            <div className="h-[66px] w-[313px] flex flex-col justify-between gap-[8px]">
              <label className="text-[12px] font-bold leading-[18px]">
                اسم المدرب
              </label>
              <div className="relative">
                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4" />
                <CoachSelector
                  showLabel={false}
                  variant="event"
                  selectedCoach={booking.coach}
                  setSelectedCoach={(coach) =>
                    setBooking({ ...booking, coach, coachId: coach.id })
                  }
                  coachesList={coaches}
                  
                />
              </div>
            </div>
          )}

          {/* الحد الأقصى للمشتركين */}
          <div className="h-[66px] w-[313px] flex flex-col justify-between gap-[8px]">
            <label className="text-[12px] font-bold leading-[18px]">
              الحد الأقصى للمشتركين
            </label>
            <div className="relative">
              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4" />
              <MaxParticipantsSelector
                variant="event"
                showLabel={false}
                showIcon={true} // ✅ الأيقونة رح تبين جوّا الحقل فقط هون
                selectedMax={booking.maxMembers || 0}
                setSelectedMax={(value) =>
                  setBooking({ ...booking, maxMembers: Number(value) })
                }
                options={[
                  { label: "1 مشترك", value: 1 },
                  { label: "5 مشتركين", value: 5 },
                  { label: "10 مشتركين", value: 10 },
                  { label: "20 مشتركاً", value: 20 },
                  { label: "غير محدود", value: Infinity },
                  { label: "إدخال مخصص", value: "custom" },
                ]}
              />
            </div>
          </div>

          {/* المشتركين */}
          <div className="h-[66px] w-[313px] flex flex-col justify-between gap-[8px]">
            <label className="text-[12px] font-bold leading-[18px]">
              المشتركين
            </label>
            <div className="relative">
              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4" />
              <ParticipantsSelector
                variant="event"
                showLabel={false}
                showIcon={true} // ✅ الأيقونة داخل الحقل
                booking={booking}
                setBooking={setBooking}
                membersList={members}
                onMembersChange={(newList) => setUpdatedMembers(newList)}
              />
            </div>
          </div>

          {/* اللون */}
          <div className="w-[313px] h-10 flex items-center">
            <ColorSelector
              selectedColor={{
                bg: booking.bg,
                border: booking.border,
                text: booking.text,
              }}
              setSelectedColor={(c) =>
                setBooking({ ...booking, ...c, __colorChanged: true })
              }
            />
          </div>

          {/* التذكير */}
          <div className="h-[66px] w-[313px] flex flex-col justify-between gap-[8px] mb-[8px]">
            <label className="text-[12px] font-bold leading-[18px]">
              التذكير
            </label>
            <div className="relative">
              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4" />
              <ReminderSelector
                variant="event"
                showLabel={false}
                selectedReminders={booking.reminders || []}
                setSelectedReminders={(rem) =>
                  setBooking({ ...booking, reminders: rem })
                }
                showIconInInput
                borderStyle="#7E818C"
                placeholderColor="text-gray-400"
                baseDateTime={booking.start} // 🟣 نمرّر وقت الحجز الحالي لحساب الفرق
              />
            </div>
          </div>
        </div>

        {/* حفظ */}
        <div className="pt-2">
          <button
  onClick={handleUpdateSingleSchedule}
  disabled={saving || deleting}
  className={`
    w-[313px] h-10 
    bg-[var(--color-purple)] text-white 
    rounded-[8px] font-bold text-[14px]
    hover:bg-[var(--color-purple)] transition
    flex items-center justify-center
    ${saving || deleting ? "opacity-70 cursor-not-allowed" : ""}
  `}
>
  {saving ? "جاري الحفظ..." : "حفظ"}
</button>

        </div>
      </div>

      {showConfirm && (
        <ConfirmDeleteModal
          event={booking.selectedSchedule || booking}
          isLoading={deleting}
          onCancel={() => setShowConfirm(false)}
          onConfirm={async () => {
            try {
              setDeleting(true);
              await handleDeleteBooking(); // نفس الدالة الحالية
              setShowConfirm(false);
            } finally {
              setDeleting(false);
            }
          }}
        />
      )}
    </div>
  );
}

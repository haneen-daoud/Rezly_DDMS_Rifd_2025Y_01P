import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import MiniCalender from "../../../components/MiniCalender/MiniCalender";
import { toast } from "react-toastify";
import Step1Booking from "./Step1Booking";
import Step2Booking from "./Step2Booking";
import CloseIcon from "../../../icons/close.svg";
import CalenderIcon from "../../../icons/calender.svg?react";
import { useBookings } from "../../BookingsContext.jsx";

import { formatBookingData } from "../helpers/formatBookingData";
import { step1Schema, step2Schema } from "../helpers/bookingValidation";
import {
  createBookingAPI,
  updateGeneralBookingAPI,
  updateSingleScheduleAPI,
  getUserFromToken,
} from "../../../api/bookingsApi";

function mapDurationToBackend(arabicText) {
  const map = {
    أسبوع: "1week",
    أسبوعين: "2weeks",
    "3 أسابيع": "3weeks",
    شهر: "1month",
    "3 أشهر": "3months",
    "6 أشهر": "6months",
    سنة: "1year",
  };
  return map[arabicText] || arabicText || "";
}

function convertToBackendTimeFormat(hhmm, fullDateTime) {
  if (!hhmm) return "";
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  let suffix = "ص";

  if (h === 0) {
    h = 12;
    suffix = "ص";
  } else if (h === 12) {
    suffix = "م";
  } else if (h > 12) {
    h = h - 12;
    suffix = "م";
  } else {
    suffix = h < 12 ? "ص" : "م";
  }

  return `${h}:${mStr} ${suffix}`;
}

export default function AddBookingModal({ onChange }) {
  const { setBookings } = useBookings();

  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isGroupEdit, setIsGroupEdit] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedDateLabel, setSelectedDateLabel] = useState("");

  const [step1Errors, setStep1Errors] = useState({});
  const [step2Errors, setStep2Errors] = useState({});
  const [groupBookings, setGroupBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedOption, setSelectedOption] = useState("all");
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const steps = ["معلومات الحجز", "موعد الحجز"];

  const [fullBookingData, setFullBookingData] = useState(null);

  const [isCoach, setIsCoach] = useState(false);
  const [coachId, setCoachId] = useState(null);

  const [allMembers, setAllMembers] = useState([]);

  const calendarRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickAnywhere = (e) => {
      // لو الدروب داون أو الكاليندر مفتوحين
      if (dropdownOpen || showCalendar) {
        const dropdownEl = dropdownRef.current;

        // نتحقق: إذا العنصر اللي انضغط عليه مش جوّا الدروب داون نفسه
        if (dropdownEl && !dropdownEl.contains(e.target)) {
          setDropdownOpen(false);
          setShowCalendar(false);
        }
      }
    };

    // نستخدم capture mode true حتى نلتقط الكليك قبل React events داخل المودال
    document.addEventListener("mousedown", handleClickAnywhere, true);

    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere, true);
    };
  }, [dropdownOpen, showCalendar]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // لو الكاليندر مفتوح والمكان اللي انضغط مش داخل الكاليندر
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  // أول ما نفتـح المودال للتعديل
  useEffect(() => {
    if (isEditing && formData?.schedules?.length) {
      setScheduleOptions(formData.schedules);
    }
  }, [isEditing, formData.schedules]);

  // 🟣 جلب جميع المشتركين من السيرفر (كل الصفحات)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          localStorage.getItem("token") ||
          "";
        const headers = { Authorization: `Bearer ${token}` };

        // 🕐 أول صفحة
        const first = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL2}/auth/getAllMembers?page=1`,
          { headers }
        );

        const firstList = first.data?.members || first.data?.data || [];
        let all = [...firstList];
        let page = 2;

        // 🌀 باقي الصفحات
        while (true) {
          const res = await axios.get(
            `${
              import.meta.env.VITE_API_BASE_URL2
            }/auth/getAllMembers?page=${page}`,
            { headers }
          );
          const list = res.data?.members || res.data?.data || [];
          if (!list.length) break;
          all = [...all, ...list];
          page++;
        }

        // 🧩 تنسيق قائمة المشتركين للـ dropdown
        const formatted = all.map((m) => ({
          id: m._id,
          name:
            `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
            m.userName ||
            "مشترك بدون اسم",
        }));

        setAllMembers(formatted);

        // 🟣 في وضع التعديل (تعديل الكل)
        if (isEditing && fullBookingData?.members?.length) {
          const enrichedMembers = fullBookingData.members.map((m) => {
            const id = typeof m === "object" ? m.id || m._id : m;
            const full = formatted.find((mm) => mm.id === id || mm._id === id);
            return {
              id,
              name:
                full?.name ||
                `${full?.firstName || ""} ${full?.lastName || ""}`.trim() ||
                full?.userName ||
                "مشترك بدون اسم",
            };
          });

          // ✅ تنظيف التكرارات (لو الباك رجع العضو مكرر من كل جدول)
          const uniqueMap = new Map();
          enrichedMembers.forEach((m) => {
            if (!uniqueMap.has(m.id)) {
              uniqueMap.set(m.id, m);
            }
          });

          // ✅ تحديث الـ formData بأعضاء فريدين فقط وبأسمائهم
          setFormData((prev) => ({
            ...prev,
            members: Array.from(uniqueMap.values()),
          }));
        }
      } catch (err) {
        console.error("[AddBookingModal] فشل جلب المشتركين:", err);
      }
    };

    fetchMembers();
  }, []);

  // جلب بيانات المستخدم الفعلية
  useEffect(() => {
    async function fetchUser() {
      const user = await getUserFromToken();
      const role = user?.role?.toLowerCase() || "unknown";
      setIsCoach(role === "coach");
      setCoachId(user?.id || null);
      console.log("المستخدم الحالي:", user);
    }
    fetchUser();
  }, []);

  // تحديث الدور لو تغيّر التوكن
  useEffect(() => {
    const handleStorageChange = async () => {
      const updatedUser = await getUserFromToken();
      const role = updatedUser?.role?.toLowerCase() || "unknown";
      setIsCoach(role === "coach");
      setCoachId(updatedUser?.id || null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // فتح المودال للإضافة
  const handleOpen = async () => {
    // صَفّي كل شيء أول إشي
    setStep1Errors({});
    setStep2Errors({});
    setActiveStep(0);

    const currentUser =
      JSON.parse(localStorage.getItem("currentUser") || "null") ||
      (await getUserFromToken());

    const role = currentUser?.role?.toLowerCase() || "unknown";
    setIsCoach(role === "coach");
    setCoachId(currentUser?.id || null);

    // بعدين نظّف الداتا الجاهزة للحجز الجديد
    setIsEditing(false);
    setFormData({});
    setIsGroupEdit(false);
    setSelectedBooking(null);
    setGroupBookings([]);
    setSelectedOption("all");
    setScheduleOptions([]);
    setOpen(true);

    console.log("🟣 فتح المودال — المستخدم الحالي:", currentUser);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setFormData({});
    setIsEditing(false);
    setIsGroupEdit(false);
    setEditingBookingId(null);
    setSelectedBooking(null);
    setGroupBookings([]);

    // تصفير الأخطاء عند الإغلاق
    setStep1Errors({});
    setStep2Errors({});
    setSelectedOption("all");
    setScheduleOptions([]);
  };

  // تحديث البيانات عند اختيار حجز فردي من القائمة
  const handleSelectBooking = (selectedSchedule) => {
    console.log("🟣 handleSelectBooking استُدعيت مع:", selectedSchedule);

    // لو ما في حجز (اختار تعديل الكل)
    if (!selectedSchedule) {
      setSelectedBooking(null);
      setIsGroupEdit(true);
      setSelectedOption(null); // 🟣 تصفير آخر يوم مختار من المربع

      setFormData((prev) => ({
        ...prev,
        subscriptionDuration: prev.subscriptionDuration || "",
        repeatDays: prev.repeatDays || [],
        recurrence: prev.recurrence || [],
      }));
      return;
    }

    // 🔹 الحجز الكامل (من state أو من النسخة الأصلية)
    const fullBooking = fullBookingData || formData;

    // 🔸 تنسيق الوقت العربي → 24 ساعة
    const normalizeArabicTime = (timeStr) => {
      if (!timeStr) return "";
      let clean = String(timeStr).trim();
      const isPM = /م/.test(clean);
      const isAM = /ص/.test(clean);
      clean = clean.replace(/[^\d:]/g, "");
      let [hour, minute] = clean.split(":").map(Number);
      if (isNaN(hour)) return "";
      if (isPM && hour < 12) hour += 12;
      if (isAM && hour === 12) hour = 0;
      return `${hour.toString().padStart(2, "0")}:${(minute || 0)
        .toString()
        .padStart(2, "0")}`;
    };

    // 🔹 نستخدم بيانات الـ schedule للفردي مع العامة
    const dateStr = selectedSchedule.date
      ? selectedSchedule.date.split("T")[0]
      : fullBooking.startDate?.split("T")[0] || "";

    const startTime =
      normalizeArabicTime(selectedSchedule.timeStart) || "09:00";
    const endTime = normalizeArabicTime(selectedSchedule.timeEnd) || "10:00";

    // 🔹 نجيب بيانات المدرب الصحيحة
    // 🔹 تحديد الكوتش الصحيح من قائمة الموظفين
    const allEmployees = JSON.parse(
      localStorage.getItem("allEmployees") || "[]"
    );

    // 🟣 تجهيز بيانات المدرب للفردي بشكل مضمون
    let coachObj = {};
    let coachIdFinal = "";

    // لو الـ schedule نفسه فيه كوتش (id أو object)
    if (selectedSchedule?.coach) {
      coachIdFinal =
        typeof selectedSchedule.coach === "object"
          ? selectedSchedule.coach._id
          : selectedSchedule.coach;

      console.log("🟣 [DEBUG] allEmployees:", allEmployees);
      console.log("🟣 [DEBUG] coachIdFinal we're searching for:", coachIdFinal);
      console.log(
        "🟣 [DEBUG] matches found:",
        allEmployees.filter(
          (c) => String(c._id || c.id).trim() === String(coachIdFinal).trim()
        )
      );

      const foundCoach = allEmployees.find(
        (c) => String(c._id || c.id).trim() === String(coachIdFinal).trim()
      );

      if (foundCoach) {
        coachObj = {
          id: foundCoach._id || foundCoach.id,
          name:
            foundCoach.name ||
            `${foundCoach.firstName || ""} ${foundCoach.lastName || ""}`.trim(),
        };
      } else {
        coachObj = { id: coachIdFinal, name: "مدرب غير معروف" };
      }
    } else {
      // fallback من الحجز العام
      coachIdFinal =
        typeof fullBooking.coach === "object"
          ? fullBooking.coach._id
          : fullBooking.coach || fullBooking.coachId || "";

      const foundCoach = allEmployees.find(
        (c) => String(c._id || c.id).trim() === String(coachIdFinal).trim()
      );

      coachObj = foundCoach
        ? {
            id: foundCoach._id,
            name: `${foundCoach.firstName || ""} ${
              foundCoach.lastName || ""
            }`.trim(),
          }
        : { id: coachIdFinal, name: "مدرب غير معروف" };
    }

    console.log("🟣 [LOG] selectedSchedule:", selectedSchedule);
    console.log("🟣 [LOG] selectedSchedule.coach:", selectedSchedule?.coach);

    // الآن نخزّن الشكل الموحد بالـ formData
    const updatedForm = {
      ...formData,
      title: fullBooking.service || formData.title || "",
      description: fullBooking.description || formData.description || "",
      coachId: coachObj.id || "",
      coach: coachObj,
      location: selectedSchedule.location || fullBooking.location || "",
      room: selectedSchedule.location || fullBooking.room || "",
      maxMembers: selectedSchedule.maxMembers || fullBooking.maxMembers || 0,
      reminders:
        selectedSchedule.reminders?.length > 0
          ? selectedSchedule.reminders
          : fullBooking.reminders || [],
      dateOnly: dateStr,
      start: `${dateStr}T${startTime}`,
      end: `${dateStr}T${endTime}`,
    };

    // ✅ تعبئة المشتركين من الـ schedule المحدد
    if (Array.isArray(selectedSchedule.members)) {
      updatedForm.members = selectedSchedule.members.map((m) => {
        const id = typeof m === "object" ? m._id || m.id : m;
        const full = allMembers.find((mem) => mem.id === id || mem._id === id);
        return {
          id,
          name:
            full?.name ||
            `${full?.firstName || ""} ${full?.lastName || ""}`.trim() ||
            full?.userName ||
            "مشترك بدون اسم",
        };
      });

      console.log(
        "👥 تم تعبئة المشتركين من الـ schedule:",
        updatedForm.members
      );
    }

    // 🔸 تحديث الحالة
    setSelectedBooking(selectedSchedule);
    setIsGroupEdit(false);
    setFormData(updatedForm);

    console.log("🟣 [LOG] updatedForm.coach:", updatedForm.coach);

    // 🔁 إعادة رسم فورية بعد تحديث بيانات الكوتش
    setTimeout(() => {
      setFormData((prev) => ({ ...prev }));
    }, 0);

    setStep1Errors({});
    setStep2Errors({});

    // 🟣 ما نغيّر الخطوة الحالية، نخلي المستخدم بمكانه فقط
    setActiveStep((prev) => prev);

    console.log("✅ تم تحديث formData للفردي:", updatedForm);
  };

    // ✅ دوال مساعدة للتنسيق المحلي للتاريخ والوقت
  const pad2 = (n) => String(n).padStart(2, "0");
  const formatLocalDate = (d) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const formatLocalTime = (d) =>
    `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

  // ✅ Helper: يبني Date من "YYYY-MM-DD" + "HH:mm" (محلي، مش UTC)
  const buildBaseDateTime = (baseDateStr, hhmm) => {
    if (!baseDateStr) return new Date();
    const [y, mo, d] = baseDateStr.split("-").map(Number); // YYYY-MM-DD
    const [h, m] = (hhmm || "09:00").split(":").map(Number); // HH:mm
    return new Date(
      y || 1970,
      (mo || 1) - 1,
      d || 1,
      h || 0,
      m || 0,
      0,
      0
    );
  };

  // ✅ تحويل reminders لصيغة الباك إند:
  //  - السترنغز: "30min" / "1hour" / "1day" / "none" تضل زي ما هي
  //  - الكستمايز: { hoursBefore: 5 } → { date: "...", time: "..." } حسب أول موعد
  //  - لو أصلاً جاي {date,time} من الباك إند (تعديل) منرجّعه زي ما هو
  function transformRemindersForCreateOrGroup(formData) {
    if (!Array.isArray(formData.reminders)) return [];

    // 👈 نحدد "وقت الأساس" للحجز
    let base;
    if (formData.start) {
      // حالة الفردي: عندنا start جاهز
      base = new Date(formData.start);
    } else if (
      formData.dateOnly &&
      Array.isArray(formData.daysSchedule) &&
      formData.daysSchedule.length > 0
    ) {
      // حالة الحجز الجماعي: نستخدم أول يوم في الجدول
      const first = formData.daysSchedule[0];
      base = buildBaseDateTime(formData.dateOnly, first.start);
    } else {
      // fallback
      base = new Date();
    }

    return formData.reminders.map((r) => {
      // الأنواع الجاهزة (30 دقيقة، ساعة، يوم...)
      if (typeof r === "string") return r;

      // تذكير مخصّص قبل X ساعات → نحوله لـ {date,time}
      if (r && typeof r.hoursBefore === "number") {
        const reminderDate = new Date(
          base.getTime() - r.hoursBefore * 60 * 60 * 1000
        );

        const y = reminderDate.getFullYear();
        const mo = String(reminderDate.getMonth() + 1).padStart(2, "0");
        const d = String(reminderDate.getDate()).padStart(2, "0");
        const hh = String(reminderDate.getHours()).padStart(2, "0");
        const mm = String(reminderDate.getMinutes()).padStart(2, "0");

        return {
          date: `${y}-${mo}-${d}`,
          time: `${hh}:${mm}`,
        };
      }

      // لو جاي أصلًا من الباك إند كـ {date,time}
      if (typeof r === "object" && r.date && r.time) return r;

      // أي شكل غريب يرجع زي ما هو (عشان ما نكسر الداتا)
      return r;
    });
  }



    const buildRequestBodyForBackend = () => {
    // خريطة اليوم عربي → رقم يوم الأسبوع (حسب JS)
    const dayToIndex = {
      أحد: 0,
      إثنين: 1,
      ثلاثاء: 2,
      أربعاء: 3,
      خميس: 4,
      جمعة: 5,
      سبت: 6,
    };

    // خريطة مدة الاشتراك عربي → كود الباك (مبدئي)
    const durationMap = {
      أسبوع: "1week",
      أسبوعين: "2weeks",
      "3 أسابيع": "3weeks",
      شهر: "1month",
      "3 أشهر": "3months",
      "6 أشهر": "6months",
      سنة: "1year",
    };

    // helper لتحويل "08:00" → "8:00 ص" / "09:30" → "9:30 م"
    const toArabic12h = (time24) => {
      if (!time24) return "";
      let [h, m] = time24.split(":").map(Number);
      const isPM = h >= 12;
      let displayH = h;
      if (displayH === 0) displayH = 12; // 00 -> 12 ص
      else if (displayH > 12) displayH = displayH - 12;
      const hh = String(displayH).padStart(1, ""); // بدون صفر على اليسار
      const mm = String(m).padStart(2, "0");
      return `${hh}:${mm} ${isPM ? "م" : "ص"}`;
    };

    // schedules
    const schedules = Array.isArray(formData.daysSchedule)
      ? formData.daysSchedule
          .filter((row) => row.day && row.start && row.end)
          .map((row) => ({
            dayOfWeek: dayToIndex[row.day] ?? null,
            timeStart: toArabic12h(row.start),
            timeEnd: toArabic12h(row.end),
          }))
      : [];

    // 🔔 reminders: نستخدم الفنكشن اللي فوق
    const reminders = transformRemindersForCreateOrGroup(formData);

    // coachId:
    // - لو المستخدم كوتش: من التوكن
    // - لو أدمن: من الفورم (المدرب اللي اختاره)
    const finalCoachId =
      (typeof formData.coach === "object" && formData.coach?.id) ||
      formData.coachId ||
      coachId ||
      "";

    const requestBody = {
      service: formData.title || formData.service || "", // اسم الحصة
      description: formData.description || "",
      coachId: finalCoachId,
      location: formData.room || formData.location || "",
      maxMembers: formData.maxMembers || 0,

      startDate:
        formData.dateOnly ||
        (formData.start ? formData.start.split("T")[0] : "") ||
        "",

      subscriptionDuration:
        durationMap[formData.subscriptionDuration] ||
        formData.subscriptionDuration ||
        "",

      schedules,
      reminders,
    };

    console.log("📤 requestBody to backend:", requestBody);
    return requestBody;
  };


  // الحفظ
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault(); // ✅ يمنع الخطأ لو ما في event
    setLoading(true);

    try {
      // 🟣 إنشاء حجز جديد
      if (!isEditing) {
        const bodyForCreate = buildRequestBodyForBackend();
        bodyForCreate.members = Array.isArray(formData.members)
          ? [
              ...new Set(
                formData.members
                  .filter((m) => !m._tempRemoved)
                  .map((m) => (typeof m === "object" ? m.id || m._id : m))
                  .filter(Boolean)
              ),
            ]
          : [];

        console.log("🚀 إرسال بيانات الإضافة:", bodyForCreate);

        // 🟣 نرسل الطلب ونستقبل الرد الحقيقي من السيرفر
        const response = await createBookingAPI(bodyForCreate);

        // ✅ السيرفر عادة يرجّع الحجز الجديد داخل data.data أو data مباشرة
        const newBooking = response?.data?.data || response?.data || response;

        // ✅ نغني البيانات المحلية لتنعرض فوريًا بالكروت
        const enrichedBooking = {
          ...newBooking,
          coach: {
            _id: formData.coach?.id || formData.coachId || "",
            name:
              formData.coach?.name || formData.coachName || "مدرب غير معروف",
          },
          members: Array.isArray(formData.members)
            ? formData.members.map((m) =>
                typeof m === "object"
                  ? { _id: m._id || m.id, name: m.name || "مشترك غير معروف" }
                  : { _id: m, name: "مشترك غير معروف" }
              )
            : [],
        };

        setBookings((prev) => [...prev, enrichedBooking]);

        toast.success("تم إنشاء الحجز بنجاح ✅");
        handleClose();
        onChange(); // لإعادة تحميل القائمة (لو لازمة لعرض التفاصيل الجديدة)
        setLoading(false);
        return;
      }

      // 🟣 تعديل حجز موجود
      // تعديل الكل
      // ---------------------------------
      // حالة تعديل الكل
      // ---------------------------------
      // ---------------------------------
      // حالة تعديل الكل (updateAllSameGroup)
      // ---------------------------------
      if (isGroupEdit) {
        let coachIdFinal = "";

        if (typeof formData.coachId === "string") {
          coachIdFinal = formData.coachId;
        } else if (
          typeof formData.coachId === "object" &&
          formData.coachId?.id
        ) {
          coachIdFinal = formData.coachId.id;
        } else if (typeof formData.coach === "object" && formData.coach?.id) {
          coachIdFinal = formData.coach.id;
        }

        // 🟣 خريطة اليوم العربي → رقم
        const dayToIndex = {
          أحد: 0,
          إثنين: 1,
          ثلاثاء: 2,
          أربعاء: 3,
          خميس: 4,
          جمعة: 5,
          سبت: 6,
        };

        // 🕐 تحويل الوقت إلى صيغة الباك
        const toArabic12h = (time24) => {
          if (!time24) return "";
          let [h, m] = time24.split(":").map(Number);
          const isPM = h >= 12;
          let displayH = h;
          if (displayH === 0) displayH = 12;
          else if (displayH > 12) displayH -= 12;
          const suffix = isPM ? "م" : "ص";
          return `${displayH}:${String(m).padStart(2, "0")} ${suffix}`;
        };

        // 🗓️ تحويل الأيام لحسب الباك
        const schedules = (formData.daysSchedule || []).map((d, i) => ({
          _id: `${Date.now()}_${i}`, // 👈 ID مؤقت عشوائي لتجاوز Joi
          dayOfWeek: dayToIndex[d.day] ?? 0,
          timeStart: toArabic12h(d.start),
          timeEnd: toArabic12h(d.end),
        }));

        const body = {
          service: formData.service || formData.title || "",
          description: formData.description || "",
          coachId: coachIdFinal || "",
          location: formData.location || formData.room || "",
          maxMembers: Number(formData.maxMembers) || 0,
          reminders: transformRemindersForCreateOrGroup(formData),


          members: Array.isArray(formData.members)
            ? [
                ...new Set(
                  formData.members
                    .filter((m) => !m._tempRemoved)
                    .map((m) => (typeof m === "object" ? m.id || m._id : m))
                    .filter(Boolean)
                ),
              ]
            : [],

          subscriptionDuration: mapDurationToBackend(
            formData.subscriptionDuration
          ),
          startDate:
            formData.dateOnly ||
            (formData.start ? formData.start.split("T")[0] : ""),
          schedules,
        };

        console.log("🚀 جسم الإرسال النهائي (تعديل الكل):", body);

        const updatedResponse = await updateGeneralBookingAPI(
          fullBookingData?.groupId || formData.groupId,
          body
        );

        // ✅ السيرفر بيرجع النسخة المعدّلة، ناخدها ونحدث الـ context
        const updatedBooking =
          updatedResponse?.data?.data ||
          updatedResponse?.data ||
          updatedResponse;

        setBookings((prev) =>
          prev.map((b) => {
            if (b._id === (updatedBooking._id || formData._id)) {
              return {
                ...b,
                ...updatedBooking,

                // ✅ تحديث بيانات المدرب محلياً
                coach: {
                  _id:
                    formData.coach?.id ||
                    formData.coachId ||
                    updatedBooking.coachId ||
                    b.coach?._id ||
                    "",
                  name:
                    formData.coach?.name ||
                    formData.coachName ||
                    b.coach?.name ||
                    "مدرب غير معروف",
                },

                // ✅ تحديث بيانات المشتركين محلياً بالأسماء الصحيحة
                members: Array.isArray(formData.members)
                  ? formData.members.map((m) =>
                      typeof m === "object"
                        ? {
                            _id: m._id || m.id,
                            name: m.name || "مشترك غير معروف",
                          }
                        : { _id: m, name: "مشترك غير معروف" }
                    )
                  : [],
              };
            }
            return b;
          })
        );

        toast.success("تم تعديل الحجز بالكامل ✅");
        handleClose();
        setLoading(false);
        return;
      }

      // ---------------------------------
      // حالة تعديل يوم واحد فقط (scheduleId)
      // ---------------------------------
      if (!isGroupEdit && selectedBooking && selectedBooking._id) {
        const selectedSchedule = scheduleOptions.find(
          (s) => s._id === selectedOption || s.date === selectedOption
        );

        if (!selectedSchedule) {
          toast.error("لم يتم العثور على الجدول المحدد");
          setLoading(false);
          return;
        }

        const toArabic12h = (time24) => {
          if (!time24) return "";
          let [h, m] = time24.split(":").map(Number);
          const isPM = h >= 12;
          let displayH = h;
          if (displayH === 0) displayH = 12;
          else if (displayH > 12) displayH -= 12;
          const suffix = isPM ? "م" : "ص";
          return `${displayH}:${String(m).padStart(2, "0")} ${suffix}`;
        };

        // ✅ تحويل أي hoursBefore → {date,time} بناءً على وقت هذا اليوم (formData.start)
const remindersSingle = Array.isArray(formData.reminders)
  ? formData.reminders.map((r) => {
      if (typeof r === "string") return r;
      if (typeof r === "object" && typeof r.hoursBefore === "number") {
  const base = new Date(formData.start); // "YYYY-MM-DDTHH:mm" تُفهم محليًا
  const reminderDate = new Date(base.getTime() - r.hoursBefore * 60 * 60 * 1000);
  const y = reminderDate.getFullYear();
const mo = String(reminderDate.getMonth() + 1).padStart(2, "0");
const d = String(reminderDate.getDate()).padStart(2, "0");
const hh = String(reminderDate.getHours()).padStart(2, "0");
const mm = String(reminderDate.getMinutes()).padStart(2, "0");

return { date: `${y}-${mo}-${d}`, time: `${hh}:${mm}` };

}

      if (typeof r === "object" && r.date && r.time) return r;
      return r;
    })
  : [];

        // ⚡ نرسلها داخل مصفوفة schedules
        const updateBody = {
          _id: selectedSchedule._id,
          coach:
            typeof formData.coach === "object"
              ? formData.coach.id
              : formData.coachId || "",
          location: formData.location || formData.room || "",
          maxMembers: Number(formData.maxMembers) || 0,
          reminders: remindersSingle,


          timeStart: toArabic12h(formData.start?.split("T")[1]?.slice(0, 5)),
          timeEnd: toArabic12h(formData.end?.split("T")[1]?.slice(0, 5)),

          // 🟣 نرسل التاريخ الجديد كمان
          date: formData.dateOnly || formData.start?.split("T")[0],
          dayOfWeek: new Date(formData.dateOnly || formData.start).getDay(),
          members: Array.isArray(formData.members)
            ? formData.members
                .filter((m) => !m._tempRemoved)
                .map((m) => (typeof m === "object" ? m.id || m._id : m))
                .filter(Boolean)
            : [],
        };

        console.log("🚀 جسم الإرسال (تعديل فردي):", updateBody);

        const updatedResponse = await updateSingleScheduleAPI(
          fullBookingData?._id || selectedBooking?._id,
          updateBody,
          selectedSchedule._id
        );

        const updatedBooking =
          updatedResponse?.data?.data ||
          updatedResponse?.data ||
          updatedResponse;

        // ✅ تحديث الحجز داخل الـ context بدون refresh
        setBookings((prev) =>
          prev.map((b) =>
            b._id === (updatedBooking._id || selectedBooking._id)
              ? { ...b, ...updatedBooking }
              : b
          )
        );

        toast.success("تم تعديل اليوم بنجاح ✅");
        handleClose();
        setLoading(false);
        return;
      }

      // fallback
      setLoading(false);
    } catch (err) {
      console.error("❌ فشل الحفظ:", err.response?.data || err.message);

      // 🟣 قراءة رسالة الباك الأساسية
      let backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.details?.[0]?.message ||
        "حدث خطأ غير متوقع أثناء حفظ الحجز";

      // 🟣 لو فيه أيام متعارضة، نكوّن رسالة تفصيلية
      const conflicted = err?.response?.data?.conflictedDays;
      if (Array.isArray(conflicted) && conflicted.length > 0) {
        const details = conflicted
          .map((d) => {
            const dateStr = new Date(d["التاريخ"]).toLocaleDateString("ar-EG", {
              weekday: "long",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
            let reason = d["السبب"];
            if (reason === "Coach busy") reason = "المدرب مشغول";
            if (reason === "Room busy") reason = "القاعة محجوزة";
            return `• ${dateStr} — ${reason}`;
          })
          .join("\n");
        backendMsg += "\n" + details;
      }

      // 🧾 عرض التوست للمستخدم
      toast.error(backendMsg, {
        position: "top-left",
        autoClose: 5000,
        className: "custom-toast-error", // لو عندك كلاس خاص بالألوان القديمة
        style: { whiteSpace: "pre-line" },
      });

      setLoading(false);
    }
  };

  // فتح المودال من الخارج (زر إضافة)
  useEffect(() => {
    const handleOpenAdd = () => handleOpen();
    window.addEventListener("openAddBooking", handleOpenAdd);
    return () => window.removeEventListener("openAddBooking", handleOpenAdd);
  }, []);

  // فتح للتعديل (من 3 نقاط على الكارت)
  useEffect(() => {
    const handleOpenEdit = (event) => {
      const booking = event.detail;
      if (!booking) return;
      const formatted = formatBookingData(booking);
      setFullBookingData(booking); // 🟣 نخزّن نسخة كاملة من الحجز الأصلي
      setFormData(formatted);

      // ✳️ إغناء المشتركين بالأسماء الكاملة عند تعديل الحجز
      if (booking?.members?.length && allMembers.length > 0) {
        const enrichedMembers = booking.members.map((m) => {
          const id = typeof m === "object" ? m.id || m._id : m;
          const full = allMembers.find((mm) => mm.id === id || mm._id === id);

          return {
            id,
            name:
              full?.name ||
              `${full?.firstName || ""} ${full?.lastName || ""}`.trim() ||
              full?.userName ||
              "مشترك بدون اسم",
          };
        });

        setFormData((prev) => ({
          ...prev,
          members: enrichedMembers,
        }));

        console.log(
          "✅ [AddBookingModal] تم إغناء المشتركين بالأسماء:",
          enrichedMembers
        );
      }

      // 🟣 بعد setFormData(formatted)
      const allEmployees = JSON.parse(
        localStorage.getItem("allEmployees") || "[]"
      );
      const foundCoach = allEmployees.find(
        (c) =>
          c._id === (booking.coach?._id || booking.coach || booking.coachId)
      );
      if (foundCoach) {
        const coachObj = {
          id: foundCoach._id,
          name: `${foundCoach.firstName || ""} ${
            foundCoach.lastName || ""
          }`.trim(),
        };
        setFormData((prev) => ({
          ...prev,
          coach: coachObj,
          coachId: coachObj.id,
        }));
      }

      setEditingBookingId(booking._id);
      setIsEditing(true);
      setIsGroupEdit(true);
      setSelectedBooking(null);
      setGroupBookings(booking.groupBookings || [booking]);
      setOpen(true);
      console.log(
        "🧩 [DEBUG] booking.schedules from backend:",
        booking.schedules
      );
    };

    window.addEventListener("openBookingEdit", handleOpenEdit);
    return () => window.removeEventListener("openBookingEdit", handleOpenEdit);
  }, []);

  useEffect(() => {
    // كل ما تتغير بيانات الحجز أو تتبدل الحالة (فتح/تعديل جديد)
    setDropdownOpen(false);
    setShowCalendar(false);
  }, [formData, isEditing]);

    // 🟣 وقت الأساس لحساب التذكير في Step2 (نفس منطق التحويل للبك تقريباً)
  const baseDateTimeForStep2 =
  formData?.start
    ? formData.start
    : formData?.dateOnly &&
      Array.isArray(formData.daysSchedule) &&
      formData.daysSchedule.length > 0 &&
      formData.daysSchedule[0]?.start
    ? `${formData.dateOnly}T${formData.daysSchedule[0].start}:00`
    : null;

    const normalizedBaseDateTime = baseDateTimeForStep2
  ? new Date(baseDateTimeForStep2).toISOString()
  : null;


  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
          <div className="bg-white rounded-2xl shadow-lg w-[849px] h-[712px] flex flex-col p-6 text-right overflow-hidden animate-fadeIn relative">
            {/* 🟣 اللودنج */}
            {loading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
                <div className="w-16 h-16 border-4 border-[var(--color-purple)] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium text-[var(--color-purple)]">
                  {isEditing
                    ? isGroupEdit
                      ? "جارٍ تعديل الحجز..."
                      : "جارٍ حفظ التعديل..."
                    : "جارٍ إضافة الحجز..."}
                </p>
              </div>
            )}

            {/* 🟣 الهيدر */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <h2 className="text-[16px] font-bold text-black">
                  {isEditing
                    ? isGroupEdit
                      ? "تعديل الحجز الجماعي"
                      : "تعديل الحجز"
                    : "إضافة حجز جديد"}
                </h2>

                {/* Dropdown للحجوزات الفردية */}
                {/* Dropdown للحجوزات الفردية */}
                {isEditing && (
                  <div className="relative w-[180px]" ref={dropdownRef}>
                    {/* الحقل الرئيسي */}
                    <div
                      className="flex items-center justify-between border border-gray-300 rounded-md bg-gray-50 h-9 px-3 cursor-pointer"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <CalenderIcon className="w-4 h-4 text-[var(--color-purple)]" />
                        {isGroupEdit
                          ? "تعديل الكل"
                          : selectedDateLabel
                          ? selectedDateLabel
                          : "اختيار يوم"}
                      </div>
                      <img
                        src="/src/icons/downarrow.svg"
                        alt="arrow"
                        className={`w-4 h-4 transform transition-transform ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {/* القائمة المنسدلة */}
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg z-50">
                        <div className="flex flex-col text-[14px] text-gray-700 font-medium">
                          {/* خيار تعديل الكل */}
                          <div
                            className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                              isGroupEdit
                                ? "text-[var(--color-purple)] font-semibold"
                                : ""
                            }`}
                            onClick={() => {
                              if (fullBookingData) {
                                const restored =
                                  formatBookingData(fullBookingData);
                                setFormData(restored);
                                setSelectedBooking(null);
                                setIsGroupEdit(true);
                                toast.info("تم اختيار تعديل الكل");
                              }
                              setDropdownOpen(false);
                              setShowCalendar(false);
                            }}
                          >
                            تعديل الكل
                          </div>

                          {/* خيار اختيار يوم */}
                          <div
                            className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                              !isGroupEdit
                                ? "text-[var(--color-purple)] font-semibold"
                                : ""
                            }`}
                            onClick={() => {
                              setIsGroupEdit(false);
                              setDropdownOpen(false);
                              setTimeout(() => setShowCalendar(true), 200); // بعد إغلاق الدروب داون
                            }}
                          >
                            اختيار يوم
                          </div>
                        </div>
                      </div>
                    )}

                    {/* الكاليندر */}
                    {showCalendar && (
                      <div
                        ref={calendarRef}
                        className="absolute top-[calc(100%+6px)] right-78 z-50"
                      >
                        <div className="calendar-popup">
                          <MiniCalender
                            variant="event"
                            hideTodayHighlight={true}
                            currentDate={
                              Array.isArray(scheduleOptions) &&
                              scheduleOptions.length > 0
                                ? new Date(scheduleOptions[0].date)
                                : new Date()
                            }
                            highlightedDates={
                              Array.isArray(scheduleOptions)
                                ? scheduleOptions.map(
                                    (s) => s.date.split("T")[0]
                                  )
                                : []
                            }
                            handleDateChange={(selectedDate) => {
                              const dateStr = selectedDate
                                .toISOString()
                                .split("T")[0];
                              const found = scheduleOptions.find(
                                (s) => s.date.split("T")[0] === dateStr
                              );

                              if (found) {
                                handleSelectBooking(found);

                                // ✅ نخزّن الـ _id تبع اليوم المختار عشان handleSubmit تقدر تلاقيه
                                setSelectedOption(found._id || found.date);

                                const formattedDate =
                                  selectedDate.toLocaleDateString("ar-EG", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  });
                                setSelectedDateLabel(formattedDate);

                                setShowCalendar(false);
                                toast.success(`تم اختيار ${formattedDate}`);
                              } else {
                                toast.warn("لا يوجد حجز في هذا اليوم");
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center"
              >
                <img src={CloseIcon} alt="إغلاق" />
              </button>
            </div>

            {/* الخطوات */}
            <div className="flex justify-center items-center gap-4 mt-6 mb-8">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setActiveStep(index)}
                  >
                    <div
                      className={`w-[20px] h-[20px] flex items-center justify-center rounded-[10px] text-xs font-medium border ${
                        index < activeStep
                          ? "border-[var(--color-purple)] bg-[var(--color-purple)] text-white"
                          : index === activeStep
                          ? "border-[var(--color-purple)] text-[var(--color-purple)]"
                          : "border-gray-300 text-gray-500"
                      }`}
                    >
                      {index < activeStep ? "✓" : index + 1}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        index <= activeStep
                          ? "text-[var(--color-purple)]"
                          : "text-gray-500"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-[51px] h-[1px] bg-gray-200"></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* المحتوى */}
            <div className="flex-grow flex flex-col justify-between pr-2 text-[14px]">
              {activeStep === 0 ? (
                <Step1Booking
                  key={`step1-${isEditing}-${selectedOption}-${
                    selectedBooking?._id || "new"
                  }`}
                  formData={formData}
                  setFormData={setFormData}
                  errors={step1Errors}
                  setErrors={setStep1Errors}
                  isIndividual={!!selectedBooking}
                  isCoach={isCoach}
                  members={allMembers}
                />
              ) : (
                <Step2Booking
                  key={`step2-${isEditing}-${selectedBooking?._id || "new"}`}
                  formData={formData}
                  setFormData={setFormData}
                  errors={step2Errors}
                  setErrors={setStep2Errors}
                  isIndividual={!!selectedBooking}
                  isEditing={isEditing}
                  baseDateTime={normalizedBaseDateTime}

                />
              )}

              {/* أزرار التنقل */}
              <div className="w-[344px] mt-4 self-center flex flex-row gap-2">
                {activeStep === 0 ? (
                  <button
                    className="w-full py-3 text-white text-sm font-medium rounded-[8px] bg-[var(--color-purple)]"
                    onClick={async () => {
                      try {
                        if (isCoach && coachId && !formData.coachId)
                          formData.coachId = coachId;
                        if (isCoach) formData.coach = { id: coachId };
                        await step1Schema.validate(formData, {
                          abortEarly: false,
                        });
                        setStep1Errors({});
                        setActiveStep(1);
                        console.log("✅ Step1 validation passed");
                      } catch (err) {
                        const formattedErrors = {};
                        if (Array.isArray(err.inner)) {
                          err.inner.forEach((e) => {
                            formattedErrors[e.path] = e.message;
                          });
                          setStep1Errors(formattedErrors);
                        }
                        toast.error("يرجى تعبئة معلومات الحجز");
                      }
                    }}
                  >
                    التالي
                  </button>
                ) : (
                  <>
                    <button
                      className="w-full py-3 text-[var(--color-purple)] text-sm font-medium rounded-[8px] border border-[var(--color-purple)]"
                      onClick={() => setActiveStep(0)}
                    >
                      السابق
                    </button>
                    <button
                      className="w-full py-3 text-white text-sm font-medium rounded-[8px] bg-[var(--color-purple)]"
                      onClick={async () => {
                        // 🟣 تحقق يدوي من Step2 قبل الحفظ
                        const newErrors = {};

                        if (!formData.dateOnly)
                          newErrors.dateOnly = "تاريخ البدء مطلوب";

                        if (!formData.subscriptionDuration)
                          newErrors.subscriptionDuration =
                            "مدة الاشتراك مطلوبة";

                        if (
                          !formData.daysSchedule ||
                          formData.daysSchedule.length === 0
                        ) {
                          newErrors.daysSchedule = "أضف يومًا واحدًا على الأقل";
                        } else {
                          // 🟣 تحقق من كل يوم داخل الجدول
                          const invalidDay = formData.daysSchedule.find(
                            (d) =>
                              !d.day?.trim() ||
                              !String(d.start || "").trim() ||
                              !String(d.end || "").trim()
                          );

                          if (invalidDay) {
                            newErrors.daysSchedule =
                              "يرجى إدخال اليوم ووقت البداية والنهاية لكل يوم";
                          }
                        }

                        // ✅ نتحقق من start/end فقط في الحجز الفردي
                        if (
                          selectedBooking &&
                          (!formData.start || !formData.end)
                        ) {
                          newErrors.start = "وقت البداية مطلوب";
                          newErrors.end = "وقت النهاية مطلوب";
                        }

                        if (
                          !formData.reminders ||
                          formData.reminders.length === 0
                        )
                          newErrors.reminders = "اختيار التذكير مطلوب";

                        console.log("🔍 DEBUG CHECK — formData:", {
                          dateOnly: formData.dateOnly,
                          subscriptionDuration: formData.subscriptionDuration,
                          daysSchedule: formData.daysSchedule,
                          start: formData.start,
                          end: formData.end,
                          reminders: formData.reminders,
                        });
                        console.log("🔍 ERRORS so far:", newErrors);

                        if (Object.keys(newErrors).length > 0) {
                          setStep2Errors(newErrors); // أو setErrors(newErrors) حسب اسمك
                          toast.error("يرجى تعبئة جميع حقول الحجز");
                          return; // ❌ ما نكمّل الحفظ
                        }

                        // ✅ إذا كله تمام كمّلي الحفظ
                        handleSubmit();
                      }}
                      disabled={loading}
                    >
                      {isEditing ? "حفظ" : "إضافة"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

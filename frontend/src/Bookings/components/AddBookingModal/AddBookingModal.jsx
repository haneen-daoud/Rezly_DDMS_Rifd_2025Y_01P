import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Step1Booking from "./Step1Booking";
import Step2Booking from "./Step2Booking";
import CloseIcon from "../../../icons/close.svg";
import CalenderIcon from "../../../icons/calender.svg?react";
import { formatBookingData } from "../helpers/formatBookingData";
import { step1Schema, step2Schema } from "../helpers/bookingValidation";
import {
  createBookingAPI,
  updateBookingAPI,
  updateSingleScheduleAPI,
  getUserFromToken,
} from "../../../api/bookingsApi";

export default function AddBookingModal({ onChange }) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isGroupEdit, setIsGroupEdit] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);

  const [step1Errors, setStep1Errors] = useState({});
  const [step2Errors, setStep2Errors] = useState({});
  const [groupBookings, setGroupBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
const [selectedOption, setSelectedOption] = useState("all");
const [scheduleOptions, setScheduleOptions] = useState([]);

  const steps = ["معلومات الحجز", "موعد الحجز"];

  const [fullBookingData, setFullBookingData] = useState(null);

  // 🟣 متغيرات المستخدم
  const [isCoach, setIsCoach] = useState(false);
  const [coachId, setCoachId] = useState(null);

  // أول ما نفتـح المودال للتعديل
useEffect(() => {
  if (isEditing && formData?.schedules?.length) {
    setScheduleOptions(formData.schedules); // نحفظ نسخة منفصلة ثابتة
  }
}, [isEditing, formData.schedules]);

  // 🧩 جلب بيانات المستخدم الفعلية
  useEffect(() => {
    async function fetchUser() {
      const user = await getUserFromToken();
      const role = user?.role?.toLowerCase() || "unknown";
      setIsCoach(role === "coach");
      setCoachId(user?.id || null);
      console.log("🧩 المستخدم الحالي:", user);
    }
    fetchUser();
  }, []);

  // 🔁 تحديث الدور لو تغيّر التوكن
  useEffect(() => {
    const handleStorageChange = async () => {
      const updatedUser = await getUserFromToken();
      const role = updatedUser?.role?.toLowerCase() || "unknown";
      setIsCoach(role === "coach");
      setCoachId(updatedUser?.id || null);
      console.log("🔁 تم تحديث المستخدم:", updatedUser);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // فتح المودال للإضافة
 const handleOpen = async () => {
  // ✅ صَفّي كل شيء أول إشي
  setStep1Errors({});
  setStep2Errors({});
  setActiveStep(0);

  const currentUser = await getUserFromToken();
  const role = currentUser?.role?.toLowerCase() || "unknown";
  setIsCoach(role === "coach");
  setCoachId(currentUser?.id || null);

  // 🔹 بعدين نظّف الداتا الجاهزة للحجز الجديد
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

  // ✅ تصفير الأخطاء عند الإغلاق
  setStep1Errors({});
  setStep2Errors({});
  setSelectedOption("all");
  setScheduleOptions([]);
};


 // 🟣 تحديث البيانات عند اختيار حجز فردي من القائمة
const handleSelectBooking = (booking) => {
  console.log("🟣 handleSelectBooking استُدعيت مع:", booking);

  // 🔸 لو ما في حجز (اختار تعديل الكل)
  if (!booking) {
    setSelectedBooking(null);
    setIsGroupEdit(true);
    setFormData((prev) => ({
      ...prev,
      subscriptionDuration: prev.subscriptionDuration || "",
      repeatDays: prev.repeatDays || [],
      recurrence: prev.recurrence || [],
    }));
    return;
  }

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

  // 🔸 تجهيز البيانات
  const formatted = formatBookingData(booking);

  const rawDate =
    booking.date ||
    booking.start ||
    formatted.dateOnly ||
    formatted.start ||
    new Date().toISOString();

  const dateStr = String(rawDate).split("T")[0];

  const startTime =
    normalizeArabicTime(booking.timeStart) ||
    (booking.start ? normalizeArabicTime(booking.start.split("T")[1]) : "") ||
    (formatted.start ? formatted.start.split("T")[1]?.slice(0, 5) : "") ||
    "09:00";

  const endTime =
    normalizeArabicTime(booking.timeEnd) ||
    (booking.end ? normalizeArabicTime(booking.end.split("T")[1]) : "") ||
    (formatted.end ? formatted.end.split("T")[1]?.slice(0, 5) : "") ||
    "10:00";

  // 🟣 إعداد البيانات الجديدة
  const updatedForm = {
    ...formData,
    dateOnly: dateStr,
    start: `${dateStr}T${startTime}`,
    end: `${dateStr}T${endTime}`,
  };

  // 🔸 تحديث الحالة
  setSelectedBooking(booking);
  setIsGroupEdit(false);
  setFormData(updatedForm);

  //  تنظيف الأخطاء والانتقال إلى Step2
  setStep1Errors({});
  setStep2Errors({});
  setActiveStep(1);

  console.log("✅ تم تحديث formData للفردي:", updatedForm);
};



  const buildRequestBodyForBackend = () => {
    // 1) service / description / location / maxMembers من Step1
    // 2) coachId (لو المستخدم كوتش بنحطه من التوكن)
    // 3) startDate من formData.dateOnly
    // 4) subscriptionDuration بنبعتها على شكل كود الباك رح يفهمه
    //    مبدئياً رح نبعتها مثل ما هي بالنص العربي، ولما يعطونا الـ mapping النهائي
    //    (أسبوع -> 1week مثلا) منعدلها بمكان واحد هون
    // 5) schedules: تحويل daysSchedule → [{dayOfWeek, timeStart, timeEnd}]

    // خريطة اليوم عربي → رقم يوم الأسبوع (حسب JS)
const dayToIndex = {
  "أحد": 0,
  "إثنين": 1,
  "ثلاثاء": 2,
  "أربعاء": 3,
  "خميس": 4,
  "جمعة": 5,
  "سبت": 6,
};

    // خريطة مدة الاشتراك عربي → كود الباك (مبدئي، عدليه حسب اللي عطاكم هو)
    const durationMap = {
      "أسبوع": "1week",
      "أسبوعين": "2weeks",
      "3 أسابيع": "3weeks",
      "شهر": "1month",
      "3 أشهر": "3months",
      "6 أشهر": "6months",
      "سنة": "1year",
    };

    // helper لتحويل "08:00" → "08:00 ص" / "09:30" → "09:30 م"
    const toArabic12h = (time24) => {
      if (!time24) return "";
      let [h, m] = time24.split(":").map(Number);
      const isPM = h >= 12;
      let displayH = h;
      if (displayH === 0) displayH = 12; // 00 -> 12 ص
      else if (displayH > 12) displayH = displayH - 12;
      const hh = String(displayH).padStart(1, ""); // خليه طبيعي بدون صفر عاليسار
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

    // تذكير
    const reminders = Array.isArray(formData.reminders)
      ? formData.reminders
      : [];

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

      schedules, // ← أهم جزء جديد

      reminders,
      // مبدئياً مش عم نبعت members هون لأن اختيارهم لسه ما اندمج بالـ AddModal
      // لو بدنا نبعتهم بعدين: members: [...ids]
    };

    console.log("📤 requestBody to backend:", requestBody);
    return requestBody;
  };

  // الحفظ
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ✅ لو المستخدم كوتش ولسا مش حاطط coachId بالمودال، نعبيه من حاله
      if (isCoach && coachId && !formData.coachId) formData.coachId = coachId;
      if (isCoach && coachId && !formData.coach)
        formData.coach = { id: coachId };

      // ✅ تحقق خطوة 1
if (isGroupEdit) {
  try {
    await step1Schema.validate(formData, { abortEarly: false });
    setStep1Errors({});
  } catch (err) {
    const formattedErrors = {};
    if (Array.isArray(err.inner)) {
      err.inner.forEach((e) => {
        formattedErrors[e.path] = e.message;
      });
    }
    setStep1Errors(formattedErrors);
    toast.error("يرجى تعبئة معلومات الحجز بشكل صحيح");
    setLoading(false);
    return;
  }
}


      // ✅ تحقق خطوة 2 (بس الأساسيات)
      try {
        console.log("🧩 Step2 validation input:", {
  ...formData,
  isIndividual: !!selectedBooking,
});

        await step2Schema.validate(
          {
            ...formData,
            isIndividual: !!selectedBooking,
          },
          { abortEarly: false }
        );
        setStep2Errors({});
      } catch (err) {
        console.error("❌ Step2 validation error:", err);
        const formattedErrors = {};
        if (Array.isArray(err.inner)) {
          err.inner.forEach((e) => {
            formattedErrors[e.path] = e.message;
          });
        }
        setStep2Errors(formattedErrors);
        toast.error("يرجى تعبئة مواعيد الحجز بشكل صحيح");
        setLoading(false);
        return;
      }

      // 🟣 إذا تعديل
if (isEditing && editingBookingId) {
  let cleanedData = {};

  if (isGroupEdit) {
    // تعديل جماعي (كامل)
    cleanedData = buildRequestBodyForBackend();
    console.log("🟣 تعديل جماعي كامل — البيانات المرسلة:", cleanedData);

  } else {
   // تعديل فردي (scheduleId واحد)
const scheduleId = selectedBooking?._id || selectedBooking?.scheduleId;

const toArabicAmPm = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const isPM = hours >= 12;
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${isPM ? "م" : "ص"}`;
};

// 🟣 استخدم بيانات الحجز الأصلية كنسخة احتياط
const original = formData;
 // هذا booking يجيك من props (الحجز الكامل)

// نبني البيانات المطلوبة حسب المطلوب من الباك
const updatedData = {
  scheduleId: selectedBooking?._id || selectedBooking?.scheduleId,
  timeStart: toArabicAmPm(formData.start),
  timeEnd: toArabicAmPm(formData.end),
  location: formData.location || original.location,
  service: formData.service || original.service,
  description: formData.description || original.description,
  coachId:
    typeof formData.coachId === "object"
      ? formData.coachId?.id
      : formData.coachId ||
        original.coach?._id ||
        original.coachId,
  maxMembers: formData.maxMembers || original.maxMembers,
  reminders: formData.reminders || original.reminders || [],
  members:
    original.members?.map((m) =>
      typeof m === "object" ? m._id : m
    ) || [],
  subscriptionDuration:
    typeof formData.subscriptionDuration === "string"
      ? formData.subscriptionDuration
      : original.subscriptionDuration,
};


console.log("🟣 تعديل فردي (scheduleId):", updatedData);
console.log("🚀 Payload sent to backend:", JSON.stringify(updatedData, null, 2));

await updateSingleScheduleAPI(editingBookingId, updatedData);
toast.success("تم تعديل الموعد الفردي بنجاح ✅");
return;

  }

  const targetId =
  formData.groupId || editingBookingId || selectedBooking?._id;

console.log("🟣 إرسال تعديل: ", {
  targetId,
  isGroupEdit,
  cleanedData,
});

await updateBookingAPI(targetId, cleanedData, isGroupEdit);


  toast.success(
    isGroupEdit
      ? "تم تعديل جميع تكرارات الحجز بنجاح ✅"
      : "تم تعديل الحجز الفردي بنجاح ✅"
  );

  handleClose();
  onChange();
  setLoading(false);
  return;
}


      // 🟣 إذا إضافة جديدة
      const bodyToSend = buildRequestBodyForBackend();
      await createBookingAPI(bodyToSend);

      toast.success("تم إضافة الحجز بنجاح ✅");

      handleClose();
      onChange();
    } catch (err) {
      console.error("❌ خطأ أثناء حفظ الحجز:", err);
      toast.error("حدث خطأ أثناء حفظ الحجز");
    } finally {
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
      setEditingBookingId(booking.groupId || booking._id);
      setIsEditing(true);
      setIsGroupEdit(true);
      setSelectedBooking(null);
      setGroupBookings(booking.groupBookings || [booking]);
      setOpen(true);
      console.log("🧩 [DEBUG] booking.schedules from backend:", booking.schedules);

    };
    
    window.addEventListener("openBookingEdit", handleOpenEdit);
    return () => window.removeEventListener("openBookingEdit", handleOpenEdit);
  }, []);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
          <div className="bg-white rounded-2xl shadow-lg w-[849px] h-[712px] flex flex-col p-6 text-right overflow-hidden animate-fadeIn relative">
            {/* 🟣 اللودنج */}
            {loading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
                <div className="w-16 h-16 border-4 border-[#6A0EAD] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium text-[#6A0EAD]">
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
  <div className="flex items-center gap-2 border px-3 py-1 rounded cursor-pointer bg-gray-100">
    <CalenderIcon className="w-5 h-5 text-[var(--color-purple)]" />
    <select
    className="border rounded-md px-3 py-1 text-sm focus:outline-none"
    value={selectedOption}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedOption(value);

      if (value === "all") {
        // 🔹 رجّع البيانات الكاملة (تعديل الكل)
        setFormData(formatBookingData(editingBooking)); 
        setSelectedBooking(null);
      } else {
        // 🔹 جِيب الحجز الفرعي حسب التاريخ المختار من القائمة الثابتة
        const found = scheduleOptions.find((s) => s.date === value);
        if (found) handleSelectBooking(found);
      }
    }}
  >
    <option value="all">تعديل الكل</option>
    {scheduleOptions.map((s) => (
      <option key={s.date} value={s.date}>
        {new Date(s.date).toLocaleDateString("ar-EG", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
        })}
      </option>
    ))}
  </select>

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
                          ? "border-[#6A0EAD] bg-[#6A0EAD] text-white"
                          : index === activeStep
                          ? "border-[#6A0EAD] text-[#6A0EAD]"
                          : "border-gray-300 text-gray-500"
                      }`}
                    >
                      {index < activeStep ? "✓" : index + 1}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        index <= activeStep
                          ? "text-purple-600"
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
    key={`step1-${isEditing}-${selectedBooking?._id || "new"}`}
    formData={formData}
    setFormData={setFormData}
    errors={step1Errors}
    setErrors={setStep1Errors}
    isIndividual={!!selectedBooking}
    isCoach={isCoach}
  />
) : (
  <Step2Booking
    key={`step2-${isEditing}-${selectedBooking?._id || "new"}`}
    formData={formData}
    setFormData={setFormData}
    errors={step2Errors}
    setErrors={setStep2Errors}
    isIndividual={!!selectedBooking}
  />
)}



              {/* أزرار التنقل */}
              <div className="w-[344px] mt-4 self-center flex flex-row-reverse gap-2">
                {activeStep === 0 ? (
                  <button
                    className="w-full py-3 text-white text-sm font-medium rounded-[8px]"
                    style={{ backgroundColor: "#6A0EAD" }}
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
                      className="w-full py-3 text-[#6A0EAD] text-sm font-medium rounded-[8px] border border-[#6A0EAD]"
                      onClick={() => setActiveStep(0)}
                    >
                      السابق
                    </button>
                    <button
                      className="w-full py-3 text-white text-sm font-medium rounded-[8px]"
                      style={{ backgroundColor: "#6A0EAD" }}
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {isEditing ? "حفظ التعديلات" : "إضافة الحجز"}
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

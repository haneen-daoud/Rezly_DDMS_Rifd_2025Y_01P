// src/helpers/bookingValidation.js
import * as Yup from "yup";

// 🟣 التحقق من الوقت بصيغة HH:MM (إما 24h أو مع ص/م)
const timeRegex = /^([0-9]{1,2}):([0-9]{2})(\s?[صم]?)$/;

// 🟣 step 1 — الحقول الأساسية
export const step1Schema = Yup.object().shape({
  // service أو title في الواجهة
title: Yup.string()
  .trim()
  .required("اسم الحصة مطلوب")
  .min(3, "اسم الحصة يجب أن يحتوي على 3 أحرف على الأقل")
  .max(50, "اسم الحصة يجب ألا يزيد عن 50 حرفًا"),

  description: Yup.string()
  .required("الوصف مطلوب")
  .min(10, "الوصف يجب أن يحتوي على 10 أحرف على الأقل")
  .max(250, "الوصف يجب ألا يزيد عن 250 حرفًا"),


 coachId: Yup.string()
  .transform((value, originalValue) => {
    // لو اجت كـ object { id, name } (حالة تعديل حجز)
    if (originalValue && typeof originalValue === "object") {
      return originalValue.id || originalValue._id || "";
    }
    return value;
  })
  .required("اختيار المدرب مطلوب"),


  room: Yup.string()
  .trim()
  .required("اختيار القاعة مطلوب")
  .max(10, "اسم القاعة يجب ألا يزيد عن 10 حروف"),


  maxMembers: Yup.number()
    .typeError("عدد المشتركين يجب أن يكون رقمًا")
    .min(1, "عدد المشتركين لا يمكن أن يكون أقل من 1")
    .required("عدد المشتركين مطلوب"),
});

// 🟢 step 2 — التاريخ، الاشتراك، الأوقات
export const step2Schema = Yup.object().shape({
  // تاريخ البداية
  dateOnly: Yup.string()
    .required("تاريخ البدء مطلوب")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "صيغة التاريخ غير صحيحة"),

  // مدة الاشتراك (تتخطى بالفردي)
  subscriptionDuration: Yup.string().when("isIndividual", {
    is: true,
    then: () => Yup.string().notRequired(),
    otherwise: () =>
      Yup.string()
        .oneOf(
          [
            "1day",
            "1week",
            "2weeks",
            "3weeks",
            "1month",
            "3months",
            "6months",
            "1year",
            "أسبوع",
            "أسبوعين",
            "3 أسابيع",
            "شهر",
            "3 أشهر",
            "6 أشهر",
            "سنة",
          ],
          "مدة الاشتراك غير صالحة"
        )
        .required("مدة الاشتراك مطلوبة"),
  }),

  // جدول الأيام (يتجاوز بالفردي)
  daysSchedule: Yup.array().when("isIndividual", {
    is: true,
    then: () => Yup.array().notRequired(),
    otherwise: () =>
      Yup.array()
        .of(
          Yup.object().shape({
            day: Yup.string().required("اختر اليوم"),
            start: Yup.string()
              .required("وقت البداية مطلوب")
              .matches(timeRegex, "صيغة الوقت غير صحيحة"),
            end: Yup.string()
              .required("وقت النهاية مطلوب")
              .matches(timeRegex, "صيغة الوقت غير صحيحة"),
          })
        )
        .min(1, "أضف يومًا واحدًا على الأقل"),
  }),

  // الأوقات في حالة تعديل فردي
  start: Yup.string().when("isIndividual", {
    is: true,
    then: () =>
      Yup.string()
        .required("وقت البداية مطلوب")
        .matches(timeRegex, "صيغة الوقت غير صحيحة"),
    otherwise: () => Yup.string().notRequired(),
  }),
  end: Yup.string().when("isIndividual", {
    is: true,
    then: () =>
      Yup.string()
        .required("وقت النهاية مطلوب")
        .matches(timeRegex, "صيغة الوقت غير صحيحة"),
    otherwise: () => Yup.string().notRequired(),
  }),

  // reminders (اختياري)
  reminders: Yup.array().of(
    Yup.mixed().test("valid-reminder", "التذكير غير صالح", (val) => {
      if (!val) return true;
      const validValues = ["none", "30min", "1hour", "1day"];
      if (typeof val === "string") return validValues.includes(val);
      if (typeof val === "object" && val.date && val.time) return true;
      return false;
    })
  ),
});

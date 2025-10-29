// src/helpers/bookingValidation.js
import * as Yup from "yup";

export const step1Schema = Yup.object().shape({
  title: Yup.string().required("اسم الحصة مطلوب"),
  description: Yup.string().required("الوصف مطلوب"),
  coach: Yup.object().required("اختيار المدرب مطلوب"),
  room: Yup.string().required("اختيار القاعة مطلوب"),
  maxMembers: Yup.number()
    .min(1, "عدد المشتركين لا يمكن أن يكون أقل من 1")
    .required("عدد المشتركين مطلوب"),
});

// ✅ النسخة الثابتة من step2Schema بدون branch error
export const step2Schema = Yup.object().shape({
  dateOnly: Yup.string().required("تاريخ البدء مطلوب"),

  // مدة الاشتراك
  subscriptionDuration: Yup.string().when("isIndividual", {
    is: true,
    then: () => Yup.string().notRequired(),
    otherwise: () => Yup.string().required("مدة الاشتراك مطلوبة"),
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
            start: Yup.string().required("وقت البداية مطلوب"),
            end: Yup.string().required("وقت النهاية مطلوب"),
          })
        )
        .min(1, "أضف يومًا واحدًا على الأقل"),
  }),

  // وقت البداية والنهاية (مطلوبين للفردي)
  start: Yup.string().when("isIndividual", {
    is: true,
    then: () => Yup.string().required("وقت البداية مطلوب"),
    otherwise: () => Yup.string().notRequired(),
  }),
  end: Yup.string().when("isIndividual", {
    is: true,
    then: () => Yup.string().required("وقت النهاية مطلوب"),
    otherwise: () => Yup.string().notRequired(),
  }),
});

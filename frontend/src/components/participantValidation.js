import * as Yup from "yup";

export const step1Schema = Yup.object().shape({
  firstName: Yup.string()
    .required("الاسم الأول مطلوب")
    .min(2, "يجب أن لا يقل عن حرفين ")
    .max(15, "يجب ألا يزيد عن 15 حرفًا"),

  lastName: Yup.string()
    .required("الاسم الثاني مطلوب")
    .min(2, "يجب أن لا يقل عن حرفين ")
    .max(15, "يجب ألا يزيد عن 15 حرفًا"),

  gender: Yup.string()
    .required("الجنس مطلوب"),

  idNumber: Yup.string()
    .required("رقم الهوية مطلوب")
    .matches(/^[0-9]+$/, "يجب أن يحتوي على أرقام فقط")
    .min(7, "رقم الهوية غير صحيح")
    .max(15, "رقم الهوية غير صحيح"),

 birthDate: Yup
  .date()
  .nullable()
  .transform((value, originalValue) => {
    return originalValue === "" ? null : value;
  })
  .required("تاريخ الميلاد مطلوب"),

  // الصورة غير إلزامية
  image: Yup.mixed().nullable(),
});

// Step 2: Subscription Information

export const step2Schema = Yup.object().shape({
  phone: Yup.string().required("رقم الهاتف مطلوب"),
  email: Yup.string().email("الإيميل غير صالح").required("الإيميل مطلوب"),
  city: Yup.string().required("المدينة مطلوبة"),
  address: Yup.string().required("العنوان مطلوب"),
});
// Step 3: Medical File (No required fields)
export const step3Schema = Yup.object().shape({});

export const step4Schema = Yup.object().shape({
  packageId: Yup.string().required("يجب اختيار الاشتراك"),
  paymentMethod: Yup.string().required("يجب اختيار طريقة الدفع"),
  coachId: Yup.string().required("يجب اختيار المدرب"),
});
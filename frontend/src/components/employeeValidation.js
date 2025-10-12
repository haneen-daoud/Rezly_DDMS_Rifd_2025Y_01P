import * as Yup from "yup";

export const step1Schema = Yup.object().shape({
  firstName: Yup.string()
    .required("الاسم الأول مطلوب")
    .min(2, "  يجب أن يحتوي على حرفين على الأقل"),

  lastName: Yup.string()
    .required("الاسم الثاني مطلوب")
    .min(2, "  يجب أن يحتوي على حرفين على الأقل"),

  gender: Yup.string().required("يجب اختيار الجنس"),

  //  الهوية اختيارية، لكن إذا تمت تعبئتها يجب أن تكون 10 أرقام
  nationalId: Yup.string()
    .matches(/^\d{10}$/, "رقم الهوية يجب أن يتكون من 10 أرقام")
    .notRequired()
    .nullable()
    .transform((value) => (value === "" ? null : value)),

  //  تاريخ الميلاد اختياري
  birthDate: Yup.string().notRequired().nullable(),

  //  الصورة اختيارية
  image: Yup.mixed().notRequired(),
});
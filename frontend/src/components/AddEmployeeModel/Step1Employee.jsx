import React, { useState, useImperativeHandle, forwardRef } from "react";
import { step1Schema } from "../employeeValidation.js";
import Select from "react-select";
import selectStyles from "../selectStyles.js";
import CalenderIcon from "../../icons/calender.svg?react";
import MiniCalender from "../MiniCalender/MiniCalender.jsx";

const Step1Employee = forwardRef(({ data, onChange, errors }, ref) => {
  const [localErrors, setLocalErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);

  const genderOptions = [
    { value: "ذكر", label: "ذكر" },
    { value: "أنثى", label: "أنثى" },
  ];

  const handleFileChange = (e) => {
  const file = e.target.files[0];

  if (!file) {
    // لو شال الملف بعد ما اختاره
    onChange("image", null);
    setLocalErrors((prev) => ({ ...prev, image: "" }));
    return;
  }

  // التحقق من حجم الملف
  if (file.size > 2 * 1024 * 1024) {
    // أكبر من 2MB → خطأ تحت الحقل
    onChange("image", null); // نتأكد إنه مش محفوظ
    setLocalErrors((prev) => ({
      ...prev,
      image: "حجم الصورة يجب ألا يتجاوز 2MB",
    }));
  } else {
    // حجم مناسب → نخزّنه ونمسح الخطأ
    onChange("image", file);
    setLocalErrors((prev) => ({ ...prev, image: "" }));
    validateField("image", file);
  }
};


  const validateField = async (field, value) => {
    try {
      await step1Schema.validateAt(field, { ...data, [field]: value });
      setLocalErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      setLocalErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  const handleChange = (field, value) => {
    onChange(field, value);
    validateField(field, value);
  };

  const validateAll = async () => {
    try {
      await step1Schema.validate(data, { abortEarly: false });
      setLocalErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setLocalErrors(newErrors);
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    validateAll,
  }));

  const combinedErrors = { ...errors, ...localErrors };

  return (
    <div className="flex justify-center bg-white w-full relative">
      <form className="w-[343px] flex flex-col gap-2 font-[Cairo] relative">
        {/* الاسم الأول + الثاني */}
        <div className="flex gap-3 align-item-center">
          <div className="flex-1">
            <label className="block text-[14px] font-[700] text-black mb-1.5">
              الاسم الأول <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="أدخل الاسم الأول"
              value={data.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C]
  focus:outline-none ${
    combinedErrors.firstName
      ? "border-red-500"
      : "border-gray-300 focus:border-[var(--color-purple)]"
  }`}
            />
            {combinedErrors.firstName && (
              <p className="text-red-500 text-[11px] mt-1">
                {combinedErrors.firstName}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-[14px] font-[700] text-black mb-1.5">
              الاسم الثاني <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="أدخل الاسم الثاني"
              value={data.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C]
  focus:outline-none ${
    combinedErrors.lastName
      ? "border-red-500"
      : "border-gray-300 focus:border-[var(--color-purple)]"
  }`}
            />
            {combinedErrors.lastName && (
              <p className="text-red-500 text-[11px] mt-1">
                {combinedErrors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* الجنس */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5">
            الجنس <span className="text-red-500">*</span>
          </label>
          <Select
            options={genderOptions}
            value={genderOptions.find((o) => o.value === data.gender)}
            onChange={(opt) => handleChange("gender", opt.value)}
            placeholder="اختر الجنس"
            styles={selectStyles}
            isRtl={true}
          />
          {combinedErrors.gender && (
            <p className="text-red-500 text-[11px] mt-1">
              {combinedErrors.gender}
            </p>
          )}
        </div>

        {/* رقم الهوية */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5">
            رقم الهوية
          </label>
          <input
            type="text"
            placeholder="أدخل رقم الهوية"
            value={data.nationalId}
            onChange={(e) => handleChange("nationalId", e.target.value)}
            className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C]
  focus:outline-none ${
    combinedErrors.nationalId
      ? "border-red-500"
      : "border-gray-300 focus:border-[var(--color-purple)]"
  }`}
          />
          {combinedErrors.nationalId && (
            <p className="text-red-500 text-[11px] mt-1">
              {combinedErrors.nationalId}
            </p>
          )}
        </div>

        {/* تاريخ الميلاد + MiniCalender */}
<div className="flex flex-col gap-2">
  <label className="block text-[14px] font-[700] text-black mb-1.5">
    تاريخ الميلاد
  </label>

  <div className="relative">
    <button
      type="button"
      onClick={() => setShowCalendar((prev) => !prev)}
      className={`w-full flex items-center gap-2 border rounded-xl px-3 py-2.5 cursor-pointer 
        text-[12px] placeholder-[#7E818C]
        ${
          combinedErrors.birthDate
            ? "border-red-500"
            : "border-gray-300 focus:border-[var(--color-purple)]"
        }
        focus:outline-none
      `}
    >
      <CalenderIcon className="w-5 h-5 text-[var(--color-purple)]" />
      <span className={data.birthDate ? "text-black" : "text-[#7E818C]"}>
        {data.birthDate || "اختر تاريخ الميلاد"}
      </span>
    </button>

    {showCalendar && (
      <MiniCalender
        currentDate={
          data.birthDate ? new Date(data.birthDate) : new Date()
        }
        variant="employeeTop"
        handleDateChange={(date) => {
          const iso = date.toISOString().split("T")[0];
          handleChange("birthDate", iso);
          setShowCalendar(false);
        }}
      />
    )}
  </div>

  {combinedErrors.birthDate && (
    <p className="text-red-500 text-[11px] mt-1">
      {combinedErrors.birthDate}
    </p>
  )}
</div>


        {/* صورة الملف الشخصي */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5">
            صورة الملف الشخصي
          </label>

          <div className="border-2 border-dashed border-[var(--color-purple)] rounded-xl p-5 text-center text-gray-500 text-[12px] cursor-pointer hover:border-purple-400 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="imageUpload"
            />

            <label htmlFor="imageUpload" className="cursor-pointer">
              <svg
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="m-auto"
              >
                <rect x="0.5" width="32" height="32" rx="8" fill="#E1CFEF" />
                <path
                  d="M13.5 20.5V14.5H9.5L16.5 7.5L23.5 14.5H19.5V20.5H13.5ZM9.5 24.5V22.5H23.5V24.5H9.5Z"
                  fill="var(--color-purple)"
                />
              </svg>

              <p>اسحب الملف وأفلته هنا أو اختر ملفاً</p>
              <p className="text-xs text-gray-400 mt-1">الحد الأقصى 2MB</p>

              {data.image && (
                <p className="text-green-600 mt-2">✔ تم اختيار الملف</p>
              )}
            </label>
            {combinedErrors.image && (
  <p className="text-red-500 text-[11px] mt-1">
    {combinedErrors.image}
  </p>
)}

          </div>
        </div>
      </form>
    </div>
  );
});

export default Step1Employee;

import React, { useState, useImperativeHandle, forwardRef } from "react";
import { step1Schema } from "../employeeValidation.js";

const Step1Employee = forwardRef(({ data, onChange, errors }, ref) => {
  const [localErrors, setLocalErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      onChange("image", file);
      validateField("image", file);
    } else {
      alert("الملف أكبر من 2MB");
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
    <div className="flex justify-center bg-white w-full">
      <form className="w-[343px] flex flex-col gap-2 font-[Cairo]">
        <div className="flex gap-3 align-item-center">
          {/* الاسم الأول */}
          <div className="flex-1">
            <label className="block text-[14px] font-[700] text-black mb-1.5 ">
              الاسم الأول <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="أدخل الاسم الأول"
              value={data.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C] focus:outline-none focus:ring-2 ${
                combinedErrors.firstName
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
            />
            {combinedErrors.firstName && (
              <p className="text-red-500 text-[11px] mt-1">
                {combinedErrors.firstName}
              </p>
            )}
          </div>

          {/* الاسم الثاني */}
          <div className="flex-1">
            <label className="block text-[14px] font-[700] text-black mb-1.5 ">
              الاسم الثاني <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="أدخل الاسم الثاني"
              value={data.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C] focus:outline-none focus:ring-2 ${
                combinedErrors.lastName
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
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
          <label className="block text-[14px] font-[700] text-black mb-1.5 ">
            الجنس <span className="text-red-500">*</span>
          </label>
          <select
            value={data.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className={`w-full p-2.5 border rounded-xl text-[12px] text-[#7E818C] focus:outline-none focus:ring-2 ${
              combinedErrors.gender
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-purple-500"
            }`}
          >
            <option value="">اختر الجنس</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>
          {combinedErrors.gender && (
            <p className="text-red-500 text-[11px] mt-1">
              {combinedErrors.gender}
            </p>
          )}
        </div>

        {/* رقم الهوية */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5 ">
            رقم الهوية
          </label>
          <input
            type="text"
            placeholder="أدخل رقم الهوية"
            value={data.nationalId}
            onChange={(e) => handleChange("nationalId", e.target.value)}
            className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C] focus:outline-none focus:ring-2 ${
              combinedErrors.nationalId
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-purple-500"
            }`}
          />
          {combinedErrors.nationalId && (
            <p className="text-red-500 text-[11px] mt-1">
              {combinedErrors.nationalId}
            </p>
          )}
        </div>

        {/* تاريخ الميلاد */}
        <div className="relative">
          <label className="block text-[14px] font-[700] text-black mb-1.5 ">
            تاريخ الميلاد
          </label>
          <input
            type="text"
            placeholder="اختر تاريخ الميلاد"
            value={data.birthDate}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            onChange={(e) => handleChange("birthDate", e.target.value)}
            className={`w-full p-2.5 pr-10 border rounded-xl text-[12px] placeholder-[#7E818C] focus:outline-none focus:ring-2 ${
              combinedErrors.birthDate
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-purple-500"
            }`}
          />
          {combinedErrors.birthDate && (
            <p className="text-red-500 text-[11px] mt-1">
              {combinedErrors.birthDate}
            </p>
          )}
        </div>

        {/* رفع الملف */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5 ">
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
          </div>
        </div>
      </form>
    </div>
  );
});

export default Step1Employee;

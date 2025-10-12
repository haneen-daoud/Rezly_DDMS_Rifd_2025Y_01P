import React, { useState } from "react";
import { step1Schema } from "../employeeValidation.js";

export default function Step1Employee({ data, onChange }) {
  const [errors, setErrors] = useState({});

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
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  const handleChange = (field, value) => {
    onChange(field, value);
    validateField(field, value);
  };

  const validateAll = async () => {
    try {
      await step1Schema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  React.useImperativeHandle(data._ref, () => ({
    validateAll,
  }));

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
              className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C] focus:outline-none focus:ring-2 ${errors.firstName
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
                }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-[11px] mt-1">{errors.firstName}</p>
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
              className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C] focus:outline-none focus:ring-2 ${errors.lastName
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
                }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-[11px] mt-1">{errors.lastName}</p>
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
            className={`w-full p-2.5 border rounded-xl text-[12px] text-[#7E818C] focus:outline-none focus:ring-2 ${errors.gender
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-purple-500"
              }`}
          >
            <option value="">اختر الجنس</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-[11px] mt-1">{errors.gender}</p>
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
            className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C] focus:outline-none focus:ring-2 ${errors.nationalId
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-purple-500"
              }`}
          />
          {errors.nationalId && (
            <p className="text-red-500 text-[11px] mt-1">{errors.nationalId}</p>
          )}
        </div>

        {/* تاريخ الميلاد */}
        <div className="relative ">
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
            className={`w-full p-2.5 pr-10 border rounded-xl text-[12px] placeholder-[#7E818C] focus:outline-none focus:ring-2 ${errors.birthDate
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-purple-500"
              }`}
          />

          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <path
              d="M14.5 8V12.6667C14.5 13.0203 14.3595 13.3594 14.1095 13.6095C13.8594 13.8595 13.5203 14 13.1667 14H3.83333C3.47971 14 3.14057 13.8595 2.89052 13.6095C2.64048 13.3594 2.5 13.0203 2.5 12.6667V8H14.5ZM11.1667 2C11.3435 2 11.513 2.07024 11.6381 2.19526C11.7631 2.32029 11.8333 2.48986 11.8333 2.66667V3.33333H13.1667C13.5203 3.33333 13.8594 3.47381 14.1095 3.72386C14.3595 3.97391 14.5 4.31304 14.5 4.66667V6.66667H2.5V4.66667C2.5 4.31304 2.64048 3.97391 2.89052 3.72386C3.14057 3.47381 3.47971 3.33333 3.83333 3.33333H5.16667V2.66667C5.16667 2.48986 5.2369 2.32029 5.36193 2.19526C5.48695 2.07024 5.65652 2 5.83333 2C6.01014 2 6.17971 2.07024 6.30474 2.19526C6.42976 2.32029 6.5 2.48986 6.5 2.66667V3.33333H10.5V2.66667C10.5 2.48986 10.5702 2.32029 10.6953 2.19526C10.8203 2.07024 10.9899 2 11.1667 2Z"
              fill="#6A0EAD"
            />
          </svg>

          {errors.birthDate && (
            <p className="text-red-500 text-[11px] mt-1">{errors.birthDate}</p>
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
              <p>اسحب الملف وأفلته هنا أو اختر ملفا</p>
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
}
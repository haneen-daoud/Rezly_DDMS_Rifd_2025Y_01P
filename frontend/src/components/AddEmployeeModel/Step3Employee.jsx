import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { step3Schema } from "../employeeValidation.js";

const Step3Employee = forwardRef(({ data, onChange }, ref) => {
  const [localErrors, setLocalErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  // تغيير البيانات
  const handleChange = (field, value) => {
    onChange(field, value);
    // التعليق هنا إذا تريد تحقق أثناء الكتابة
    // validateField(field, value);
  };

  const validateAll = async () => {
    try {
      await step3Schema.validate(data, { abortEarly: false });
      setLocalErrors({});
      setShowErrors(true);
      console.log("Step3 validation passed!");
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setLocalErrors(newErrors);
      setShowErrors(true);
      console.log("Step3 validation failed:", newErrors);
      return false;
    }
  };
  useEffect(() => {
    console.log("بيانات step3:", data);
  }, [data]);


  useImperativeHandle(ref, () => ({
    validateAll,
  }));

  return (
    <div className="flex justify-center bg-white w-full">
      <form className="w-[343px] flex flex-col gap-3 font-[Cairo]">
        {/* المسمى الوظيفي */}
        <div className="flex flex-col gap-2 ">
          <label className="text-[14px] font-[700] text-black">
            المسمى الوظيفي<span className="text-red-500">*</span>
          </label>
          <select
            value={data.jobTitle || ""}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 text-[12px] text-[#7E818C] focus:outline-none focus:ring-2 ${showErrors && localErrors.jobTitle
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-purple-500"
              }`}
          >
            <option value="">المسمى الوظيفي</option>
            <option value="مطور">مطور</option>
            <option value="مصمم">مصمم</option>
            <option value="مدير">مدير</option>
          </select>
          {showErrors && localErrors.jobTitle && (
            <p className="text-red-500 text-[11px] mt-1">{localErrors.jobTitle}</p>
          )}
        </div>

        {/* القسم */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            القسم<span className="text-red-500">*</span>
          </label>
          <select
            value={data.department || ""}
            onChange={(e) => handleChange("department", e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 text-[12px] text-[#7E818C] focus:outline-none focus:ring-2 ${showErrors && localErrors.department
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-purple-500"
              }`}
          >
            <option value="">اختر القسم</option>
            <option value="HR">الموارد البشرية</option>
            <option value="Administration">الادارة</option>

            <option value="تقنية المعلومات">تقنية المعلومات</option>
          </select>
          {showErrors && localErrors.department && (
            <p className="text-red-500 text-[11px] mt-1">{localErrors.department}</p>
          )}
        </div>

        {/* نوع العقد */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            نوع العقد<span className="text-red-500">*</span>
          </label>
          <select
            value={data.contractType || ""}
            onChange={(e) => handleChange("contractType", e.target.value)}
            className={`w-full border rounded-xl px-2.5 py-2 text-[12px] text-[#7E818C] focus:outline-none focus:ring-2 ${showErrors && localErrors.contractType
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-purple-500"
              }`}
          >
            <option value="">نوع العقد</option>
            <option value="كامل">دوام كامل</option>
            <option value="جزئي">دوام جزئي</option>
            <option value="مؤقت">دوام مؤقت</option>
          </select>
          {showErrors && localErrors.contractType && (
            <p className="text-red-500 text-[11px] mt-1">{localErrors.contractType}</p>
          )}
        </div>

        {/* تاريخ بدء العمل */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5">
            تاريخ بدء العمل<span className="text-red-500">*</span>

          </label>
          <input
            type="date"
            value={data.startDate || ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </form>
    </div>
  );
});

export default Step3Employee;

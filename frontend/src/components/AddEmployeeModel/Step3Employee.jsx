import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { step3Schema } from "../employeeValidation.js";
import Select from 'react-select';
import selectStyles from "../selectStyles.js";

const Step3Employee = forwardRef(({ data, onChange }, ref) => {
  const [localErrors, setLocalErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);


  // تغيير البيانات
  const handleChange = (field, value) => {
    onChange(field, value);
    // التعليق هنا إذا تريد تحقق أثناء الكتابة
    // validateField(field, value);
  };
const jobTitleOptions = [
  { value: "مطور", label: "مطور" },
  { value: "مصمم", label: "مصمم" },
  { value: "مدير", label: "مدير" },
];

const departmentOptions = [
  { value: "HR", label: "الموارد البشرية" },
  { value: "Administration", label: "الإدارة" },
  { value: "تقنية المعلومات", label: "تقنية المعلومات" },
];

const contractTypeOptions = [
  { value: "كامل", label: "دوام كامل" },
  { value: "جزئي", label: "دوام جزئي" },
  { value: "مؤقت", label: "دوام مؤقت" },
];

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
     <Select
  options={jobTitleOptions}
  value={jobTitleOptions.find((o) => o.value === data.jobTitle)}
  onChange={(opt) => handleChange("jobTitle", opt.value)}
  placeholder="المسمى الوظيفي"
  styles={selectStyles}
  isRtl={true}
/>
{showErrors && localErrors.jobTitle && (
  <p className="text-red-500 text-[11px] mt-1">{localErrors.jobTitle}</p>
)}

        </div>

        {/* القسم */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            القسم<span className="text-red-500">*</span>
          </label>
          <Select
  options={departmentOptions}
  value={departmentOptions.find((o) => o.value === data.department)}
  onChange={(opt) => handleChange("department", opt.value)}
  placeholder="اختر القسم"
  styles={selectStyles}
  isRtl={true}
/>
{showErrors && localErrors.department && (
  <p className="text-red-500 text-[11px] mt-1">{localErrors.department}</p>
)}

        </div>

        {/* نوع العقد */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            نوع العقد<span className="text-red-500">*</span>
          </label>
   <Select
  options={contractTypeOptions}
  value={contractTypeOptions.find((o) => o.value === data.contractType)}
  onChange={(opt) => handleChange("contractType", opt.value)}
  placeholder="نوع العقد"
  styles={selectStyles}
  isRtl={true}
/>
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

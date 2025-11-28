import React, { useState, forwardRef, useImperativeHandle } from "react";
import { step4Schema } from "../employeeValidation.js";
import Select from "react-select";
import selectStyles from "../selectStyles.js";

const Step4Employee = forwardRef(({ data, onChange }, ref) => {
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const handleChange = (field, value) => {
    onChange(field, value);
    if (errors[field]) {
      validateField(field, value);
    }
  };
  const roleOptions = [
    { value: "Admin", label: "مدير" },
    { value: "Coach", label: "مدرب" },
    { value: "Accountant", label: "محاسب" },
    { value: "Receptionist", label: "موظف استقبال" },
  ];

  const validateField = async (field, value) => {
    try {
      await step4Schema.validateAt(field, { ...data, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  // التحقق من جميع الحقول عند الضغط على "التالي"
  const validateAll = async () => {
    try {
      await step4Schema.validate(data, { abortEarly: false });
      setErrors({});
      setShowErrors(true);
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
      setShowErrors(true);
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    validateAll,
  }));

  return (
    <div className="flex justify-center bg-white w-full">
      <form className="w-[343px] flex flex-col gap-3 font-[Cairo]">
        {/* اسم المستخدم */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            اسم المستخدم<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder=" أدخل اسم المستخدم"
            value={data.username || ""}
            onChange={(e) => handleChange("username", e.target.value)}
            className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C]
  focus:outline-none ${
    showErrors && errors.username
      ? "border-red-500"
      : "border-gray-300 focus:border-[var(--color-purple)]"
  }`}
          />
          {showErrors && errors.username && (
            <p className="text-red-500 text-[11px]">{errors.username}</p>
          )}
        </div>

        {/* كلمة المرور */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            كلمة المرور<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="أدخل كلمة المرور"
            value={data.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C]
  focus:outline-none ${
    showErrors && errors.password
      ? "border-red-500"
      : "border-gray-300 focus:border-[var(--color-purple)]"
  }`}
          />
          {showErrors && errors.password && (
            <p className="text-red-500 text-[11px]">{errors.password}</p>
          )}
        </div>

        {/* مستوى الصلاحية */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            مستوى الصلاحية<span className="text-red-500">*</span>
          </label>

          <Select
            options={roleOptions}
            value={roleOptions.find((o) => o.value === data.role)}
            onChange={(opt) => handleChange("role", opt.value)}
            placeholder="اختر مستوى الصلاحية"
            styles={selectStyles}
            isRtl={true}
          />

          {showErrors && errors.role && (
            <p className="text-red-500 text-[11px] mt-1">{errors.role}</p>
          )}
        </div>

        {/* ملاحظات */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">ملاحظات</label>
          <input
            type="text"
            placeholder="أضف ملاحظات"
            value={data.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C]
  border-gray-300 focus:outline-none focus:border-[var(--color-purple)]"
          />
        </div>
      </form>
    </div>
  );
});

export default Step4Employee;

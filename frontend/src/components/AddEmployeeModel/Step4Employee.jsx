import React, { useState, forwardRef, useImperativeHandle } from "react";
import { step4Schema } from "../employeeValidation.js";

const Step4Employee = forwardRef(({ data, onChange }, ref) => {
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const handleChange = (field, value) => {
    onChange(field, value);
    // يمكن تحقق field real-time
    if (errors[field]) {
      validateField(field, value);
    }
  };

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
            placeholder="اسم المستخدم"
            value={data.username || ""}
            onChange={(e) => handleChange("username", e.target.value)}
            className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C]
              focus:outline-none focus:ring-2 ${
                showErrors && errors.username
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
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
              focus:outline-none focus:ring-2 ${
                showErrors && errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
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
          <select
            value={data.role || ""}
            onChange={(e) => handleChange("role", e.target.value)}
            className={`w-full border rounded-xl p-2.5 text-[12px] text-[#7E818C]
              focus:outline-none focus:ring-2 ${
                showErrors && errors.role
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
          >
            <option value="">اختر مستوى الصلاحية</option>
            <option value="Admin">مدير</option>
            <option value="Coach">مدرب</option>
            <option value="Accountant">محاسب</option>
            <option value="Receptionist">موظف استقبال</option>
          </select>
          {showErrors && errors.role && (
            <p className="text-red-500 text-[11px]">{errors.role}</p>
          )}
        </div>

        {/* ملاحظات */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            ملاحظات
          </label>
          <input
            type="text"
            placeholder="أضف ملاحظات"
            value={data.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C]
              focus:outline-none focus:ring-2 `}
          />

        </div>

      </form>
    </div>
  );
});

export default Step4Employee;

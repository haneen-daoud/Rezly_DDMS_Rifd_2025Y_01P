import React, { useState, useImperativeHandle, forwardRef } from "react";
import { step2Schema } from "../employeeValidation.js";

const Step2Employee = forwardRef(({ data, onChange }, ref) => {
  const [localErrors, setLocalErrors] = useState({});

  // التحقق من حقل واحد
  const validateField = async (field, value) => {
    try {
      await step2Schema.validateAt(field, { ...data, [field]: value });
      setLocalErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      setLocalErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  // عند كل تغيير
  const handleChange = (field, value) => {
    onChange(field, value);
    validateField(field, value);
  };

  // التحقق من جميع الحقول
  const validateAll = async () => {
    try {
      await step2Schema.validate(data, { abortEarly: false });
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

  // تمرير التحقق للأب
  useImperativeHandle(ref, () => ({
    validateAll,
  }));

  return (
    <div className="flex justify-center bg-white w-full">
      <form className="w-[343px] flex flex-col gap-3 font-[Cairo]">
        {/* رقم الهاتف */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="05xxxxxxxxx"
            value={data.phoneNumber || ""}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C]
              focus:outline-none focus:ring-2 ${
                localErrors.phoneNumber
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
          />
          {localErrors.phoneNumber && (
            <p className="text-red-500 text-[11px] mt-1">
              {localErrors.phoneNumber}
            </p>
          )}
        </div>

        {/* الإيميل */}
        <div>
          <label className="block text-[14px] font-[700] mb-1.5 text-black">
            البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={data.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C]
              focus:outline-none focus:ring-2 ${
                localErrors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
          />
          {localErrors.email && (
            <p className="text-red-500 text-[11px] mt-1">{localErrors.email}</p>
          )}
        </div>

        {/* العنوان */}
        <div>
          <label className="block text-[14px] font-[700] mb-1.5 text-black">
            العنوان
          </label>
          <input
            type="text"
            placeholder="أدخل العنوان"
            value={data.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            className={`w-full p-2.5 border rounded-xl text-[12px] placeholder-[#7E818C]
              focus:outline-none focus:ring-2 `}
          />
        </div>
      </form>
    </div>
  );
});

export default Step2Employee;

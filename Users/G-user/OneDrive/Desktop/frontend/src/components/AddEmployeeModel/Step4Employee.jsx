import React from "react";

export default function Step4Employee({ data , onChange }) {
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
            onChange={(e) => onChange("username", e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] placeholder-[#7E818C] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
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
            onChange={(e) => onChange("password", e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] placeholder-[#7E818C] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          
        </div>

        {/* مستوى الصلاحية */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            مستوى الصلاحية<span className="text-red-500">*</span>
          </label>
          <select
            value={data.role || ""}
            onChange={(e) => onChange("role", e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-[12px] text-[#7E818C] focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">اختر مستوى الصلاحية</option>
            <option value="Admin">مدير</option>
            <option value="Coach">مدرب </option>
            <option value="accountant">محاسبة </option>
            <option value="receptionist">موظف استقبال </option>


          </select>
        </div>

        {/* ملاحظات */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5">
            ملاحظات<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="أضف ملاحظات"
            value={data.notes || ""}
            onChange={(e) => onChange("notes", e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] placeholder-[#7E818C] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

      </form>
    </div>
  );
}

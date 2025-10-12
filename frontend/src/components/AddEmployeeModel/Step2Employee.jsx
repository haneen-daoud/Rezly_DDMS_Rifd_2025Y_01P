import React from "react";

export default function Step2Employee({ data, onChange }) {
  return (
    <div className="flex justify-center bg-white w-full">
      <form className="w-[343px] flex flex-col gap-3 font-[Cairo]">
        {/* رقم الهاتف */}
        <div>
          <label className="block text-[12px] font-[700] text-black mb-1.5">
            رقم الهاتف<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="05xxxxxxxxxx"
            value={data.phoneNumber || ""}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-sm placeholder-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* الايميل */}
        <div>
          <label className="block text-[12px] font-[700] mb-1.5 text-black">
            الايميل<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={data.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-sm placeholder-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* العنوان */}
        <div>
          <label className="block text-[12px] font-[700] mb-1.5 text-black">
            العنوان<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            placeholder="أدخل العنوان"
            value={data.address || ""}
            onChange={(e) => onChange("address", e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-sm placeholder-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </form>
    </div>
  );
}

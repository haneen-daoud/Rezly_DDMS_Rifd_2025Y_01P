import React from "react";

export default function Step3Employee({ data , onChange }) {
    return (
        <div className="flex justify-center bg-white w-full">
            <form className="w-[343px] flex flex-col gap-3 font-[Cairo]">

                {/* المسمى الوظيفي */}
                <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-[700] text-black">
                        المسمى الوظيفي<span className="text-red-500">*</span>
                    </label>
                    <select
                        value={data.jobTitle || ""}
                        onChange={(e) => onChange("jobTitle", e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[12px] text-[#7E818C] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                        <option value="">المسمى الوظيفي</option>
                        <option value="مطور">مطور</option>
                        <option value="مصمم">مصمم</option>
                        <option value="مدير">مدير</option>
                    </select>
                </div>

                {/* القسم */}
                <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-[700] text-black">
                        اختر القسم<span className="text-red-500">*</span>
                    </label>
                    <select
                        value={data.department || ""}
                        onChange={(e) => onChange("department", e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[12px] text-[#7E818C] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                        <option value="">اختر القسم</option>
                        <option value="HR">الموارد البشرية</option>
                        <option value="تقنية المعلومات">تقنية المعلومات</option>
                        <option value="managerr">manager </option>


                    </select>
                </div>

                {/* نوع العقد */}
                <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-[700] text-black">
                        اختر نوع العقد<span className="text-red-500">*</span>
                    </label>
                    <select
                        value={data.contractType || ""}
                        onChange={(e) => onChange("contractType", e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-2.5 py-2 text-[12px] text-[#7E818C] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                        <option value="-">نوع العقد</option>
                        <option value="دوام كامل">دوام كامل</option>
                        <option value="دوام جزئي">دوام جزئي</option>
                        <option value="مؤقت">دوام مؤقت</option>

                    </select>
                </div>

          

                        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5">
                        تاريخ بدء العمل
          </label>
          <div className="relative">
             <input
                        type="date"
                        value={data.startDate || ""}
                        onChange={(e) => onChange("startDate", e.target.value)}
                        className="w-full p-2.5 pr-10 border placeholder-[#7E818C] border-gray-300 rounded-xl text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            >
              <path
                d="M14.5 8V12.6667C14.5 13.0203 14.3595 13.3594 14.1095 13.6095C13.8594 13.8595 13.5203 14 13.1667 14H3.83333C3.47971 14 3.14057 13.8595 2.89052 13.6095C2.64048 13.3594 2.5 13.0203 2.5 12.6667V8H14.5ZM11.1667 2C11.3435 2 11.513 2.07024 11.6381 2.19526C11.7631 2.32029 11.8333 2.48986 11.8333 2.66667V3.33333H13.1667C13.5203 3.33333 13.8594 3.47381 14.1095 3.72386C14.3595 3.97391 14.5 4.31304 14.5 4.66667V6.66667H2.5V4.66667C2.5 4.31304 2.64048 3.97391 2.89052 3.72386C3.14057 3.47381 3.47971 3.33333 3.83333 3.33333H5.16667V2.66667C5.16667 2.48986 5.2369 2.32029 5.36193 2.19526C5.48695 2.07024 5.65652 2 5.83333 2C6.01014 2 6.17971 2.07024 6.30474 2.19526C6.42976 2.32029 6.5 2.48986 6.5 2.66667V3.33333H10.5V2.66667C10.5 2.48986 10.5702 2.32029 10.6953 2.19526C10.8203 2.07024 10.9899 2 11.1667 2Z"
                fill="#6A0EAD"
              />
            </svg>
          </div>
        </div>
                
            </form>
        </div>
    );
}

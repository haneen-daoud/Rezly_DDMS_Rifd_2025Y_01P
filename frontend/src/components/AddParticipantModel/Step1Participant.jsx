import React, { forwardRef, useImperativeHandle, useState } from "react";

import Select from "react-select";
import selectStyles from "../selectStyles.js";
const Step1Participant = forwardRef(({ memberData, setMemberData }, ref) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMemberData({ ...memberData, image: file });
    }
  };
  const [errors, setErrors] = useState({});

  useImperativeHandle(ref, () => ({
    setErrors,
  }));
  // داخل المكون Step1Participant
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMemberData({ ...memberData, image: file });
    }
  };

  return (
    <div className="flex justify-center bg-white w-full">
      <form className="w-[343px] flex flex-col gap-2 font-[Cairo]">
        {/* الاسم الأول والاسم الثاني */}
        <div className="flex gap-3 align-item-center">
          {/* الاسم الأول */}
          <div className="flex-1">
            <label className="block text-[14px] font-[700] text-black mb-1.5 ">
              الاسم الأول <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="أدخل الاسم الأول"
              value={memberData.firstName}
              onChange={(e) => {
                setMemberData({ ...memberData, firstName: e.target.value });
                setErrors({ ...errors, firstName: "" });
              }}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
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
              value={memberData.lastName}
              onChange={(e) => {
                setMemberData({ ...memberData, lastName: e.target.value });
                setErrors({ ...errors, lastName: "" });
              }}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* الجنس */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5 ">
            الجنس <span className="text-red-500">*</span>
          </label>
          <Select
            options={[
              { value: "ذكر", label: "ذكر" },
              { value: "أنثى", label: "أنثى" },
            ]}
            value={
              memberData.gender
                ? { value: memberData.gender, label: memberData.gender }
                : null
            }
            onChange={(opt) => {
              setMemberData({ ...memberData, gender: opt.value }),
                setErrors({ ...errors, gender: "" });
            }}
            placeholder="اختر الجنس"
            styles={selectStyles}
            isRtl={true}
          />
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        {/* رقم الهوية */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5 ">
            رقم الهوية <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="أدخل رقم الهوية"
            value={memberData.idNumber}
            onChange={(e) => {
              setMemberData({ ...memberData, idNumber: e.target.value });
              setErrors({ ...errors, idNumber: "" });
            }}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.idNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>
          )}
        </div>

        {/* تاريخ الميلاد */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5 ">
            تاريخ الميلاد <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={memberData.birthDate}
            onChange={(e) => {
              setMemberData({ ...memberData, birthDate: e.target.value });
              setErrors({ ...errors, birthDate: "" });
            }}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>
          )}
        </div>

        {/* رفع الصورة */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-1.5">
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

            <label
              htmlFor="imageUpload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-2"
              >
                <rect x="0.5" width="32" height="32" rx="8" fill="#E1CFEF" />
                <path
                  d="M13.5 20.5V14.5H9.5L16.5 7.5L23.5 14.5H19.5V20.5H13.5ZM9.5 24.5V22.5H23.5V24.5H9.5Z"
                  fill="var(--color-purple)"
                />
              </svg>

              {!memberData.image ? (
                <>
                  <p>اسحب الملف وأفلته هنا أو اختر ملفًا</p>
                  <p className="text-xs text-gray-400 mt-1">الحد الأقصى 2MB</p>
                </>
              ) : (
                <p className="text-green-600 mt-1">
                  ✔ تم اختيار الملف: {memberData.image.name}
                </p>
              )}
            </label>
          </div>
        </div>
      </form>
    </div>
  );
});

export default Step1Participant;

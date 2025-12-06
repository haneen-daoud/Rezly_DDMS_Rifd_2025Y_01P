import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect, } from "react";
import Select from "react-select";
import selectStyles from "../selectStyles.js";
import MiniCalender from "../MiniCalender/MiniCalender.jsx";
import CalenderIcon from "../../icons/calender.svg?react";

const Step1Participant = forwardRef(({ memberData, setMemberData }, ref) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMemberData({ ...memberData, image: file });
    }
  };
  const [errors, setErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);

  const calendarRef = useRef(null);

useEffect(() => {
  if (!showCalendar) return;

  const handleClickOutside = (e) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target)) {
      setShowCalendar(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showCalendar]);

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

  // تحويل تاريخ الميلاد من سترنغ لـ Date للميني كاليندر
  const birthDateObj = memberData.birthDate
    ? new Date(memberData.birthDate)
    : null;

  // تنسيق بسيط لعرض التاريخ داخل الحقل
  const formatBirthDateLabel = () => {
    if (!memberData.birthDate) return "";
    const [year, month, day] = memberData.birthDate.split("-");
    return `${day}/${month}/${year}`;
  };

  // لما نختار تاريخ من الميني كاليندر
  const handleBirthDateSelect = (date) => {
    if (!date) return;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const iso = `${year}-${month}-${day}`;

    setMemberData({ ...memberData, birthDate: iso });
    setErrors({ ...errors, birthDate: "" });
    setShowCalendar(false);
  };

  return (
    <div className="flex justify-center bg-white w-full">
      <form className="w-[343px] flex flex-col gap-2 font-[Cairo]">
        {/* الاسم الأول والاسم الثاني */}
        <div className="flex gap-4 align-item-center">
          {/* الاسم الأول */}
          <div className="flex-1">
            <label className="block text-[14px] font-[700] text-black mb-2 ">
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
              className="w-full h-[42px] p-3 border border-gray-300 rounded-[8px] text-[12px] placeholder-gray-500 focus:border-[var(--color-purple)] focus:outline-none"
            />
            {errors.firstName && (
              <p className="text-red-500 text-[11px]  ">{errors.firstName}</p>
            )}
          </div>

          {/* الاسم الثاني */}
          <div className="flex-1">
            <label className="block text-[14px] font-[700] text-black mb-2 ">
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
              className="w-full h-[42px] p-3 border border-gray-300 rounded-[8px] text-[12px] placeholder-gray-500 focus:border-[var(--color-purple)] focus:outline-none"
            />

            {errors.lastName && (
              <p className="text-red-500 text-[11px]  ">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* الجنس */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-2 ">
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
            <p className="text-red-500 text-[11px]  ">{errors.gender}</p>
          )}
        </div>

        {/* رقم الهوية */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-2 ">
            رقم الهوية <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="أدخل رقم الهوية"
            value={memberData.idNumber}
            maxLength={9}
            onChange={(e) => {
              setMemberData({ ...memberData, idNumber: e.target.value });
              setErrors({ ...errors, idNumber: "" });
            }}
            className="w-full h-[42px] p-3 border border-gray-300 rounded-[8px] text-[12px] placeholder-gray-500 focus:border-[var(--color-purple)] focus:outline-none"
          />
          {errors.idNumber && (
            <p className="text-red-500 text-[11px]  ">{errors.idNumber}</p>
          )}
        </div>

        {/* تاريخ الميلاد + MiniCalender */}
        <div className="relative" ref={calendarRef}>
          <label className="block text-[14px] font-[700] text-black mb-2 ">
            تاريخ الميلاد <span className="text-red-500">*</span>
          </label>

          {/* هذا الكونتينر هو اللي رح يكون relative عشان الميني كاليندر يطلع فوق الحقل مباشرة */}
          <div className="relative">
            {/* الحقل نفسه (div clickable) مع أيقونة الكاليندر وبجانبه التاريخ */}
            <button
              type="button"
              onClick={() => setShowCalendar((prev) => !prev)}
              className={`w-full h-[42px] flex items-center gap-2 border rounded-[8px] p-3 text-[12px] text-right
        ${
          errors.birthDate ? "border-red-500" : "border-gray-300"
        } bg-white cursor-pointer
        ${
          showCalendar
            ? "focus:border-[var(--color-purple)] focus:outline-none"
            : "focus:outline-none focus:ring-2 focus:ring-[var(--color-purple)]"
        }
      `}
            >
              <CalenderIcon className="w-4 h-4 shrink-0 text-[var(--color-purple)]" />

              <span
                className={
                  memberData.birthDate ? "text-gray-900" : "text-[#7E818C]"
                }
              >
                {memberData.birthDate
                  ? formatBirthDateLabel()
                  : "اختر تاريخ الميلاد"}
              </span>
            </button>

            {/* الميني كاليندر يطلع فوق الحقل مباشرة بفضل variant=employeeTop و parent relative */}
            {showCalendar && (
              <MiniCalender
                currentDate={birthDateObj || new Date()}
                handleDateChange={handleBirthDateSelect}
                variant="employeeTop"
              />
            )}
          </div>

          {errors.birthDate && (
            <p className="text-red-500 text-[11px]  ">{errors.birthDate}</p>
          )}
        </div>

        {/* رفع الصورة */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-2">
            صورة الملف الشخصي
          </label>

          <div className="border-2 border-dashed border-[var(--color-purple)] rounded-[8px] p-5 text-center text-gray-500 text-[12px] cursor-pointer hover:border-purple-400 transition">
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
                  <p className="text-[11px] text-gray-400  ">الحد الأقصى 2MB</p>
                </>
              ) : (
                <p className="text-green-600  ">
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

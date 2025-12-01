import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";
import { step3Schema } from "../employeeValidation.js";
import Select from "react-select";
import selectStyles from "../selectStyles.js";
import CalenderIcon from "../../icons/calender.svg?react";
import MiniCalender from "../MiniCalender/MiniCalender.jsx";

const Step3Employee = forwardRef(({ data, onChange }, ref) => {
  const [localErrors, setLocalErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);

  const calendarRef = useRef(null);

useEffect(() => {
  if (!showStartCalendar) return;

  const handleClickOutside = (e) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target)) {
      setShowStartCalendar(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showStartCalendar]);

  // تغيير البيانات
  const handleChange = (field, value) => {
    onChange(field, value);
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
        <div className="flex flex-col">
          <label className="text-[14px] font-[700] text-black  mb-2">
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
            <p className="text-red-500 text-[11px] mt-1">
              {localErrors.jobTitle}
            </p>
          )}
        </div>

        {/* القسم */}
        <div className="flex flex-col">
          <label className="text-[14px] font-[700] text-black  mb-2">
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
            <p className="text-red-500 text-[11px] mt-1">
              {localErrors.department}
            </p>
          )}
        </div>

        {/* نوع العقد */}
        <div className="flex flex-col">
          <label className="text-[14px] font-[700] text-black mb-2">
            نوع العقد<span className="text-red-500">*</span>
          </label>
          <Select
            options={contractTypeOptions}
            value={contractTypeOptions.find(
              (o) => o.value === data.contractType
            )}
            onChange={(opt) => handleChange("contractType", opt.value)}
            placeholder="نوع العقد"
            styles={selectStyles}
            isRtl={true}
          />
          {showErrors && localErrors.contractType && (
            <p className="text-red-500 text-[11px] mt-1">
              {localErrors.contractType}
            </p>
          )}
        </div>

        <div className="relative" ref={calendarRef}>
          <div className="flex flex-col">
            <label className="block text-[14px] font-[700] text-black mb-2">
              تاريخ بدء العمل<span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                type="text"
                readOnly
                value={data.startDate || ""}
                onClick={() => setShowStartCalendar((prev) => !prev)}
                placeholder="اختر تاريخ بدء العمل"
                className="w-full h-[42px] p-3 border border-gray-300 rounded-[8px] text-[12px] placeholder-[#7E818C]
        focus:outline-none focus:border-[var(--color-purple)] cursor-pointer pr-9"
              />

              <CalenderIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-purple)] pointer-events-none" />

              {showStartCalendar && (
                <MiniCalender
                  currentDate={
                    data.startDate ? new Date(data.startDate) : new Date()
                  }
                  variant="employeeTop"
                  handleDateChange={(date) => {
                    const iso = date.toISOString().split("T")[0];
                    handleChange("startDate", iso);
                    setShowStartCalendar(false);
                  }}
                />
              )}
            </div>

            {/* خطأ التحقق خارج الـ relative */}
            {showErrors && localErrors.startDate && (
              <p className="text-red-500 text-[11px]">
                {localErrors.startDate}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
});

export default Step3Employee;

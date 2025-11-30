import React, { useEffect, useRef } from "react";
import Select from "react-select";
import selectStyles from "../selectStyles";

export default function EmployeeFilter({ isOpen, onClose, filterData = {}, setFilterData }) {
  const ref = useRef(null);

  // إغلاق الفلتر عند الضغط خارج العنصر
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  if (!isOpen) return null;

  // خيارات القوائم
  const jobTitleOptions = [
    { value: "مطور", label: "مطور" },
    { value: "مصمم", label: "مصمم" },
    { value: "مدير", label: "مدير" },
  ];

  const departmentOptions = [
    { value: "HR", label: "الموارد البشرية" },
    { value: "Administration", label: "الإدارة" },
    { value: "IT", label: "تقنية المعلومات" },
  ];

  const contractTypeOptions = [
    { value: "كامل", label: "دوام كامل" },
    { value: "جزئي", label: "دوام جزئي" },
    { value: "مؤقت", label: "دوام مؤقت" },
  ];

  const permissionLevelOptions = [
    { value: "عادي", label: "عادي" },
    { value: "متوسط", label: "متوسط" },
    { value: "متقدم", label: "متقدم" },
  ];

  const cityOptions = [
    { value: "رام الله", label: "رام الله" },
    { value: "نابلس", label: "نابلس" },
    { value: "الخليل", label: "الخليل" },
  ];

  const handleChange = (field, value) => {
    setFilterData({ ...filterData, [field]: value });
  };

  return (
    <div
      ref={ref}
      className="absolute top-7 right-[-10px] w-80 bg-white rounded-xl shadow-xl p-4 z-50 border border-gray-200"
    >
      <div className="filterHeader flex justify-between items-center mb-3">
        <h2 className="text-center text-[16px] text-black font-bold">الفلاتر</h2>
        <button
          className="text-red-500 font-bold text-sm"
          onClick={() => setFilterData({})} // إعادة التعيين لمسح القيم
        >
          إعادة التعيين
        </button>
      </div>

      {/* المسمى الوظيفي */}
      <label className="block mb-1 text-[14px] font-[700] text-black">المسمى الوظيفي</label>
      <Select
        options={jobTitleOptions}
value={jobTitleOptions.find((o) => o.value === filterData?.jobTitle) || null}
        onChange={(opt) => handleChange("jobTitle", opt.value)}
        placeholder="اختر المسمى الوظيفي"
        styles={selectStyles}
        isRtl={true}
      />

      {/* القسم */}
      <label className="block mb-1 mt-3 text-[14px] font-[700] text-black">القسم</label>
      <Select
        options={departmentOptions}
        value={departmentOptions.find((o) => o.value === filterData.department) || null}
        onChange={(opt) => handleChange("department", opt.value)}
        placeholder="اختر القسم"
        styles={selectStyles}
        isRtl={true}
      />

      {/* نوع العقد */}
      <label className="block mb-1 mt-3 text-[14px] font-[700] text-black">نوع العقد</label>
      <Select
        options={contractTypeOptions}
        value={contractTypeOptions.find((o) => o.value === filterData.contractType) || null}
        onChange={(opt) => handleChange("contractType", opt.value)}
        placeholder="اختر نوع العقد"
        styles={selectStyles}
        isRtl={true}
      />

      {/* مستوى الصلاحية */}
      <label className="block mb-1 mt-3 text-[14px] font-[700] text-black">مستوى الصلاحية</label>
      <Select
        options={permissionLevelOptions}
        value={permissionLevelOptions.find((o) => o.value === filterData.permissionLevel) || null}
        onChange={(opt) => handleChange("permissionLevel", opt.value)}
        placeholder="اختر مستوى الصلاحية"
        styles={selectStyles}
        isRtl={true}
      />

      {/* المدينة */}
      <label className="block mb-1 mt-3 text-[14px] font-[700] text-black">المدينة</label>
      <Select
        options={cityOptions}
        value={cityOptions.find((o) => o.value === filterData.city) || null}
        onChange={(opt) => handleChange("city", opt.value)}
        placeholder="اختر المدينة"
        styles={selectStyles}
        isRtl={true}
      />

      <button
        className="w-full mt-4 flex items-center justify-center gap-[8px] bg-[var(--color-purple)] text-white h-[36px] px-3 rounded-lg text-sm font-semibold font-Cairo transition"
        onClick={() => console.log("تطبيق الفلتر", filterData)}
      >
        تطبيق الفلتر
      </button>
    </div>
  );
}

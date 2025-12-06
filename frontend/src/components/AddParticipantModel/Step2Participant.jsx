import React, { forwardRef, useImperativeHandle, useState } from "react";
import Select from "react-select";
import selectStyles from "../selectStyles.js";
const Step2Participant = forwardRef(({ memberData, setMemberData }, ref) => {
  const [errors, setErrors] = useState({});

  useImperativeHandle(ref, () => ({
    setErrors: (newErrors) => setErrors(newErrors),
  }));
  // المدن الفلسطينية + مدن الداخل
  const allCities = [
    "رام الله",
    "الخليل",
    "نابلس",
    "بيت لحم",
    "جنين",
    "قلقيلية",
    "طولكرم",
    "أريحا",
    "يافا",
    "حيفا",
    "الناصرة",
    "عكا",
    "طبريا",
    "صفد",
    "كفر قاسم",
    "قلنسوة",
    "طمرة",
    "باقة الغربية",
    "أم الفحم",
    "شفاعمرو",
  ];

  // المدن الرئيسية التي تريد أن تظهر أولاً
  const mainCities = ["رام الله", "الخليل", "نابلس", "بيت لحم", "جنين"];

  // إنشاء خيارات للقائمة
  const cityOptions = [
    ...mainCities.map((city) => ({ value: city, label: city })),
    ...allCities
      .filter((city) => !mainCities.includes(city))
      .map((city) => ({ value: city, label: city })),
  ];
  // دالة التحديث + مسح الخطأ مباشرة
  const handleChange = (field, value) => {
    setMemberData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  console.log(memberData);
  return (
    <div className="flex justify-center bg-white w-full">
      <form className="w-[343px] flex flex-col gap-3 font-[Cairo]">
        {/*  رقم الهاتف */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-2">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="05xxxxxxxx"
            value={memberData.phone || ""} // نعرض القيمة من الـ state
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full h-[42px] p-3 border border-gray-300 rounded-[8px] text-sm 
                                   placeholder-[color:var(--grey,#7E818C)] focus:border-[var(--color-purple)] focus:outline-none"
          />
          {errors.phone && (
            <p className="text-red-500 text-[11px]">{errors.phone}</p>
          )}
        </div>

        {/*الإيميل */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-2">
            الإيميل <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={memberData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full h-[42px] p-3 border border-gray-300 rounded-[8px] text-sm 
                                   placeholder-[color:var(--grey,#7E818C)] focus:border-[var(--color-purple)] focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-[11px]">{errors.email}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-[14px] font-[700] text-black mb-2">
            المدينة <span className="text-red-500">*</span>
          </label>
          <Select
            options={cityOptions}
            value={cityOptions.find((o) => o.value === memberData.city)}
            onChange={(opt) => handleChange("city", opt.value)}
            placeholder="اختر المدينة"
            styles={selectStyles}
            isRtl={true}
            isSearchable={true} // تفعيل البحث
            classNamePrefix="rz"
          />
          {errors.city && (
            <p className="text-red-500 text-[11px]">{errors.city}</p>
          )}
        </div>

        {/* العنوان */}
        <div>
          <label className="block text-[14px] font-[700] text-black mb-2">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="أدخل العنوان"
            value={memberData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full h-[42px] p-3 border border-gray-300 rounded-[8px] text-sm 
                                   placeholder-[color:var(--grey,#7E818C)] focus:border-[var(--color-purple)] focus:outline-none"
          />
          {errors.address && (
            <p className="text-red-500 text-[11px]">{errors.address}</p>
          )}
        </div>
      </form>
    </div>
  );
});

export default Step2Participant;

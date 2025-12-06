import React, { useEffect, useState, useRef } from "react";
import { getAllCoaches } from "../../api";
import Select from "react-select";
import selectStyles from "../selectStyles";
import CalendarIcon from "../../icons/calender.svg?react";
import MiniCalender from "../../components/MiniCalender/MiniCalender.jsx";

// ستايلات خاصة بفلتر الموظفين: نفس selectStyles + ضبط طول المنيو
const filterSelectStyles = {
  ...selectStyles,
  menuList: (base) => ({
    ...base,
    maxHeight: 160, // الارتفاع الأقصى للمنيو (مثلاً 160px)
    overflowY: "auto", // لو أطول من هيك، يطلع سكرول
  }),
};

export default function SubscribersFilter({
  isOpen,
  onClose,
  anchorRect,
  onApply,
  filters = {},
}) {
  const filterRef = useRef(null);

  // مدة الاشتراك → رح نبعثها كـ packageName
  const [subscriptionDuration, setSubscriptionDuration] = useState([]);

  // باقي الفلاتر
  const [startDate, setStartDate] = useState(null); // Date | null
  const [endDate, setEndDate] = useState(null); // Date | null
  const [city, setCity] = useState("");
  const [coachId, setCoachId] = useState("");
  const [coaches, setCoaches] = useState([]);

  // إظهار / إخفاء الميني كاليندر
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  if (!isOpen || !anchorRect) return null;

  // نخلي الكرت ما يطلع عن الشاشة ويعمل سكرول داخلي لو طال
  const panelStyle = {
    position: "fixed",
    top: anchorRect.bottom,
    left: anchorRect.right - 320,
    width: 320,
    zIndex: 9999,
    maxHeight: "80vh", // أقصى ارتفاع من الشاشة
  };

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // مزامنة قيم الفلترة مع اللي مخزنينها في البيرنت
  useEffect(() => {
    if (!isOpen) return;

    setSubscriptionDuration(filters.packageName || "");

    // بنفترض إن البيرنت بيخزن التاريخ كـ "YYYY-MM-DD"
    setStartDate(filters.startDate ? new Date(filters.startDate) : null);
    setEndDate(filters.endDate ? new Date(filters.endDate) : null);

    setCity(filters.city || "");
    setCoachId(filters.coachId || "");
  }, [isOpen, filters]);

  // إغلاق عند الضغط خارج العنصر
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // جلب قائمة المدربين من الباك مرة واحدة
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const data = await getAllCoaches(); // بيرجع res.data.employees || []
        setCoaches(data || []);
      } catch (err) {
        console.error("❌ خطأ أثناء جلب المدربين في SubscribersFilter:", err);
      }
    };

    fetchCoaches();
  }, []);

  // خيارات المدن
  const cityOptions = [
    { value: "رام الله", label: "رام الله" },
    { value: "نابلس", label: "نابلس" },
    { value: "الخليل", label: "الخليل" },
    { value: "بيت لحم", label: "بيت لحم" },
    { value: "جنين", label: "جنين" },
    { value: "قلقيلية", label: "قلقيلية" },
    { value: "طولكرم", label: "طولكرم" },
    { value: "أريحا", label: "أريحا" },
    { value: "حيفا", label: "حيفا" },
    { value: "يافا", label: "يافا" },
    { value: "الناصرة", label: "الناصرة" },
    { value: "عكا", label: "عكا" },
    { value: "طبريا", label: "طبريا" },
    { value: "صفد", label: "صفد" },
    { value: "كفر قاسم", label: "كفر قاسم" },
    { value: "قلنسوة", label: "قلنسوة" },
    { value: "طمرة", label: "طمرة" },
    { value: "باقة الغربية", label: "باقة الغربية" },
    { value: "أم الفحم", label: "أم الفحم" },
    { value: "شفا عمرو", label: "شفا عمرو" },
  ];

  // خيارات المدربين
  const coachOptions = [
    ...coaches.map((coach) => ({
      value: coach._id,
      label: `${coach.firstName} ${coach.lastName}`,
    })),
  ];

  // تجهيز الفلاتر وإرسالها للبِيرنت
  const handleApply = () => {
    const appliedFilters = {};

    if (subscriptionDuration.length) {
      appliedFilters.packageName = subscriptionDuration;
    }

    if (startDate) {
      // نخزنها كـ "YYYY-MM-DD" زي ما كان ييجي من input[type=date]
      appliedFilters.startDate = startDate.toISOString().split("T")[0];
    }

    if (endDate) {
      appliedFilters.endDate = endDate.toISOString().split("T")[0];
    }

    if (city) appliedFilters.city = city;
    if (coachId) appliedFilters.coachId = coachId;

    if (onApply) {
      onApply(appliedFilters);
    }
  };

  const handleReset = () => {
    setSubscriptionDuration([]);
    setStartDate(null);
    setEndDate(null);
    setCity("");
    setCoachId("");
    setShowStartCalendar(false);
    setShowEndCalendar(false);
  };

  return (
    <>
      {/* خلفية شفافة بس لاستقبال الكليك برا */}
      <div className="fixed inset-0 z-[998]" onClick={onClose} />

      <div
        ref={filterRef}
        style={panelStyle}
        className="
          bg-white
          rounded-[8px]
          p-4
          flex flex-col
          border border-[#E5E7EB]
          text-[#000000]
          shadow-[0_4px_16px_rgba(0,0,0,0.12)]
          custom-scrollbar
        "
      >
        {/* الهيدر */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[16px] font-bold">الفلاتر</h2>
          <button
            className="text-red-500 text-sm font-semibold cursor-pointer"
            type="button"
            onClick={handleReset}
          >
            إعادة التعيين
          </button>
        </div>

        {/* المحتوى القابل للسكرول */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {/* مدة الاشتراك */}
          <label className="text-[14px] font-bold mb-1 block">
            مدة الاشتراك
          </label>

          <div className="flex items-center gap-2 mb-3">
            {["يومي", "شهري", "أسبوعي", "سنوي"].map((option) => {
              const isSelected = subscriptionDuration.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      // لو موجود، شيل
                      setSubscriptionDuration((prev) =>
                        prev.filter((item) => item !== option)
                      );
                    } else {
                      // لو مش موجود، ضيف
                      setSubscriptionDuration((prev) => [...prev, option]);
                    }
                  }}
                  className={`
        px-3 py-1 rounded-full text-[12px] font-semibold border cursor-pointer
        ${
          isSelected
            ? "border-[var(--color-purple)] text-[var(--color-purple)] bg-[#F5F0FF]"
            : "border-[#1D1E20] text-[#1D1E20] bg-white"
        }
      `}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* تاريخ بدء الاشتراك */}
          <div className="flex flex-col h-[63px] relative mb-3">
            <label className="text-[14px] font-bold mb-1 block">
              تاريخ بدء الاشتراك
            </label>

            <div
              onClick={() => {
                setShowStartCalendar((prev) => !prev);
                setShowEndCalendar(false);
              }}
              className="
              w-full
              h-[42px]
              flex items-center
              border border-[#E5E7EB]
              rounded-[8px]
              px-2
              bg-white
              cursor-pointer
            "
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[var(--color-purple)]" />
                <span
                  className={`font-Cairo text-[12px] ${
                    startDate ? "text-[#1D1E20]" : "text-[#7E818C]"
                  }`}
                >
                  {startDate
                    ? formatDate(startDate)
                    : "اختر تاريخ بدء الاشتراك"}
                </span>
              </div>
            </div>

            {showStartCalendar && (
              <MiniCalender
                currentDate={startDate || new Date()}
                handleDateChange={(date) => {
                  if (date) setStartDate(date);
                  setShowStartCalendar(false);
                }}
                variant="filter"
              />
            )}
          </div>

          {/* تاريخ نهاية الاشتراك */}
          <div className="flex flex-col h-[63px] relative mb-3">
            <label className="text-[14px] font-bold mb-1 block">
              تاريخ نهاية الاشتراك
            </label>

            <div
              onClick={() => {
                setShowEndCalendar((prev) => !prev);
                setShowStartCalendar(false);
              }}
              className="
              w-full
              h-[42px]
              flex items-center
              border border-[#E5E7EB]
              rounded-[8px]
              px-2
              bg-white
              cursor-pointer
            "
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[var(--color-purple)]" />
                <span
                  className={`font-Cairo text-[12px] ${
                    endDate ? "text-[#1D1E20]" : "text-[#7E818C]"
                  }`}
                >
                  {endDate ? formatDate(endDate) : "اختر تاريخ نهاية الاشتراك"}
                </span>
              </div>
            </div>

            {showEndCalendar && (
              <MiniCalender
                currentDate={endDate || new Date()}
                handleDateChange={(date) => {
                  if (date) setEndDate(date);
                  setShowEndCalendar(false);
                }}
                variant="filter"
              />
            )}
          </div>

          {/* المدينة - React Select */}
          <label className="text-[14px] font-bold mb-1 block">المدينة</label>
          <Select
            styles={filterSelectStyles}
            menuPlacement="top"
            classNamePrefix="rz"
            className="mb-3"
            placeholder="اختر المدينة"
            options={cityOptions}
            value={cityOptions.find((option) => option.value === city)}
            onChange={(selected) => {
              setCity(selected ? selected.value : "");
            }}
          />

          {/* المدرب المسؤول - React Select */}
          <label className="text-[14px] font-bold mb-1 block">
            المدرب المسؤول
          </label>
          <Select
            styles={filterSelectStyles}
            menuPlacement="auto"
            classNamePrefix="rz"
            className="mb-3"
            placeholder="اختر المدرب"
            options={coachOptions}
            value={coachOptions.find((option) => option.value === coachId)}
            onChange={(selected) => {
              setCoachId(selected ? selected.value : "");
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleApply}
          className="w-full bg-[var(--color-purple)] text-white h-[40px] rounded-lg font-semibold text-sm mt-2 cursor-pointer"
        >
          تطبيق الفلتر
        </button>
      </div>
    </>
  );
}

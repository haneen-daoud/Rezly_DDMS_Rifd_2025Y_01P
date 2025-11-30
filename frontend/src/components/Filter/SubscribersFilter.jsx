import React, { useEffect, useRef } from "react";

export default function SubscribersFilter({ isOpen, onClose, anchorRect }) {
  const filterRef = useRef(null);

  // لو مش مفتوح أو ما وصلنا مكان الزر، ما نرندر اشي
  if (!isOpen || !anchorRect) return null;

  // نخلي الكرت يطلع تحت الزر، وبدايته من جهة يمين الزر
  const panelStyle = {
    position: "fixed",
    top: anchorRect.bottom,         // تحت الزر بـ 8px
    left: anchorRect.right - 320,       // 320 = عرض الكرت، هيك يمينه = يمين الزر
    width: 320,
    zIndex: 9999,
  };

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
        "
      >
        {/* الهيدر */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[16px] font-bold">الفلاتر</h2>
          <button className="text-red-500 text-sm font-semibold">
            إعادة التعيين
          </button>
        </div>

        {/* مدة الاشتراك */}
        <label className="text-[14px] font-bold mb-1 block">
          مدة الاشتراك
        </label>
        <div className="flex items-center gap-2 mb-3">
          <button className="border border-[#7E818C] text-[#7E818C] text-[12px] px-3 py-1 rounded-full">
            يومي
          </button>
          <button className="border border-[#7E818C] text-[#7E818C] text-[12px] px-3 py-1 rounded-full">
            شهري
          </button>
          <button className="border border-[var(--color-purple)] text-white text-[12px] px-3 py-1 rounded-full bg-[var(--color-purple)]">
            أسبوعي
          </button>
          <button className="border border-[#7E818C] text-[#7E818C] text-[12px] px-3 py-1 rounded-full">
            سنوي
          </button>
        </div>

        {/* تاريخ البدء */}
        <label className="text-[14px] font-bold mb-1 block">
          تاريخ بدء الاشتراك
        </label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-md h-[40px] px-2 mb-3"
        />

        {/* تاريخ الانتهاء */}
        <label className="text-[14px] font-bold mb-1 block">
          تاريخ نهاية الاشتراك
        </label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-md h-[40px] px-2 mb-3"
        />

        {/* المدينة */}
        <label className="text-[14px] font-bold mb-1 block">المدينة</label>
        <select className="w-full border border-gray-300 rounded-md h-[40px] px-2 mb-3">
          <option>اختر المدينة</option>
          <option>رام الله</option>
          <option>نابلس</option>
          <option>الخليل</option>
        </select>

        {/* المدرب المسؤول */}
        <label className="text-[14px] font-bold mb-1 block">
          المدرب المسؤول
        </label>
        <select className="w-full border border-gray-300 rounded-md h-[40px] px-2 mb-3">
          <option>اختر المدرب</option>
          <option>أحمد</option>
          <option>سارة</option>
          <option>جواد</option>
        </select>

        <button className="w-full bg-[var(--color-purple)] text-white h-[40px] rounded-lg font-semibold text-sm mt-2">
          تطبيق الفلتر
        </button>
      </div>
    </>
  );
}

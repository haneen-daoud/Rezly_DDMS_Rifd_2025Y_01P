import React from "react";
import { PlusIcon } from "@heroicons/react/24/solid"; // أيقونة للـ add
import MembersIcon from "../icons/addpeople.svg?react";
import BookingIcon from "../icons/booking.svg?react";

export default function SubTopbar({ onAddMemberClick, onAddBookingClick }) {
  const today = new Date();

  const weekdays = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const dayName = weekdays[today.getDay()];

  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const formattedDate = `${dayName} ${day}-${month}-${year}`;

  return (
    <div className="w-full flex flex-wrap justify-between items-center rounded-lg px-5 pt-4 gap-2">
      {/* أقصى اليمين: التاريخ */}
      <div className="text-right font-cairo text-gray-700 text-sm flex-shrink-0">
        {formattedDate}
      </div>

      {/* أقصى اليسار: الأزرار */}
      <div className="flex flex-wrap items-center gap-3 justify-start w-full sm:w-auto">
        <button
          onClick={onAddBookingClick}
          className="
            flex items-center justify-center gap-[8px]
            bg-[var(--color-purple)] text-white 
            w-full sm:w-[144px] h-[40px] sm:h-[32px]
            rounded-lg transition
            text-sm font-semibold font-Cairo
          "
        >
          <BookingIcon className="w-4 h-4" />
          <span>إضافة حجز</span>
        </button>

        <button
          onClick={onAddMemberClick}
          className="
            flex items-center justify-center gap-[8px]
            bg-[var(--color-purple)] text-white 
            w-full sm:w-[144px] h-[40px] sm:h-[32px]
            rounded-lg transition
            text-sm font-semibold font-Cairo
          "
        >
          <MembersIcon className="w-4 h-4" />
          <span>إضافة مشترك</span>
        </button>

        <button className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition w-full sm:w-auto justify-center">
          <PlusIcon className="w-4 h-4" />
          <span>تسجيل دفعة</span>
        </button>
      </div>
    </div>
  );
}
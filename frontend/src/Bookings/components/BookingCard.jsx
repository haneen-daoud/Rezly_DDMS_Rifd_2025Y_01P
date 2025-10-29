import React, { useState } from "react";
import CalenderIcon from "../../icons/calender.svg?react";
import HourIcon from "../../icons/hour.svg?react";
import MembersIcon from "../../icons/members.svg?react";
import ShareIcon from "../../icons/share.svg?react";
import DeleteIcon from "../../icons/delete.svg?react";
import EditIcon from "../../icons/address.svg?react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { deleteBookingAPI } from "../../api/bookingsApi";
import { toast } from "react-toastify";
import ReactDOM from "react-dom";

export default function BookingCard({
  bookingGroup = [],
  onEdit,
  onDeleteSingle,
  onDeleteGroup,
  onShare,
  formatToArabicTime,
  getEndDateBySubscription,
  index,
  openMenu,
  setOpenMenu,
  onChange,
}) {
  if (!bookingGroup.length) return null;

  // أول حجز كممثل للجروب
  const booking = bookingGroup[0];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ==========================
      معالجة البيانات من الباك الجديد
  =========================== */
  const schedules = booking.schedules || [];
  const firstSchedule = schedules[0] || {};

  // 🗓️ التاريخ
  const startDate = booking.startDate
    ? new Date(booking.startDate)
    : firstSchedule.date
    ? new Date(firstSchedule.date)
    : null;

  // 🕓 الوقت
  const timeStart = firstSchedule.timeStart || "غير محدد";
  const timeEnd = firstSchedule.timeEnd || "";

  // 🗓️ الأيام (dayOfWeek)
  const dayNames = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const repeatDays =
    schedules.length > 0
      ? Array.from(
          new Set(
            schedules
              .map((s) => dayNames[s.dayOfWeek] || "")
              .filter((d) => d !== "")
          )
        )
      : [];

  // 🗓️ حساب فترة التاريخ بناءً على مدة الاشتراك
  let dateRange = "غير محدد";
  if (startDate && booking.subscriptionDuration) {
    const endDate = new Date(startDate);
    const subMap = {
      "1day": 1,
      "1week": 7,
      "2weeks": 14,
      "3weeks": 21,
      "1month": 30,
      "3months": 90,
      "6months": 180,
      "1year": 365,
    };
    const addDays = subMap[booking.subscriptionDuration] || 7;
    endDate.setDate(startDate.getDate() + addDays);

    dateRange = `${startDate.getDate()} ${startDate.toLocaleString("ar-EG", {
      month: "long",
    })} - ${endDate.getDate()} ${endDate.toLocaleString("ar-EG", {
      month: "long",
    })}`;
  }

  /* ==========================
      الحالة (status)
  =========================== */
  let statusText = "متاح";
  let statusColor = "bg-green-100 text-green-700";
  if (["cancelled", "ملغي"].includes(booking.status)) {
    statusText = "ملغي";
    statusColor = "bg-red-100 text-red-700";
  } else if (["completed", "منتهي"].includes(booking.status)) {
    statusText = "منتهي";
    statusColor = "bg-gray-100 text-gray-700";
  } else if (booking.membersCount >= booking.maxMembers) {
    statusText = "ممتلئ";
    statusColor = "bg-blue-100 text-blue-700";
  }

  console.log("✅ booking:", booking);

  return (
    <div className="w-full max-w-[370px] rounded-[16px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] p-4 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)] relative z-0">

      {/* 🔹 صورة المدرب */}
      {booking.coach?.image && (
        <img
          src={booking.coach.image}
          alt={booking.coach.name}
          className="absolute top-3 left-3 w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
        />
      )}

      {/* العنوان والمدرب */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-black">
            حجز {booking.service || "غير محدد"}
          </h3>
          <div className="w-6 h-6"></div>
        </div>
        <p className="text-sm text-gray-600">
          {booking.coach?.name || "لا يوجد مدرب"}
        </p>
      </div>

      {/* الأيام والتاريخ */}
      <div className="flex items-center justify-between text-sm text-gray-700 mt-3">
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-800">
          <CalenderIcon className="w-6 h-6 text-[var(--color-purple)]" />
          <span>{dateRange}</span>
        </div>

        <div className="flex gap-2">
          {repeatDays.slice(0, 3).map((d, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: "#6A0EAD1A",
                color: "var(--color-purple)",
              }}
            >
              {d}
            </span>
          ))}
          {repeatDays.length > 3 && (
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: "#6A0EAD1A",
                color: "var(--color-purple)",
              }}
            >
              +{repeatDays.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* الوقت */}
      <div className="flex items-center gap-2 mt-2 text-sm text-gray-800">
        <HourIcon className="w-6 h-6 text-[var(--color-purple)]" />
        <span>
          {timeStart} - {timeEnd}
        </span>
      </div>

      {/* عدد المشتركين + الصور + الحالة */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <MembersIcon className="w-6 h-6 text-[var(--color-purple)]" />
          {/* العدد */}
          <span className="text-sm font-semibold text-gray-700">
            {booking.membersCount}/{booking.maxMembers || firstSchedule.maxMembers || 0}

          </span>

          {/* صور المشتركين */}
          <div className="flex -space-x-2">
            {(booking.members || []).slice(0, 3).map((m, i) => (
              <div key={i} className="relative group">
                <img
                  src={m.image || "/default-user.jpg"}
                  alt={m.name || "مشترك"}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover cursor-pointer"
                />
                {m.name && (
                  <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] bg-black text-white px-2 py-[2px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {m.name}
                  </span>
                )}
              </div>
            ))}
            {booking.members?.length > 3 && (
              <span className="text-xs text-gray-500 ml-1">
                +{booking.members.length - 3}
              </span>
            )}
          </div>
        </div>

        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColor}`}
        >
          {statusText}
        </span>
      </div>

      {/* الأزرار */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <button className="flex-1 bg-[#F4F4F4] text-[#000] text-sm font-semibold py-2 rounded-[12px] hover:bg-gray-200 transition">
          عرض التفاصيل
        </button>

        <button
          onClick={() =>
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => toast.info("تم نسخ رابط الحجز 📋"))
          }
          className="w-10 h-10 flex items-center justify-center bg-[#F4F4F4] rounded-[12px] hover:bg-gray-200 transition"
        >
          <ShareIcon className="w-5 h-5 text-[#000]" />
        </button>

        {/* النقاط الثلاث */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === index ? null : index)}
            className="w-10 h-10 flex items-center justify-center bg-[#F4F4F4] rounded-[12px] hover:bg-gray-200 transition"
          >
            <span className="text-xl leading-none text-[#000]">⋯</span>
          </button>

          {openMenu === index && (
            <div className="absolute bg-white rounded-lg flex flex-col z-20 shadow-md border border-[#7E818C66] p-2 left-[-100px] top-[calc(100%+12px)] w-[174px]">
              <button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("openBookingEdit", {
                      detail: {
                        ...booking,
                        groupBookings: bookingGroup,
                      },
                    })
                  );
                  setOpenMenu(null);
                }}
                className="flex items-center gap-2 text-right text-[14px] font-semibold hover:text-blue-600 mb-2"
              >
                <EditIcon className="w-4 h-4" />
                تعديل الحجز
              </button>

              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  setOpenMenu(null);
                }}
                className="flex items-center gap-2 text-right text-[14px] font-semibold text-red-500 hover:text-red-700"
              >
                <DeleteIcon className="w-4 h-4" />
                حذف الحجز
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ مودال الحذف */}
      {showDeleteModal &&
  ReactDOM.createPortal(
    <ConfirmDeleteModal
      event={booking}
      isLoading={deleting}
      onCancel={() => setShowDeleteModal(false)}
      onConfirm={async () => {
        try {
          setDeleting(true);
          await deleteBookingAPI(booking._id);
          toast.success("تم حذف الحجز ✅");
          setShowDeleteModal(false);
          onChange?.();
        } catch (err) {
          console.error(err);
          toast.error("حدث خطأ أثناء الحذف");
        } finally {
          setDeleting(false);
        }
      }}
    />,
    document.body
  )}

    </div>
  );
}

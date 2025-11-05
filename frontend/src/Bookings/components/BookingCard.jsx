import React, { useState } from "react";
import { useBookings } from "../BookingsContext";
import CalenderIcon from "../../icons/calender.svg?react";
import HourIcon from "../../icons/hour.svg?react";
import MembersIcon from "../../icons/members.svg?react";
import ShareIcon from "../../icons/share.svg?react";
import DeleteIcon from "../../icons/delete.svg?react";
import EditIcon from "../../icons/address.svg?react";
import DetailsIcon from "../../icons/circle-arrow-left.svg?react";

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
  const { role } = useBookings();
  const isAdmin = (role || "").toLowerCase() === "admin";

  // 🔹 أول حجز كممثل للجروب (للتفاصيل العامة)
  const booking = bookingGroup[0];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  /* ==========================
      استخراج أقرب موعد قادم
  =========================== */
  const allSchedules = bookingGroup.flatMap((b) =>
    (b.schedules || []).map((s) => ({
      parentId: b._id,
      service: b.service,
      coach: s.coach || b.coach,
      location: s.location || b.location,
      maxMembers: s.maxMembers || b.maxMembers,
      members: s.members || b.members || [],
      membersCount: s.members?.length || b.membersCount || 0,
      timeStart: s.timeStart,
      timeEnd: s.timeEnd,
      date: s.date ? new Date(s.date) : null,
    }))
  );

  const today = new Date();
  const upcomingSchedule =
    allSchedules
      .filter((s) => s.date && s.date >= today)
      .sort((a, b) => a.date - b.date)[0] ||
    allSchedules.sort((a, b) => b.date - a.date)[0]; // fallback لأقرب مضى

  const upcomingDateLabel = upcomingSchedule?.date
    ? upcomingSchedule.date.toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
      })
    : "غير محدد";

  // 🟣 استخراج اسم المدرب الصحيح
  let coachName = "مدرب غير معروف";
  if (upcomingSchedule?.coach) {
    if (typeof upcomingSchedule.coach === "object") {
      coachName =
        upcomingSchedule.coach.name ||
        `${upcomingSchedule.coach.firstName || ""} ${
          upcomingSchedule.coach.lastName || ""
        }`.trim() ||
        "مدرب غير معروف";
    } else if (typeof upcomingSchedule.coach === "string") {
      // 🟢 نحاول نجيب الاسم من الحجز الأصلي لو المدرب جاي كـ ID
      const foundCoach = booking.coachList?.find?.(
        (c) =>
          c.id === upcomingSchedule.coach || c._id === upcomingSchedule.coach
      );
      coachName =
        foundCoach?.name ||
        `${foundCoach?.firstName || ""} ${foundCoach?.lastName || ""}`.trim() ||
        booking.coach?.name ||
        "مدرب غير معروف";
    }
  }

  const timeStart = upcomingSchedule?.timeStart || "غير محدد";
  const timeEnd = upcomingSchedule?.timeEnd || "";
  const membersCount = upcomingSchedule?.membersCount || 0;
  const maxMembers = upcomingSchedule?.maxMembers || 0;
  const membersList = upcomingSchedule?.members || [];

  /* ==========================
      بيانات الحجز الكامل
  =========================== */
  const schedules = booking.schedules || [];
  const firstSchedule = schedules[0] || {};

  const startDate = booking.startDate
    ? new Date(booking.startDate)
    : firstSchedule.date
    ? new Date(firstSchedule.date)
    : null;

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
  } else if (membersCount >= maxMembers && maxMembers !== 0) {
    statusText = "ممتلئ";
    statusColor = "bg-blue-100 text-blue-700";
  }

  console.log("✅ booking:", booking);

  return (
    <div className="w-full max-w-[370px] rounded-[16px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] p-4 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)] relative z-0">
      {/* 🟣 الموعد القادم */}
      <div className="absolute top-0 left-0 bg-[var(--color-purple)] text-white text-[14px] px-4 py-1 rounded-tl-[16px] font-semibold min-w-[160px] text-center">
        الموعد القادم {upcomingDateLabel}
      </div>

      {/* العنوان والمدرب */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-black">
            حجز {booking.service || "غير محدد"}
          </h3>
          <div className="w-6 h-6"></div>
        </div>
        <p className="text-sm text-gray-600">{coachName}</p>
      </div>

      {/* الأيام والتاريخ */}
      <div className="flex items-center justify-between text-sm text-gray-700 mt-3">
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-800">
          <CalenderIcon className="w-6 h-6 text-[var(--color-purple)]" />
          <span>{dateRange}</span>
        </div>

        <div className="flex gap-2">
          {repeatDays.slice(0, 2).map((d, i) => (
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
          <span className="text-sm font-semibold text-gray-700">
            {membersCount}/{maxMembers}
          </span>

          <div className="flex -space-x-2">
            {membersList.slice(0, 3).map((m, i) => (
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
            {membersList.length > 3 && (
              <span className="text-xs text-gray-500 ml-1">
                +{membersList.length - 3}
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
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#F4F4F4] text-[#000] text-sm font-semibold py-2 rounded-[12px] hover:bg-gray-200 transition">
          <span>عرض التفاصيل</span>
          <DetailsIcon className="w-4 h-4 text-[var(--color-purple)]" />
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

        <div className="relative">
          <button
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMenuPosition({
                top: rect.bottom + 12,
                left: rect.left - 100,
              });
              setOpenMenu(openMenu === index ? null : index);
            }}
            className="w-10 h-10 flex items-center justify-center bg-[#F4F4F4] rounded-[12px] hover:bg-gray-200 transition"
          >
            <span className="text-xl leading-none text-[#000]">⋯</span>
          </button>

          {openMenu === index && (
            <div className="absolute bg-white rounded-lg flex flex-col z-[9999] shadow-lg border border-[#7E818C66] p-2 left-[-100px] top-[calc(100%+12px)] w-[174px]">
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

              {isAdmin && (
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
              )}
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

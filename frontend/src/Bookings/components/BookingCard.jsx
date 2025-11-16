import React, { useState } from "react";
import { useRef, useLayoutEffect } from "react";
import { useBookings } from "../BookingsContext";
import CalenderIcon from "../../icons/calender.svg?react";
import HourIcon from "../../icons/hour.svg?react";
import MembersIcon from "../../icons/members.svg?react";
import ShareIcon from "../../icons/share.svg?react";
import DeleteIcon from "../../icons/deleteIcon.svg?react";
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
  const { setBookings } = useBookings();
  const { role } = useBookings();
  const isAdmin = (role || "").toLowerCase() === "admin";

  const booking = bookingGroup[0];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // ========================
  // استخراج البيانات المجمعة
  // ========================
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

  // ========================
  // المواعيد حسب التاريخ + الوقت
  // ========================

  // 🟣 دالة مساعدة لتحويل string الوقت لـ ساعات + دقائق
  function parseTime(timeStr) {
    if (!timeStr) return null;

    const match = timeStr.match(/^(\d{1,2}):(\d{2})(?:\s*([صمAPMapm]+))?$/);
    if (!match) return null;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const suffix = match[3]?.trim();

    // دعم ص/م و am/pm
    if (suffix) {
      if (["م", "pm", "PM"].includes(suffix) && hours < 12) {
        hours += 12;
      } else if (["ص", "am", "AM"].includes(suffix) && hours === 12) {
        hours = 0;
      }
    }

    return { hours, minutes };
  }

  // 🟣 نبني تاريخ/وقت البداية أو النهاية
  function buildDateTime(dateObj, timeStr, type = "start") {
    if (!dateObj) return null;

    const d = new Date(dateObj);
    const parsed = parseTime(timeStr);

    if (parsed) {
      d.setHours(parsed.hours, parsed.minutes, 0, 0);
    } else {
      // لو ما في وقت: البداية = أول اليوم، النهاية = آخر اليوم
      if (type === "start") {
        d.setHours(0, 0, 0, 0);
      } else {
        d.setHours(23, 59, 0, 0);
      }
    }

    return d;
  }

  // 🟣 تنسيق التاريخ بدون وقت (نفس ستايلك القديم)
  function formatDateLabel(date) {
    if (!date) return "غير محدد";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      ...(d.getFullYear() !== new Date().getFullYear()
        ? { year: "numeric" }
        : {}),
    });
  }

  const now = new Date();

  // نبني start/end لكل جلسة
  const schedulesWithTimes = allSchedules
    .filter((s) => s.date)
    .map((s) => {
      const startDateTime = buildDateTime(s.date, s.timeStart, "start");
      const endDateTime = buildDateTime(
        s.date,
        s.timeEnd || s.timeStart,
        "end"
      );

      return {
        ...s,
        startDateTime,
        endDateTime,
      };
    })
    .filter((s) => s.startDateTime && s.endDateTime);

  // المواعيد اللي لسه ما خلص وقتها
  const futureSchedules = schedulesWithTimes.filter(
    (s) => s.endDateTime > now
  );

  // أقرب موعد قادم
  const nextSchedule =
    futureSchedules.length > 0
      ? [...futureSchedules].sort(
          (a, b) => a.startDateTime - b.startDateTime
        )[0]
      : null;

  // آخر جلسة في الجدول (حسب وقت النهاية)
  const lastSchedule =
    schedulesWithTimes.length > 0
      ? [...schedulesWithTimes].sort(
          (a, b) => b.endDateTime - a.endDateTime
        )[0]
      : null;

  // هذا اللي بنستخدمه لعرض المدرب + الوقت + عدد المشتركين
  const upcomingSchedule = nextSchedule || lastSchedule;

  // التاريخ لعرضه بدون وقت
  const upcomingDateLabel = nextSchedule
    ? formatDateLabel(nextSchedule.startDateTime || nextSchedule.date)
    : "غير محدد";

  const endedDateLabel =
    !nextSchedule && lastSchedule
      ? formatDateLabel(lastSchedule.endDateTime || lastSchedule.date)
      : "";

  // نص الشريط البنفسجي فوق
  let headerText = "لا يوجد مواعيد قادمة";
  if (nextSchedule) {
    headerText = `الموعد القادم ${upcomingDateLabel}`;
  } else if (
    !nextSchedule &&
    lastSchedule?.endDateTime &&
    lastSchedule.endDateTime < now
  ) {
    headerText = `انتهى بتاريخ ${endedDateLabel}`;
  }

  // ========================
  // المدرب
  // ========================
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

  // ========================
  // التاريخ والمدّة
  // ========================
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

  // ========================
  // الحالة
  // ========================
  let statusText = "متاح";
  let statusColor = "bg-green-100 text-green-700";

  // لو الحجز ملغي
  if (["cancelled", "ملغي"].includes(booking.status)) {
    statusText = "ملغي";
    statusColor = "bg-red-100 text-red-700";
  }
  // لو كل المواعيد انتهت (ما في nextSchedule)
  else if (
    !nextSchedule &&
    lastSchedule?.endDateTime &&
    lastSchedule.endDateTime < now
  ) {
    statusText = "منتهي";
    statusColor = "bg-gray-200 text-gray-700";
  }
  // لو الحجز ممتلئ
  else if (membersCount >= maxMembers && maxMembers !== 0) {
    statusText = "ممتلئ";
    statusColor = "bg-blue-100 text-blue-700";
  }

  // 🔹 مرجع للزر لتحديد موقعه
  const menuButtonRef = useRef(null);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });

  // 🔹 تحديث موقع المنيو كل ما يتغير الحجم أو السكروول
  useLayoutEffect(() => {
    function updateMenuPosition() {
      if (openMenu === index && menuButtonRef.current) {
        const rect = menuButtonRef.current.getBoundingClientRect();
        const menuWidth = 131;
        const menuHeight = 82;
        const margin = 8;

        const scrollTop =
          window.scrollY ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;
        const scrollLeft =
          window.scrollX ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft ||
          0;

        let top = rect.bottom + scrollTop + margin;
        let left = rect.left + scrollLeft - 90;

        if (rect.bottom + menuHeight + margin > window.innerHeight) {
          top = rect.top + scrollTop - menuHeight - margin;
        }

        if (rect.left + menuWidth > window.innerWidth) {
          left = window.innerWidth - menuWidth - margin;
        }
        if (rect.left < 0) {
          left = margin;
        }

        setMenuCoords({ top, left });
      }
    }

    updateMenuPosition();

    window.addEventListener("scroll", updateMenuPosition, true);
    window.addEventListener("resize", updateMenuPosition);

    function handleClickOutside(e) {
      const menuEl = document.getElementById(`menu-${index}`);
      const btnEl = menuButtonRef.current;
      if (!btnEl || !menuEl) return;
      if (btnEl.contains(e.target)) return;
      if (!menuEl.contains(e.target)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", updateMenuPosition, true);
      window.removeEventListener("resize", updateMenuPosition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu, index]);

  // ========================
  // عرض الكرت
  // ========================
  return (
    <div
      className="
      w-full rounded-[16px] bg-white 
      shadow-[0_2px_6px_rgba(0,0,0,0.15)] 
      p-3 md:p-4 flex flex-col justify-between 
      transition-transform duration-300 
      hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)] 
      relative z-0
    "
    >
      {/* 🟣 الشريط العلوي (الموعد القادم / منتهي) */}
      <div
        className="
          absolute top-0 left-0 
          bg-[var(--color-purple)] text-white 
          text-[13px] md:text-[14px] font-semibold 
          px-3 md:px-4 py-[3px] md:py-[4px]
          rounded-tl-[16px]
          text-center min-w-[138px] md:min-w-[149px]
        "
      >
        {headerText}
      </div>

      {/* العنوان والمدرب */}
      <div className="mt-[20px] md:mt-[22px]">
        <div className="flex items-center justify-between mb-[2px] md:mb-[4px]">
          <h3 className="font-bold text-[16px] md:text-[18px] text-black leading-[1.3]">
            حجز {booking.service || "غير محدد"}
          </h3>
        </div>
        <p className="text-[13px] md:text-[14px] text-gray-600 leading-[1.2]">
          {coachName}
        </p>
      </div>

      {/* الأيام والتاريخ */}
      <div className="flex items-center justify-between text-gray-700 mt-3 text-[13px] md:text-[14px]">
        <div className="flex items-center gap-2">
          <CalenderIcon className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-purple)]" />
          <span>{dateRange}</span>
        </div>

        <div className="flex gap-1 md:gap-2">
          {repeatDays.slice(0, 3).map((d, i) => (
            <span
              key={i}
              className="
                rounded-full text-xs md:text-[13px] font-semibold 
                flex items-center justify-center 
                px-2 md:px-3 py-[2px]
              "
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
              className="
                rounded-full text-xs md:text-[13px] font-semibold 
                flex items-center justify-center 
                px-2 md:px-3 py-[2px]
              "
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
      <div className="flex items-center gap-2 mt-2 text-[13px] md:text-[14px] text-gray-800">
        <HourIcon className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-purple)]" />
        <span>
          {timeStart} - {timeEnd}
        </span>
      </div>

      {/* عدد المشتركين + الصور + الحالة */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <MembersIcon className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-purple)]" />
          <span className="text-[13px] md:text-[14px] font-semibold text-gray-700">
            {membersCount}/{maxMembers}
          </span>

          <div className="flex -space-x-2">
            {membersList.slice(0, 3).map((m, i) => (
              <div key={i} className="relative group">
                <img
                  src={m.image || "/default-user.jpg"}
                  alt={m.name || "مشترك"}
                  className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-white object-cover cursor-pointer"
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
          className={`
            text-[12.5px] md:text-[13.5px] font-semibold 
            flex items-center justify-center
            rounded-full 
            px-[12px] md:px-[14px] py-[3px] md:py-[4px]
            ${statusColor}
          `}
          style={{
            minHeight: "22px",
            maxHeight: "24px",
            minWidth: "77px",
          }}
        >
          {statusText}
        </span>
      </div>

      {/* الأزرار */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#F4F4F4] text-[#000] text-[13px] md:text-[14px] font-semibold py-2 rounded-[12px] hover:bg-gray-200 transition">
          <span>عرض التفاصيل</span>
          <DetailsIcon className="w-4 h-4 text-[var(--color-purple)]" />
        </button>

        <button
          onClick={() =>
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => toast.info("تم نسخ رابط الحجز 📋"))
          }
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-[#F4F4F4] rounded-[12px] hover:bg-gray-200 transition"
        >
          <ShareIcon className="w-5 h-5 text-[#000]" />
        </button>

        <div className="relative">
          <button
            ref={menuButtonRef}
            onClick={() =>
              setOpenMenu(openMenu === index ? null : index)
            }
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-[#F4F4F4] rounded-[12px] hover:bg-gray-200 transition"
          >
            <span className="text-xl leading-none text-[#000]">⋯</span>
          </button>

          {openMenu === index &&
            ReactDOM.createPortal(
              (() => {
                if (!menuButtonRef.current) return null;

                const rect =
                  menuButtonRef.current.getBoundingClientRect();
                const menuWidth = 131;
                const menuHeight = 82;
                const margin = 8;

                let top = rect.bottom + margin - 10;
                let left = rect.right - menuWidth;

                if (
                  rect.bottom + menuHeight + margin >
                  window.innerHeight
                ) {
                  top = rect.top - menuHeight - margin + 10;
                }

                if (left < 0) left = 8;
                if (left + menuWidth > window.innerWidth)
                  left = window.innerWidth - menuWidth - 8;

                return (
                  <div
                    id={`menu-${index}`}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="fixed bg-white border border-[#D1D5DB] rounded-[16px]
                     shadow-[0_4px_8px_rgba(0,0,0,0.25)]
                     flex flex-col justify-center pointer-events-auto z-[999999]"
                    style={{
                      top: `${top}px`,
                      left: `${left}px`,
                      width: `${menuWidth}px`,
                      height: `${menuHeight}px`,
                      padding: "8px",
                      transition:
                        "opacity 0.15s ease, transform 0.15s ease",
                      transformOrigin:
                        rect.bottom + menuHeight + margin >
                        window.innerHeight
                          ? "bottom right"
                          : "top right",
                    }}
                  >
                    {/* تعديل */}
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
                      className="flex items-center pr-1 gap-2 text-[12px] font-bold text-black hover:text-[var(--color-purple)] transition-colors"
                    >
                      <EditIcon className="w-4 h-4 text-[var(--color-purple)]" />
                      تعديل
                    </button>

                    <div className="my-[6px] mx-[6px] border-t border-[#D1D5DB]" />

                    {/* حذف */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setOpenMenu(null);
                        }}
                        className="flex items-center pr-1 gap-2 text-[12px] font-bold text-black hover:text-red-600 transition-colors"
                      >
                        <DeleteIcon className="w-4 h-4" />
                        حذف
                      </button>
                    )}
                  </div>
                );
              })(),
              document.body
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

                setBookings((prev) =>
                  prev.filter((b) => b._id !== booking._id)
                );

                toast.success("تم حذف الحجز ✅");
                setShowDeleteModal(false);
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

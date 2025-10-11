import React, { useState, useEffect } from "react";
import AddBookingModal from "../AddBookingModal/AddBookingModal";
import ConfirmDeleteModal from "../Calender/ConfirmDeleteModal";

import CalenderIcon from "../../icons/calender.svg?react";
import DeleteIcon from "../../icons/delete.svg?react";
import EditIcon from "../../icons/address.svg?react";
import ShareIcon from "../../icons/share.svg?react";
import HourIcon from "../../icons/hour.svg?react";
import MembersIcon from "../../icons/members.svg?react";

import { getAllBookingsAPI, deleteBookingAPI } from "../../api/bookingsApi";
import { getAllCoachesAPI } from "../../api/coachesApi";

const parseArabicTimeTo24 = (t) => {
  if (!t || typeof t !== "string") return "08:00";
  const parts = t.trim().split(" ");
  const hhmm = parts[0];
  const ampm = (parts[1] || "").trim();
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10) || 8;
  const m = parseInt(mStr || "0", 10) || 0;
  if (ampm === "م" && h !== 12) h += 12;
  if (ampm === "ص" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const computeOccurrences = (subscriptionDuration, repeatDays) => {
  if (!repeatDays || repeatDays.length === 0) return 1;
  let weeks = 1;
  if (subscriptionDuration.includes("أسبوع"))
    weeks = parseInt(subscriptionDuration) || 1;
  else if (subscriptionDuration.includes("شهر"))
    weeks = (parseInt(subscriptionDuration) || 1) * 4;
  else if (subscriptionDuration.includes("سنة"))
    weeks = (parseInt(subscriptionDuration) || 1) * 52;
  return weeks * repeatDays.length;
};

const mapBookingForCard = (b, coachesMap) => {
  const repeatDays = Array.isArray(b.recurrence) ? b.recurrence : [];
  const subscriptionDuration = Array.isArray(b.subscriptionDuration)
    ? b.subscriptionDuration[0]
    : b.subscriptionDuration || "أسبوع";

  const dateStr = b.date
    ? b.date.split("T")[0]
    : new Date().toISOString().split("T")[0];

  const parseArabicTimeTo24 = (t) => {
    if (!t || typeof t !== "string") return "08:00";
    const parts = t.trim().split(" ");
    const hhmm = parts[0];
    const ampm = (parts[1] || "").trim();
    let [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
    if (ampm === "م" && h !== 12) h += 12;
    if (ampm === "ص" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const start24 =
    b.timeStart?.includes("ص") || b.timeStart?.includes("م")
      ? parseArabicTimeTo24(b.timeStart)
      : b.timeStart?.slice(0, 5) || "08:00";

  const end24 =
    b.timeEnd?.includes("ص") || b.timeEnd?.includes("م")
      ? parseArabicTimeTo24(b.timeEnd)
      : b.timeEnd?.slice(0, 5) || "09:00";

  const dayMap = {
    Sun: "الأحد",
    Mon: "الإثنين",
    Tue: "الثلاثاء",
    Wed: "الأربعاء",
    Thu: "الخميس",
    Fri: "الجمعة",
    Sat: "السبت",
  };
  const repeatDaysArabic = repeatDays.map((day) => dayMap[day] || day);

  let subscriptionDurationArabic = b.subscriptionDuration || "أسبوع";
  if (typeof subscriptionDurationArabic === "string") {
    subscriptionDurationArabic = subscriptionDurationArabic
      .replace("1week", "أسبوع واحد")
      .replace("2weeks", "أسبوعين")
      .replace("3weeks", "3 أسابيع")
      .replace("1month", "شهر واحد")
      .replace("3months", "3 أشهر")
      .replace("6months", "6 أشهر")
      .replace("1year", "سنة واحدة");
  }

  let coachObj = { id: null, name: "لا يوجد مدرب" };
  if (b.coach && typeof b.coach === "object" && b.coach.name) {
    coachObj = { id: b.coach._id || null, name: b.coach.name };
  } else if (b.coach && typeof b.coach === "string" && coachesMap[b.coach]) {
    coachObj = { id: b.coach, name: coachesMap[b.coach] };
  } else if (b.coachId && coachesMap[b.coachId]) {
    coachObj = { id: b.coachId, name: coachesMap[b.coachId] };
  }

  return {
    ...b,
    title: b.service || b.title || "غير محدد",
    description: b.description || "لا يوجد وصف",
    coach: coachObj,
    room: b.location || "لم يتم تحديد القاعة",
    maxMembers: b.maxMembers || 0,
    start: `${dateStr}T${start24}:00`,
    end: `${dateStr}T${end24}:00`,
    repeatDays: repeatDaysArabic,
    subscriptionDuration: subscriptionDurationArabic,
    reminder:
      Array.isArray(b.reminders) && b.reminders.length
        ? String(b.reminders[0])
        : "0",
    occurrences: computeOccurrences(subscriptionDuration, repeatDays),
  };
};

// حساب تاريخ النهاية حسب مدة الاشتراك
const getEndDateBySubscription = (start, subscriptionDuration) => {
  const endDate = new Date(start);

  if (!subscriptionDuration) return endDate;

  let daysToAdd = 7;

  if (typeof subscriptionDuration === "string") {
    const str = subscriptionDuration.toLowerCase();
    if (str.includes("أسبوع") || str.includes("week")) {
      const match = str.match(/\d+/);
      daysToAdd = match ? parseInt(match) * 7 : 7;
    } else if (str.includes("شهر") || str.includes("month")) {
      const match = str.match(/\d+/);
      daysToAdd = match ? parseInt(match) * 30 : 30;
    } else if (str.includes("سنة") || str.includes("year")) {
      const match = str.match(/\d+/);
      daysToAdd = match ? parseInt(match) * 365 : 365;
    }
  }

  endDate.setDate(endDate.getDate() + daysToAdd - 1);
  return endDate;
};

const BookingsTab = ({ bookings, setBookings }) => {
  const headerColors = ["#FBEDD3", "#E1CFEF", "#D0EFDD", "#D2E6F8"];
  const iconColors = ["#EBA522", "#6A0EAD", "#16B157", "#495AFF"];

  const [openMenu, setOpenMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [coachesMap, setCoachesMap] = useState({});
  const [deleteMode, setDeleteMode] = useState("group");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        //  جلب المدربين من الـ API
        const response = await getAllCoachesAPI();
        console.log("✅ Coaches API response:", response);

        const coaches = response.employees || [];
        console.log("✅ Coaches array:", coaches);

        const map = {};
        coaches.forEach((c) => {
          map[c._id] = `${c.firstName} ${c.lastName}`;
        });
        console.log("✅ CoachesMap:", map);

        // جلب الحجوزات
        const data = await getAllBookingsAPI();
        console.log("✅ Raw bookings from API:", data);

        const bookingMap = new Map();
        data.forEach((b) => {
          const groupKey = b.groupId || b._id;
          if (!bookingMap.has(groupKey)) {
            bookingMap.set(groupKey, {
              ...b,
              groupId: groupKey,
              allBookings: [b],
              recurrence: [...(b.recurrence || [])],
            });
          } else {
            const existing = bookingMap.get(groupKey);
            existing.allBookings.push(b);
            existing.recurrence = Array.from(
              new Set([...existing.recurrence, ...(b.recurrence || [])])
            );
            bookingMap.set(groupKey, existing);
          }
        });

        const uniqueBookings = Array.from(bookingMap.values())
          .map((b) => {
            const mapped = mapBookingForCard(b, map);
            console.log(`🔹 Booking mapped for card (ID: ${b._id}):`, mapped);
            return {
              ...mapped,
              id: b.groupId || b._id,
            };
          })
          .sort((a, b) => new Date(a.start) - new Date(b.start));

        setBookings(uniqueBookings);
        setCoachesMap(map);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  const handleAddBooking = (updatedBooking) => {
    const mapped = mapBookingForCard(
      {
        ...updatedBooking,
        reminders: updatedBooking.reminders.map((r) => r.replace("m", "")),
      },
      coachesMap
    );

    setBookings((prev) => [...prev, mapped]);
    setShowAddModal(false);
    setEditMode(false);
    setEditingIndex(null);
  };

  const handleDeleteBooking = async (id, mode = "single") => {
    try {
      if (mode === "group") {
        await deleteBookingAPI(id, true);
        setBookings(bookings.filter((b) => b.groupId !== id));
      } else {
        await deleteBookingAPI(id);
        setBookings(bookings.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "حدث خطأ أثناء حذف الحجز");
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6 justify-items-center mb-4">
        {bookings.map((booking, idx) => {
          const iconColor = iconColors[idx % iconColors.length];

          const startDate = new Date(booking.start);
          const endDate = getEndDateBySubscription(
            startDate,
            booking.subscriptionDurationOriginal || booking.subscriptionDuration
          );

          const dateRange = `${startDate.getDate()} ${startDate.toLocaleString(
            "ar-EG",
            { month: "long" }
          )} - ${endDate.getDate()} ${endDate.toLocaleString("ar-EG", {
            month: "long",
          })}`;

          return (
            <div
              key={booking.id || idx}
              className="w-[368px] h-[280px] rounded-[16px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] p-4 flex flex-col justify-between"
            >
              {/* العنوان والمدربة */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-black">
                    حجز {booking.title}
                  </h3>
                  {/* مكان الأيقونة */}
                  <div className="w-6 h-6"></div>
                </div>
                <p className="text-sm text-gray-600">
                  {booking.coach?.name || "لا يوجد مدرب"}
                </p>
              </div>

              {/* الأيام والتاريخ */}
              <div className="flex items-center justify-between text-sm text-gray-700 mt-3">
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-800">
                  <div className="w-5 h-5">
                    <CalenderIcon className="w-6 h-6 text-[var(--color-purple)]" />
                  </div>
                  <span>{dateRange}</span>
                </div>
                <div className="flex gap-2">
                  {(booking.repeatDays || []).slice(0, 3).map((d, i) => (
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
                  {booking.repeatDays && booking.repeatDays.length > 3 && (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: "#6A0EAD1A",
                        color: "var(--color-purple)",
                      }}
                    >
                      +{booking.repeatDays.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* الوقت */}
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-800">
                <div className="w-5 h-5">
                  <HourIcon className="w-6 h-6 text-[var(--color-purple)]" />
                </div>
                <span>
                  {booking.timeStart} - {booking.timeEnd}
                </span>
              </div>

              {/* عدد المشتركين + الحالة */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5">
                    <MembersIcon className="w-6 h-6 text-[var(--color-purple)]" />
                  </div>

                  {/* العدد */}
                  <span className="text-sm font-semibold text-gray-700">
                    {booking.maxMembers}/{booking.membersCount}
                  </span>

                  {/* صور المشتركين (افتراضي 3 + عدد الباقي) */}
                  <div className="flex items-center">
                    {(booking.members || []).slice(0, 3).map((m, i) => (
                      <img
                        key={i}
                        src={m?.avatar || "/placeholder.png"}
                        alt="member"
                        className="w-6 h-6 rounded-full border -mr-1"
                      />
                    ))}
                    {booking.members && booking.members.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        +{booking.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* الحالة */}
                {(() => {
                  let statusText = "متاح";
                  let statusColor = "bg-green-100 text-green-700";

                  if (
                    booking.status === "cancelled" ||
                    booking.status === "ملغي"
                  ) {
                    statusText = "ملغي";
                    statusColor = "bg-red-100 text-red-700";
                  } else if (
                    booking.status === "completed" ||
                    booking.status === "منتهي"
                  ) {
                    statusText = "منتهي";
                    statusColor = "bg-gray-100 text-gray-700";
                  } else if (booking.membersCount >= booking.maxMembers) {
                    statusText = "ممتلئ";
                    statusColor = "bg-blue-100 text-blue-700";
                  }

                  return (
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColor}`}
                    >
                      {statusText}
                    </span>
                  );
                })()}
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                {/* زر عرض التفاصيل */}
                <button className="flex-1 bg-[#F4F4F4] text-[#000] text-sm font-semibold py-2 rounded-[12px] hover:bg-gray-200 transition">
                  عرض التفاصيل
                </button>

                {/* زر المشاركة */}
                <button className="w-10 h-10 flex items-center justify-center bg-[#F4F4F4] rounded-[12px] hover:bg-gray-200 transition">
                  <ShareIcon className="w-5 h-5 text-[#000]" />
                </button>

                {/* زر النقاط مع المينيو */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                    className="w-10 h-10 flex items-center justify-center bg-[#F4F4F4] rounded-[12px] hover:bg-gray-200 transition"
                  >
                    <span className="text-xl leading-none text-[#000]">⋯</span>
                  </button>

                  {openMenu === idx && (
                    <div
                      className="absolute bg-white rounded-lg flex flex-col z-20 shadow-md"
                      style={{
                        width: "174px",
                        borderRadius: "8px",
                        top: "calc(100% + 12px)",
                        left: "-100px",
                        border: "1px solid #7E818C66",
                        padding: "8px 16px",
                      }}
                    >
                      {/* حذف هذا الحجز فقط */}
                      <button
                        onClick={() => {
                          setDeleteMode("single");
                          setBookingToDelete(booking);
                          setShowDeleteConfirm(true);
                          setOpenMenu(null);
                        }}
                        className="flex items-center justify-start gap-2 text-right font-[Cairo] text-[14px] font-semibold text-[#000] hover:text-red-600"
                        style={{
                          height: "32px",
                          lineHeight: "150%",
                          marginBottom: "12px",
                        }}
                      >
                        <DeleteIcon
                          className="w-4 h-4"
                          style={{ color: "#000" }}
                        />
                        حذف هذا الحجز فقط
                      </button>

                      {/* حذف جميع التكرارات */}
                      <button
                        onClick={() => {
                          setDeleteMode("group");
                          setBookingToDelete(booking);
                          setShowDeleteConfirm(true);
                          setOpenMenu(null);
                        }}
                        className="flex items-center justify-start gap-2 text-right font-[Cairo] text-[14px] font-semibold text-[#000] hover:text-red-600"
                        style={{
                          height: "32px",
                          lineHeight: "150%",
                          marginBottom: "12px",
                        }}
                      >
                        <DeleteIcon
                          className="w-4 h-4"
                          style={{ color: "#000" }}
                        />
                        حذف جميع التكرارات
                      </button>

                      {/* تعديل */}
                      <button
                        onClick={() => {
                          setEditingIndex(idx);
                          setEditMode(true);
                          setShowAddModal(true);
                          setOpenMenu(null);
                        }}
                        className="flex items-center justify-start gap-2 text-right font-[Cairo] text-[14px] font-semibold text-[#000] hover:text-blue-600"
                        style={{
                          height: "32px",
                          lineHeight: "150%",
                          marginBottom: "12px",
                        }}
                      >
                        <EditIcon
                          className="w-4 h-4"
                          style={{ color: "#000" }}
                        />
                        تعديل
                      </button>

                      {/* مشاركة */}
                      <button
                        className="flex items-center justify-start gap-2 text-right font-[Cairo] text-[14px] font-semibold text-[#000] hover:text-blue-600"
                        style={{ height: "32px", lineHeight: "150%" }}
                      >
                        <ShareIcon
                          className="w-4 h-4"
                          style={{ color: "#000" }}
                        />
                        مشاركة
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <AddBookingModal
          onClose={() => {
            setShowAddModal(false);
            setEditMode(false);
            setEditingIndex(null);
          }}
          onSave={handleAddBooking}
          initialData={editMode ? bookings[editingIndex] : null}
          editMode={editMode}
        />
      )}

      {showDeleteConfirm && bookingToDelete && (
        <ConfirmDeleteModal
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            handleDeleteBooking(
              deleteMode === "group"
                ? bookingToDelete.groupId
                : bookingToDelete.id,
              deleteMode
            );
            setShowDeleteConfirm(false);
          }}
          event={bookingToDelete}
        />
      )}
    </div>
  );
};

export default BookingsTab;

import React, { useState, useEffect } from "react";
import AddBookingModal from "../AddBookingModal/AddBookingModal";
import ConfirmDeleteModal from "../Calender/ConfirmDeleteModal";

import CardioIcon from "../../icons/cardio.svg?react";
import YogaIcon from "../../icons/yoga.svg?react";
import MuscleIcon from "../../icons/muscle.svg?react";
import DeleteIcon from "../../icons/delete.svg?react";
import EditIcon from "../../icons/address.svg?react";
import ShareIcon from "../../icons/share.svg?react";
import NoteIcon from "../../icons/note.svg?react";
import HourIcon from "../../icons/hour.svg?react";
import LocationIcon from "../../icons/location.svg?react";
import NotificationIcon from "../../icons/notification.svg?react";
import MembersIcon from "../../icons/members.svg?react";
import TrainerIcon from "../../icons/train.svg?react";

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

  const repeatDaysArabic = (
    Array.isArray(b.recurrence) ? b.recurrence : []
  ).map((day) => dayMap[day] || day);

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

  return {
    ...b,
    title: b.service || b.title || "غير محدد",
    description: b.description || "لا يوجد وصف",
    coach: b.coachId
      ? { id: b.coachId, name: coachesMap[b.coachId] || "لا يوجد مدرب" }
      : { id: null, name: "لا يوجد مدرب" },
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

const BookingsTab = ({ bookings, setBookings }) => {
  const headerColors = ["#FBEDD3", "#E1CFEF", "#D0EFDD", "#D2E6F8"];
  const iconColors = ["#EBA522", "#6A0EAD", "#16B157", "#495AFF"];

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

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
        const coaches = await getAllCoachesAPI();
        console.log("Coaches from API:", coaches);
        const coachesMap = {};
        coaches.forEach((c) => {
          coachesMap[c._id] = `${c.firstName} ${c.lastName}`;
        });
        console.log("Coaches Map:", coachesMap);
        const data = await getAllBookingsAPI();

        const bookingMap = new Map();

        data.forEach((b) => {
          const groupKey = b.groupId || b._id;
          if (!bookingMap.has(groupKey)) {
            bookingMap.set(groupKey, {
              ...b,
              repeatDays: Array.isArray(b.recurrence) ? [...b.recurrence] : [],
              subscriptionDuration: b.subscriptionDuration || "1week",
              groupId: groupKey,
              allBookings: [b],
            });
          } else {
            const existing = bookingMap.get(groupKey);
            existing.allBookings.push(b);
            existing.repeatDays = Array.from(
              new Set([...existing.repeatDays, ...(b.recurrence || [])])
            );
            bookingMap.set(groupKey, existing);
          }
        });

        console.log("Unique Bookings raw:", Array.from(bookingMap.values()));

        console.log(
          "🔍 Booking objects before map:",
          Array.from(bookingMap.values())
        );
        Array.from(bookingMap.values()).forEach((b) => {
          b.coachId = b.coach || b.coachId;
          console.log(
            `Booking ${b._id} => coachId: ${b.coachId}, coach: ${b.coach}`
          );
        });

        const uniqueBookings = Array.from(bookingMap.values())
          .map((b) => ({
            ...mapBookingForCard(b, coachesMap),
            id: b.groupId || b._id,
          }))
          .sort((a, b) => new Date(a.start) - new Date(b.start));

        setBookings(uniqueBookings);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  const handleAddBooking = (updatedBooking) => {
    const mappedBooking = mapBookingForCard(
      {
        ...updatedBooking,
        maxMembers: updatedBooking.maxMembers,
        reminders: updatedBooking.reminders.map((r) => r.replace("m", "")),
      },
      coachesMap
    );

    if (editMode && editingIndex !== null) {
      setBookings((prev) =>
        prev.map((b, i) => (i === editingIndex ? mappedBooking : b))
      );
    } else {
      setBookings((prev) => [...prev, mappedBooking]);
    }

    setEditMode(false);
    setEditingIndex(null);
    setShowAddModal(false);
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

      console.log("✅ تم الحذف بنجاح");
    } catch (err) {
      console.error("❌ Error deleting booking:", err.response?.data || err);
      alert(err.response?.data?.message || "حدث خطأ أثناء حذف الحجز");
    }
  };

  const currentBookings = bookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const getIconByTitle = (title, color) => {
    if (!title) return null;
    const lower = title.toLowerCase();
    if (lower.includes("يوغا"))
      return <YogaIcon className="w-6 h-6" style={{ color }} />;
    if (lower.includes("كارديو"))
      return <CardioIcon className="w-6 h-6" style={{ color }} />;
    if (lower.includes("ملاكمة"))
      return <MuscleIcon className="w-6 h-6" style={{ color }} />;
    return null;
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6 justify-items-center mb-4">
        {currentBookings.map((booking, idx) => {
          const headerBg = headerColors[idx % headerColors.length];
          const iconColor = iconColors[idx % iconColors.length];
          const icon = getIconByTitle(booking.title, iconColor);

          return (
            <div
              key={booking.id || idx}
              className="rounded-[16px] bg-white shadow-[0.5px_0.5px_3px_0px_rgba(0,0,0,0.25)]"
              style={{
                width: "368px",
                height: "343px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="flex justify-between items-center px-3 py-3 rounded-t-[16px]"
                style={{
                  backgroundColor: headerBg,
                  height: "56px",
                  gap: "8px",
                }}
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="font-bold text-sm text-black">
                    حجز {booking.title}
                  </span>
                </div>
                <span
                  className="cursor-pointer text-xl relative"
                  style={{ color: iconColor }}
                  onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                >
                  ⋯
                  {openMenu === idx && (
                    <div
                      className="absolute bg-white rounded-lg flex flex-col z-20 shadow-md"
                      style={{
                        width: "174px",
                        borderRadius: "8px",
                        top: "calc(100% + 12px)",
                        left: "calc(100% - 30px)",
                        border: "1px solid #7E818C66",
                        padding: "8px 16px",
                      }}
                    >
                      <button
                        onClick={() => {
                          setDeleteMode("single");
                          handleDeleteBooking(booking.id, "single");
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

                      <button
                        onClick={() => {
                          setDeleteMode("group");
                          handleDeleteBooking(booking.groupId, "group");
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

                      <button
                        onClick={() => {
                          setEditingIndex(idx);
                          setEditMode(true);
                          setShowAddModal(true);
                          setOpenMenu(null);
                        }}
                      >
                        تعديل
                      </button>

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
                </span>
              </div>

              {/* Content */}
              <div
                className="flex flex-col px-4 py-3 gap-4"
                style={{ flex: 1, height: "256px" }}
              >
                <p className="text-black text-[12px] font-normal line-clamp-2 overflow-hidden">
                  {booking.description}
                </p>

                <div className="flex items-center justify-between text-[14px] text-black">
                  <div className="flex items-center gap-2">
                    <HourIcon
                      className="w-6 h-6"
                      style={{ color: iconColor }}
                    />
                    <span>
                      {booking.start && booking.end
                        ? `${new Date(booking.start)
                            .toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })
                            .replace("AM", "ص")
                            .replace("PM", "م")} - ${new Date(booking.end)
                            .toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })
                            .replace("AM", "ص")
                            .replace("PM", "م")}`
                        : "لم يتم تحديد الوقت"}
                    </span>
                  </div>
                  {booking.repeatDays?.length > 0 && (
                    <div className="flex flex-col items-end">
                      <div className="flex gap-1">
                        {booking.repeatDays.map((day, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold"
                            style={{ backgroundColor: headerBg, color: "#000" }}
                          >
                            {day?.slice(2, 5)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[14px] text-black">
                  <LocationIcon
                    className="w-6 h-6"
                    style={{ color: iconColor }}
                  />
                  <span>{booking.room}</span>
                </div>
                <div className="flex items-center gap-2 text-[14px] text-black">
                  <NotificationIcon
                    className="w-6 h-6"
                    style={{ color: iconColor }}
                  />
                  <span>
                    {["0", "0m"].includes(booking.reminder)
                      ? "عدم التذكير"
                      : ["30", "30m"].includes(booking.reminder)
                      ? "قبل 30 دقيقة"
                      : ["60", "60m", "1h"].includes(booking.reminder)
                      ? "قبل ساعة"
                      : ["24", "24h", "1d"].includes(booking.reminder)
                      ? "قبل يوم"
                      : "لا يوجد تذكير"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[14px] text-black">
                  <MembersIcon
                    className="w-6 h-6"
                    style={{ color: iconColor }}
                  />
                  <span>
                    {booking.maxMembers
                      ? `${booking.maxMembers} مشترك${
                          booking.maxMembers > 1 ? "ين" : ""
                        }`
                      : "غير محدد"}
                  </span>
                </div>
              </div>

              <div style={{ height: "16px" }} />
              <div
                style={{
                  width: "336px",
                  height: "0px",
                  borderTop: "1px solid #E2E8F0",
                  margin: "0 auto",
                }}
              />
              <div style={{ height: "8px" }} />
              <div
                className="flex items-center"
                style={{
                  width: "100%",
                  height: "40px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  gap: "16px",
                }}
              >
                <div className="flex items-center gap-2 text-black">
                  <TrainerIcon
                    className="w-6 h-6"
                    style={{ color: iconColor }}
                  />
                  <span className="text-[14px] font-normal">
                    {booking.coach?.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {/* Add/Edit Modal */}
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

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteBooking}
          event={bookingToDelete}
        />
      )}
    </div>
  );
};

export default BookingsTab;
--------------------------------------
import React, { useState, useEffect } from "react";
import { getAllBookingsAPI } from "../../api/bookingsApi";
import { getAllCoachesAPI } from "../../api/coachesApi";
import AddBookingModal from "../../Bookings/components/AddBookingModal/AddBookingModal";
import BookingsList from "../../components/BookingsList/BookingsList";
import CalendarView from "../../components/CalendarView/CalendarView";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // دالة الجلب والتحديث المركزي
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const coaches = await getAllCoachesAPI();
      const coachesMap = {};
      coaches.forEach((c) => {
        if (c.role === "Coach")
          coachesMap[c._id] = `${c.firstName} ${c.lastName}`.trim();
      });

      const data = await getAllBookingsAPI();
      const mapped = data.map((b) => ({
        ...b,
        coach: b.coachId
          ? {
              id: b.coachId,
              name: coachesMap[b.coachId] || "لا يوجد مدرب",
            }
          : { id: null, name: "لا يوجد مدرب" },
      }));

      setBookings(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6 flex flex-col gap-6">
      <AddBookingModal onChange={fetchBookings} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingsList
          bookings={bookings}
          onChange={fetchBookings}
          loading={loading}
        />
        <CalendarView bookings={bookings} />
      </div>
    </div>
  );
}

import React, { useState } from "react";
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

const BookingsTab = ({ bookings, setBookings }) => {
  // ألوان الهيدر للحجوزات بالترتيب 
  const headerColors = ["#FBEDD3", "#E1CFEF", "#D0EFDD", "#D2E6F8"];
  const iconColors = ["#EBA522", "#6A0EAD", "#16B157", "#495AFF"];

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6; // عدد الكاردات بكل صفحة

  const [openMenu, setOpenMenu] = useState(null); // لتتبع الكارد المفتوح
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddBooking = (updatedBooking) => {
    if (editMode) {
      setBookings((prev) =>
        prev.map((b, i) => (i === editingIndex ? updatedBooking : b))
      );
    } else {
      setBookings((prev) => [...prev, updatedBooking]);
    }
  };

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const currentBookings = bookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // اختيار الأيقونة حسب نوع الحجز
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

  const handleDeleteBooking = (index) => {
    setBookings((prev) => prev.filter((_, i) => i !== index));
    setOpenMenu(null);
  };

  const handleConfirmDelete = () => {
    setBookings((prev) => prev.filter((b) => b !== bookingToDelete));
    setShowDeleteConfirm(false);
    setBookingToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setBookingToDelete(null);
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
              key={idx}
              className="rounded-[16px] bg-white shadow-[0.5px_0.5px_3px_0px_rgba(0,0,0,0.25)]"
              style={{
                width: "368px",
                height: "343px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* الجزء العلوي المظلل (الهيدر) */}
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
                  ⋯ {/* القائمة */}
                  {openMenu === idx && (
                    <div
                      className="absolute bg-white rounded-lg flex flex-col z-20"
                      style={{
                        width: "174px",
                        height: "155px",
                        borderRadius: "8px",
                        top: "calc(100% + 12px)",
                        left: "calc(100% - 30px)",
                        border: "1px solid #7E818C66",
                        padding: "8px 16px",
                      }}
                    >
                      {/* حذف */}
                      <button
                        onClick={() => {
                          setBookingToDelete(booking);
                          setShowDeleteConfirm(true);
                          setOpenMenu(null);
                        }}
                        className="flex items-center justify-start gap-2 text-right font-[Cairo] text-[14px] font-semibold text-[#000] hover:text-red-600"
                        style={{
                          height: "32px",
                          lineHeight: "150%",
                          marginBottom: "16px",
                        }}
                      >
                        <DeleteIcon className="w-4 h-4" style={{ color: "#000" }} />
                        حذف
                      </button>

                      {/* تعديل */}
                      <button
                        onClick={() => {
                          setEditingIndex(idx);
                          setEditMode(true);
                          setShowAddModal(true);
                          setOpenMenu(null);
                        }}
                        className="flex items-center justify-start gap-2 text-right font-[Cairo] text-[14px] font-semibold text-[#000] hover:text-purple-600"
                        style={{
                          height: "32px",
                          lineHeight: "150%",
                          marginBottom: "16px",
                        }}
                      >
                        <EditIcon className="w-4 h-4" style={{ color: "#000" }} />
                        تعديل
                      </button>

                      {/* مشاركة */}
                      <button
                        className="flex items-center justify-start gap-2 text-right font-[Cairo] text-[14px] font-semibold text-[#000] hover:text-blue-600"
                        style={{
                          height: "32px",
                          lineHeight: "150%",
                        }}
                      >
                        <ShareIcon className="w-4 h-4" style={{ color: "#000" }} />
                        مشاركة
                      </button>
                    </div>
                  )}
                </span>
              </div>

              {/* محتوى الكارد */}
              <div
                className="flex flex-col px-4 py-3 gap-4"
                style={{ flex: 1, height: "256px" }}
              >
                {/* الوصف */}
                <p className="text-black text-[12px] font-normal line-clamp-2 overflow-hidden">
                  {booking.description || "لا يوجد وصف"}
                </p>

                {/* الوقت */}
                <div className="flex items-center gap-2 text-[14px] text-black">
                  <HourIcon className="w-6 h-6" style={{ color: iconColor }} />
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

                {/* المكان */}
                <div className="flex items-center gap-2 text-[14px] text-black">
                  <LocationIcon
                    className="w-6 h-6"
                    style={{ color: iconColor }}
                  />
                  <span>{booking.room || "لم يتم تحديد القاعة"}</span>
                </div>

                {/* التذكير */}
                <div className="flex items-center gap-2 text-[14px] text-black">
                  <NotificationIcon
                    className="w-6 h-6"
                    style={{ color: iconColor }}
                  />
                  <span>
                    {booking.reminder
                      ? `قبل ${booking.reminder} دقيقة`
                      : "لا يوجد تذكير"}
                  </span>
                </div>

                {/* المشتركين */}
                <div className="flex items-center gap-2 text-[14px] text-black">
                  <MembersIcon
                    className="w-6 h-6"
                    style={{ color: iconColor }}
                  />
                  <span>{booking.maxParticipants || 0} مشتركين</span>
                </div>
              </div>

              {/* مسافة فوق الخط الفاصل */}
              <div style={{ height: "16px" }} />

              {/* خط فاصل */}
              <div
                style={{
                  width: "336px",
                  height: "0px",
                  borderTop: "1px solid #E2E8F0",
                  margin: "0 auto",
                }}
              />

              {/* مسافة تحت الخط (خففناها) */}
              <div style={{ height: "8px" }} />

              {/* القسم الأخير (Flow أفقي) */}
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
                    {booking.coach || "لا يوجد مدرب"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-between items-center gap-2 mt-4">
    {/* جهة الأيقونة + عدد الحجوزات */}
    <div className="flex items-center gap-2 text-black font-normal">
      <NoteIcon className="w-6 h-6 text-[var(--color-purple)]" />
      <span>
         العدد الكلي {bookings.length}
      </span>
    </div>

    {/* أزرار الصفحات */}
    <div className="flex items-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-1 border rounded-md ${
            page === currentPage ? "bg-purple-600 text-white" : ""
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        ←
      </button>
    </div>
  </div>
)}

      {/* مودال التعديل */}
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

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          event={bookingToDelete}
        />
      )}
    </div>
  );
};

export default BookingsTab;
{/*}
// src/pages/BookingsPage.jsx
import React, { useState, useEffect } from "react";
import { getAllBookingsAPI } from "../api/bookingsApi";
import { getAllCoachesAPI } from "../api/coachesApi";

import AddBookingModal from "../Bookings/components/AddBookingModal/AddBookingModal";
import BookingsList from "../Bookings/components/BookingsList";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { deleteBookingAPI } from "../api/bookingsApi";
import { useBookings } from "./BookingsContext";

export default function BookingsPage() {
  //const [bookings, setBookings] = useState([]);
  const { bookings, setBookings, fetchBookings, loading } = useBookings();
  //const [loading, setLoading] = useState(true);
  const [deleteModalData, setDeleteModalData] = useState(null);
  const [deleting, setDeleting] = useState(false); // 🔹 حالة اللودنج



  const handleDelete = async (booking, isGroup) => {
    try {
      setDeleting(true);
      const idToDelete = isGroup ? booking.groupId || booking._id : booking._id;
      await deleteBookingAPI(idToDelete, isGroup);
      toast.success(isGroup ? "تم حذف جميع التكرارات ✅" : "تم حذف الحجز ✅");
      setDeleteModalData(null);
      fetchBookings(); // تحديث البيانات
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setDeleting(false);
    }
  };

  // 📌 تحميل البيانات أول مرة
  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const handleOpenAdd = () => setOpen(true);
    window.addEventListener("openAddBooking", handleOpenAdd);
    return () => window.removeEventListener("openAddBooking", handleOpenAdd);
  }, []);

  // 🌀 تحديث تلقائي بعد أي تعديل أو حذف أو إضافة
  const handleDataChange = () => {
    fetchBookings();
  };

  // 🔍 مراقبة الحجوزات بالكونسول (اختياري)
  useEffect(() => {
    console.log(" الحجوزات بعد التحديث:", bookings);
  }, [bookings]);

  useEffect(() => {
    const handleOpenDeleteModal = (e) => setDeleteModalData(e.detail);
    window.addEventListener("openDeleteBookingModal", handleOpenDeleteModal);
    return () =>
      window.removeEventListener(
        "openDeleteBookingModal",
        handleOpenDeleteModal
      );
  }, []);

  return (
    <>
      {deleteModalData && (
        <ConfirmDeleteModal
          event={deleteModalData.booking}
          isLoading={deleting}
          onCancel={() => setDeleteModalData(null)}
          onConfirm={() => {
            handleDelete(deleteModalData.booking, deleteModalData.isGroup);
            setDeleteModalData(null);
          }}
        />
      )}
      <div className="p-6 flex flex-col gap-6">
        <AddBookingModal onChange={handleDataChange} />

        
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              جارِ التحميل...
            </div>
          ) : (
            <BookingsList
              bookings={bookings}
              loading={loading}
              onChange={handleDataChange}
            />
          )}
        </div>

        {deleteModalData && (
          <ConfirmDeleteModal
            event={deleteModalData.booking}
            isLoading={deleting}
            onCancel={() => setDeleteModalData(null)}
            onConfirm={() =>
              handleDelete(deleteModalData.booking, deleteModalData.isGroup)
            }
          />
        )}
      </div>
    </>
  );
}
*/}
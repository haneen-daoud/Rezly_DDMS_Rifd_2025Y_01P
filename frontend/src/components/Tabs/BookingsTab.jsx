// src/pages/BookingsPage.jsx
import React, { useState, useEffect } from "react";
import { getAllBookingsAPI, deleteBookingAPI } from "../../api/bookingsApi";
import AddBookingModal from "../../Bookings/components/AddBookingModal/AddBookingModal";
import BookingsList from "../../Bookings/components/BookingsList";
import ConfirmDeleteModal from "../../Bookings/components/ConfirmDeleteModal";
import { toast } from "react-toastify";
import { useBookings } from "../../Bookings/BookingsContext";

export default function BookingsPage({ bookings: filteredBookings }) {
  const { bookings, setBookings, fetchBookings, loading } = useBookings();

  const [deleteModalData, setDeleteModalData] = useState(null);
  const [deleting, setDeleting] = useState(false);

  {/*
  // تحميل البيانات عند أول فتح الصفحة
  useEffect(() => {
    fetchBookings();
  }, []);
*/}
{/*
  // تحديث الحجوزات عند إضافة أو تعديل أو حذف
  const handleDataChange = () => {
    fetchBookings();
  };
*/}
  {/*}
  // مراقبة التحديثات بالكونسول (اختياري)
  useEffect(() => {
    console.log(" الحجوزات بعد التحديث:", bookings);
  }, [bookings]);
*/}


  // حذف حجز
  const handleDelete = async (booking, isGroup) => {
    try {
      setDeleting(true);
      const idToDelete = isGroup ? booking.groupId || booking._id : booking._id;
      await deleteBookingAPI(idToDelete, isGroup);
      toast.success(isGroup ? "تم حذف جميع التكرارات  " : "تم حذف الحجز  ");
      setDeleteModalData(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setDeleting(false);
    }
  };

  // عرض النتائج (مفلترة أو كاملة)
  const displayBookings =
    filteredBookings && Array.isArray(filteredBookings)
      ? filteredBookings
      : bookings;

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

     <div className="mt-[16px] md:mt-[20px] flex flex-col gap-6 w-full">
  {/*   مودال الإضافة */}
<AddBookingModal onChange={() => {}} />


  {/*   محتوى الصفحة */}
  <div className="flex flex-col gap-6 overflow-visible relative z-0 w-full">

    {loading ? (
      <div className="flex justify-center items-center h-[200px]">
    <span className="loader"></span>
  </div>
    ) : displayBookings.length === 0 ? (
      <div className="text-center text-gray-400 py-8">
        لا توجد حجوزات مطابقة 
      </div>
    ) : (
      <BookingsList bookings={displayBookings} loading={loading} onChange={() => {}} />
    )}
  </div>
</div>

    </>
  );
}

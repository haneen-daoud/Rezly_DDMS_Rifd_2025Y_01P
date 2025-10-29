// src/Bookings/components/BookingsList.jsx
import React, { useState, useRef, useEffect} from "react";
import BookingCard from "./BookingCard";

export default function BookingsList({ bookings = [], loading, onChange }) {
   const [openMenu, setOpenMenu] = useState(null); // ✅ للتحكم بالمنيو المفتوح

   const listRef = useRef(null); // 🔹 عشان نعرف إذا الكبس كان داخل أو برا القائمة

  // 🟢 سكّر المنيو لما المستخدم يكبس برا
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">جارِ التحميل...</div>;
  }

  if (!bookings.length) {
    return <div className="text-center py-12 text-gray-500">لا توجد حجوزات حالياً</div>;
  }

  // 🔹 تجميع الحجوزات حسب groupId
  const groupedBookings = bookings.reduce((acc, booking) => {
    const groupId = booking.groupId || booking._id; // fallback إذا ما في groupId
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(booking);
    return acc;
  }, {});

  // 🔹 تحويلها لمصفوفة قابلة للعرض
  const groupedArray = Object.values(groupedBookings);
console.log("📦 الحجوزات اللي داخل BookingList:", bookings);

  return (
  <div ref={listRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {groupedArray.map((group) => (
      <BookingCard
        key={group[0]._id} // ✅ id ثابت
        bookingGroup={group}
        index={group[0]._id} // index يستخدم فقط للمنيو
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        onChange={onChange}
      />
    ))}
  </div>
);

}
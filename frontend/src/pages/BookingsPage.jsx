import React, { useState } from "react";
import AddBookingModal from "../components/AddBookingModal/AddBookingModal";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddBooking = (newBooking) => {
    setBookings([...bookings, newBooking]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الحجوزات</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          + إضافة حجز
        </button>
      </div>

      {/* عرض الحجوزات ككروت */}
      <div className="grid grid-cols-3 gap-4">
        {bookings.map((booking, idx) => (
          <div key={idx} className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="font-bold">{booking.title}</h2>
            <p>👤 {booking.coach}</p>
            <p>🏠 {booking.room}</p>
          </div>
        ))}
      </div>

      {/* المودال */}
      {showAddModal && (
        <AddBookingModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddBooking}
        />
      )}
    </div>
  );
};

export default BookingsPage;

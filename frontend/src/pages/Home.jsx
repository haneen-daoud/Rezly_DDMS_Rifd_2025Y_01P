import React, { useState } from "react";
import Chart from "../components/Chart";
import AttendanceTable from "../components/AttendanceTable/AttendanceTable";
import StatCard from "../components/StatCard";
import CalendarView from "../Bookings/components/CalendarView";
import EventModal from "../Bookings/components/EventModal";
import { useOutletContext } from "react-router-dom";
import { useBookings } from "../Bookings/BookingsContext";

import Icon1 from "../assets/icon/card-icon1.svg";
import Icon2 from "../assets/icon/card-icon2.svg";
import Icon3 from "../assets/icon/card-icon3.svg";
import Icon4 from "../assets/icon/card-icon4.svg";

export default function Home() {

  const { bookings, setBookings, fetchBookings, loading } = useBookings();
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // حفظ التغييرات من EventModal
  const handleSaveEvent = async (updatedEvent) => {
    try {
      // 🔹 هنا ممكن تنادي API لتحديث الحجز
      setBookings((prev) =>
        prev.map((b) => (b._id === updatedEvent._id ? updatedEvent : b))
      );
      setShowEventModal(false);
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  // حذف الحجز الفردي من EventModal
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      // 🔹 هنا ممكن تنادي API لحذف الحجز
      setBookings((prev) =>
        prev.filter((b) => b._id !== selectedEvent._id)
      );
      setShowEventModal(false);
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-[2] flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            value={<span className="text-[28px] font-cairo font-bold">60</span>}
            icon={Icon1}
            title="إشغال المكان"
            bgColor="#9333EA"
          />
          <StatCard
            value={<span className="text-[28px] font-cairo font-bold">$440</span>}
            icon={Icon2}
            title="إيرادات اليوم"
            bgColor="#22C55E"
          />
          <StatCard
            value={<span className="text-[28px] font-cairo font-bold">23</span>}
            icon={Icon3}
            title="اشتراكات اليوم"
            bgColor="#3B82F6"
          />
          <StatCard
            value={<span className="text-[28px] font-cairo font-bold">15</span>}
            icon={Icon4}
            title="زوار الموقع الآن"
            bgColor="#FACC15"
          />
        </div>

        <div className="bg-white rounded-2xl shadow py-6">
          <Chart />
        </div>

        <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
          <AttendanceTable />
        </div>
      </div>

      <div className="flex-[3] flex mt-6 lg:mt-0 w-full">
        <div className="bg-white rounded-2xl shadow p-4">
          <CalendarView
  onEventClick={(event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  }}
/>

        </div>
      </div>

      {showEventModal && selectedEvent && (
        <EventModal
          newEvent={selectedEvent}
          setNewEvent={setSelectedEvent}
          handleSaveEvent={handleSaveEvent}
          handleDeleteClick={handleDeleteEvent}
          closeModal={() => setShowEventModal(false)}
        />
      )}
    </div>
  );
}

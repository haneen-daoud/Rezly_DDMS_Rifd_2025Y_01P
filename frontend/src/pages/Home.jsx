import React, { useState } from "react";
import Chart from "../components/Chart";
import AttendanceTable from "../components/AttendanceTable/AttendanceTable";
import StatCard from "../components/StatCard";
import CalendarView from "../Bookings/components/CalendarView";
import EventModal from "../Bookings/components/EventModal";
import { useBookings } from "../Bookings/BookingsContext";

import Icon1 from "../assets/icon/card-icon1.svg";
import Icon2 from "../assets/icon/card-icon2.svg";
import Icon3 from "../assets/icon/card-icon3.svg";
import Icon4 from "../assets/icon/card-icon4.svg";

export default function Home() {
  const { bookings, setBookings } = useBookings();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  return (
    <div
      className="
        flex flex-col lg:flex-row gap-6 
        bg-white sm:bg-[#F8F8F8] 
        min-h-screen rounded-[0px] sm:rounded-[0px]
      "
    >
      {/* القسم الأيسر (الكروت + الشارت + الجدول) */}
      <div className="flex-[2] flex flex-col gap-6 w-full p-4 sm:p-0">
        {/* 🔹 الكروت */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-[800px] mx-auto">
          <StatCard
            value={<span className="text-[28px] font-cairo font-bold">60%</span>}
            icon={Icon1}
            title="إشغال المكان"
          />
          <StatCard
            value={<span className="text-[28px] font-cairo font-bold">$440</span>}
            icon={Icon2}
            title="إيرادات اليوم"
          />
          <StatCard
            value={<span className="text-[28px] font-cairo font-bold">23</span>}
            icon={Icon3}
            title="اشتراكات اليوم"
          />
          <StatCard
            value={<span className="text-[28px] font-cairo font-bold">15</span>}
            icon={Icon4}
            title="زوار الموقع الآن"
          />
        </div>

        {/* 🔹 الشارت */}
        <div className="bg-white rounded-2xl shadow py-6">
          <Chart />
        </div>

        {/* 🔹 الجدول */}
        <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
          <AttendanceTable />
        </div>
      </div>

      {/* القسم الأيمن (الكاليندر) */}
      <div className="flex-[3] flex mt-6 lg:mt-0 w-full">
        <div className="bg-white rounded-2xl shadow p-4 w-full">
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

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
  const { bookings } = useBookings();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  return (
    <div className="min-h-screen w-full font-cairo">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full h-full">

        {/* الجزء الأيسر: الكروت + الشارت + الجدول  */}
        <div className="flex flex-col gap-6 w-full lg:w-[39%]">
          {/* الكروت */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <StatCard
              value={<span className="text-[28px] font-bold">60%</span>}
              icon={Icon1}
              title="إشغال المكان"
            />
            <StatCard
              value={<span className="text-[28px] font-bold">$440</span>}
              icon={Icon2}
              title="إيرادات اليوم"
            />
            <StatCard
              value={<span className="text-[28px] font-bold">23</span>}
              icon={Icon3}
              title="اشتراكات اليوم"
            />
            <StatCard
              value={<span className="text-[28px] font-bold">15</span>}
              icon={Icon4}
              title="زوار الموقع الآن"
            />
          </div>

          {/* الشارت */}
          <section className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex-1">
            <Chart />
          </section>

          {/* الجدول */}
          <section className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex-1">
            <AttendanceTable />
          </section>
        </div>

        {/* الجزء الأيمن: الكاليندر */}
        <div className="w-full lg:w-[61%] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex flex-col">
          <CalendarView
            onEventClick={(event) => {
              setSelectedEvent(event);
              setShowEventModal(true);
            }}
          />
        </div>
      </div>

      {/* مودال الحدث */}
      {showEventModal && selectedEvent && (
        <EventModal
          newEvent={selectedEvent}
          setNewEvent={setSelectedEvent}
          handleSaveEvent={() => {}}
          handleDeleteClick={() => {}}
          closeModal={() => setShowEventModal(false)}
        />
      )}
    </div>
  );
}

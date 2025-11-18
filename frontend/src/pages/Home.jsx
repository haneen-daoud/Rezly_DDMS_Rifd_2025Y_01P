import React, { useState } from "react";
import Chart from "../components/Chart";
import AttendanceTable from "../components/AttendanceTable/AttendanceTable";
import StatCard from "../components/StatCard";
import CalendarView from "../Bookings/components/CalendarView";
import EventModal from "../Bookings/components/EventModal";
import { useBookings } from "../Bookings/BookingsContext";
import { useOutletContext } from "react-router-dom";
import DashboardBoxes from "../components/DashboardBoxes";
import WaitingList from "../components/waitingList.jsx";
import MembersNotes from "../components/MembersNotes.jsx";

import Icon1 from "../assets/icon/card-icon1.svg";
import Icon2 from "../assets/icon/card-icon2.svg";
import Icon3 from "../assets/icon/card-icon3.svg";
import Icon4 from "../assets/icon/card-icon4.svg";
import User1 from "../img/User1.svg";
import User2 from "../img/User2.svg";
import User3 from "../img/User3.svg";

const needsFollowUp = [
  { id: 1, name: "خالد السالم", reason: "تغيب يومين", image: User1 },
  { id: 2, name: "فاطمة أحمد", reason: "تأخر متكرر", image: User2 },
  { id: 3, name: "خالد السالم", reason: "يحتاج إعداد برنامج", image: User3 },
];

const mostActive = [
  { id: 1, name: "أحمد محمد", status: "حضور عالي", image: User1 },
  { id: 2, name: "ريم الحربي", status: "مستمر", image: User2 },
  { id: 3, name: "عمر السعيد", status: "حضور عالي", image: User3 },
];

export default function Home() {
  const { bookings } = useBookings();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const { currentUser } = useOutletContext();
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  const role = currentUser?.role?.toLowerCase() || "";
  const isReception =
    role === "reception" || role === "receptionist" || role === "receptionist_employee";
  const isCoach = role === "coach";

  return (
    <div className="min-h-screen w-full font-cairo">
      {/* العمودين الرئيسيين: يسار (٤ كروت + محتوى) / يمين (٦ كروت للريسبشنست + الكاليندر) */}
      <div className="grid grid-cols-1 lg:grid-cols-[39%_61%] gap-6 w-full">
        {/* العمود اليسار */}
        <div className="flex flex-col gap-6 w-full">
          {/* ٤ كروت الأساسية - للجميع */}
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

          {/* المحتوى تحت الكروت بالعمود اليسار حسب الرول */}
          {isCoach ? (
            // لو مدرب → بوكسات المتابعة والنشاط
            <DashboardBoxes
              needsFollowUp={needsFollowUp}
              mostActive={mostActive}
            />
          ) : isReception ? (
            // لو ريسبشنست → قائمة الانتظار + ملاحظات المشتركين
            <div className="flex flex-col gap-4 w-full">
              <section className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex-1">
                <WaitingList />
              </section>
              <section className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex-1">
                <MembersNotes />
              </section>
            </div>
          ) : (
            // باقي المستخدمين → شارت
            <section className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex-1">
              <Chart />
            </section>
          )}

          {/* جدول الحضور */}
          <section className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex-1">
            <AttendanceTable />
          </section>
        </div>

        {/* العمود اليمين */}
        <div className="flex flex-col gap-4 w-full">
          {/* ٦ كروت إضافية للريسبشنست - على نفس امتداد الأربع كروت */}
          {isReception && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
              <StatCard
                title="حجوزات اليوم"
                value={<span className="text-[24px] font-bold">34</span>}
                icon={Icon1}
              />
              <StatCard
                title="حجوزات الغد"
                value={<span className="text-[24px] font-bold">18</span>}
                icon={Icon2}
              />
              <StatCard
                title="حجوزات قيد الانتظار"
                value={<span className="text-[24px] font-bold">7</span>}
                icon={Icon3}
              />
              <StatCard
                title="إلغاءات اليوم"
                value={<span className="text-[24px] font-bold">3</span>}
                icon={Icon4}
              />
              <StatCard
                title="مشتركين منتهية اشتراكاتهم"
                value={<span className="text-[24px] font-bold">5</span>}
                icon={Icon1}
              />
              <StatCard
                title="استفسارات جديدة"
                value={<span className="text-[24px] font-bold">9</span>}
                icon={Icon2}
              />
            </div>
          )}

          {/* الكاليندر */}
          <div className="w-full bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex flex-col">
            <CalendarView
              onEventClick={(event) => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
            />
          </div>
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

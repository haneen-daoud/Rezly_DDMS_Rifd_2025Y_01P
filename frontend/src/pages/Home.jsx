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
import Icon5 from "../assets/icon/card-icon5.svg";
import Icon6 from "../assets/icon/card-icon6.svg";
import Icon7 from "../assets/icon/card-icon7.svg";
import Icon8 from "../assets/icon/card-icon8.svg";
import Icon9 from "../assets/icon/card-icon9.svg";
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
    role === "reception" ||
    role === "receptionist" ||
    role === "receptionist_employee";
  const isCoach = role === "coach";
  const isAdmin = role === "admin";

  // ٤ كروت الأساسية حسب الرول
  const primaryCards = (() => {
    if (isCoach) {
      return [
        {
          title: "جلسات اليوم",
          value: <span className="text-[28px] font-bold">15</span>,
          icon: Icon1,
        },
        {
          title: "نسبة الحضور اليوم",
          value: <span className="text-[28px] font-bold">85%</span>,
          icon: Icon2,
        },
        {
          title: "نسبة الالتزام",
          value: <span className="text-[28px] font-bold">92%</span>,
          icon: Icon3,
        },
        {
          title: "تقييماتك",
          value: <span className="text-[28px] font-bold">4.8</span>,
          icon: Icon4,
        },
      ];
    }

    if (isReception) {
      return [
        {
          title: "جلسات اليوم",
          value: <span className="text-[28px] font-bold">15</span>,
          icon: Icon4,
        },
        {
          title: "إشغال المكان",
          value: <span className="text-[28px] font-bold">60%</span>,
          icon: Icon1,
        },
        {
          title: "عدد الاشتراكات",
          value: <span className="text-[28px] font-bold">120</span>,
          icon: Icon1,
        },
        {
          title: "عدد الحجوزات",
          value: <span className="text-[28px] font-bold">34</span>,
          icon: Icon3,
        },
      ];
    }

    // Admin / باقي المستخدمين الافتراضي
    return [
      {
        title: "إشغال المكان",
        value: <span className="text-[28px] font-bold">60%</span>,
        icon: Icon1,
      },
      {
        title: "إيرادات اليوم",
        value: <span className="text-[28px] font-bold">₪440</span>,
        icon: Icon2,
      },
      {
        title: "اشتراكات اليوم",
        value: <span className="text-[28px] font-bold">23</span>,
        icon: Icon3,
      },
      {
        title: "جلسات اليوم",
        value: <span className="text-[28px] font-bold">15</span>,
        icon: Icon4,
      },
    ];
  })();

  // ٦ كروت الريسبشنست الثانوية
  const receptionSecondaryCards = [
    {
      title: "إيرادات اليوم",
      value: <span className="text-[24px] font-bold">₪440</span>,
      icon: Icon2,
    },
    {
      title: "اشتراكات قيد الانتهاء",
      value: <span className="text-[24px] font-bold">12</span>,
      icon: Icon6,
    },
    {
      title: "المدفوعات المعلقة",
      value: <span className="text-[24px] font-bold">8</span>,
      icon: Icon8,
    },
    {
      title: "عدد الحضور",
      value: <span className="text-[24px] font-bold">57</span>,
      icon: Icon5,
    },
    {
      title: "نسبة التسرّب",
      value: <span className="text-[24px] font-bold">12%</span>,
      icon: Icon7,
    },
    {
      title: "الجلسات الملغاة اليوم",
      value: <span className="text-[24px] font-bold">3</span>,
      icon: Icon9,
    },
  ];

  return (
    <div className="min-h-screen w-full font-cairo">
      {/* العمودين الرئيسيين: يسار (٤ كروت + محتوى) / يمين (٦ كروت للريسبشنست + الكاليندر) */}
      <div className="grid grid-cols-1 lg:grid-cols-[39%_61%] gap-6 w-full">
        {/* العمود اليسار */}
        <div className="flex flex-col gap-6 w-full">
          {/* ٤ كروت الأساسية - ديناميكية حسب الرول */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {primaryCards.map((card, index) => (
              <StatCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
              />
            ))}
          </div>

          {/* ٦ كروت الريسبشنست تحت الأربع كروت في الموبايل فقط */}
          {isReception && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:hidden">
              {receptionSecondaryCards.map((card, index) => (
                <StatCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                />
              ))}
            </div>
          )}

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
        <div className="flex flex-col gap-6 w-full">
          {/* ٦ كروت إضافية للريسبشنست - على نفس امتداد الأربع كروت (للديسكتوب فقط) */}
          {isReception && (
            <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
              {receptionSecondaryCards.map((card, index) => (
                <StatCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                />
              ))}
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

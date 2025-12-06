import React, { useState, useEffect } from "react";
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
import { getMembersStats } from "../api.js";

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
import UpcomingBookings from "../components/UpcomingBookings.jsx";
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

  const [stats, setStats] = useState({
    sessionsToday: 0,
    totalBookings: 0,
    cancelledSessionsToday: 0,
    totalSubscriptions: 0,
    todaySubscriptions: 0,
    subscriptionsEndingSoon: 0,
    pendingPayments: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  const [memberStats, setMemberStats] = useState(null);

  const role = currentUser?.role?.toLowerCase() || "";
  const isSuperAdmin = role === "superadmin";
  const isReception =
    role === "reception" ||
    role === "receptionist" ||
    role === "receptionist_employee";
  const isCoach = role === "coach";
  const isAdmin = role === "admin" || isSuperAdmin;

  const getDateKey = (value) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  };

    // 1) إحصائيات من الحجوزات + دمج إحصائيات الأعضاء لو موجودة
  useEffect(() => {
    const today = new Date();
    const todayKey = getDateKey(today);

    const allBookings = Array.isArray(bookings) ? bookings : [];

    let sessionsToday = 0;
    let cancelledSessionsToday = 0;

    allBookings.forEach((booking) => {
      const schedules = Array.isArray(booking.schedules)
        ? booking.schedules
        : [];

      schedules.forEach((s) => {
        const scheduleDateKey = getDateKey(s.date);
        if (scheduleDateKey === todayKey) {
          sessionsToday += 1;
          if (booking.status === "cancelled") {
            cancelledSessionsToday += 1;
          }
        }
      });
    });

    const baseStats = {
      sessionsToday,
      totalBookings: allBookings.length,
      cancelledSessionsToday,
      totalSubscriptions: memberStats?.totalSubscriptions || 0,
      todaySubscriptions: memberStats?.todaySubscriptions || 0,
      subscriptionsEndingSoon:
        memberStats?.subscriptionsEndingSoon || 0,
      pendingPayments: memberStats?.pendingPayments || 0,
    };

    setStats((prev) => ({ ...prev, ...baseStats }));
  }, [bookings, memberStats]);

    // 2) تحميل إحصائيات الأعضاء مرة واحدة فقط (للآدمن و الاستقبال)
  useEffect(() => {
    if (!isAdmin && !isReception) return;

    let cancelled = false;

    const loadMembersStats = async () => {
      try {
        setStatsLoading(true);

        const data = await getMembersStats();
        const members = Array.isArray(data.members) ? data.members : [];
        const totalSubscriptions = data.totalMembers || members.length;

        const today = new Date();
        const todayKey = getDateKey(today);

        // اشتراكات اليوم (أعضاء مضافة اليوم)
        const todaySubscriptions = members.filter((m) => {
          const createdKey = getDateKey(m.createdAt);
          return createdKey === todayKey;
        }).length;

        // اشتراكات تنتهي خلال 7 أيام
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const after7Days = new Date(startOfToday);
        after7Days.setDate(startOfToday.getDate() + 7);

        const subscriptionsEndingSoon = members.filter((m) => {
          if (!m.endDate) return false;
          const end = new Date(m.endDate);
          if (Number.isNaN(end.getTime())) return false;
          return end >= startOfToday && end <= after7Days;
        }).length;

        // المدفوعات المعلقة / غير مدفوعة
        const pendingPayments = members.filter((m) => {
          return (
            m.paymentStatus === "قيد المعالجة" ||
            m.paymentStatus === "غير مدفوع"
          );
        }).length;

        if (!cancelled) {
          setMemberStats({
            totalSubscriptions,
            todaySubscriptions,
            subscriptionsEndingSoon,
            pendingPayments,
          });
        }
      } catch (err) {
        console.error("خطأ أثناء تحميل إحصائيات الأعضاء للداشبورد:", err);
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    };

    loadMembersStats();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, isReception]);

  
  // ٤ كروت الأساسية حسب الرول
  const primaryCards = (() => {
    // مدرب
    if (isCoach) {
      return [
        {
          title: "جلسات اليوم",
          value: (
            <span className="text-[28px] font-bold">
              {statsLoading ? "..." : stats.sessionsToday}
            </span>
          ),
          icon: Icon1,
        },
        {
          title: "نسبة الحضور اليوم",
          value: <span className="text-[28px] font-bold">85%</span>, // مؤقت
          icon: Icon2,
        },
        {
          title: "نسبة الالتزام",
          value: <span className="text-[28px] font-bold">92%</span>, // مؤقت
          icon: Icon3,
        },
        {
          title: "تقييماتك",
          value: <span className="text-[28px] font-bold">4.8</span>, // مؤقت
          icon: Icon4,
        },
      ];
    }

    // موظف استقبال
    if (isReception) {
      return [
        {
          title: "جلسات اليوم",
          value: (
            <span className="text-[28px] font-bold">
              {statsLoading ? "..." : stats.sessionsToday}
            </span>
          ),
          icon: Icon4,
        },
        {
          title: "إشغال المكان",
          value: <span className="text-[28px] font-bold">60%</span>, // مؤقت
          icon: Icon1,
        },
        {
          title: "عدد الاشتراكات",
          value: (
            <span className="text-[28px] font-bold">
              {statsLoading ? "..." : stats.totalSubscriptions}
            </span>
          ),
          icon: Icon1,
        },
        {
          title: "عدد الحجوزات",
          value: (
            <span className="text-[28px] font-bold">
              {statsLoading ? "..." : stats.totalBookings}
            </span>
          ),
          icon: Icon3,
        },
      ];
    }

    // Admin / باقي المستخدمين
    return [
      {
        title: "إشغال المكان",
        value: <span className="text-[28px] font-bold">60%</span>, // مؤقت
        icon: Icon1,
      },
      {
        title: "إيرادات اليوم",
        value: <span className="text-[28px] font-bold">₪440</span>, // مؤقت
        icon: Icon2,
      },
      {
        title: "اشتراكات اليوم",
        value: (
          <span className="text-[28px] font-bold">
            {statsLoading ? "..." : stats.todaySubscriptions}
          </span>
        ),
        icon: Icon3,
      },
      {
        title: "جلسات اليوم",
        value: (
          <span className="text-[28px] font-bold">
            {statsLoading ? "..." : stats.sessionsToday}
          </span>
        ),
        icon: Icon4,
      },
    ];
  })();

  // ٦ كروت الريسبشنست الثانوية
  const receptionSecondaryCards = [
    {
      title: "إيرادات اليوم",
      value: <span className="text-[24px] font-bold">₪440</span>, // مؤقت
      icon: Icon2,
    },
    {
      title: "اشتراكات قيد الانتهاء",
      value: (
        <span className="text-[24px] font-bold">
          {statsLoading ? "..." : stats.subscriptionsEndingSoon}
        </span>
      ),
      icon: Icon6,
    },
    {
      title: "المدفوعات المعلقة",
      value: (
        <span className="text-[24px] font-bold">
          {statsLoading ? "..." : stats.pendingPayments}
        </span>
      ),
      icon: Icon8,
    },
    {
      title: "عدد الحضور",
      value: <span className="text-[24px] font-bold">57</span>, // مؤقت (بدها Attendance)
      icon: Icon5,
    },
    {
      title: "نسبة التسرّب",
      value: <span className="text-[24px] font-bold">12%</span>, // مؤقت
      icon: Icon7,
    },
    {
      title: "الجلسات الملغاة اليوم",
      value: (
        <span className="text-[24px] font-bold">
          {statsLoading ? "..." : stats.cancelledSessionsToday}
        </span>
      ),
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
            <section className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex-1 flex flex-col">
              <Chart />
            </section>
          )}

          <section className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex-1">
            {isCoach ? <UpcomingBookings /> : <AttendanceTable />}
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
          {/* الكاليندر */}
<div className="w-full bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex flex-col min-h-[600px]">
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

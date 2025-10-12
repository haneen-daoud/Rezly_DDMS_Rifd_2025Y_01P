import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet, useLocation } from "react-router-dom";
import { getAllBookingsAPI } from "../api/bookingsApi";
import { getAllCoachesAPI } from "../api/coachesApi";

export default function Layout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coaches = await getAllCoachesAPI();
        const coachesMap = {};
        coaches.forEach(c => { if (c.role === "Coach") coachesMap[c._id] = `${c.firstName} ${c.lastName}`.trim(); });

        const data = await getAllBookingsAPI();
        const mapped = data.map(b => ({
          ...b,
          coach: b.coachId ? { id: b.coachId, name: coachesMap[b.coachId] || "لا يوجد مدرب" } : { id: null, name: "لا يوجد مدرب" }
        }));
        setBookings(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  // العنوان اللي رح يظهر في Topbar
  const topbarTitle =
    location.pathname === "/" ? 
      "مرحباً بك في لوحة التحكم، نتمنى لك يوماً مثمراً!" 
      : selectedTab;

  return (
    <div className="w-full min-h-screen bg-bg flex">
      {/* Sidebar ثابت على الشاشات الكبيرة */}
      <div className="hidden lg:block">
        <Sidebar
          onClose={() => setOpenSidebar(false)}
          onSelectTab={setSelectedTab}
        />
      </div>

      {/* Drawer للموبايل */}
      {openSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenSidebar(false)}
          />
          <div className="absolute left-0 top-0 w-64 h-full bg-bg p-4">
            <Sidebar
              onClose={() => setOpenSidebar(false)}
              onSelectTab={setSelectedTab}
            />
          </div>
        </div>
      )}

      {/* المحتوى */}
      <div className="flex flex-col w-full">
        <Topbar title={topbarTitle} onMenuClick={() => setOpenSidebar(true)} />
        <main className="flex-1 p-6 w-full overflow-auto">
          <Outlet context={{ bookings, setBookings }} />
        </main>
      </div>
    </div>
  );
}

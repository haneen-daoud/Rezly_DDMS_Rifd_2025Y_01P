import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet, useLocation } from "react-router-dom";
import { BookingsProvider } from "../Bookings/BookingsContext";

export default function Layout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("");

  const topbarTitle =
    location.pathname === "/dashboard"
      ? "مرحباً بك في لوحة التحكم، نتمنى لك يوماً مثمراً!"
      : selectedTab;

  return (
    <div className="w-full min-h-screen bg-bg flex">
      {/* 🔹 Sidebar في الديسكتوب */}
      <div className="hidden lg:block">
        <Sidebar
          onClose={() => setOpenSidebar(false)}
          onSelectTab={setSelectedTab}
        />
      </div>

      {/* 🔹 Drawer في الموبايل */}
      {openSidebar && (
        <>
          {/* خلفية شفافة */}
          <div
            className="fixed inset-0 bg-black/40 z-40 animate-fadeIn"
            onClick={() => setOpenSidebar(false)}
          ></div>

          {/* سايدبار متحرك من اليمين */}
          <div
            className={`fixed top-0 right-0 w-64 h-full bg-bg z-50 shadow-xl transform transition-transform duration-300 ${
              openSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Sidebar
              onClose={() => setOpenSidebar(false)}
              onSelectTab={setSelectedTab}
            />
          </div>
        </>
      )}

      {/* 🔹 المحتوى الرئيسي */}
      <div className="flex flex-col w-full">
        {/* توب بار دائم */}
        <Topbar
          title={topbarTitle}
          onMenuClick={() => setOpenSidebar(true)}
        />

        <BookingsProvider>
          <main className="flex-1 p-6 w-full overflow-auto">
            <Outlet />
          </main>
        </BookingsProvider>
      </div>
    </div>
  );
}

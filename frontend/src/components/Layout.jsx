import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet, useLocation } from "react-router-dom";
import { BookingsProvider } from "../Bookings/BookingsContext";

export default function Layout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("");

  const topbarTitle =
    location.pathname === "/dashboard"
      ? "مرحباً بك في لوحة التحكم، نتمنى لك يوماً مثمراً!"
      : selectedTab;

  return (
    <div className="w-full min-h-screen flex bg-[#F8F8F8]">
      {/* Sidebar (ديسكتوب) */}
      <div className="hidden lg:block">
        <Sidebar
          onClose={() => setOpenSidebar(false)}
          onSelectTab={setSelectedTab}
          setActiveSubTab={setActiveSubTab}
        />
      </div>

      {/* Drawer للموبايل */}
      {openSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenSidebar(false)}
          ></div>

          {/* السايدبار */}
          <div className="absolute top-0 right-0 h-full bg-white w-[212px] shadow-xl animate-slideIn">
            <Sidebar
              onClose={() => setOpenSidebar(false)}
              onSelectTab={setSelectedTab}
              setActiveSubTab={setActiveSubTab}
            />
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <div className="flex flex-col w-full">
        {/* التوب بار */}
        <Topbar
          title={topbarTitle}
          onMenuClick={() => setOpenSidebar((prev) => !prev)}
        />

        <div className="lg:hidden mt-2 px-4 text-right font-Cairo text-[12px] font-semibold">
          {location.pathname === "/dashboard" ? (
            <span className="text-[var(--color-purple)]">الصفحة الرئيسية</span>
          ) : location.pathname.startsWith("/dashboard/clients") ? (
            <>
              <span className="text-[#7E818C]">إدارة العملاء</span>
              {activeSubTab && (
                <>
                  <span className="text-[#7E818C] mx-1">{`>`}</span>
                  <span className="text-[var(--color-purple)]">
                    {activeSubTab}
                  </span>
                </>
              )}
            </>
          ) : location.pathname.startsWith("/dashboard/employees") ? (
            <span className="text-[var(--color-purple)]">طاقم العمل</span>
          ) : location.pathname.startsWith("/dashboard/finance") ? (
            <span className="text-[var(--color-purple)]">المالية</span>
          ) : location.pathname.startsWith("/dashboard/setting") ? (
            <span className="text-[var(--color-purple)]">الإعدادات</span>
          ) : null}
        </div>

        {/* محتوى الصفحة */}
        <BookingsProvider>
          <main
            className="
    flex-1 w-full overflow-auto bg-[#F8F8F8]
    mt-4 pb-6 h-[calc(100vh-72px)]
    px-4 lg:[padding-inline-start:0px] lg:[padding-inline-end:24px]
  "
          >
            <Outlet context={{ setActiveSubTab, activeSubTab }} />
          </main>
        </BookingsProvider>
      </div>
    </div>
  );
}

{
  /*
  إذا بدنا بس الداشبورد ييجي ملاصق للسايد بار

  <main
  className={`
    flex-1 w-full overflow-auto bg-[#F8F8F8] mt-4 pb-6 h-[calc(100vh-72px)]
    ${location.pathname === "/dashboard" ? "[padding-inline-start:0px] [padding-inline-end:24px]" : "px-6"}
  `}
>
  <Outlet />
</main>

  
  
  */
}

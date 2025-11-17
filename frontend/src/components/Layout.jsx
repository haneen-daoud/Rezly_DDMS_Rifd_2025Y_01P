import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BookingsProvider } from "../Bookings/BookingsContext";
import { getUserFromToken } from "../api/bookingsApi";

export default function Layout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  // ✅ استخراج التاب النشط من الـ URL تلقائياً
  useEffect(() => {
    const path = location.pathname;

    // ✅ إدارة العملاء
    if (path.startsWith("/dashboard/clients")) {
      const subPath = path.split("/")[3];
      const mapping = {
        bookings: "الحجوزات",
        members: "المشتركين",
        attendance: "سجل الحضور",
        reports: "التقارير",
        settings: "الإعدادات",
      };

      setSelectedTab("إدارة العملاء");

      if (subPath && mapping[subPath]) {
        // لو دخل تب فعلي زي /bookings
        setActiveSubTab(mapping[subPath]);
      } else {
        // ✅ لو دخل فقط /dashboard/clients بدون تب
        setActiveSubTab("الحجوزات"); // ← نخلي أول تب افتراضي
        navigate("/dashboard/clients/bookings", { replace: true });
      }
    }

    // ✅ طاقم العمل
    else if (path.startsWith("/dashboard/employees")) {
      const subPath = path.split("/")[3];
      const mapping = {
        staff: "الموظفين",
        roles: "الصلاحيات",
        reports: "التقارير",
        settings: "الإعدادات",
      };

      setSelectedTab("طاقم العمل");

      if (subPath && mapping[subPath]) {
        setActiveSubTab(mapping[subPath]);
      } else {
        // ✅ لو دخل فقط /dashboard/employees بدون تب
        setActiveSubTab("الموظفين");
        navigate("/dashboard/employees/staff", { replace: true });
      }
    }

    // ✅ الصفحة الرئيسية
    else if (path === "/dashboard" || path === "/dashboard/") {
      setSelectedTab("الصفحة الرئيسية");
      setActiveSubTab("");
    }

    // ✅ المالية
    else if (path.startsWith("/dashboard/finance")) {
      setSelectedTab("المالية");
      setActiveSubTab("");
    }

    // ✅ الإعدادات
    else if (path.startsWith("/dashboard/setting")) {
      setSelectedTab("الإعدادات");
      setActiveSubTab("");
    }
  }, [location.pathname]);

  useEffect(() => {
    async function loadUser() {
      // 1) جرّب نقرأ من localStorage (فيه الاسم كامل)
      const saved = localStorage.getItem("currentUser");

      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        console.log("👤 تم تحميل المستخدم من localStorage:", parsed);
        return;
      }

      // 2) لو مش موجود → نروح نفك التوكن
      const u = await getUserFromToken();
      setCurrentUser(u);
      console.log("👤 تم تحميل المستخدم من التوكن فقط:", u);
    }

    loadUser();
  }, []);

  // ✅ العنوان في التوب بار
  const topbarTitle =
    location.pathname === "/dashboard"
      ? "مرحباً بك في لوحة التحكم، نتمنى لك يوماً مثمراً!"
      : selectedTab;

  return (
    <div className="w-full min-h-screen flex bg-[#F8F8F8]">
      {/* ✅ Sidebar (ديسكتوب) */}
      <div className="hidden lg:block w-[22%] max-w-[280px]">
        <Sidebar
          user={currentUser}
          onClose={() => setOpenSidebar(false)}
          onSelectTab={setSelectedTab}
          setActiveSubTab={setActiveSubTab}
        />
      </div>

      {/* ✅ Drawer للموبايل */}
      {openSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenSidebar(false)}
          ></div>

          <div className="absolute top-0 right-0 h-full bg-white w-[212px] shadow-xl animate-slideIn">
            <Sidebar
              user={currentUser}
              onClose={() => setOpenSidebar(false)}
              onSelectTab={setSelectedTab}
              setActiveSubTab={setActiveSubTab}
            />
          </div>
        </div>
      )}

      {/* ✅ المحتوى الرئيسي */}
      <div className="flex flex-col w-full">
        {/* التوب بار */}
        <Topbar
          user={currentUser}
          title={topbarTitle}
          onMenuClick={() => setOpenSidebar((prev) => !prev)}
        />

        {/* ✅ breadcrumb للموبايل */}
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
            <>
              <span className="text-[#7E818C]">طاقم العمل</span>
              {activeSubTab && (
                <>
                  <span className="text-[#7E818C] mx-1">{`>`}</span>
                  <span className="text-[var(--color-purple)]">
                    {activeSubTab}
                  </span>
                </>
              )}
            </>
          ) : location.pathname.startsWith("/dashboard/finance") ? (
            <span className="text-[var(--color-purple)]">المالية</span>
          ) : location.pathname.startsWith("/dashboard/setting") ? (
            <span className="text-[var(--color-purple)]">الإعدادات</span>
          ) : null}
        </div>

        {/* ✅ محتوى الصفحة */}
        <BookingsProvider>
          <main
            className="
              flex-1 w-full overflow-auto bg-[#F8F8F8]
              mt-4 pb-6 h-[calc(100vh-72px)]
              px-4 lg:[padding-inline-start:15px] lg:[padding-inline-end:24px]
            "
          >
            {/* ✅ تمرير الحالة إلى الصفحات الفرعية */}
            <Outlet context={{ setActiveSubTab, activeSubTab }} />
          </main>
        </BookingsProvider>
      </div>
    </div>
  );
}

{
  /*
  إذا بدنا بس الداشبورد ييجي ملاصق للسايد بارx

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

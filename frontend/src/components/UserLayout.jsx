import React, { useState } from "react";
import Topbar from "./Topbar";
import UserSidebar from "./UserSidebar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className="w-full min-h-screen flex bg-[#F8F8F8]">
      {/* Sidebar (ديسكتوب) */}
      <div className="hidden lg:block w-[22%] max-w-[280px]">
        <UserSidebar user={currentUser} onClose={() => setOpenSidebar(false)} />
      </div>

      {/* Drawer للموبايل */}
      {openSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenSidebar(false)}
          ></div>

          <div className="absolute top-0 right-0 h-full bg-white w-[212px] shadow-xl animate-slideIn">
            <UserSidebar user={currentUser} onClose={() => setOpenSidebar(false)} />
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <div className="flex flex-col w-full">
        {/* التوب بار */}
        <Topbar
          title="سجل حضورك اليوم 💪"
          user={currentUser}
          onMenuClick={() => setOpenSidebar((prev) => !prev)}
        />

        {/* محتوى الصفحة */}
        <main
          className="
            flex-1 w-full overflow-auto bg-[#F8F8F8]
            mt-4 pb-6 h-[calc(100vh-72px)]
            px-4 lg:[padding-inline-start:15px] lg:[padding-inline-end:24px]
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

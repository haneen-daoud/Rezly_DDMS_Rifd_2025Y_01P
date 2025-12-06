import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Homesidebar from "../assets/icon/homesidebar.svg";
import Employeeside from "../assets/icon/employeeside.svg";
import WalletSide from "../assets/icon/walletSide.svg";
import Booking from "../assets/icon/booking.svg";
import Setting from "../assets/icon/setting.svg";
import DownArrow from "../icons/downarrow.svg?react";
import Logo from "../assets/icon/rezly-logo.svg";

export default function Sidebar({
  user,
  onClose,
  onSelectTab,
  setActiveSubTab,
}) {
  const role = (user?.role || "").toLowerCase();
  const isSuperAdmin = role === "superadmin";


  const navigate = useNavigate();
  const location = useLocation();

  // ✅ حالة فتح/إغلاق القوائم الفرعية
  const [openMenus, setOpenMenus] = useState({
    clients: false,
    employees: false,
  });

  // ✅ التابات الفرعية الجديدة مع روابطها
  const subTabs = {
    clients: [
      { name: "الحجوزات", path: "bookings" },
      { name: "المشتركين", path: "members" },
      { name: "سجل الحضور", path: "attendance" },
      { name: "التقارير", path: "reports" },
      { name: "الإعدادات", path: "settings" },
    ],
    employees: [
      { name: "الموظفين", path: "staff" },
      { name: "الصلاحيات", path: "roles" },
      { name: "التقارير", path: "reports" },
      { name: "الإعدادات", path: "settings" },
    ],
  };

  // ✅ القوائم الرئيسية
  let menu = [
    // الجميع يشوف هدول
    { to: "/dashboard", label: "الصفحة الرئيسية", icon: Homesidebar },
    {
      to: "/dashboard/clients",
      label: "إدارة العملاء",
      icon: Booking,
      key: "clients",
    },
  ];

  // Only Admin sees employees tab
  if (role === "admin" || isSuperAdmin) {
    menu.push({
      to: "/dashboard/employees",
      label: "طاقم العمل",
      icon: Employeeside,
      key: "employees",
    });
  }

  if (role === "admin" || role === "receptionist" || isSuperAdmin) {
    menu.push({
      to: "/dashboard/finance",
      label: "المالية",
      icon: WalletSide,
    });
  }

  // الكل بشوفهم
  menu.push({
    to: "/dashboard/setting",
    label: "الإعدادات",
    icon: Setting,
  });

  const toggleSubMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ لما يكبس على عنصر رئيسي (يفتح صفحته)
  const handleMainClick = (item) => {
    navigate(item.to);
    onSelectTab && onSelectTab(item.label);
    onClose && onClose();
  };

  // ✅ لما يكبس على تب فرعي — يروح لرابطه الكامل
  const handleSubTabClick = (mainKey, tab) => {
    navigate(`/dashboard/${mainKey}/${tab.path}`); // ← صار لكل تاب رابط فعلي
    setActiveSubTab && setActiveSubTab(tab.name);
    onSelectTab && onSelectTab(tab.name);
    onClose && onClose();
  };

  // ✅ التحقق من الصفحة الحالية (لتمييز النشطة)
  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className="
        w-full h-screen flex flex-col min-h-screen overflow-y-auto
        font-cairo pr-6 pl-[9px] pt-4 pb-6
      "
      dir="rtl"
    >
      {/* اللوجو */}
      <div className="flex justify-center items-center mb-[18px] mt-[-4px]">
        <img src={Logo} alt="logo" className="h-[57px] w-auto object-contain" />
      </div>

      {/* القوائم */}
      <nav className="flex-1 flex flex-col gap-2 mt-0">
        {menu.map((item) => (
          <div key={item.to}>
            {/* العنصر الرئيسي */}
            <div
              className={`
                flex items-center justify-between h-[54px] px-3 rounded-[16px]
                transition-all duration-200 cursor-pointer
                ${
                  isActive(item.to)
                    ? "bg-white text-black font-[700]"
                    : "text-[#7E818C] font-[700] hover:text-black"
                }
              `}
            >
              {/* الضغط على الاسم أو الأيقونة يفتح الصفحة */}
              <div
                className="flex items-center gap-3 flex-1"
                onClick={() => handleMainClick(item)}
              >
                <div className="w-7 h-7 rounded-[12px] flex items-center justify-center bg-[var(--color-purple)]">
                  <img src={item.icon} className="w-4 h-4" alt="" />
                </div>

                <span className="text-[14px] whitespace-nowrap truncate">
                  {item.label}
                </span>
              </div>

              {/* السهم لإظهار القوائم الفرعية */}
              {item.key && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubMenu(item.key);
                  }}
                  className="p-1 transition-transform lg:hidden"
                >
                  <DownArrow
                    className={`w-4 h-4 text-[#7E818C] transition-transform duration-200 ${
                      openMenus[item.key] ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {/* ✅ القوائم الفرعية (تظهر في الموبايل فقط) */}
            {item.key && openMenus[item.key] && (
              <div className="lg:hidden pr-10 mt-2 flex flex-col gap-2.5">
                {subTabs[item.key].map((tab) => (
                  <button
                    key={tab.path}
                    onClick={() => handleSubTabClick(item.key, tab)} // ← يروح للرابط الصحيح
                    className={`text-right text-[13px] font-semibold transition-colors py-1 ${
                      location.pathname === `/dashboard/${item.key}/${tab.path}`
                        ? "text-[var(--color-purple)]"
                        : "text-[#7E818C] hover:text-[var(--color-purple)]"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* تسجيل الخروج */}
      <div className="mt-auto pt-5 border-t border-[#eee]">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("currentUser");

            // لو حابة كمان تمسحي كاش الحجوزات للمستخدم السابق:
            // localStorage.removeItem("cachedBookings");

            navigate("/");
            onClose && onClose();
          }}
          className="flex items-center gap-2 text-[14px] text-[#7E818C] hover:text-black font-[700] transition-colors duration-200 w-full cursor-pointer"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 6.5C9.46957 6.5 8.96086 6.71071 8.58579 7.08579C8.21071 7.46086 8 7.96957 8 8.5V17.5C8 18.0304 8.21071 18.5391 8.58579 18.9142C8.96086 19.2893 9.46957 19.5 10 19.5H13C13.5304 19.5 14.0391 19.2893 14.4142 18.9142C14.7893 18.5391 15 18.0304 15 17.5V8.5C15 7.96957 14.7893 7.46086 14.4142 7.08579C14.0391 6.71071 13.5304 6.5 13 6.5H10ZM15.862 9.02865C15.987 8.90368 16.1566 8.83337 16.3333 8.83337C16.5101 8.83337 16.6796 8.90368 16.8047 9.02865L19.4713 11.6953C19.5963 11.8203 19.6665 11.9899 19.6665 12.1667C19.6665 12.3434 19.5963 12.513 19.4713 12.638L16.8047 15.3047C16.6789 15.4262 16.5105 15.4934 16.3357 15.4918C16.1609 15.4903 15.9937 15.4201 15.8701 15.2965C15.7465 15.1729 15.6764 15.0057 15.6749 14.8309C15.6734 14.6561 15.7406 14.4877 15.862 14.362L17.3907 12.8334H12.3333C12.1565 12.8334 11.987 12.7631 11.862 12.638C11.737 12.513 11.6668 12.3434 11.6668 12.1667C11.6668 11.9899 11.737 11.8203 11.862 11.6953C11.987 11.5703 12.1565 11.5 12.3333 11.5H17.3907L15.862 9.97135C15.737 9.84638 15.6668 9.67682 15.6668 9.50004C15.6668 9.32326 15.737 9.1537 15.862 9.02865Z"
              fill="var(--color-purple)"
            />
          </svg>

          <span className="whitespace-nowrap">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}

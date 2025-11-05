import React from "react";
import { NavLink } from "react-router-dom";
import Homesidebar from "../assets/icon/homesidebar.svg";
import Employeeside from "../assets/icon/employeeside.svg";
import WalletSide from "../assets/icon/walletSide.svg";
import Booking from "../assets/icon/booking.svg";
import Setting from "../assets/icon/setting.svg";
import Logo from "../assets/icon/rezly-logo.svg";

export default function Sidebar({ onClose, onSelectTab }) {
  const menu = [
    { to: "/dashboard", label: "الصفحة الرئيسية", icon: Homesidebar },
    { to: "/dashboard/clients", label: "إدارة العملاء", icon: Booking },
    { to: "/dashboard/employees", label: "طاقم العمل", icon: Employeeside },
    { to: "/dashboard/finance", label: "المالية", icon: WalletSide },
    { to: "/dashboard/setting", label: "الإعدادات", icon: Setting },
  ];

  return (
    <aside
      className="w-64 bg-bg p-3 flex flex-col min-h-screen overflow-y-auto font-cairo transition-all duration-300"
      dir="rtl"
    >
      {/* 🔹 اللوجو */}
      <div className="logo p-3 flex justify-center items-center border-b border-[#eee] mb-3">
        <img src={Logo} alt="logo" className="w-32 h-auto" />
      </div>

      {/* 🔹 القوائم */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {menu.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={() => {
                  onSelectTab && onSelectTab(item.label);
                  onClose && onClose(); // لإغلاق السايدبار بالموبايل
                }}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 
                  ${
                    isActive
                      ? "bg-white text-black font-[700]"
                      : "text-[var(--color-greytext)] hover:bg-white"
                  }`
                }
              >
                <div className="w-7 h-7 rounded-[12px] flex items-center justify-center bg-[var(--color-purple)]">
                  <img src={item.icon} className="w-4 h-4" alt="" />
                </div>
                <span className="text-[14px]">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* 🔹 تسجيل الخروج */}
      <div className="mt-auto pt-4 border-t border-[#eee]">
        <NavLink
          to="/login"
          onClick={onClose}
          className="w-full flex items-center justify-start text-[14px] p-3 rounded-xl text-[var(--color-greytext)] hover:bg-white"
        >
          <svg
            width="26"
            height="26"
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
          <span className="ms-2">تسجيل الخروج</span>
        </NavLink>
      </div>
    </aside>
  );
}

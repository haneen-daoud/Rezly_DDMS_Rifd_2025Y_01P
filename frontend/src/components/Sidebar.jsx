import React from "react";
import { NavLink } from "react-router-dom";
import Homesidebar from "../assets/icon/homesidebar.svg";
import Employeeside from "../assets/icon/employeeside.svg";
import WalletSide from "../assets/icon/walletSide.svg";
import Booking from "../assets/icon/booking.svg";
import Logo from "../assets/icon/rezly-logo.svg";

export default function Sidebar({ onClose, onSelectTab }) {
  const menu = [
    { to: "/dashboard", label: "الصفحة الرئيسية", icon: Homesidebar },
    { to: "/dashboard/clients", label: "إدارة العملاء", icon: Booking },
    { to: "/dashboard/employees", label: "طاقم العمل", icon: Employeeside },
    { to: "/dashboard/finance", label: "المالية", icon: WalletSide },
  ];

  return (
    <aside className="w-64 bg-bg p-2 flex flex-col  min-h-[150vh] overflow-y-auto scroll-smooth font-cairo">
      <div className="logo p-2">
        <img src={Logo} alt="logo" className="w-30 h-13 m-auto" />
      </div>

      <nav className="flex-1 mt-3">
        <ul className="space-y-4">
          {menu.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => {
                  onSelectTab && onSelectTab(item.label);
                  onClose && onClose();
                }}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 p-3 rounded-xl transition 
                ${isActive ? "bg-white text-black  font-[700]" : "text-[var(--color-greytext)] hover:bg-white"}`
                }
              >
                <div className="w-7 h-7 rounded-[12px] flex items-center justify-center bg-[var(--color-purple)]">
                  <img src={item.icon} className="w-4 h-4" alt="" />
                </div>

                <span className="text-[14px] font-cairo">
                  {item.label}
                </span>
              </NavLink>

            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex">
        <NavLink
          to="/login"
          className="w-full flex items-center justify-start text-[14px] p-3 rounded-xl text-[var(--color-greytext)]"
        >
          <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11 8.83337C10.4696 8.83337 9.96086 9.04409 9.58579 9.41916C9.21071 9.79423 9 10.3029 9 10.8334V20.1667C9 20.6971 9.21071 21.2058 9.58579 21.5809C9.96086 21.956 10.4696 22.1667 11 22.1667H15C15.5304 22.1667 16.0391 21.956 16.4142 21.5809C16.7893 21.2058 17 20.6971 17 20.1667V10.8334C17 10.3029 16.7893 9.79423 16.4142 9.41916C16.0391 9.04409 15.5304 8.83337 15 8.83337H11ZM17.862 12.362C17.987 12.2371 18.1566 12.1668 18.3333 12.1668C18.5101 12.1668 18.6796 12.2371 18.8047 12.362L21.4713 15.0287C21.5963 15.1537 21.6665 15.3233 21.6665 15.5C21.6665 15.6768 21.5963 15.8464 21.4713 15.9714L18.8047 18.638C18.6789 18.7595 18.5105 18.8267 18.3357 18.8252C18.1609 18.8236 17.9937 18.7535 17.8701 18.6299C17.7465 18.5063 17.6764 18.3391 17.6749 18.1643C17.6734 17.9895 17.7406 17.8211 17.862 17.6954L19.3907 16.1667H13.6667C13.4899 16.1667 13.3203 16.0965 13.1953 15.9714C13.0702 15.8464 13 15.6769 13 15.5C13 15.3232 13.0702 15.1537 13.1953 15.0286C13.3203 14.9036 13.4899 14.8334 13.6667 14.8334H19.3907L17.862 13.3047C17.737 13.1797 17.6668 13.0101 17.6668 12.8334C17.6668 12.6566 17.737 12.4871 17.862 12.362Z"
              fill="var(--color-purple)"
            />
          </svg>
          <span className="text-[var(--color-greytext)]">تسجيل الخروج</span>
        </NavLink>
      </div>
    </aside>
  );
}

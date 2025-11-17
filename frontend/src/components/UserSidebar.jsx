import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Homesidebar from "../assets/icon/homesidebar.svg";
import Booking from "../assets/icon/booking.svg";
import Setting from "../assets/icon/setting.svg";
import Logo from "../assets/icon/rezly-logo.svg";

export default function UserSidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { to: "/user", label: "نظرة عامة", icon: Homesidebar },
    { to: "/user/subscription", label: "الحجوزات", icon: Booking },
    { to: "/user/profile2", label: "متابعة التقدّم", icon: Setting },
    { to: "/user/profile3", label: " عضويتي", icon: Setting },
    { to: "/user/profile", label: "الملف الشخصي", icon: Setting },
  ];

  const isActive = (path) => {
    if (path === "/user") return location.pathname === "/user";
    return location.pathname.startsWith(path);
  };

  const handleClick = (item) => {
    navigate("/user");
    onClose && onClose();
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
          <button
            key={item.to}
            onClick={() => handleClick(item)}
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
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-[12px] flex items-center justify-center bg-[var(--color-purple)]">
                <img src={item.icon} className="w-4 h-4" alt="" />
              </div>

              <span className="text-[14px] whitespace-nowrap truncate">
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </nav>

      {/* تسجيل الخروج */}
      <div className="mt-auto pt-5 border-top border-[#eee]">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
            onClose && onClose();
          }}
          className="flex items-center gap-2 text-[14px] text-[#7E818C] hover:text-black transition-colors duration-200 w-full"
        >
          <span className="whitespace-nowrap">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}

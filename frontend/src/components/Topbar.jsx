import React from "react";
import AdminImg from "../img/admin-img.jpg";
import Logo from "../assets/icon/rezly-logo.svg";
import SearchIcon from "../icons/search.svg?react";
import PromotionIcon from "../icons/promotion.svg?react";
import NotificationIcon from "../icons/notification.svg?react";
import DownVectorIcon from "../icons/downVector.svg?react";

export default function Topbar({ title, onMenuClick, user }) {
  const roleArabic = {
    admin: "آدمن",
    coach: "مدرب",
    receptionist: "استقبال",
    accountant: "محاسب",
    member: "مشترك",
  };

  const userName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const userRole = roleArabic[user?.role?.toLowerCase()] || "مستخدم";

  // 👇 لو عنده صورة من الداتا استعمليها، غير هيك استعملي الصورة الثابتة كباك أب
  const avatarSrc = user?.image || AdminImg;

  return (
    <>
      {/* ديسكتوب */}
      <header
        className="
          hidden lg:flex w-full items-center justify-between 
          px-6 
          h-[72px] 
          font-cairo
        "
      >
        {/* العنوان */}
        <h2 className="text-black text-[16px] font-bold leading-[24px] break-words">
          {title}
        </h2>

        {/* العناصر الجانبية */}
        <div className="flex gap-7 items-center">
          <div className="icon-box flex gap-4 items-center">
            <SearchIcon className="w-6 h-6 text-[var(--color-purple)]" />

            <div className="relative">
              <PromotionIcon className="w-6 h-6 text-[var(--color-purple)]" />
              {/*
              <span className="absolute -top-1 -right-0 bg-[var(--color-danger)] text-white text-[10px] px-1 rounded-full">
                2
              </span>
              */}
            </div>

            <div className="relative">
              <NotificationIcon className="w-6 h-6 text-[var(--color-purple)]" />
              {/*
              <span className="absolute -top-1 -right-0 bg-[var(--color-danger)] text-white text-[10px] px-1 rounded-full">
                4
              </span>
              */}
            </div>
          </div>

          {/* صورة المستخدم */}
          <div className="flex items-center gap-3 py-1">
            <DownVectorIcon className="w-3 h-5 text-[var(--color-purple)]" />

            <div className="flex flex-col text-right leading-tight">
              <span className="text-black text-[12px] font-[600]">
                {userName || "مستخدم"}
              </span>

              <span className="text-[var(--color-purple)] text-[12px] font-[700]">
                {userRole}
              </span>
            </div>

            <img
              src={avatarSrc}
              width="40"
              height="40"
              className="rounded-full object-cover"
              alt="user"
            />
          </div>
        </div>
      </header>

      {/* موبايل */}
      <header className="flex lg:hidden w-full items-center justify-between bg-white px-4 h-[72px] shadow-sm">
        <button
          onClick={onMenuClick}
          className="flex flex-col justify-center items-center w-10 h-10 rounded-md bg-white"
        >
          <span className="block w-6 h-[3px] bg-[var(--color-purple)] mb-[5px] rounded"></span>
          <span className="block w-6 h-[3px] bg-[var(--color-purple)] mb-[5px] rounded"></span>
          <span className="block w-6 h-[3px] bg-[var(--color-purple)] rounded"></span>
        </button>

        <img src={Logo} alt="logo" className="w-24 h-auto" />

        <img
          src={avatarSrc}
          alt="user"
          className="w-10 h-10 rounded-full border border-[#eee] object-cover"
        />
      </header>
    </>
  );
}

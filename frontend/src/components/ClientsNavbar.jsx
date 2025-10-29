import React from "react";

export default function ClientsNavbar({
  tabs,
  activeTab,
  setActiveTab,
  totalMembers,
  totalBookings,
  onAddClick,
  onFilterClick,
  searchValue,
  setSearchValue,
}) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 🔹 التابات */}
      <div className="flex bg-white">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2.5 text-base cursor-pointer relative pb-1 text-[12px] font-[600] font-Cairo leading-[150%] text-center transition ${
              activeTab === tab ? "" : "text-[var(--grey,#7E818C)]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-15 h-[2px] bg-[var(--color-purple)] rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* 🔹 شريط الأدوات */}
      <div className="flex justify-between items-center p-2">
        {/* اليمين */}
        <div className="flex items-center gap-3">
          {(activeTab === "المشتركين" || activeTab === "الحجوزات") && (
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 bg-[var(--color-purple)] text-white px-2 py-1 rounded-lg transition"
            >
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.333 7.66699C12.7011 7.66699 12.9998 7.96497 13 8.33301V10H14.667C15.035 10.0002 15.333 10.2989 15.333 10.667C15.3328 11.0349 15.0349 11.3328 14.667 11.333H13V13C13 13.3682 12.7012 13.667 12.333 13.667C11.965 13.6668 11.667 13.3681 11.667 13V11.333H10C9.63192 11.333 9.33318 11.035 9.33301 10.667C9.33301 10.2988 9.63181 10 10 10H11.667V8.33301C11.6672 7.96508 11.9651 7.66717 12.333 7.66699ZM7.33301 7.83301C8.57388 7.83301 9.71278 8.27092 10.6035 9H10C9.07953 9 8.33301 9.74652 8.33301 10.667C8.33318 11.5873 9.07963 12.333 10 12.333H10.667V13C10.667 13.1742 10.6936 13.3422 10.7432 13.5H1.33301C1.05702 13.4998 0.833008 13.276 0.833008 13C0.833008 10.1465 3.14653 7.83301 6 7.83301H7.33301ZM6.66699 0.5C8.41574 0.500176 9.83301 1.9182 9.83301 3.66699C9.83283 5.41564 8.41564 6.83283 6.66699 6.83301C4.9182 6.83301 3.50018 5.41574 3.5 3.66699C3.5 1.91809 4.91809 0.5 6.66699 0.5Z"
                  fill="white"
                />
              </svg>
              <span className="text-[12px] font-[600] font-Cairo">
                {activeTab === "المشتركين"
                  ? "اضافة مشترك"
                  : "اضافة حجز"}
              </span>
            </button>
          )}

          {/* 🔹 الفلترة (فقط للحجوزات) */}
          {activeTab === "الحجوزات" && (
            <div
              onClick={onFilterClick}
              className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-gray-900"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.5 1.66667C0.5 1.02233 1.02234 0.5 1.66667 0.5H12.3333C12.9777 0.5 13.5 1.02233 13.5 1.66667V3.35442C13.5 3.70066 13.3462 4.02902 13.0802 4.25067L9.51659 7.22037C9.48496 7.24672 9.46421 7.28385 9.45833 7.32459L8.87068 11.3954C8.81609 11.7735 8.57982 12.101 8.23818 12.272L6.74583 13.019C6.01978 13.3824 5.15376 12.9115 5.06409 12.1045L4.53269 7.32194C4.52794 7.27915 4.50682 7.23987 4.47374 7.21231L0.919785 4.25067C0.653793 4.02902 0.5 3.70066 0.5 3.35442V1.66667Z"
                  fill="#6A0EAD"
                />
              </svg>
              <span className="text-[12px] font-[600] font-Cairo leading-[150%]">
                فلترة حسب
              </span>
            </div>
          )}

          {/* العدادات */}
          <div className="flex items-center gap-3 px-3 py-1">
            <div className="flex items-center gap-1">
              <span className="text-[12px] text-gray-700">👥</span>
              <span className="text-[12px]">{totalMembers}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[12px] text-gray-700">📅</span>
              <span className="text-[12px]">{totalBookings}</span>
            </div>
          </div>
        </div>

        {/* 🔹 البحث */}
        <div className="flex w-[241px] h-[32px] gap-2 px-2 py-1 rounded-[10px] bg-white border border-gray-200">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6.33301 0.666992C9.46251 0.666992 11.9998 3.20354 12 6.33301C12 7.65733 11.5435 8.8741 10.7822 9.83887L11.8047 10.8623L11.7793 10.8867C12.2287 10.754 12.7352 10.866 13.0898 11.2207L14.7793 12.9102C15.2955 13.4263 15.2955 14.2631 14.7793 14.7793C14.2631 15.2955 13.4263 15.2955 12.9102 14.7793L11.2207 13.0898C10.866 12.7352 10.754 12.2287 10.8867 11.7793L10.8623 11.8047L9.83887 10.7822C8.8741 11.5435 7.65733 12 6.33301 12C3.20354 11.9998 0.666992 9.46251 0.666992 6.33301C0.667168 3.20365 3.20365 0.667168 6.33301 0.666992ZM6.33301 2C3.94003 2.00018 2.00018 3.94003 2 6.33301C2 8.72613 3.93992 10.6668 6.33301 10.667C8.72624 10.667 10.667 8.72624 10.667 6.33301C10.6668 3.93992 8.72613 2 6.33301 2Z"
              fill="#6A0EAD"
            />
          </svg>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={
              activeTab === "المشتركين"
                ? "ابحث عن المشترك..."
                : "ابحث عن الحجز..."
            }
            className="w-full text-[12px] text-[var(--color-greytext)] outline-none"
          />
        </div>
      </div>
    </div>
  );
}

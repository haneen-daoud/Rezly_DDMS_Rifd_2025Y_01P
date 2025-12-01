import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BookingIcon from "../icons/booking.svg?react";
import MembersIcon from "../icons/addpeople.svg?react";
import FilterIcon from "../icons/filter.svg?react";
import BookingNumberIcon from "../icons/bookingNumber.svg?react";
import MembersNumberIcon from "../icons/people.svg?react";
import SearchIcon from "../icons/search.svg?react";

//  التابات الرئيسية لإدارة العملاء
const tabs = [
  { name: "الحجوزات", path: "bookings" },
  { name: "المشتركين", path: "members" },
  { name: "سجل الحضور", path: "attendance" },
  { name: "التقارير", path: "reports" },
  { name: "الإعدادات", path: "settings" },
];

export default function ClientsHeader({
  activeTab,
  setActiveTab,
  totalMembers,
  totalBookings,
  handleAddBookingClick,
  onOpenFilter,
  onSearchChange,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = React.useState(null);

  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const role = (parsed.role || "").toLowerCase();
        setUserRole(role);
      }
    } catch (err) {
      console.error(
        "[ClientsHeader] فشل قراءة currentUser من localStorage:",
        err
      );
    }
  }, []);

  const isCoach = userRole === "coach";

  //  عند الضغط على تب → يغير التاب والرابط
  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    navigate(`/dashboard/clients/${tab.path}`);
  };

  // استخراج المسار الحالي لمعرفة التاب النشط
  const currentPath = location.pathname.split("/")[3];

  return (
    <div className="w-full">
      {/*  التابات (ديسكتوب) */}
      <div
        className="hidden md:flex bg-white items-center px-4 h-[40px] border-b border-[#E5E7EB]"
        style={{ gap: "12px" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab)}
            className={`relative text-[12px] font-semibold font-Cairo leading-[150%] pb-[3px] transition-colors duration-200 cursor-pointer ${
              // ✅ التاب النشط لو المسار يطابق الرابط أو الـ activeTab
              activeTab === tab.name || currentPath === tab.path
                ? "text-[var(--color-purple)]"
                : "text-[#7E818C]"
            }`}
          >
            {tab.name}
            {(activeTab === tab.name || currentPath === tab.path) && (
              <span className="absolute bottom-[-10px] left-[-8px] right-[-8px] h-[3px] bg-[var(--color-purple)] rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      <div className="hidden md:block h-[20px]"></div>

      {/* الأدوات (بحث + إضافة + فلترة + عدادات) */}
      <div
        className="
          flex flex-col md:flex-row md:justify-between md:items-center 
          gap-3 md:gap-0
          bg-transparent
        "
      >
        {/* البحث والفلترة للموبايل */}
        <div className="flex items-center gap-2 w-full md:hidden">
          {/* مربع البحث */}
          <div className="flex items-center bg-white w-full h-[40px] rounded-[8px] px-[12px] gap-[8px] border border-[#7E818C]">
            <SearchIcon className="w-5 h-5 text-[var(--color-purple)]" />
            <input
              type="text"
              placeholder={
                activeTab === "الحجوزات" ? "ابحث عن حجز" : "ابحث عن مشترك"
              }
              className="w-full outline-none bg-transparent text-[12px] font-semibold font-Cairo text-[#7E818C] placeholder-[#7E818C]"
              onChange={(e) => {
                if (onSearchChange && activeTab === "المشتركين") {
                  onSearchChange(e.target.value);
                }
              }}
            />
          </div>

          {/* زر الفلتر */}
          {(activeTab === "الحجوزات" || activeTab === "المشتركين") && (
            <div
              className="w-[40px] h-[40px] flex items-center justify-center bg-white rounded-md cursor-pointer hover:bg-gray-50 border border-[#7E818C]"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();

                if (activeTab === "الحجوزات") {
                  onOpenFilter && onOpenFilter(rect); //  نمرر مكان الزر
                } else if (activeTab === "المشتركين") {
                  window.dispatchEvent(
                    new CustomEvent("openSubscribersFilter", {
                      detail: { rect },
                    })
                  );
                }
              }}
            >
              <FilterIcon className="w-5 h-5 text-[var(--color-purple)]" />
            </div>
          )}
        </div>

        {/* زر الإضافة + العدادات */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {/* زر الإضافة */}
          {// في تبويب الحجوزات: الكل يقدر يضيف (أدمن + استقبال + مدرب)
          (activeTab === "الحجوزات" ||
            // في تبويب المشتركين: بس لو مش مدرب
            (activeTab === "المشتركين" && !isCoach)) && (
            <button
              onClick={handleAddBookingClick}
              className="
      flex items-center justify-center gap-[8px]
      bg-[var(--color-purple)] text-white 
      w-full lg:w-[144px] h-[40px] sm:h-[32px]
      rounded-lg transition
      text-sm font-semibold font-Cairo cursor-pointer
    "
            >
              {activeTab === "المشتركين" ? (
                <MembersIcon className="w-4 h-4" />
              ) : (
                <BookingIcon className="w-4 h-4" />
              )}
              <span>
                {activeTab === "المشتركين" ? "إضافة مشترك" : "إضافة حجز"}
              </span>
            </button>
          )}

          {/* زر الفلتر والعدادات (ديسكتوب) */}
          <div className="hidden md:flex items-center gap-3 w-full sm:w-auto">
            {(activeTab === "الحجوزات" || activeTab === "المشتركين") && (
              <div
                className="
      w-8 h-8 
      flex items-center justify-center 
      bg-white rounded-md cursor-pointer hover:bg-gray-50
    "
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();

                  if (activeTab === "الحجوزات") {
                    onOpenFilter && onOpenFilter(rect); //  نمرر مكان الزر
                  } else if (activeTab === "المشتركين") {
                    window.dispatchEvent(
                      new CustomEvent("openSubscribersFilter", {
                        detail: { rect },
                      })
                    );
                  }
                }}
              >
                <FilterIcon className="w-5 h-5 text-[var(--color-purple)]" />
              </div>
            )}

            {/*  العدادات */}
            <div className="flex items-center gap-[4px] ml-[8px]">
              {activeTab === "المشتركين" ? (
                <>
                  <MembersNumberIcon className="w-5 h-5 text-[var(--color-purple)]" />
                  <span className="text-[12px]">{totalMembers}</span>
                </>
              ) : activeTab === "الحجوزات" ? (
                <>
                  <BookingNumberIcon className="w-5 h-5 text-[var(--color-purple)]" />
                  <span className="text-[12px]">{totalBookings}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* البحث (ديسكتوب) */}
        <div className="hidden md:flex items-center bg-white w-[241px] h-[32px] rounded-[8px] px-[12px] gap-[8px]">
          <SearchIcon className="w-5 h-5 text-[var(--color-purple)]" />
          <input
            type="text"
            placeholder={
              activeTab === "الحجوزات" ? "ابحث عن حجز" : "ابحث عن مشترك"
            }
            className="w-full outline-none bg-transparent text-[12px] font-semibold font-Cairo text-[#7E818C] placeholder-[#7E818C]"
            onChange={(e) => {
              if (onSearchChange && activeTab === "المشتركين") {
                onSearchChange(e.target.value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

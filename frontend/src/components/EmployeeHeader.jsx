import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ للتحكم بالتنقل والصفحة الحالية
import SearchIcon from "../icons/search.svg?react";
import FilterIcon from "../icons/filter.svg?react";
import MembersIcon from "../icons/addpeople.svg?react";
import MembersNumberIcon from "../icons/people.svg?react";
import EmployeeFilter from "../components/Filter/EmployeesFilter";
// ✅ التابات الفرعية لطاقم العمل
const tabs = [
  { name: "الموظفين", path: "staff" },
  { name: "الصلاحيات", path: "roles" },
  { name: "التقارير", path: "reports" },
  { name: "الإعدادات", path: "settings" },
];

export default function EmployeesHeader({
  activeTab,
  setActiveTab,
  totalEmployees = 0,
  handleAddEmployeeClick,
  activeIconIndex,
  setActiveIconIndex,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ تغيير التاب والرابط معاً عند الضغط
  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    navigate(`/dashboard/employees/${tab.path}`);
  };
const [showFilter, setShowFilter] = useState(false);

  // ✅ تحديد التاب الحالي من URL
  const currentPath = location.pathname.split("/")[3];

  return (
    <div className="w-full flex flex-col gap-3">
      {/* ✅ التابات (ديسكتوب) */}
      <div className="hidden md:flex bg-white items-center px-4 h-[40px] border-b border-[#E5E7EB] gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab)} // ← التنقل للرابط الجديد
            className={`relative text-[12px] font-semibold font-Cairo pb-[3px] transition-colors duration-200 ${
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

      {/* ✅ الصف العلوي للأزرار والبحث */}
      <div className="hidden md:flex justify-between items-center w-full gap-3">
        {/* القسم الأيمن: إضافة + فلترة + عدد الموظفين */}
        <div className="flex items-center gap-2">
          {activeTab === "الموظفين" && (
            <button
              onClick={handleAddEmployeeClick}
              className="flex items-center justify-center gap-[8px] bg-[var(--color-purple)] text-white h-[36px] px-3 rounded-lg text-sm font-semibold font-Cairo transition"
            >
              <MembersIcon className="w-4 h-4" />
              <span>إضافة موظف</span>
            </button>
          )}

          <div
            className="w-9 h-9 flex items-center justify-center bg-white rounded-md cursor-pointer "
            onClick={() =>
              window.dispatchEvent(new CustomEvent("openEmployeesFilter"))
            }
          >
            <button onClick={() => setShowFilter(!showFilter)}>
            <FilterIcon className="w-5 h-5 text-[var(--color-purple)]" />
</button>
<div className="relative">
  <button onClick={() => setShowFilter(!showFilter)}>
    <i className="fa-solid fa-filter text-purple-600 text-xl"></i>
  </button>

  <EmployeeFilter
    isOpen={showFilter}
    onClose={() => setShowFilter(false)}
  />
</div>


          </div>

          <div className="flex items-center gap-[4px] px-3 rounded-lg">
            <MembersNumberIcon className="w-5 h-5 text-[var(--color-purple)]" />
            <span className="text-[12px]">{totalEmployees}</span>
          </div>
        </div>

        {/* القسم الأيسر: التبديل بين العرضين + البحث */}
        <div className="flex items-center gap-2">
          {/* ✅ أيقونات التبديل بين كارت وجدول */}
          <div className="flex gap-2">
            <div
              role="button"
              tabIndex={0}
              aria-pressed={activeIconIndex === 0}
              onClick={() => setActiveIconIndex(0)}
              className={`cursor-pointer p-2 border rounded-md transition-colors ${
                activeIconIndex === 0
                  ? "bg-[var(--color-purple)]"
                  : "bg-white"
              } border-gray-300`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 11.25C7.9665 11.25 8.75 12.0335 8.75 13V18C8.75 18.9665 7.9665 19.75 7 19.75H2C1.0335 19.75 0.25 18.9665 0.25 18V13C0.25 12.0335 1.0335 11.25 2 11.25H7ZM18 11.25C18.9665 11.25 19.75 12.0335 19.75 13V18C19.75 18.9665 18.9665 19.75 18 19.75H13C12.0335 19.75 11.25 18.9665 11.25 18V13C11.25 12.0335 12.0335 11.25 13 11.25H18ZM7 0.25C7.9665 0.25 8.75 1.0335 8.75 2V7C8.75 7.9665 7.9665 8.75 7 8.75H2C1.0335 8.75 0.25 7.9665 0.25 7V2C0.25 1.0335 1.0335 0.25 2 0.25H7ZM18 0.25C18.9665 0.25 19.75 1.0335 19.75 2V7C19.75 7.9665 18.9665 8.75 18 8.75H13C12.0335 8.75 11.25 7.9665 11.25 7V2C11.25 1.0335 12.0335 0.25 13 0.25H18Z"
                  fill={activeIconIndex === 0 ? "#fff" : "#6A0EAD"}
                />
              </svg>
            </div>

            <div
              role="button"
              tabIndex={0}
              aria-pressed={activeIconIndex === 1}
              onClick={() => setActiveIconIndex(1)}
              className={`cursor-pointer p-2 border rounded-md transition-colors ${
                activeIconIndex === 1
                  ? "bg-[var(--color-purple)]"
                  : "bg-white"
              } border-gray-300`}
            >
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                <path
                  d="M19 15.5C19.5523 15.5 20 15.9477 20 16.5C20 17.0523 19.5523 17.5 19 17.5H1C0.447715 17.5 0 17.0523 0 16.5C0 15.9477 0.447715 15.5 1 15.5H19ZM19 10.5C19.5523 10.5 20 10.9477 20 11.5C20 12.0523 19.5523 12.5 19 12.5H1C0.447715 12.5 0 12.0523 0 11.5C0 10.9477 0.447715 10.5 1 10.5H19ZM19 5.5C19.5523 5.5 20 5.94772 20 6.5C20 7.05228 19.5523 7.5 19 7.5H1C0.447715 7.5 0 7.05228 0 6.5C0 5.94772 0.447715 5.5 1 5.5H19ZM19 0.5C19.5523 0.5 20 0.947715 20 1.5C20 2.05228 19.5523 2.5 19 2.5H1C0.447715 2.5 0 2.05228 0 1.5C0 0.947715 0.447715 0.5 1 0.5H19Z"
                  fill={activeIconIndex === 1 ? "#fff" : "#6A0EAD"}
                />
              </svg>
            </div>
          </div>

          {/* ✅ مربع البحث */}
          <div className="flex items-center bg-white w-[241px] h-[36px] rounded-[8px] px-[12px] gap-[8px] ">
            <SearchIcon className="w-5 h-5 text-[var(--color-purple)]" />
            <input
              type="text"
              placeholder="ابحث عن موظف"
              className="w-full outline-none text-[12px] font-semibold font-Cairo text-[#7E818C] placeholder-[#7E818C] bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* ✅ واجهة الموبايل */}
      <div className="flex flex-col md:hidden w-full gap-2">
        {/* البحث + الفلترة */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex items-center flex-1 bg-white h-[38px] rounded-[8px] px-[12px] gap-[8px] border border-gray-300">
            <SearchIcon className="w-5 h-5 text-[var(--color-purple)]" />
            <input
              type="text"
              placeholder="ابحث عن موظف"
              className="w-full outline-none text-[13px] font-semibold font-Cairo text-[#7E818C] placeholder-[#7E818C] bg-transparent"
            />
          </div>

          <div
            className="w-[42px] h-[38px] flex items-center justify-center bg-white rounded-[8px] border border-gray-300 cursor-pointer hover:bg-gray-50"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("openEmployeesFilter"))
            }
          >
            <FilterIcon className="w-5 h-5 text-[var(--color-purple)]" />
          </div>
        </div>

        {/* زر الإضافة + التبديل */}
        <div className="flex items-center gap-2 w-full">
          {activeTab === "الموظفين" && (
            <button
              onClick={handleAddEmployeeClick}
              className="flex-1 flex items-center justify-center gap-[6px] bg-[var(--color-purple)] text-white h-[38px] px-3 rounded-lg text-sm font-semibold font-Cairo transition"
            >
              <MembersIcon className="w-4 h-4" />
              <span>إضافة موظف</span>
            </button>
          )}

          <div className="flex gap-2">
            <div
              role="button"
              tabIndex={0}
              aria-pressed={activeIconIndex === 0}
              onClick={() => setActiveIconIndex(0)}
              className={`cursor-pointer p-2 border rounded-md transition-colors ${
                activeIconIndex === 0
                  ? "bg-[var(--color-purple)]"
                  : "bg-white"
              } border-gray-300`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 11.25C7.9665 11.25 8.75 12.0335 8.75 13V18C8.75 18.9665 7.9665 19.75 7 19.75H2C1.0335 19.75 0.25 18.9665 0.25 18V13C0.25 12.0335 1.0335 11.25 2 11.25H7ZM18 11.25C18.9665 11.25 19.75 12.0335 19.75 13V18C19.75 18.9665 18.9665 19.75 18 19.75H13C12.0335 19.75 11.25 18.9665 11.25 18V13C11.25 12.0335 12.0335 11.25 13 11.25H18ZM7 0.25C7.9665 0.25 8.75 1.0335 8.75 2V7C8.75 7.9665 7.9665 8.75 7 8.75H2C1.0335 8.75 0.25 7.9665 0.25 7V2C0.25 1.0335 1.0335 0.25 2 0.25H7ZM18 0.25C18.9665 0.25 19.75 1.0335 19.75 2V7C19.75 7.9665 18.9665 8.75 18 8.75H13C12.0335 8.75 11.25 7.9665 11.25 7V2C11.25 1.0335 12.0335 0.25 13 0.25H18Z"
                  fill={activeIconIndex === 0 ? "#fff" : "#6A0EAD"}
                />
              </svg>
            </div>

            <div
              role="button"
              tabIndex={0}
              aria-pressed={activeIconIndex === 1}
              onClick={() => setActiveIconIndex(1)}
              className={`cursor-pointer p-2 border rounded-md transition-colors ${
                activeIconIndex === 1
                  ? "bg-[var(--color-purple)]"
                  : "bg-white"
              } border-gray-300`}
            >
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                <path
                  d="M19 15.5C19.5523 15.5 20 15.9477 20 16.5C20 17.0523 19.5523 17.5 19 17.5H1C0.447715 17.5 0 17.0523 0 16.5C0 15.9477 0.447715 15.5 1 15.5H19ZM19 10.5C19.5523 10.5 20 10.9477 20 11.5C20 12.0523 19.5523 12.5 19 12.5H1C0.447715 12.5 0 12.0523 0 11.5C0 10.9477 0.447715 10.5 1 10.5H19ZM19 5.5C19.5523 5.5 20 5.94772 20 6.5C20 7.05228 19.5523 7.5 19 7.5H1C0.447715 7.5 0 7.05228 0 6.5C0 5.94772 0.447715 5.5 1 5.5H19ZM19 0.5C19.5523 0.5 20 0.947715 20 1.5C20 2.05228 19.5523 2.5 19 2.5H1C0.447715 2.5 0 2.05228 0 1.5C0 0.947715 0.447715 0.5 1 0.5H19Z"
                  fill={activeIconIndex === 1 ? "#fff" : "#6A0EAD"}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

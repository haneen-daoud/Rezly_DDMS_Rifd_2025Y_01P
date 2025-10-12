// Employees.jsx
import React, { useState, useEffect } from "react";
import EmployeeTable from "../components/Tabs/EmployeeTable";
import EmployeeCardTab from "../components/Tabs/EmployeeCardTab.jsx";
import AddEmployeeModel from "../components/AddEmployeeModel/AddEmployeeModel.jsx";
import { getAllEmployees } from "../api.js";
import SearchIcon from "../icons/search.svg?react";

const tabs = ["الموظفين", "الصلاحيات", "التقارير", "الإعدادات"];

export default function Employees() {
  const [activeTab, setActiveTab] = useState("الموظفين");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeIconIndex, setActiveIconIndex] = useState(0); // 0 = EmployeeCard, 1 = SubscribersTab
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllEmployees();
        console.log(" بيانات الموظفين:", data);
        setEmployees(data.data?.employees || data.employees || data || []);
        setTotalEmployees(data.totalCount)
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الموظفين:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

const handleDeleteEmployee = (id) => {
  setEmployees(prev => {
    const updated = prev.filter(emp => emp._id !== id);
    setTotalEmployees(updated.length); // تحديث العدد بناءً على طول المصفوفة
    return updated;
  });
};



  const renderContent = () => {
    if (activeTab === "الموظفين") {
      return activeIconIndex === 0 ? <EmployeeCardTab /> : <EmployeeTable />;
    }
    return <div className="p-4 bg-white rounded-2xl shadow">محتوى {activeTab}</div>;
  };

  const handleIconKey = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIconIndex(index);
    }
  };

  return (
    <div className="flex flex-col gap-3 flex-1 w-full">
      {/* Navbar */}
      <div className="flex">
        <div className="flex w-full bg-white">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 text-base cursor-pointer relative pb-1 text-[12px] font-[600] font-Cairo leading-[150%] text-center transition ${activeTab === tab ? "" : "text-[var(--grey,#7E818C)]"}`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-15 h-[2px] bg-[var(--color-purple)] rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center p-2">
        {/* الجانب الأيمن */}
        <div className="flex flex-2 items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[var(--color-purple)] text-white px-2 py-1 rounded-lg transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12.333 8.66699C12.7011 8.66699 12.9998 8.96497 13 9.33301V11H14.667C15.035 11.0002 15.333 11.2989 15.333 11.667C15.3328 12.0349 15.0349 12.3328 14.667 12.333H13V14C13 14.3682 12.7012 14.667 12.333 14.667C11.965 14.6668 11.667 14.3681 11.667 14V12.333H10C9.63192 12.333 9.33318 12.035 9.33301 11.667C9.33301 11.2988 9.63181 11 10 11H11.667V9.33301C11.6672 8.96508 11.9651 8.66717 12.333 8.66699ZM7.33301 8.83301C8.57388 8.83301 9.71278 9.27092 10.6035 10H10C9.07953 10 8.33301 10.7465 8.33301 11.667C8.33318 12.5873 9.07963 13.333 10 13.333H10.667V14C10.667 14.1742 10.6936 14.3422 10.7432 14.5H1.33301C1.05702 14.4998 0.833008 14.276 0.833008 14C0.833008 11.1465 3.14653 8.83301 6 8.83301H7.33301ZM6.66699 1.5C8.41574 1.50018 9.83301 2.9182 9.83301 4.66699C9.83283 6.41564 8.41564 7.83283 6.66699 7.83301C4.9182 7.83301 3.50018 6.41574 3.5 4.66699C3.5 2.91809 4.91809 1.5 6.66699 1.5Z"
                fill="white"
              />
            </svg>
            <span className="text-[12px] font-[600] font-Cairo leading-[150%]">اضافة موظف</span>
          </button>

          {/* فلترة */}
          <div className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-gray-900">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.5 1.66667C0.5 1.02233 1.02234 0.5 1.66667 0.5H12.3333C12.9777 0.5 13.5 1.02233 13.5 1.66667V3.35442C13.5 3.70066 13.3462 4.02902 13.0802 4.25067L9.51659 7.22037C9.48496 7.24672 9.46421 7.28385 9.45833 7.32459L8.87068 11.3954C8.81609 11.7735 8.57982 12.101 8.23818 12.272L6.74583 13.019C6.01978 13.3824 5.15376 12.9115 5.06409 12.1045L4.53269 7.32194C4.52794 7.27915 4.50682 7.23987 4.47374 7.21231L0.919785 4.25067C0.653793 4.02902 0.5 3.70066 0.5 3.35442V1.66667Z" fill="#6A0EAD" />
            </svg>
          </div>

          {/* الأشخاص مع رقم */}
          <div className="flex items-center gap-1 px-3 py-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.39968 2.40658C5.36634 2.97324 4.65969 4.07317 4.65969 5.33317C4.65969 6.0065 4.85967 6.63984 5.20634 7.1665C3.87967 7.09984 2.82635 6.0065 2.82635 4.6665C2.82635 3.3265 3.94635 2.1665 5.32635 2.1665C5.70635 2.1665 6.07301 2.25324 6.39968 2.40658ZM5.51967 8.1665C3.86634 8.65984 2.66634 10.1865 2.66634 11.9998V13.1665H1.33301C1.05967 13.1665 0.833008 12.9398 0.833008 12.6665V11.3332C0.833008 9.5865 2.25301 8.1665 3.99967 8.1665H5.51967ZM7.99967 2.83317C6.61967 2.83317 5.49967 3.95317 5.49967 5.33317C5.49967 6.71317 6.61967 7.83317 7.99967 7.83317C9.37967 7.83317 10.4997 6.71317 10.4997 5.33317C10.4997 3.95317 9.37967 2.83317 7.99967 2.83317ZM6.66634 8.83317C4.91967 8.83317 3.49967 10.2532 3.49967 11.9998V13.3332C3.49967 13.6065 3.72634 13.8332 3.99967 13.8332H11.9997C12.273 13.8332 12.4997 13.6065 12.4997 13.3332V11.9998C12.4997 10.2532 11.0797 8.83317 9.33301 8.83317H6.66634ZM13.1663 4.6665C13.1663 6.0065 12.113 7.09984 10.7864 7.1665C11.133 6.63984 11.333 6.0065 11.333 5.33317C11.333 4.07317 10.633 2.97324 9.59302 2.40658C9.91968 2.25324 10.2797 2.1665 10.6663 2.1665C12.0463 2.1665 13.1663 3.2865 13.1663 4.6665ZM14.6663 13.1665H13.333V11.9998C13.333 10.1865 12.133 8.65984 10.4797 8.1665H11.9997C13.7463 8.1665 15.1663 9.5865 15.1663 11.3332V12.6665C15.1663 12.9398 14.9397 13.1665 14.6663 13.1665Z" fill="#6A0EAD" />
            </svg>
            <span className="text-[12px]">{totalEmployees || 0}</span>
          </div>
        </div>

        {/* الجانب الأيسر - أيقونات العرض */}
        <div className="flex justify-end align-center">
          <div className="iconbox flex justify-between gap-2">
            <div
              role="button"
              tabIndex={0}
              aria-pressed={activeIconIndex === 0}
              onClick={() => setActiveIconIndex(0)}
              onKeyDown={(e) => handleIconKey(e, 0)}
              className={`cursor-pointer p-2 border border-b-gray-300 rounded-md transition-colors
               ${activeIconIndex === 0 ? "bg-[#6A0EAD]" : "bg-white"}`}
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
              onKeyDown={(e) => handleIconKey(e, 1)}
              className={`cursor-pointer p-2 border border-gray-400 rounded-md transition-colors
              ${activeIconIndex === 1 ? "bg-[#6A0EAD]" : "bg-white"}`}
            >
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                <path
                  d="M19 15.5C19.5523 15.5 20 15.9477 20 16.5C20 17.0523 19.5523 17.5 19 17.5H1C0.447715 17.5 0 17.0523 0 16.5C0 15.9477
      0.447715 15.5 1 15.5H19ZM19 10.5C19.5523 10.5 20 10.9477 20 11.5C20 12.0523 19.5523 12.5 19 12.5H1C0.447715 12.5
      0 12.0523 0 11.5C0 10.9477 0.447715 10.5 1 10.5H19ZM19 5.5C19.5523 5.5 20 5.94772 20 6.5C20 7.05228 19.5523 7.5
      19 7.5H1C0.447715 7.5 0 7.05228 0 6.5C0 5.94772 0.447715 5.5 1 5.5H19ZM19 0.5C19.5523 0.5 20 0.947715 20 1.5C20
      2.05228 19.5523 2.5 19 2.5H1C0.447715 2.5 0 2.05228 0 1.5C0 0.947715 0.447715 0.5 1 0.5H19Z"
                  fill={activeIconIndex === 1 ? "#fff" : "#6A0EAD"}
                />
              </svg>
            </div>
            <div className=" flex justify-between w-[241px] h-[32px] gap-2 px-2 py-1 align-center  rounded-[10px] bg-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_1569_57)">
                <path d="M6.33301 0.666992C9.46251 0.666992 11.9998 3.20354 12 6.33301C12 7.65733 11.5435 8.8741 10.7822 9.83887L11.8047 10.8623L11.7793 10.8867C12.2287 10.754 12.7352 10.866 13.0898 11.2207L14.7793 12.9102C15.2955 13.4263 15.2955 14.2631 14.7793 14.7793C14.2631 15.2955 13.4263 15.2955 12.9102 14.7793L11.2207 13.0898C10.866 12.7352 10.754 12.2287 10.8867 11.7793L10.8623 11.8047L9.83887 10.7822C8.8741 11.5435 7.65733 12 6.33301 12C3.20354 11.9998 0.666992 9.46251 0.666992 6.33301C0.667168 3.20365 3.20365 0.667168 6.33301 0.666992ZM6.33301 2C3.94003 2.00018 2.00018 3.94003 2 6.33301C2 8.72613 3.93992 10.6668 6.33301 10.667C8.72624 10.667 10.667 8.72624 10.667 6.33301C10.6668 3.93992 8.72613 2 6.33301 2Z" fill="#6A0EAD" />
              </g>
              <defs>
                <clipPath id="clip0_1569_57">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <input
              type="text"
              placeholder="ابحث عن موظف..."
              className="w-full text-[12px] text-[var(--color-greytext)]"
            />

          </div>

          </div>
        </div>
      </div>

      {/* المحتوى حسب التاب والأيقونة */}
      {renderContent()}

      {isModalOpen && (
        <AddEmployeeModel
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => console.log("معلومات الموظف ", data)}
        />
      )}
    </div>
  );
}

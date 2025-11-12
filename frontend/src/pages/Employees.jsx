import React, { useState, useEffect } from "react";
import EmployeeTable from "../components/Tabs/EmployeeTable";
import EmployeeCardTab from "../components/Tabs/EmployeeCardTab.jsx";
import AddEmployeeModel from "../components/AddEmployeeModel/AddEmployeeModel.jsx";
import { getAllEmployees } from "../api.js";
import EmployeesHeader from "../components/EmployeeHeader.jsx";
import { useOutletContext, useNavigate, useLocation, Outlet } from "react-router-dom";

export default function Employees() {
  const [activeTab, setActiveTab] = useState("الموظفين");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeIconIndex, setActiveIconIndex] = useState(0); // 0 = Card, 1 = Table
  const [loading, setLoading] = useState(true);

  const { activeSubTab, setActiveSubTab } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ نقرأ التاب الحالي من الرابط (URL)
  useEffect(() => {
    const subPath = location.pathname.split("/")[3]; // → staff / roles / reports / settings
    const mapping = {
      staff: "الموظفين",
      roles: "الصلاحيات",
      reports: "التقارير",
      settings: "الإعدادات",
    };

    if (mapping[subPath]) {
      setActiveTab(mapping[subPath]);
      setActiveSubTab(mapping[subPath]);
    }
  }, [location.pathname]);

  // ✅ لما يتغير التاب من السايدبار → غيّر الرابط تلقائياً
  useEffect(() => {
    const reverseMapping = {
      الموظفين: "staff",
      الصلاحيات: "roles",
      التقارير: "reports",
      الإعدادات: "settings",
    };

    if (activeSubTab && reverseMapping[activeSubTab]) {
      navigate(`/dashboard/employees/${reverseMapping[activeSubTab]}`);
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  // ✅ جلب بيانات الموظفين
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllEmployees();
        setEmployees(data.data?.employees || data.employees || []);
        setTotalEmployees(data.totalCount || (data.data?.employees?.length || 0));
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الموظفين:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ حذف موظف وتحديث العدد
  const handleDeleteEmployee = (id) => {
    setEmployees((prev) => {
      const updated = prev.filter((emp) => emp._id !== id);
      setTotalEmployees(updated.length);
      return updated;
    });
  };

  // ✅ فتح مودال إضافة موظف
  const handleAddEmployeeClick = () => {
    setIsModalOpen(true);
  };

  // ✅ تحديد المحتوى حسب التاب
  const renderContent = () => {
    if (activeTab === "الموظفين") {
      return activeIconIndex === 0 ? (
        <EmployeeCardTab employees={employees} loading={loading} onDelete={handleDeleteEmployee} />
      ) : (
        <EmployeeTable employees={employees} loading={loading} onDelete={handleDeleteEmployee} />
      );
    }

    // بقية التابات (الصلاحيات / التقارير / الإعدادات)
    return (
      <div className="p-4 bg-white rounded-2xl shadow">
        محتوى {activeTab}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 flex-1 w-full">
      {/* ✅ الهيدر */}
      <EmployeesHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalEmployees={totalEmployees}
        handleAddEmployeeClick={handleAddEmployeeClick}
        activeIconIndex={activeIconIndex}
        setActiveIconIndex={setActiveIconIndex}
      />

      {/* ✅ المحتوى */}
      {renderContent()}

      {/* ✅ مودال إضافة موظف */}
      {isModalOpen && (
        <AddEmployeeModel
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => console.log("تم إضافة موظف:", data)}
        />
      )}

      <Outlet />
    </div>
  );
}

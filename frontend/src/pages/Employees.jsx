import React, { useState, useEffect } from "react";
import EmployeeTable from "../components/Tabs/EmployeeTable";
import EmployeeCardTab from "../components/Tabs/EmployeeCardTab.jsx";
import AddEmployeeModel from "../components/AddEmployeeModel/AddEmployeeModel.jsx";
import { getAllEmployees } from "../api.js";
import EmployeesHeader from "../components/EmployeeHeader.jsx";
import {
  useOutletContext,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { toast } from "react-toastify";

export default function Employees() {
  const [activeTab, setActiveTab] = useState("الموظفين");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeIconIndex, setActiveIconIndex] = useState(0); // 0 = Card, 1 = Table
  const [loading, setLoading] = useState(true);
  const EMPLOYEES_CACHE_KEY = "employees_cache_v1";

  const [filterData, setFilterData] = useState({});

  const { activeSubTab, setActiveSubTab } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  /* --------------------------------------------------------
      قراءة التاب الحالي من الرابط
  -------------------------------------------------------- */
  useEffect(() => {
    const subPath = location.pathname.split("/")[3]; // staff / roles / reports / settings

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

  /* --------------------------------------------------------
      تحديث الرابط عند تغيير التاب من السايدبار
  -------------------------------------------------------- */
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

  /* --------------------------------------------------------
      جلب الموظفين أول مرة
  -------------------------------------------------------- */
  /* --------------------------------------------------------
      جلب الموظفين أول مرة + كاش محلي
  -------------------------------------------------------- */
  useEffect(() => {
    // 1) جرّبي تجيبي بيانات من localStorage أولاً
    try {
      const cached = localStorage.getItem(EMPLOYEES_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed.list)) {
          setEmployees(parsed.list);
          setTotalEmployees(parsed.total || parsed.list.length);
          setLoading(false); // عندي بيانات جاهزة → ما في داعي أظهر اللودر
        }
      }
    } catch (err) {
      console.error("خطأ في قراءة الكاش:", err);
    }

    // 2) بعد هيك اعملي جلب حقيقي من الـ API لتحديث البيانات
    const fetchData = async () => {
      try {
        const data = await getAllEmployees();

        const list = data.data?.employees || data.employees || [];

        const cleanedList = Array.isArray(list) ? list : [];

        setEmployees(cleanedList);
        setTotalEmployees(data.totalCount || cleanedList.length);

        // خزّنيهم في الكاش
        try {
          localStorage.setItem(
            EMPLOYEES_CACHE_KEY,
            JSON.stringify({
              list: cleanedList,
              total: data.totalCount || cleanedList.length,
              updatedAt: Date.now(),
            })
          );
        } catch (err) {
          console.error("خطأ في تخزين الكاش:", err);
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الموظفين:", error);
        toast.error("فشل تحميل بيانات الموظفين");
      } finally {
        // إذا أول مرة ما كان في كاش، فاللودر رح يضل لحد هون
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* --------------------------------------------------------
      Refresh بعد الإضافة / التعديل
  -------------------------------------------------------- */
  const refreshEmployees = async () => {
    try {
      const data = await getAllEmployees();

      const list = data.data?.employees || data.employees || data.data || [];

      const cleanedList = Array.isArray(list) ? list : [];

      setEmployees(cleanedList);
      setTotalEmployees(cleanedList.length);

      // تحديث الكاش بعد الإضافة/التعديل
      try {
        localStorage.setItem(
          EMPLOYEES_CACHE_KEY,
          JSON.stringify({
            list: cleanedList,
            total: cleanedList.length,
            updatedAt: Date.now(),
          })
        );
      } catch (err) {
        console.error("خطأ في تخزين الكاش بعد التحديث:", err);
      }

      return cleanedList;
    } catch (error) {
      console.error("Error refreshing employees:", error);
      toast.error("فشل تحديث بيانات الموظفين");
      return [];
    }
  };

  const handleApplyFilters = async (filters) => {
  try {
    setLoading(true);
    setFilterData(filters);

    const data = await getAllEmployees(filters);

    const list = data.data?.employees || data.employees || data.data || [];
    const cleanedList = Array.isArray(list) ? list : [];

    setEmployees(cleanedList);
    setTotalEmployees(data.totalCount || cleanedList.length);
  } catch (error) {
    console.error("Error applying employee filters:", error);
    // لو عندك toast:
    // toast.error("فشل تطبيق الفلاتر");
  } finally {
    setLoading(false);
  }
};


  /* --------------------------------------------------------
      حذف موظف + Toast
  -------------------------------------------------------- */
  const handleDeleteEmployee = (id) => {
    setEmployees((prev) => {
      const updated = prev.filter((emp) => emp._id !== id);
      setTotalEmployees(updated.length);
      return updated;
    });

    toast.success("تم حذف الموظف بنجاح");
  };

  /* --------------------------------------------------------
      تعديل موظف (من جدول التعديل)
  -------------------------------------------------------- */
  const handleEditEmployee = (employeeId, updatedObj) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp._id === employeeId ? { ...emp, ...updatedObj } : emp
      )
    );
  };

  /* --------------------------------------------------------
      فتح مودال إضافة موظف
  -------------------------------------------------------- */
  const handleAddEmployeeClick = () => {
    setIsModalOpen(true);
  };

  /* --------------------------------------------------------
      محتوى التاب
  -------------------------------------------------------- */
  const renderContent = () => {
    if (activeTab === "الموظفين") {
      return activeIconIndex === 0 ? (
        <EmployeeCardTab
          employees={employees}
          loading={loading}
          onDelete={handleDeleteEmployee}
        />
      ) : (
        <EmployeeTable
          employees={employees}
          loading={loading}
          onDelete={handleDeleteEmployee}
          onEdit={handleEditEmployee}
        />
      );
    }

    // باقي التابات
    return (
      <div className="p-4 bg-white rounded-2xl shadow">محتوى {activeTab}</div>
    );
  };

  /* --------------------------------------------------------
      الـ RETURN
  -------------------------------------------------------- */
  return (
    <div className="flex flex-col gap-3 flex-1 w-full">
      {/* Header */}
      <EmployeesHeader
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  totalEmployees={totalEmployees}
  handleAddEmployeeClick={handleAddEmployeeClick}
  activeIconIndex={activeIconIndex}
  setActiveIconIndex={setActiveIconIndex}
  onApplyFilters={handleApplyFilters}
  filterData={filterData}
  setFilterData={setFilterData}
/>


      {/* Content */}
      {renderContent()}

      {/* Modal */}
      {isModalOpen && (
        <AddEmployeeModel
          onClose={() => setIsModalOpen(false)}
          onSave={async () => {
            // نحدّث قائمة الموظفين مرة واحدة بعد الحفظ
            await refreshEmployees();

            // المودال نفسه هو اللي بطلع توست "تم إضافة الموظف بنجاح"
            // فمش محتاجين نرجّع نعرض توست ثاني هون

            
          }}
        />
      )}

      <Outlet />
    </div>
  );
}

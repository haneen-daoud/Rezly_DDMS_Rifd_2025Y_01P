import React, { useState, useEffect } from "react";
import EmployeeCard from "../EmployeeCard";
import { getAllEmployees } from "../../api";
import AddEmployeeModel from "../AddEmployeeModel/AddEmployeeModel";

export default function EmployeeCardTab() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 12;

  const fetchEmployees = async () => {
  try {
    const data = await getAllEmployees();

    if (data.employees) {
      // ✅ فلترة فقط الموظفين النشطين
      const activeEmployees = data.employees.filter(emp => emp.active !== false);
      setEmployees(activeEmployees);
    } else {
      setEmployees([]);
    }
  } catch (err) {
    console.error(err);
    setEmployees([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = (newEmp) => {
    setEmployees((prev) => [newEmp, ...prev]); // أضف مباشرة للـ state
    alert("✅ تم إضافة الموظف بنجاح");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <span class="loader"></span>
      </div>


    )
  }

  if (!employees.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-gray-600">لا يوجد موظفين.</p>

      </div>
    );
  }

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = employees.slice(startIndex, endIndex);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">


      <div className="flex flex-wrap gap-6">
        {currentEmployees.map((emp) => (
          <EmployeeCard
            key={emp._id}
            emp={emp}
            onDelete={(id) => setEmployees(prev => prev.filter(e => e._id !== id))}
          />
        ))}

      </div>

      {totalPages > 1 && (
        <div className="fixed bottom-4 left-4 flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${page === currentPage
                  ? "bg-[var(--color-purple)] text-white border-purple-600"
                  : "text-gray-700 border-gray-300"
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-2 py-1 border rounded ${currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-purple border-purple-600"
              }`}
          >
            &#8592;
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 border rounded ${currentPage === totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-purple border-purple-600"
              }`}
          >
            &#8594;
          </button>
        </div>
      )}

      {showAddModal && (
        <AddEmployeeModel
          onClose={() => setShowAddModal(false)}
          onSave={handleAddEmployee}
        />
      )}
    </div>
  );
}

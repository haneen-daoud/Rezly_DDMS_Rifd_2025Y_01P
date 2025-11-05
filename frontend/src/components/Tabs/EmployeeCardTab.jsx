import React, { useState, useEffect } from "react";
import EmployeeCard from "../EmployeeCard";
import { getAllEmployees } from "../../api";
import AddEmployeeModel from "../AddEmployeeModel/AddEmployeeModel";

export default function EmployeeCardTab() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
const fetchEmployees = async () => {
  try {
    setLoading(true);

    const cached = localStorage.getItem("employees_cache");
    if (cached) {
      const parsed = JSON.parse(cached);
      setEmployees(parsed);
      setLoading(false); 
    }

    const data = await getAllEmployees();
    const activeEmployees = data.employees?.filter(emp => emp.active !== false) || [];

    localStorage.setItem("employees_cache", JSON.stringify(activeEmployees));

    setEmployees(activeEmployees);
  } catch (err) {
    console.error("❌ خطأ أثناء جلب الموظفين:", err);
    if (!employees.length) setEmployees([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = (newEmp) => {
    setEmployees((prev) => [newEmp, ...prev]);
    alert("  تم إضافة الموظف بنجاح");
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

  
  const currentEmployees = employees;


  return (
    <div className="sm-p-6 p-0 bg-gray-50 min-h-screen" dir="rtl">


      <div className="flex flex-wrap gap-6">
        {currentEmployees.map((emp) => (
          <EmployeeCard
            key={emp._id}
            emp={emp}
            onDelete={(id) => setEmployees(prev => prev.filter(e => e._id !== id))}
          />
        ))}

      </div>

        
      

      {showAddModal && (
        <AddEmployeeModel
          onClose={() => setShowAddModal(false)}
          onSave={handleAddEmployee}
        />
      )}
    </div>
  );
}

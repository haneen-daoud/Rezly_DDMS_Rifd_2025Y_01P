import React from "react";
import EmployeeCard from "../EmployeeCard";

export default function EmployeeCardTab({
  employees = [],
  loading = false,
  onDelete,
}) {
  // لودر
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <span className="loader"></span>
      </div>
    );
  }

  // لا يوجد موظفين
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
            onDelete={(id) => {
              if (onDelete) onDelete(id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

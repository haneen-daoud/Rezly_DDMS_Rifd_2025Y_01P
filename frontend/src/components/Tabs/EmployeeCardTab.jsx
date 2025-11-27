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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-[24px] gap-x-[24px]">
        {[...currentEmployees]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((emp) => (
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

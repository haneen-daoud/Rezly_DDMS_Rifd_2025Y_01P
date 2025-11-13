import React, { useState } from "react";
import { toggleEmployeeStatus, updateEmployeeRole } from "../../api";
import "../AttendanceTable/AttendanceTable.css";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import AddEmployeeModel from "../AddEmployeeModel/AddEmployeeModel";
import { toast } from "react-toastify";

export default function EmployeeTable({ employees = [], loading = false, onDelete, onEdit }) {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // فتح مودال التعديل
  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  // تغيير صلاحية الموظف مباشرة
  const handleRoleChange = async (id, newRole) => {
    try {
      await updateEmployeeRole(id, newRole);

      if (onEdit) {
        onEdit(id, { role: newRole });
      }

      toast.success("تم تغيير مستوى الصلاحية بنجاح");
    } catch (err) {
      console.error("خطأ أثناء تحديث الصلاحية:", err);
      toast.error("تعذر تحديث الصلاحية");
    }
  };

  // لودر
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <span className="loader"></span>
      </div>
    );
  }

  // تحديد الكل
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((emp) => emp._id));
    }
    setSelectAll(!selectAll);
  };

  // تحديد موظف واحد
  const handleSelectEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((e) => e !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="attendance-table SubscribersTab-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            </th>
            <th>الإسم</th>
            <th>البريد الإلكتروني</th>
            <th>رقم الهاتف</th>
            <th>المسمى الوظيفي</th>
            <th>نوع العقد</th>
            <th>تاريخ بدء العمل</th>
            <th>مستوى الصلاحية</th>
            <th>الإجراءات</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                لا يوجد موظفين مسجلين حالياً
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp._id)}
                    onChange={() => handleSelectEmployee(emp._id)}
                  />
                </td>

                <td className="table-text">{`${emp.firstName} ${emp.lastName}`}</td>
                <td className="table-text">{emp.email}</td>
                <td className="table-text">{emp.phoneNumber}</td>
                <td className="table-text">{emp.jobTitle}</td>

                <td className="table-text">
                  {emp.contractType ? (
                    <div
                      className={`py-1 text-white text-xs font-semibold rounded-full`}
                      style={{
                        backgroundColor:
                          emp.contractType === "كامل" || emp.contractType === "دوام كامل"
                            ? "#16B157"
                            : emp.contractType === "جزئي" || emp.contractType === "دوام جزئي"
                            ? "#2084DB"
                            : "#999999",
                      }}
                    >
                      {emp.contractType}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="table-text">
                  {emp.startDate
                    ? new Date(emp.startDate).toLocaleDateString("ar-EG")
                    : "-"}
                </td>

                <td className="table-text">{emp.role}</td>

                <td className="table-text flex justify-center gap-2">
                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(emp)}
                    className="p-2 rounded-full hover:bg-purple-100 hover:scale-110 transition cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M5.99805 12.7034L5.12891 13.5725C4.53647 14.1647 3.73317 14.4973 2.89551 14.4973H2C1.72386 14.4973 1.5 14.2735 1.5 13.9973V13.1047C1.5 12.2669 1.83251 11.4629 2.4248 10.8704L3.29492 10.0002L5.99805 12.7034ZM7.66504 11.0364L6.70605 11.9963L4.00293 9.29321L4.96191 8.33325L7.66504 11.0364ZM11.4551 1.84106C11.9102 1.38588 12.6487 1.38659 13.1035 1.84204L14.1602 2.89966C14.6144 3.35471 14.6139 4.09247 14.1592 4.54712L8.37305 10.3323L5.66895 7.62817L11.4551 1.84106Z"
                        fill="#6A0EAD"
                      />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => openDeleteModal(emp)}
                    className="p-2 rounded-full hover:bg-red-100 hover:scale-110 transition cursor-pointer"
                  >
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                      <path
                        d="M8.22461 0.833984C8.75792 0.834042 9.24011 1.15238 9.4502 1.64258L10.1035 3.16699H12.9971C13.3653 3.16699 13.6641 3.46579 13.6641 3.83398C13.6641 4.20217 13.3653 4.50098 12.9971 4.50098H12.4492L11.9072 13.4443C11.8485 14.4118 11.0463 15.1667 10.0771 15.167H3.91992C2.95073 15.1668 2.14954 14.4118 2.09082 13.4443L1.54883 4.50098H0.99707C0.62903 4.5008 0.331055 4.20207 0.331055 3.83398C0.331055 3.4659 0.62903 3.16717 0.99707 3.16699H3.8916L4.54492 1.64258C4.75503 1.15233 5.23714 0.833984 5.77051 0.833984H8.22461ZM6 9.83301C5.72417 9.83325 5.50018 10.0572 5.5 10.333C5.5 10.609 5.72406 10.8328 6 10.833H8C8.27594 10.8328 8.5 10.609 8.5 10.333C8.49982 10.0572 8.27583 9.83325 8 9.83301H6ZM5 7.16699C4.72406 7.16723 4.5 7.391 4.5 7.66699C4.50018 7.94284 4.72417 8.16675 5 8.16699H9C9.27583 8.16675 9.49982 7.94284 9.5 7.66699C9.5 7.391 9.27594 7.16723 9 7.16699H5ZM5.8584 2.16699C5.80506 2.16699 5.75636 2.19902 5.73535 2.24805L5.3418 3.16699H8.65332L8.25879 2.24805C8.23776 2.19918 8.18993 2.16705 8.13672 2.16699H5.8584Z"
                        fill="#FF0000"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          toggleEmployeeStatus(selectedEmployee._id, false);
          onDelete(selectedEmployee._id);
          setIsDeleteModalOpen(false);
        }}
        employeeName={`${selectedEmployee?.firstName} ${selectedEmployee?.lastName}`}
        itemType="الموظف"
        itemPosition={selectedEmployee?.jobTitle}
      />

      {/* Edit Modal */}
      {isEditModalOpen && selectedEmployee && (
        <AddEmployeeModel
          employeeData={selectedEmployee}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedEmp) => {
            if (onEdit) {
              onEdit(updatedEmp._id, updatedEmp);
            }
          }}
          type="edit"
        />
      )}
    </div>
  );
}

import React from "react";
import "./AttendanceTable.css";
import tableArrowIcon from "../../icons/tableArrow.svg";

const AttendanceTable = () => {
  const data = [
    { name: "بيان عبد الحق", inTime: "8:08", outTime: "11:00", status: "مكتمل" },
    { name: "بيان عبد الحق", inTime: "8:08", outTime: "11:00", status: "موجود" },
    { name: "بيان عبد الحق", inTime: "8:08", outTime: "----", status: "موجود" },
    { name: "بيان عبد الحق", inTime: "8:08", outTime: "----", status: "مكتمل" },
    { name: "بيان عبد الحق", inTime: "8:08", outTime: "----", status: "موجود" },


  ];

  const getStatusClass = (status) => {
    if (status === "مكتمل") return "status-complete";
    if (status === "موجود") return "status-present";
    return "";
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header ">
        <h2 className="table-title text-black ">سجل الحضور</h2>
        <button className="back-btn"><img
                  src={tableArrowIcon}
                  alt="arrow"
                  className="cursor-pointer"
                
                /></button>
      </div>

      <table className="attendance-table ">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>وقت الدخول</th>
            <th>وقت الخروج</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="table-text">{row.name}</td>
              <td className="table-text">{row.inTime}</td>
              <td className="table-text">{row.outTime}</td>
              <div className="table-text p-2" >
                <div className={`status-badge py-1 text-white text-[11px] font-semibold rounded-full  ${getStatusClass(row.status)}`}>
                  {row.status}
</div>
              </div>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;

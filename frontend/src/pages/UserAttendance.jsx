import React from "react";

export default function UserAttendance() {
  return (
    <div
      className="w-full h-full min-h-[calc(100vh-72px)] flex items-center justify-center bg-[#F8F8F8]"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-md px-6 py-8 max-w-sm w-full text-center">
        <h1 className="text-lg font-bold mb-3">سجل حضورك اليوم 💪</h1>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-2">
          لتسجيل الحضور أو الانصراف:
        </p>
        <p className="text-sm text-[#111827] font-semibold leading-relaxed">
          توجه لموظف الاستقبال وامسح كود الـ QR المعروض عنده من جوالِك.
        </p>
      </div>
    </div>
  );
}

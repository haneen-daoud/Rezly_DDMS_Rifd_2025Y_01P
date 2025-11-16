import React from "react";

export default function EmployeeCard({ emp }) {
  if (!emp) return null;

  const department = emp.department || "غير محدد";
  const firstName = emp.firstName || "";
  const lastName = emp.lastName || "";
  const jobTitle = emp.jobTitle || "غير محدد";
  const phoneNumber = emp.phoneNumber || "غير متوفر";
  const email = emp.email || "غير متوفر";
  const image = emp.image || "/default-avatar.png";

  return (
    <div className="relative bg-white rounded-xl border p-4 h-[162px] w-[370px] border-[var(--color-cardborder)]">
      {/* القسم */}
      <div className="absolute top-0 left-0 bg-[var(--color-purple)] text-white text-[14px] px-7 py-1 rounded-tl-xl">
        {department}
      </div>

      {/* الاسم + الصورة */}
      <div className="flex absolute items-center mt-2 gap-7 text-[12px] font-[500]">
        <img
          src={image}
          alt={`${firstName} ${lastName}`}
          className="w-[97px] h-[97px] rounded-full object-cover"
        />

        <div className="information gap-3 flex flex-col">
          <h3 className="text-black text-[16px]">{`${firstName} ${lastName}`}</h3>
          <h3 className="text-purple px-2 text-[12px] font-[500]">{jobTitle}</h3>

          <div className="flex items-center gap-1 text-[var(--color-greytext)]">
            <span>{phoneNumber}</span>
          </div>

          <div className="flex items-center gap-1 text-[var(--color-greytext)]">
            <span>{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

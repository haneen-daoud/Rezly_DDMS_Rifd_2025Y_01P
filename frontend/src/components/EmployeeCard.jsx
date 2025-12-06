import React from "react";
import { toggleEmployeeStatus } from "../api";
import api from "../api";


export default function EmployeeCard({ emp, onDelete }) {
  if (!emp) return null;

  const department = emp.department || "غير محدد";
  const firstName = emp.firstName || "";
  const lastName = emp.lastName || "";
  const jobTitle = emp.jobTitle || "غير محدد";
  const phoneNumber = emp.phoneNumber || "غير متوفر";
  const email = emp.email || "غير متوفر";
  const image = emp.image
  ? emp.image
  : emp.gender === "أنثى"
  ? "https://res.cloudinary.com/dpv0cupet/image/upload/v1759785455/Ellipse_51_mlh4nx.svg"
  : emp.gender === "ذكر"
  ? "https://res.cloudinary.com/dkawkb4d8/image/upload/v1760180324/Ellipse_51_1_efh4lk.svg"
  : "https://res.cloudinary.com/dpv0cupet/image/upload/v1759785455/Ellipse_51_mlh4nx.svg";

    
  return (
    <div className="relative bg-white rounded-xl border p-4 h-[162px] w-full border-[var(--color-cardborder)]">

      

      {/* القسم */}
      <div className="absolute top-0 left-0 bg-[var(--color-purple)] text-white text-[14px] w-25 text-center py-1 rounded-tl-xl">
        {department}
      </div>

      {/* الاسم + الصورة */}
      <div className="flex absolute items-center mt-2 gap-7 text-[12px] font-[500] pt-1">
        <img
          src={image}
          alt={`${firstName} ${lastName}`}
          className="w-[97px] h-[97px] rounded-full object-cover"
        />

        <div className="information gap-3 flex flex-col">
          <h3 className="text-black text-[16px]">{`${firstName} ${lastName}`}</h3>
          <h3 className="text-purple px-2 text-[12px] font-[500]">{jobTitle}</h3>

          {/* رقم الهاتف */}
          <div className="flex items-center gap-1 text-[var(--color-greytext)]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.82 10.1733L11.1267 9.97999C10.9276 9.9566 10.7258 9.97865 10.5364 10.0445C10.347 10.1103 10.175 10.2182 10.0334 10.36L8.80669 11.5867C6.91429 10.6239 5.37607 9.08573 4.41336 7.19332L5.64669 5.95999C5.93336 5.67332 6.07336 5.27332 6.02669 4.86665L5.83336 3.18665C5.7957 2.86138 5.63967 2.56134 5.395 2.34372C5.15033 2.1261 4.83414 2.00612 4.50669 2.00665H3.35336C2.60003 2.00665 1.97336 2.63332 2.02003 3.38665C2.37336 9.07999 6.92669 13.6267 12.6134 13.98C13.3667 14.0267 13.9934 13.4 13.9934 12.6467V11.4933C14 10.82 13.4934 10.2533 12.82 10.1733Z"
                fill="var(--color-purple)"
              />
            </svg>
            <span>{phoneNumber}</span>
          </div>

          {/* الإيميل */}
          <div className="flex items-center gap-1 text-[var(--color-greytext)]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3335 5.33335L8.00016 8.66669L2.66683 5.33335V4.00002L8.00016 7.33335L13.3335 4.00002M13.3335 2.66669H2.66683C1.92683 2.66669 1.3335 3.26002 1.3335 4.00002V12C1.3335 12.3536 1.47397 12.6928 1.72402 12.9428C1.97407 13.1929 2.31321 13.3334 2.66683 13.3334H13.3335C13.6871 13.3334 14.0263 13.1929 14.2763 12.9428C14.5264 12.6928 14.6668 12.3536 14.6668 12V4.00002C14.6668 3.6464 14.5264 3.30726 14.2763 3.05721C14.0263 2.80716 13.6871 2.66669 13.3335 2.66669Z"
                fill="var(--color-purple)"
              />
            </svg>
            <span>{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


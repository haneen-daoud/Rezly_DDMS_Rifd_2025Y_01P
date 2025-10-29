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
{/* 
{
    "status": "success",
    "data": [
        {
            "_id": "68ed7439da6e0ad84c766e6c",
            "service": "يوغا",
            "coach": "68e5773ef73084076ebf6f8f",
            "date": "2025-10-15T00:00:00.000Z",
            "timeStart": "2:00 م",
            "timeEnd": "3:00 م",
            "location": "قاعة 1",
            "status": "pending",
            "description": "تعلم اليوغا",
            "maxMembers": 5,
            "recurrence": [
                "Wed",
                "Sat"
            ],
            "reminders": [
                "1d"
            ],
            "subscriptionDuration": "2weeks",
            "groupId": "68ed7439da6e0ad84c766e6b",
            "createdAt": "2025-10-13T21:50:49.316Z",
            "__v": 0,
            "members": [],
            "membersCount": 0
        },
        {
            "_id": "68ed743ada6e0ad84c766e70",
            "service": "يوغا",
            "coach": "68e5773ef73084076ebf6f8f",
            "date": "2025-10-18T00:00:00.000Z",
            "timeStart": "2:00 م",
            "timeEnd": "3:00 م",
            "location": "قاعة 1",
            "status": "pending",
            "description": "تعلم اليوغا",
            "maxMembers": 5,
            "recurrence": [
                "Wed",
                "Sat"
            ],
            "reminders": [
                "1d"
            ],
            "subscriptionDuration": "2weeks",
            "groupId": "68ed7439da6e0ad84c766e6b",
            "createdAt": "2025-10-13T21:50:50.077Z",
            "__v": 0,
            "members": [],
            "membersCount": 0
        },
        {
            "_id": "68ed743ada6e0ad84c766e74",
            "service": "يوغا",
            "coach": "68e5773ef73084076ebf6f8f",
            "date": "2025-10-22T00:00:00.000Z",
            "timeStart": "2:00 م",
            "timeEnd": "3:00 م",
            "location": "قاعة 1",
            "status": "pending",
            "description": "تعلم اليوغا",
            "maxMembers": 5,
            "recurrence": [
                "Wed",
                "Sat"
            ],
            "reminders": [
                "1d"
            ],
            "subscriptionDuration": "2weeks",
            "groupId": "68ed7439da6e0ad84c766e6b",
            "createdAt": "2025-10-13T21:50:50.836Z",
            "__v": 0,
            "members": [],
            "membersCount": 0
        },
        {
            "_id": "68ed743bda6e0ad84c766e78",
            "service": "يوغا",
            "coach": "68e5773ef73084076ebf6f8f",
            "date": "2025-10-25T00:00:00.000Z",
            "timeStart": "2:00 م",
            "timeEnd": "3:00 م",
            "location": "قاعة 1",
            "status": "pending",
            "description": "تعلم اليوغا",
            "maxMembers": 5,
            "recurrence": [
                "Wed",
                "Sat"
            ],
            "reminders": [
                "1d"
            ],
            "subscriptionDuration": "2weeks",
            "groupId": "68ed7439da6e0ad84c766e6b",
            "createdAt": "2025-10-13T21:50:51.594Z",
            "__v": 0,
            "members": [],
            "membersCount": 0
        }
    ],
    "metadata": {
        "totalResults": 4,
        "message": "Bookings fetched successfully"
    },
    "message": "Success"
}
  */}
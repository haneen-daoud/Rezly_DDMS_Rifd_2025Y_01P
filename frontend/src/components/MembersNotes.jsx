import React from "react";
import User1 from "../img/User1.svg";

export default function MembersNotes() {
  const notes = [
    {
      name: "أحمد محمد",
      date: "2025-11-2",
      note: "يتأخر دائماً" ,
      color: "red",
      img: User1,
    },
    {
      name: "فاطمة علي",
      date: "2025-11-2",
      note: "طلب تجديد اشتراك",
      color: "#2084DB",
      img: User1,
    },
    {
      name: "خالد محمد",
      date: "2025-11-2",
      note: "مشكلة في الدفع",
      color: "red",
      img: User1,
    },
  ];

  const borderColors = {
    red: "border-red-300",
    blue: "border-blue-300",
  };

  const textColors = {
    red: "text-red-500",
    blue: "text-blue-500",
  };

  return (
    <div className="w-full flex justify-center p-4   rtl text-right">
      <div className="w-full max-w-xl bg-white p-4 rounded-2xl ">

        {/* عنوان + زر */}
        <div className="flex text-black items-center justify-between mb-4">
          <h2 className="text-l font-bold">ملاحظات الأعضاء</h2>

          {/* الزر */}
          <button className="p-1 rounded-lg hover:bg-gray-100 transition">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="black" fillOpacity="0.04"/>
              <path
                d="M19.3 12.7H12.7M12.7 12.7V19.3M12.7 12.7L19.3 19.3"
                stroke="black" strokeWidth="1.5" strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* القائمة */}
        <div className="flex flex-col gap-2">
          {notes.map((item, i) => (
            <div
              key={i}
              className="border  rounded-xl p-2 flex items-center bg-white"
               style={{ borderColor: item.color }}
            >
              {/* الصورة */}
              {item.img && (
                <img
                  src={item.img}
                  className="w-10 h-10 rounded-full object-cover border ml-3"
                />
              )}

              {/* النص */}
              <div className="flex flex-col flex-1">
                <span className="text-base font-semibold text-black">
                  {item.name}
                </span>

                <div className="flex items-center gap-2 mt-0.5">
                 <span className="text-sm" style={{ color: item.color }}>
  {item.note}
</span>


                  <span className="text-gray-500 text-xs">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

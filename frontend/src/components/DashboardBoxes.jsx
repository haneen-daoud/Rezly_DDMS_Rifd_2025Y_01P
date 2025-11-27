import React from "react";

export default function DashboardBoxes({ needsFollowUp, mostActive }) {


  return (
    <div className="w-full flex flex-col md:flex-row gap-6 justify-center items-start font-Cairo">

      {/* صندوق يحتاجون متابعة */}
      <div className="bg-white shadow-md rounded-xl p-4 w-full md:w-1/2">
        <h2 className="text-right font-Cairo text-black text-lg font-bold mb-3">يحتاجون متابعة</h2>

        <div className="flex flex-col gap-2">
          {needsFollowUp?.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg "
            >
              {/* الصورة */}
              <img
                src={user.image}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ml-2"
              />

              {/* النص */}
              <div className="text-right flex-1 mr-3 font-Cairo">
                <p className="font-semibold text-black">{user.name}</p>
                <span className="text-red-500 font-semibold text-sm py-0.5">{user.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* صندوق الأكثر نشاطاً */}
      <div className="bg-white shadow-md rounded-xl p-4 w-full md:w-1/2">
        <h2 className="text-right font-Cairo text-black text-lg font-bold mb-3">الأكثر نشاطاً</h2>

        <div className="flex flex-col gap-2">
          {mostActive?.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg "
            >
              {/* الصورة */}
              <img
                src={user.image}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ml-2"
              />

              {/* النص */}
              <div className="text-right flex-1 mr-3 font-cairo">
                <p className="font-semibold text-black">{user.name}</p>
                <span
                  className="text-[#16B157] font-semibold text-sm bg-[#16B157]/10 rounded-full px-2 py-0.5  "
                >
                  {user.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

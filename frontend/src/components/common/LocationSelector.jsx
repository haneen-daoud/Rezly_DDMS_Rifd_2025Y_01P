import React, { useState } from "react";
import downarrowIcon from "../../icons/downarrow.svg";
import addcircleIcon from "../../icons/addcircle.svg";
import locationIcon from "../../icons/location.svg";

export default function LocationSelector({
  selectedLocation,
  setSelectedLocation,
  locationsList,
  borderColor = "#7E818C",
  placeholderColor = "text-black",
  showIcon = true, // يحدد إذا تظهر أيقونة داخل الحقل أم لا
}) {
  const [openLocation, setOpenLocation] = useState(false);

  return (
    <div className="relative">
      <label className="block font-bold text-sm mb-2">المكان</label>
      <div
        className="w-full h-10 rounded-md flex items-center justify-between cursor-pointer relative"
        onClick={() => setOpenLocation(!openLocation)}
        style={{ border: `1px solid ${borderColor}` }}
      >
        {showIcon && <img src={locationIcon} alt="location" className="absolute right-2" />}
        <span
          className={`h-10 w-full flex items-center pl-2 ${
            selectedLocation ? "text-black" : placeholderColor
          }`}
        >
          {selectedLocation || "اختر المكان"}
        </span>
        <img src={downarrowIcon} alt="downarrow" className="absolute left-2 w-4 h-4 pointer-events-none" />
      </div>

      {openLocation && (
        <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-50 text-[#000000]">
          <div className="w-full h-full p-4 box-border overflow-y-auto">
            <div className="flex items-center gap-2 mb-2 cursor-pointer px-3 py-2 hover:bg-gray-100">
              <img src={addcircleIcon} alt="add" className="w-4 h-4" />
              <span className="text-gray-800 font-normal">إضافة جديد</span>
            </div>
            {locationsList.map((location, idx) => {
              const isSelected = selectedLocation === location;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                  onClick={() => {
                    setSelectedLocation(location);
                    setOpenLocation(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img src={locationIcon} alt="location" className="w-4 h-4" />
                    <span className={isSelected ? "font-bold text-black" : "font-normal text-gray-800"}>
                      {location}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-[#6A0EAD]" : "border-gray-400"
                    }`}
                  >
                    {isSelected && <div className="w-3 h-3 rounded-full bg-[#6A0EAD] flex items-center justify-center"></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

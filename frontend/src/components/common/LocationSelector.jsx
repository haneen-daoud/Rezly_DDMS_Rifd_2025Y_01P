import React, { useState } from "react";
import downarrowIcon from "../../icons/downarrow.svg";
import AddCircleIcon from "../../icons/addcircle.svg?react";
import LocationIcon from "../../icons/location.svg?react";

export default function LocationSelector({
  selectedLocation,
  setSelectedLocation,
  locationsList,
  borderColor = "#7E818C",
  placeholderColor = "text-black",
  showIcon = true,
}) {
  const [openLocation, setOpenLocation] = useState(false);

  return (
    <div className="relative">
      <label className="block font-bold text-sm mb-2">القاعة</label>
      <div
        className="w-full h-10 rounded-md flex items-center justify-between cursor-pointer px-2"
        onClick={() => setOpenLocation(!openLocation)}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <div className="flex items-center gap-2">
          {showIcon && (
            <LocationIcon className="w-4 h-4 text-[var(--color-purple)]" />
          )}
          <span
            className={`${selectedLocation ? "text-black" : placeholderColor}`}
          >
            {selectedLocation || "اختر المكان"}
          </span>
        </div>
        <img
          src={downarrowIcon}
          alt="downarrow"
          className="w-4 h-4 pointer-events-none"
        />
      </div>

      {openLocation && (
        <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-50 text-[#000000]">
          <div className="w-full h-full p-4 box-border max-h-[250px] overflow-y-auto">
            {/* إضافة جديد */}
            <div className="flex items-center gap-2 mb-2 cursor-pointer px-3 py-2 hover:bg-gray-100">
              <AddCircleIcon className="w-4 h-4 text-[var(--color-purple)]" />
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
                    <LocationIcon className="w-4 h-4 text-[var(--color-purple)]" />
                    <span
                      className={
                        isSelected
                          ? "font-bold text-black"
                          : "font-normal text-gray-800"
                      }
                    >
                      {location}
                    </span>
                  </div>

                  <div className="w-5 h-5 rounded-full border-2 border-[var(--color-purple)] flex items-center justify-center">
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-purple)]"></div>
                    )}
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

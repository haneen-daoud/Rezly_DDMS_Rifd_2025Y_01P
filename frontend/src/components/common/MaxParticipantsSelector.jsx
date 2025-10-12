import React, { useState } from "react";
import downarrowIcon from "../../icons/downarrow.svg";

export default function MaxParticipantsSelector({
  selectedMax,
  setSelectedMax,
  options,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <label className="block font-bold text-sm mb-2">
        الحد الأقصى للمشتركين
      </label>
      <div
        className="w-full h-10 border border-gray-300 rounded-md flex items-center justify-between cursor-pointer px-2"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`h-10 w-full flex items-center pl-2 ${
            selectedMax ? "text-black" : "text-gray-400"
          } font-normal`}
        >
          {selectedMax
            ? options.find((o) => o.value === selectedMax)?.label
            : "اختر العدد"}
        </span>
        <img src={downarrowIcon} alt="downarrow" className="w-4 h-4" />
      </div>

      {open && (
        <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow z-50">
          {options.map((option, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
              onClick={() => {
                setSelectedMax(option.value);
                setOpen(false);
              }}
            >
              <span
                className={
                  selectedMax === option.value
                    ? "font-bold text-black"
                    : "font-normal text-gray-800"
                }
              >
                {option.label}
              </span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMax === option.value
                    ? "border-[#6A0EAD]"
                    : "border-gray-400"
                }`}
              >
                {selectedMax === option.value && (
                  <div className="w-3 h-3 rounded-full bg-[#6A0EAD]"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

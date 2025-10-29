import React, { useState } from "react";
import downarrowIcon from "../../icons/downarrow.svg";

export default function MaxParticipantsSelector({
  selectedMax,
  setSelectedMax,
  borderColor = "#7E818C",
  options,
}) {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(customValue);
    if (!isNaN(value) && value > 0 && value < 20) {
      setSelectedMax(value);
      setOpen(false);
    } else {
      alert("يرجى إدخال رقم صحيح أقل من 20");
    }
  };

  return (
    <div className="relative w-full">
      <label className="block font-bold text-sm mb-2">
        الحد الأقصى للمشتركين
      </label>

      {/* الزر الرئيسي */}
      <div
        className="w-full h-10 rounded-md flex items-center justify-between cursor-pointer px-2"
        onClick={() => setOpen(!open)}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <span
          className={`h-10 w-full flex items-center pl-2 ${
            selectedMax ? "text-black" : "text-gray-400"
          } font-normal`}
        >
          {/* عرض القيمة الحالية */}
          {selectedMax
            ? selectedMax === 9999
              ? "غير محدود"
              : selectedMax <= 20
              ? `${selectedMax} مشترك${selectedMax > 1 ? "ين" : ""}`
              : `${selectedMax}`
            : "اختر العدد"}
        </span>
        <img src={downarrowIcon} alt="downarrow" className="w-4 h-4" />
      </div>

      {/* القائمة المنسدلة */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow z-50">
          <div className="max-h-[150px] overflow-y-auto">
            {options.map((option, idx) => {
              if (option.value === "custom") {
                // خيار إدخال مخصص
                return (
                  <div
                    key={idx}
                    className="px-3 py-2 border-b border-[rgba(126,129,140,0.4)]"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="font-normal text-gray-800">
                        {option.label}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="19"
                      placeholder="أدخل عددًا (أقل من 20)"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      onBlur={() => {
                        const value = parseInt(customValue);
                        if (!isNaN(value) && value > 0 && value < 20) {
                          setSelectedMax(value);
                          setOpen(false);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = parseInt(customValue);
                          if (!isNaN(value) && value > 0 && value < 20) {
                            setSelectedMax(value);
                            setOpen(false);
                          } else {
                            alert("يرجى إدخال رقم صحيح أقل من 20");
                          }
                        }
                      }}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-right focus:outline-none mt-2"
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                    onClick={() => {
                      const value =
                        option.value === Infinity ? 9999 : option.value;
                      setSelectedMax(value);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={
                        selectedMax === option.value ||
                        (option.value === Infinity && selectedMax === 9999)
                          ? "font-bold text-black"
                          : "font-normal text-gray-800"
                      }
                    >
                      {option.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMax === option.value ||
                        (option.value === Infinity && selectedMax === 9999)
                          ? "border-[#6A0EAD]"
                          : "border-gray-400"
                      }`}
                    >
                      {(selectedMax === option.value ||
                        (option.value === Infinity &&
                          selectedMax === 9999)) && (
                        <div className="w-3 h-3 rounded-full bg-[#6A0EAD]"></div>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}

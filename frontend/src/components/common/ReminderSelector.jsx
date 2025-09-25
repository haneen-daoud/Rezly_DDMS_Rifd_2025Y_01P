import React, { useState } from "react";
import downarrowIcon from "../../icons/downarrow.svg";
import muteIcon from "../../icons/mute.svg";
import notificationIcon from "../../icons/notification.svg";

const ReminderSelector = ({
  selectedReminder,
  setSelectedReminder,
  showIconInInput = false, // تظهر الأيقونة في الصندوق لو true
  placeholder = "قبل 30 دقيقة",
  borderStyle = "#D1D5DB", // إطار الصندوق
  placeholderColor = "text-gray-400", // نص افتراضي
}) => {
  const [openReminder, setOpenReminder] = useState(false);

  const options = [
    { value: "0", label: "عدم التذكير", icon: muteIcon },
    { value: "30", label: "قبل 30 دقيقة", icon: notificationIcon },
    { value: "60", label: "قبل ساعة", icon: notificationIcon },
    { value: "24", label: "قبل 1 يوم", icon: notificationIcon },
  ];

  const selectedOption = options.find(o => o.value === selectedReminder);

  return (
    <div className="relative w-full">
      <label className="block font-bold text-sm mb-2">تذكير</label>
      {/* الصندوق */}
      <div
        className="w-full h-10 flex items-center justify-between cursor-pointer px-3 rounded-md"
        style={{ border: `1px solid ${borderStyle}` }}
        onClick={() => setOpenReminder(!openReminder)}
      >
        <div className="flex items-center gap-2">
          {showIconInInput && selectedOption && (
            <img src={selectedOption.icon} alt="notification" className="w-4 h-4" />
          )}
          <span className={`${!selectedOption ? placeholderColor : "text-black"}`}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <img src={downarrowIcon} alt="downarrow" className="w-4 h-4" />
      </div>

      {/* قائمة الخيارات */}
      {openReminder && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-[16px] mt-1 z-50 shadow-lg">
          <div className="w-full h-full p-4 box-border overflow-y-auto">
            {options.map((option) => {
              const isSelected = selectedReminder === option.value;
              return (
                <div
                  key={option.value}
                  className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                  onClick={() => {
                    setSelectedReminder(option.value);
                    setOpenReminder(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img src={option.icon} alt="notification" className="w-4 h-4" />
                    <span>{option.label}</span>
                  </div>
                  {/* الدائرة */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-[#6A0EAD]" : "border-gray-400"
                    }`}
                  >
                    {isSelected && <div className="w-3 h-3 rounded-full bg-[#6A0EAD]"></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderSelector;

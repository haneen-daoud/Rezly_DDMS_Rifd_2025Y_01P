import React, { useState } from "react";
import CloseIcon from "../../icons/close.svg";
import Step1Booking from "./Step1Booking";
import Step2Booking from "./Step2Booking";

const AddBookingModal = ({ onClose, onSave }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState({
  title: "",
  description: "",
  coach: "",
  room: "",
  maxParticipants: "",
  start: null,      // تاريخ ووقت البداية
  end: null,        // تاريخ ووقت النهاية
  duration: "",     // مدة الاشتراك
  reminder: "30",   // التذكير بالدقيقة
});


  const steps = ["معلومات الحجز", "موعد الحجز"];

  const handleNext = () => {
  if (activeStep < steps.length - 1) {
    setActiveStep(activeStep + 1);
  } else {
    // تمرير بيانات الحجز كاملة عند الحفظ
    if (onSave) onSave(bookingData);
    onClose();
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <div className="bg-white rounded-2xl shadow-lg w-[849px] h-[760px] flex flex-col p-6 text-right overflow-hidden">
        <div className="flex flex-col w-[801px] h-[712px] gap-4 mx-auto">
          {/* الهيدر */}
          <div className="flex justify-between items-start">
            <h2 className="text-[16px] font-bold text-black">إضافة حجز جديد</h2>
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                className="max-w-full max-h-full"
                src={CloseIcon}
                alt="close"
                onClick={onClose}
              />
            </div>
          </div>

          {/* Stepper */}
          <div className="flex justify-center items-center gap-4 mt-6 mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setActiveStep(index)}
                >
                  <div
                    className={`w-[20px] h-[20px] flex items-center justify-center rounded-[10px] text-xs font-medium border ${
                      index < activeStep
                        ? "border-[#6A0EAD] bg-[#6A0EAD] text-white"
                        : index === activeStep
                        ? "border-[#6A0EAD] text-[#6A0EAD]"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {index < activeStep ? "✓" : index + 1}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      index <= activeStep ? "text-purple-600" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-[51px] h-[1px] bg-gray-200"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* محتوى الخطوة */}
          <div className="flex-grow flex flex-col justify-between pr-2 text-[14px]">
            {activeStep === 0 && (
              <Step1Booking
                bookingData={bookingData}
                setBookingData={setBookingData}
              />
            )}
            {activeStep === 1 && (
              <Step2Booking
                bookingData={bookingData}
                setBookingData={setBookingData}
              />
            )}

            {activeStep === 0 && (
  // Step 1 → زر التالي فقط
  <div className="w-[344px] mt-4 self-center">
    <button
      onClick={() => setActiveStep(1)}
      className="w-full py-3 text-white text-sm font-medium rounded-[8px]"
      style={{ backgroundColor: "#6A0EAD" }}
    >
      التالي
    </button>
  </div>
)}

{activeStep === 1 && (
  // Step 2 → زرين: السابق + الحفظ
  <div className="flex w-[344px] mt-4 self-center flex-row-reverse gap-2">
    {/* زر السابق */}
    <button
      onClick={() => setActiveStep(0)}
      className="flex-1 py-3 text-[#6A0EAD] text-sm font-medium rounded-[8px] border"
      style={{ borderColor: "#6A0EAD", backgroundColor: "#FFFFFF" }}
    >
      السابق
    </button>

    {/* زر حفظ */}
    <button
      onClick={handleNext}
      className="flex-1 py-3 text-white text-sm font-medium rounded-[8px]"
      style={{ backgroundColor: "#6A0EAD" }}
    >
      حفظ
    </button>
  </div>
)}


          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookingModal;

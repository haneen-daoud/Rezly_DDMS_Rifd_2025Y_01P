import React, { useState } from "react";
import CloseIcon from "../../icons/close.svg";
import Step1Booking from "./Step1Booking";
import Step2Booking from "./Step2Booking";
import { createBookingAPI } from "../../api/bookingsApi";

const AddBookingModal = ({
  onClose,
  onSave,
  initialData = null,
  editMode = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState(
    initialData || {
      title: "",
      description: "",
      coachId: "68dd54b0f2732ab213f08920",
      room: "",
      maxParticipants: "",
      start: null,
      end: null,
      duration: "",
      repeatDays: "",
      reminder: "",
    }
  );

  const steps = ["معلومات الحجز", "موعد الحجز"];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      if (onSave) onSave(bookingData);
      onClose();
    }
  };

  const getCoachNameById = (id) => {
    const coaches = {
      "68dd54b0f2732ab213f08920": "مريم محمد",
    };
    return coaches[id] || "لا يوجد مدرب";
  };

  // تحويل صيغة الـ API لصيغة الكارد
  const apiToCardBooking = (data) => ({
    title: data.service,
    description: data.description || "",
    coach: getCoachNameById(data.coachId),
    room: data.room,
    maxParticipants: data.numberOfMember,
    start: `${data.date}T${data.timeStart}`,
    end: `${data.date}T${data.timeEnd}`,
    duration: data.duration,
    repeatDays: data.repeatDays,
    reminder: data.reminder,
  });

  const handleSave = async () => {
    try {
      const response = await createBookingAPI(bookingData);
      console.log("✅ Booking created:", response);

      const mappedBooking = apiToCardBooking(response.data);
      onSave(mappedBooking);

      onClose();
    } catch (err) {
      console.error("❌ Error creating booking:", err.response?.data || err);
      alert(err.response?.data?.message || "حدث خطأ أثناء إنشاء الحجز");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <div className="bg-white rounded-2xl shadow-lg w-[849px] h-[712px] flex flex-col p-6 text-right overflow-hidden">
        <div className="flex flex-col w-[801px] h-[712px] gap-4 mx-auto">
          {/* الهيدر */}
          <div className="flex justify-between items-start">
            <h2 className="text-[16px] font-bold text-black">
              {editMode ? "تعديل الحجز" : "إضافة حجز جديد"}
            </h2>
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                className="max-w-full max-h-full"
                src={CloseIcon}
                alt="close"
                onClick={onClose}
              />
            </div>
          </div>

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
              <div className="flex w-[344px] mt-4 self-center flex-row-reverse gap-2">
                {/* زر السابق */}
                <button
                  onClick={() => setActiveStep(0)}
                  className="flex-1 py-3 text-[#6A0EAD] text-sm font-medium rounded-[8px] border"
                  style={{ borderColor: "#6A0EAD", backgroundColor: "#FFFFFF" }}
                >
                  السابق
                </button>

                {/* زر الحفظ */}
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 text-white text-sm font-medium rounded-[8px]"
                  style={{ backgroundColor: "#6A0EAD" }}
                >
                  {editMode ? "تعديل" : "حفظ"}
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

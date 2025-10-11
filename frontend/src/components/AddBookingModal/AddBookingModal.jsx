import React, { useState } from "react";
import CloseIcon from "../../icons/close.svg";
import Step1Booking from "./Step1Booking";
import Step2Booking from "./Step2Booking";
import { createBookingAPI } from "../../api/bookingsApi";
import { updateBookingAPI } from "../../api/bookingsApi";

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
      coach: "مريم محمد",
      room: "قاعة 1",
      maxMembers: 1,
      start: new Date().toISOString().split("T")[0] + "T08:00",
      end: new Date().toISOString().split("T")[0] + "T09:00",
      subscriptionDuration: "أسبوع",
      repeatDays: [],
      reminders: [],
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

  const apiToCardBooking = (data) => {
    const dateStr = data.date || new Date().toISOString().split("T")[0];
    const startRaw = data.timeStart || data.start || "08:00";
    const endRaw = data.timeEnd || data.end || "09:00";

    const parseArabicTimeTo24 = (t) => {
      if (!t || typeof t !== "string") return "08:00";
      const parts = t.trim().split(" ");
      const hhmm = parts[0];
      const ampm = (parts[1] || "").trim();
      let [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
      if (ampm === "م" && h !== 12) h += 12;
      if (ampm === "ص" && h === 12) h = 0;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const start24 =
      startRaw.includes("ص") || startRaw.includes("م")
        ? parseArabicTimeTo24(startRaw)
        : startRaw.slice(0, 5);
    const end24 =
      endRaw.includes("ص") || endRaw.includes("م")
        ? parseArabicTimeTo24(endRaw)
        : endRaw.slice(0, 5);

    return {
      title: data.service || data.title || "غير محدد",
      description: data.description || "لا يوجد وصف",
      coach: data.coach || getCoachNameById(data.coachId) || "لا يوجد مدرب",
      coachId: data.coachId,
      room: data.room || "قاعة 1",
      maxMembers: data.maxMembers || 1,
      start: `${dateStr}T${start24}:00`,
      end: `${dateStr}T${end24}:00`,
      subscriptionDuration: data.subscriptionDuration || "أسبوع",
      repeatDays: Array.isArray(data.repeatDays) ? data.repeatDays : [],
      reminders: Array.isArray(data.reminders) ? data.reminders : ["0"],
    };
  };

  const formatToArabicTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "م" : "ص";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  };

  const handleSave = async () => {
    try {
      let res;
      if (editMode && bookingData.id) {
        // تعديل الحجز
        res = await updateBookingAPI(bookingData.id, bookingData, true);
      } else {
        // إنشاء حجز جديد
        res = await createBookingAPI(bookingData);
      }

      // تحويل البيانات لتنسيق الكارت
      const cardBooking = {
        ...apiToCardBooking({
          ...bookingData,
          _id: res._id || res.id,
          groupId: res.groupId || null,
        }),
        coach: bookingData.coach,
        subscriptionDurationOriginal: bookingData.subscriptionDuration,
        membersCount: bookingData.members ? bookingData.members.length : 0,
        members: bookingData.members || [],
      };

      onSave(cardBooking);
      onClose();
    } catch (err) {
      console.error(
        "❌ Error creating/updating booking:",
        err.response?.data || err
      );
      alert(
        err.response?.data?.message || "حدث خطأ أثناء إنشاء أو تعديل الحجز"
      );
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

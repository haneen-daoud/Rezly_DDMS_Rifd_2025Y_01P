import React from "react";
import CoachSelector from "../common/CoachSelector";
import LocationSelector from "../common/LocationSelector";
import MaxParticipantsSelector from "../common/MaxParticipantsSelector";

const Step1Booking = ({ bookingData, setBookingData }) => {
  if (!bookingData) return null;

  const coaches = [
    "مريم محمد",
    "معاذ حجاوي",
    "أحمد علي",
    "سارة يوسف",
    "حنين",
    "بيان",
  ];
  const rooms = ["قاعة 1", "قاعة 2", "قاعة 3"];

  return (
    <div className="flex flex-col gap-4 w-full items-center font-bold text-black text-[14px]">
      {/* اسم الحصة */}
      <div className="flex flex-col w-[344px] gap-2">
        <label className="font-bold text-black">اسم الحصة</label>
        <input
          type="text"
          placeholder="أدخل اسم الحصة"
          value={bookingData.title}
          onChange={(e) =>
            setBookingData({ ...bookingData, title: e.target.value })
          }
          className="w-full h-[42px] border border-gray-300 rounded px-3 text-right placeholder-gray-400 text-black font-normal focus:outline-none focus:border-gray-300"
        />
      </div>

      {/* الوصف*/}
      <div className="flex flex-col w-[344px] gap-2">
        <label className="font-bold text-black">الوصف</label>
        <input
          type="text"
          placeholder="أدخل الوصف"
          value={bookingData.description}
          onChange={(e) =>
            setBookingData({ ...bookingData, descriptiongit add .
: e.target.value })
          }
          className="w-full h-[42px] border border-gray-300 rounded px-3 text-right placeholder-gray-400 text-black font-normal focus:outline-none focus:border-gray-300"
        />
      </div>

      {/* المدرب */}
      <div className="w-[344px]">
        <CoachSelector
          selectedCoach={bookingData.coach}
          setSelectedCoach={(coach) =>
            setBookingData({ ...bookingData, coach })
          }
          coachesList={coaches}
          showIcon={false}
          placeholderColor="text-gray-400"
          borderStyle="#D1D5DB"
        />
      </div>

      {/* القاعة */}
      <div className="w-[344px]">
        <LocationSelector
          selectedLocation={bookingData.room}
          setSelectedLocation={(loc) =>
            setBookingData({ ...bookingData, room: loc })
          }
          locationsList={rooms}
          borderColor="#D1D5DB"
          placeholderColor="text-gray-400"
          showIcon={false}
        />
      </div>

      {/* المشتركين */}
      <div className="w-[344px]">
        <MaxParticipantsSelector
          selectedMax={bookingData.maxParticipants}
          setSelectedMax={(value) =>
            setBookingData({ ...bookingData, maxParticipants: value })
          }
          options={[
            "1 مشترك",
            "5 مشتركين",
            "10 مشتركين",
            "20 مشتركاً",
            "إدخال مخصص",
            "غير محدود",
          ]}
        />
      </div>
    </div>
  );
};

export default Step1Booking;

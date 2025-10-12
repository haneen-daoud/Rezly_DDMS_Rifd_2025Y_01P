import React, { useState, useEffect } from "react";
import axios from "axios";
import CoachSelector from "../common/CoachSelector";
import LocationSelector from "../common/LocationSelector";
import MaxParticipantsSelector from "../common/MaxParticipantsSelector";
import downarrowIcon from "../../icons/downarrow.svg";
import SearchIcon from "../../icons/search.svg?react";
import AddcircleIcon from "../../icons/addcircle.svg?react";
import * as Yup from "yup";

const Step1Booking = ({ bookingData, setBookingData }) => {
  if (!bookingData) return null;

  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const token = import.meta.env.VITE_API_TOKEN;
        const res = await axios.get(
          "https://rezly-ddms-rifd-2025y-01p.onrender.com/auth/getAllEmployees",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const coachList = res.data.employees
          .filter((emp) => emp.role === "Coach")
          .map((emp) => ({
            id: emp._id,
            name: `${emp.firstName} ${emp.lastName}`,
          }));

        setCoaches(coachList);
      } catch (error) {
        console.error("خطأ في جلب المدربين:", error);
      }
    };

    fetchCoaches();
  }, []);

  const [openClass, setOpenClass] = useState(false);
  const [classSearch, setClassSearch] = useState("");

  const classes = ["يوغا", "كارديو", "ملاكمة"];

  const rooms = ["قاعة 1", "قاعة 2", "قاعة 3"];

  return (
    <div className=" flex justify-center  bg-white w-full text-black text-[14px]">
      <form className="w-[343px] flex flex-col gap-2 font-[Cairo]">
        {/* اسم الحصة */}
        <div className="relative">
          <label className="block font-bold text-sm w-full h-[18px] mb-2">
            اسم الحصة
          </label>
          <div
            className="w-full h-10 rounded-[8px] flex items-center justify-between cursor-pointer relative"
            onClick={() => setOpenClass(!openClass)}
            style={{ border: "1px solid rgba(0,0,0,0.1)" }}
          >
            <span
              className={`h-10 pr-3 pl-2 w-full flex items-center ${
                bookingData.title
                  ? "text-black" // لو في قيمة
                  : "text-[rgba(0,0,0,0.5)]" // لو placeholder
              }`}
            >
              {bookingData.title || "اختر اسم الحصة"}
            </span>

            <img
              src={downarrowIcon}
              alt="downarrow"
              className="absolute left-2"
            />
          </div>

          {openClass && (
            <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-50 text-[#000000]">
              <div className="w-full h-full p-4 box-border overflow-y-auto">
                {/* البحث */}
                <div className="relative w-full h-[30px] mb-2">
                  <input
                    type="text"
                    placeholder="ابحث عن حصة..."
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    className="w-full h-full rounded-[8px] pr-10 pl-3 focus:outline-none placeholder-gray-400 text-gray-800"
                    style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                  />
                  <SearchIcon className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 text-[var(--color-purple)]" />
                </div>

                {/* إضافة جديد */}
                <div className="flex items-center gap-2 mb-2 cursor-pointer px-3 py-2 hover:bg-gray-100">
                  <AddcircleIcon className="w-4 h-4 text-[var(--color-purple)]" />
                  <span className="text-gray-800 font-normal">إضافة جديد</span>
                </div>

                {/* قائمة الحصص */}
                {classes
                  .filter((c) =>
                    c.toLowerCase().includes(classSearch.toLowerCase())
                  )
                  .map((cls, idx) => {
                    const isSelected = bookingData.title === cls;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                        onClick={() => {
                          setBookingData({ ...bookingData, title: cls });
                          setOpenClass(false);
                          setClassSearch("");
                        }}
                      >
                        <span
                          className={
                            isSelected
                              ? "font-bold text-black"
                              : "font-normal text-gray-800"
                          }
                        >
                          {cls}
                        </span>
                        <div className="w-5 h-5 rounded-full border-2 border-[var(--color-purple)] flex items-center justify-center">
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-purple)]"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                {classes.filter((c) => c.includes(classSearch)).length ===
                  0 && (
                  <div className="px-3 py-2 text-gray-400 font-normal">
                    لا يوجد حصص
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* الوصف */}
        <div className="flex flex-col w-[344px] gap-2">
          <label className="block font-bold text-sm w-full h-[18px] mb-2">
            الوصف
          </label>
          <input
            type="text"
            placeholder="أدخل الوصف"
            value={bookingData.description}
            onChange={(e) =>
              setBookingData({ ...bookingData, description: e.target.value })
            }
            className="w-full h-[42px] border rounded-[8px] px-3 text-right font-normal focus:outline-none"
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              color: bookingData.description ? "#000000" : "rgba(0,0,0,0.5)",
            }}
          />
        </div>

        {/* المدرب */}
        <div className="w-[344px]">
          <CoachSelector
            selectedCoach={bookingData.coach}
            setSelectedCoach={(coach) =>
              setBookingData({
                ...bookingData,
                coachId: coach.id,
                coach: coach,
              })
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
            selectedMax={bookingData.maxMembers}
            setSelectedMax={(value) =>
              setBookingData({ ...bookingData, maxMembers: value })
            }
            options={[
              { label: "1 مشترك", value: 1 },
              { label: "5 مشتركين", value: 5 },
              { label: "10 مشتركين", value: 10 },
              { label: "20 مشتركاً", value: 20 },
              { label: "إدخال مخصص", value: 20 },
              { label: "غير محدود", value: Infinity },
            ]}
          />
        </div>
      </form>
    </div>
  );
};

export default Step1Booking;

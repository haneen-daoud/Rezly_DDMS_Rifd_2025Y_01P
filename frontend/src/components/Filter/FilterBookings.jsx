import React, { useState, useEffect } from "react";
import TimeRangePicker from "../common/TimeRangePicker.jsx";
import CoachSelector from "../common/CoachSelector.jsx";
import LocationSelector from "../common/LocationSelector.jsx";
import CalendarIcon from "../../icons/calender.svg?react";
import MiniCalender from "../../components/MiniCalender/MiniCalender.jsx";

export default function FilterBookings({
  onClose,
  onApply,
  coachesList = [],
  locationsList = [],
  anchorRect,
}) {
  const [status, setStatus] = useState([]);
  const [days, setDays] = useState([]);
  const [timeRange, setTimeRange] = useState({
    startTime: "",
    endTime: "",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  // ✅ معرفة نوع المستخدم الحالي
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const role = (parsed.role || "").toLowerCase();
        setUserRole(role);
      }
    } catch (err) {
      console.error("[FilterBookings] فشل قراءة currentUser من localStorage:", err);
    }
  }, []);

  const isCoach = userRole === "coach";

  const statuses = ["ملغي", "منتهي", "ممتلىء", "متاح"];

  const toggle = (value, list, setter) => {
    if (list.includes(value)) {
      setter(list.filter((i) => i !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleReset = () => {
    setStatus([]);
    setDays([]);
    setTimeRange({ startTime: "", endTime: "" });
    setStartDate(null);
    setEndDate(null);
    setSelectedCoach(null);
    setSelectedLocation(null);
  };

  const handleApply = () => {
    onApply?.({
      status,
      days,
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      startDate,
      endDate,
      coach: selectedCoach,
      hall: selectedLocation,
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const getPanelStyle = () => {
    if (!anchorRect || typeof window === "undefined") {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 999,
      };
    }

    return {
      position: "fixed",
      top: anchorRect.bottom,
      right: Math.max(window.innerWidth - anchorRect.right, 8),
      zIndex: 999,
    };
  };

  return (
    <>
      {/* خلفية لإغلاق الفلتر عند الكليك برا */}
      <div className="fixed inset-0 z-[998]" onClick={onClose} />

      {/* كرت الفلترة */}
      <div
        className="
          bg-white
          w-[320px]
          h-[520px]
          max-h-[80vh]
          rounded-[8px]
          p-3
          flex flex-col
          border border-[#E5E7EB]
          shadow-[0_4px_16px_rgba(0,0,0,0.12)]
        "
        style={getPanelStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header ثابت */}
        <div className="flex items-center justify-between mb-3 flex-none">
          <span className="font-Cairo text-[16px] font-bold text-[#000000]">
            الفلاتر
          </span>

          <button
            type="button"
            className="cursor-pointer"
            onClick={handleReset}
          >
            إعادة التعيين
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
          <div className="flex flex-col gap-4">
            {/* حالة الحجز */}
            <div className="flex flex-col justify-between h-[55px]">
              <p className="font-Cairo text-[14px] font-normal text-[#000000]">
                حالة الحجز
              </p>

              <div className="flex flex-row items-center gap-2">
                {statuses.map((s) => {
                  const isSelected = status.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggle(s, status, setStatus)}
                      className={`
                        flex items-center justify-center
                        rounded-[16px]
                        px-2 py-1
                        text-[12px] font-Cairo font-semibold
                        border
                        cursor-pointer
                        ${
                          isSelected
                            ? "border-[var(--color-purple)] text-[var(--color-purple)] bg-[#F5F0FF]"
                            : "text-[#000000] text-[#1D1E20] bg-white"
                        }
                      `}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* الأيام */}
            <div className="flex flex-col gap-2">
              <p className="font-Cairo text-[14px] font-normal text-[#000000]">
                الأيام
              </p>

              <div className="flex flex-row items-center gap-2">
                {["السبت", "الأحد", "الإثنين", "الثلاثاء"].map((d) => {
                  const isSelected = days.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggle(d, days, setDays)}
                      className={`
                        flex items-center justify-center
                        rounded-[16px]
                        px-2 py-1
                        text-[12px] font-Cairo font-semibold
                        border
                        cursor-pointer
                        ${
                          isSelected
                            ? "border-[var(--color-purple)] text-[var(--color-purple)] bg-[#F5F0FF]"
                            : "text-[#000000] text-[#1D1E20] bg-white"
                        }
                      `}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-row items-center gap-2">
                {["الأربعاء", "الخميس", "الجمعة"].map((d) => {
                  const isSelected = days.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggle(d, days, setDays)}
                      className={`
                        flex items-center justify-center
                        rounded-[16px]
                        px-2 py-1
                        text-[12px] font-Cairo font-semibold
                        border
                        cursor-pointer
                        ${
                          isSelected
                            ? "border-[var(--color-purple)] text-[var(--color-purple)] bg-[#F5F0FF]"
                            : "text-[#000000] text-[#1D1E20] bg-white"
                        }
                      `}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* الوقت */}
            <div className="flex flex-col justify-between h-[61px]">
              <p className="font-Cairo text-[14px] font-normal text-[#000000]">
                الوقت
              </p>
              <div className="h-[32px] w-full flex items-center">
                <TimeRangePicker
                  startTime={timeRange.startTime || "08:00"}
                  endTime={timeRange.endTime || "09:00"}
                  onChange={({ startTime, endTime }) =>
                    setTimeRange({ startTime, endTime })
                  }
                  variant="filter"
                  showIcons={true}
                  isAddMode={false}
                  height="32px"
                />
              </div>
            </div>

            {/* تاريخ بدء الحجز */}
            <div className="flex flex-col gap-2 h-[61px] relative">
              <p className="font-Cairo text-[14px] font-normal text-[#000000]">
                تاريخ بدء الحجز
              </p>

              <div
                onClick={() => {
                  setShowStartCalendar((prev) => !prev);
                  setShowEndCalendar(false);
                }}
                className="
                  w-full
                  h-[32px]
                  flex items-center
                  border border-[#E5E7EB]
                  rounded-[8px]
                  px-2
                  bg-white
                  cursor-pointer
                "
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[var(--color-purple)]" />
                  <span
                    className={`font-Cairo text-[12px] ${
                      startDate ? "text-[#1D1E20]" : "text-[#7E818C]"
                    }`}
                  >
                    {startDate
                      ? formatDate(startDate)
                      : "اختر تاريخ بدء الحجز"}
                  </span>
                </div>
              </div>

              {showStartCalendar && (
                <MiniCalender
                  currentDate={startDate || new Date()}
                  handleDateChange={(date) => {
                    if (date) setStartDate(date);
                    setShowStartCalendar(false);
                  }}
                  variant="filter"
                />
              )}
            </div>

            {/* تاريخ نهاية الحجز */}
            <div className="flex flex-col gap-2 h-[61px] relative">
              <p className="font-Cairo text-[14px] font-normal text-[#000000]">
                تاريخ نهاية الحجز
              </p>

              <div
                onClick={() => {
                  setShowEndCalendar((prev) => !prev);
                  setShowStartCalendar(false);
                }}
                className="
                  w-full
                  h-[32px]
                  flex items-center
                  border border-[#E5E7EB]
                  rounded-[8px]
                  px-2
                  bg-white
                  cursor-pointer
                "
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[var(--color-purple)]" />
                  <span
                    className={`font-Cairo text-[12px] ${
                      endDate ? "text-[#1D1E20]" : "text-[#7E818C]"
                    }`}
                  >
                    {endDate
                      ? formatDate(endDate)
                      : "اختر تاريخ نهاية الحجز"}
                  </span>
                </div>
              </div>

              {showEndCalendar && (
                <MiniCalender
                  currentDate={endDate || new Date()}
                  handleDateChange={(date) => {
                    if (date) setEndDate(date);
                    setShowEndCalendar(false);
                  }}
                  variant="filter"
                />
              )}
            </div>

            {/* اسم المدرب → مخفي لو اليوزر مدرب */}
            {!isCoach && (
              <div className="flex flex-col justify-between h-[61px]">
                <p className="font-Cairo text-[14px] font-normal text-[#000000]">
                  اسم المدرب
                </p>

                <div className="h-[32px] w-full flex items-stretch">
                  <CoachSelector
                    selectedCoach={selectedCoach}
                    setSelectedCoach={setSelectedCoach}
                    coachesList={coachesList}
                    showLabel={false}
                    borderStyle="#E5E7EB"
                    placeholderColor="text-[#7E818C]"
                    variant="event"
                    height="32px"
                  />
                </div>
              </div>
            )}

            {/* القاعة */}
            <div className="flex flex-col justify-between h-[61px]">
              <p className="font-Cairo text-[14px] font-normal text-[#000000]">
                القاعة
              </p>
              <div className="h-[32px] w-full flex items-stretch">
                <LocationSelector
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  locationsList={locationsList}
                  borderColor="#E5E7EB"
                  placeholderColor="text-[#7E818C]"
                  showSearch={false}
                  showLabel={false}
                  placeholder="اختر القاعة"
                  showIcon={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* زر تطبيق الفلتر */}
        <div className="flex-none mt-3">
          <button
            type="button"
            onClick={handleApply}
            className="
              w-full
              h-[32px]
              bg-[var(--color-purple)]
              text-white
              rounded-[8px]
              font-Cairo
              text-[16px]
              cursor-pointer
            "
          >
            تطبيق الفلتر
          </button>
        </div>
      </div>
    </>
  );
}

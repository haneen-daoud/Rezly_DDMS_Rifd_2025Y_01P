import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ar from "date-fns/locale/ar"; // أو 'ar-EG' لو مركبها
import "react-datepicker/dist/react-datepicker.css";
import "./MiniCalender.css";
import RightArrowIcon from "../../icons/rightarrow.svg";
import LeftArrowIcon from "../../icons/leftarrow.svg";

// --- سجل الـ locale وعدّل بداية الأسبوع حسب حاجتك ---
// Saturday = 6, Sunday = 0, Monday = 1
const arLocale = {
  ...ar,
  options: {
    ...(ar.options || {}),
    weekStartsOn: 6, // غيّر للرقم اللي تريده إذا بدك الأسبوع يبدأ يوم ثاني
  },
};
registerLocale("ar", arLocale);

const MiniCalender = ({ currentDate, handleDateChange }) => {
  const [tempDate, setTempDate] = useState(currentDate);

  // Mapping مرن لعرض حرف واحد عربي صحيح مهما كان الاسم الممرّر (en/short/ar)
  const formatWeekDay = (nameOfDay) => {
    const map = {
      // إنجليزي كامل
      Saturday: "س",
      Sunday: "ح",
      Monday: "ن",
      Tuesday: "ث",
      Wednesday: "ر",
      Thursday: "خ",
      Friday: "ج",
      // إنجليزي مختصر
      Sat: "س",
      Sun: "ح",
      Mon: "ن",
      Tue: "ث",
      Wed: "ر",
      Thu: "خ",
      Fri: "ج",
      // عربي كامل (طرق مختلفة للتهجئة مع/بدون ألف التعريف)
      "السبت": "س",
      "سبت": "س",
      "الأحد": "ح",
      "احد": "ح",
      "الأثنين": "ن",
      "الاثنين": "ن",
      "اثنين": "ن",
      "الثلاثاء": "ث",
      "الثلا ثاء": "ث",
      "الأربعاء": "ر",
      "الاربعاء": "ر",
      "الخميس": "خ",
      "الجمعة": "ج",
      "جمعة": "ج",
    };

    // حاول ترجمة مباشرة، وإلا ارجع أول حرف كـ fallback
    return map[nameOfDay] || nameOfDay?.charAt(0) || "";
  };

  return (
    <div className="absolute z-30 right-1/4 translate-x-1/4 w-[374px] h-[374px] rounded-[16px] bg-white/100">
      <div className="absolute z-30 right-1/3 translate-x-1/2 w-[374px] h-[374px] rounded-[16px] bg-[#ffffff] shadow-[0_10px_25px_rgba(0,0,0,0.25)] flex items-center justify-center">
        <div className="flex flex-col w-[326px] h-[326px] gap-[24px]">
          <div className="flex flex-col w-full h-[269px] gap-[24px]">
            <DatePicker
              inline
              selected={tempDate}
              onChange={(date) => setTempDate(date)}
              locale="ar"                      // نستخدم الـ locale المسجّل
              calendarClassName="calendar-inside"
              formatWeekDay={formatWeekDay}    // دالة محترفة لليوم
              renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                <div className="flex items-center justify-between w-full h-[32px]">
                  <div
                    className="flex items-center justify-start w-[238px] h-[32px] text-[14px] font-bold"
                    style={{ direction: "rtl" }}
                  >
                    {date.toLocaleDateString("ar-EG", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  <div className="flex items-center gap-[16px]">
                    <button
                      onClick={decreaseMonth}
                      className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] bg-gray-300 px-[8px] border-none"
                    >
                      <img src={RightArrowIcon} alt="rightarrow" />
                    </button>

                    <button
                      onClick={increaseMonth}
                      className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] bg-gray-300 border-none"
                    >
                      <img src={LeftArrowIcon} alt="leftarrow" />
                    </button>
                  </div>
                </div>
              )}
            />
          </div>

          <button
            className="selectDateButton"
            style={{ color: "white", border: "none" }}
            onClick={() => handleDateChange(tempDate)}
          >
            اختيار
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniCalender;

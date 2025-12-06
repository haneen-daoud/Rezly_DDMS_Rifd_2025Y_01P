import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ar from "date-fns/locale/ar";
import "react-datepicker/dist/react-datepicker.css";
import "./MiniCalender.css";
import RightArrowIcon from "../../icons/rightarrow.svg";
import LeftArrowIcon from "../../icons/leftarrow.svg";
import Dropdown from "../Dropdown";

const arLocale = {
  ...ar,
  options: {
    ...(ar.options || {}),
  },
};
registerLocale("ar", arLocale);

const YEARS = [];
for (let y = 1960; y <= 2035; y++) {
  YEARS.push(y);
}

const MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export default function MiniCalender({
  currentDate,
  handleDateChange,
  variant = "default",
  highlightedDates = [],
  hideTodayHighlight = false,
}) {
  const [tempDate, setTempDate] = useState(currentDate || new Date());

  const formatWeekDay = (nameOfDay) => {
    const map = {
      Saturday: "س",
      Sunday: "ح",
      Monday: "ن",
      Tuesday: "ث",
      Wednesday: "ر",
      Thursday: "خ",
      Friday: "ج",
      Sat: "س",
      Sun: "ح",
      Mon: "ن",
      Tue: "ث",
      Wed: "ر",
      Thu: "خ",
      Fri: "ج",
      السبت: "س",
      الأحد: "ح",
      الإثنين: "ن",
      الثلاثاء: "ث",
      الأربعاء: "ر",
      الخميس: "خ",
      الجمعة: "ج",
    };
    return map[nameOfDay] || nameOfDay?.charAt(0) || "";
  };

  const styleMap = {
    step2: {
      container:
        "absolute top-[calc(100%)] left-0 z-50 w-[340px] rounded-[12px] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-[#ddd]",
      inner: "flex flex-col w-full items-center py-3 px-4",
    },
    event: {
      container:
        "absolute top-[calc(100%)+9px] left-0 z-50 w-[313px] rounded-[12px] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-[#ddd]",
      inner: "flex flex-col w-full items-center py-3 px-4",
    },
    calender: {
      container:
        "absolute top-[calc(100%)-27px] -left-[180px] z-50 w-[313px] rounded-[12px] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-[#ddd]",
      inner: "flex flex-col w-full items-center py-3 px-4",
    },
    employee: {
      container:
        "absolute top-[calc(100%+8px)] right-0 z-50 w-full max-w-[343px] rounded-[12px] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-[#ddd]",
      inner: "flex flex-col w-full items-center py-3 px-4",
    },
    employeeTop: {
      container:
        "absolute bottom-full left-0 z-50 w-[340px] rounded-[12px] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-[#ddd]",
      inner: "flex flex-col w-full items-center py-3 px-4",
    },
    filter: {
      container:
        "absolute top-[calc(100%+4px)] right-0 z-50 w-full rounded-[12px] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-[#ddd]",
      inner: "flex flex-col w-full items-center py-3 px-4",
    },
    default: {
      container:
        "absolute left-0 top-full mt-2 w-[500px] rounded-[12px] bg-white shadow-lg",
      inner: "flex flex-col w-full items-center py-3 px-4",
    },
  };

  const styles = styleMap[variant] || styleMap.default;

  return (
    <div
      className={`${styles.container} ${
        variant === "employee" ? "employee-mini-calendar" : ""
      }`}
    >
      <div className={styles.inner}>
        <DatePicker
          inline
          selected={tempDate}
          onChange={(date) => setTempDate(date)}
          locale="ar"
          calendarClassName="calendar-inside ![&_.react-datepicker__day--today]:!top-0 ![&_.react-datepicker__day--today]:!relative"
          formatWeekDay={formatWeekDay}
          dayClassName={(date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const formatted = `${year}-${month}-${day}`;

            const normalizedHighlighted = highlightedDates.map(
              (d) => d.split("T")[0]
            );

            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(
              today.getMonth() + 1
            ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

            const selected =
              tempDate &&
              formatted ===
                `${tempDate.getFullYear()}-${String(
                  tempDate.getMonth() + 1
                ).padStart(2, "0")}-${String(tempDate.getDate()).padStart(
                  2,
                  "0"
                )}`;

            if (normalizedHighlighted.includes(formatted)) {
              return selected
                ? "!bg-[#D8B7F8] !text-white font-bold rounded-[6px]"
                : "!bg-[var(--color-purple)] !text-white font-bold rounded-[6px]";
            }

            if (
              formatted === todayStr &&
              !normalizedHighlighted.includes(formatted)
            ) {
              return hideTodayHighlight
                ? "!bg-transparent !text-black !border-none !shadow-none"
                : "!bg-[rgba(106,14,173,0.15)] !text-black font-semibold rounded-[6px]";
            }

            return "text-black bg-transparent";
          }}
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
          }) => {
            const currentMonthIndex = date.getMonth();
            const currentMonthLabel = MONTHS[currentMonthIndex];
            const currentYearLabel = date.getFullYear().toString();

            return (
              <div
                className="mini-calendar-header flex items-center justify-between w-full mb-2"
                style={{ direction: "rtl" }}
              >
                {/* اختيار الشهر + اختيار السنة باستخدام Dropdown */}
                <div className="flex items-center gap-2">
                  {/* شهر */}
                  <Dropdown
                    options={MONTHS}
                    value={currentMonthLabel}
                    onChange={(label) => {
                      const idx = MONTHS.indexOf(label);
                      if (idx !== -1) changeMonth(idx);
                    }}
                    // مهم: نفس كلاس ال<select> القديمة بالضبط
                    className="w-[120px]"
                    fieldClassName="h-[32px] flex items-center justify-between px-3 text-[13px] rounded-[8px] border border-[#E5E7EB] bg-white"
                    menuClassName="dropdown-menu-scroll custom-scrollbar"
                  />

                  {/* سنة */}
                  <Dropdown
                    options={YEARS.map(String)}
                    value={currentYearLabel}
                    onChange={(label) => {
                      const y = Number(label);
                      if (!Number.isNaN(y)) changeYear(y);
                    }}
                    // برضه نفس عرض واستايل حقل السنة القديم
                    className="w-[80px]"
                    fieldClassName="h-[32px] flex items-center justify-between px-3 text-[13px] rounded-[8px] border border-[#E5E7EB] bg-white"
                    menuClassName="dropdown-menu-scroll custom-scrollbar"
                  />
                </div>

                {/* أسهم الشهر بس */}
                <div className="flex items-center gap-1">
                  {/* شهر سابق */}
                  <button
                    type="button"
                    onClick={decreaseMonth}
                    className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] bg-gray-100 border border-gray-200 cursor-pointer"
                    title="الشهر السابق"
                  >
                    <img src={RightArrowIcon} alt="prev-month" />
                  </button>

                  {/* شهر تالي */}
                  <button
                    type="button"
                    onClick={increaseMonth}
                    className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] bg-gray-100 border border-gray-200 cursor-pointer"
                    title="الشهر التالي"
                  >
                    <img src={LeftArrowIcon} alt="next-month" />
                  </button>
                </div>
              </div>
            );
          }}
        />

        <button
          className="w-full h-[36px] mt-3 bg-[var(--color-purple)] text-white rounded-[8px] font-bold text-[14px] hover:bg-[var(--color-purple)] transition cursor-pointer"
          onClick={() => handleDateChange(tempDate)}
        >
          اختيار
        </button>
      </div>
    </div>
  );
}

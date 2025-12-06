import React, { useState } from "react";
import Dropdown from "./Dropdown";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const dailyData = [
  { day: "السبت", value: 26 },
  { day: "الأحد", value: 30 },
  { day: "الإثنين", value: 42 },
  { day: "الثلاثاء", value: 38 },
  { day: "الأربعاء", value: 55 },
  { day: "الخميس", value: 47 },
  { day: "الجمعة", value: 50 },
];

const weeklyData = [
  { day: "الأسبوع 1", value: 120 },
  { day: "الأسبوع 2", value: 150 },
  { day: "الأسبوع 3", value: 180 },
  { day: "الأسبوع 4", value: 200 },
];

const monthlyData = [
  { day: "يناير", value: 400 },
  { day: "فبراير", value: 380 },
  { day: "مارس", value: 420 },
  { day: "أبريل", value: 460 },
  { day: "مايو", value: 500 },
  { day: "يونيو", value: 480 },
  { day: "يوليو", value: 530 },
  { day: "أغسطس", value: 510 },
  { day: "سبتمبر", value: 490 },
  { day: "أكتوبر", value: 550 },
  { day: "نوفمبر", value: 570 },
  { day: "ديسمبر", value: 600 },
];

export default function Chart() {
  const [chartType, setChartType] = useState("line");
  const [filter, setFilter] = useState("الأسبوع");

  const toggleChartType = () => {
    setChartType(chartType === "line" ? "bar" : "line");
  };

  const getData = () => {
    if (filter === "اليوم") return dailyData;
    if (filter === "الأسبوع") return weeklyData;
    if (filter === "الشهر") return monthlyData;
    return dailyData;
  };

  const data = getData();

  return (
    // ما عاد كرت جديد، بس كونتينر يتمدّد على قدّ الأب
    <div className="w-full h-full flex flex-col">
      {/* Header */}
<div
  className="
    flex flex-col gap-2 mb-2
    sm:flex-row sm:items-center sm:justify-between
  "
>

  {/* التابات: الزوار / المبيعات */}
  <div
    className="
      flex w-full sm:w-auto gap-2 h-[32px]
      justify-between    /* موبايل → ياخذوا كل العرض */
      sm:justify-end     /* ديسكتوب → يمين */
    "
  >
    <button
      className="
        flex-1 sm:flex-none     /* على الموبايل كل زر ياخذ نصف العرض */
        text-[13px] sm:text-[14px] font-[700]
        text-white bg-[var(--color-purple)]
        px-4 py-[6px] rounded-md
        border border-[var(--color-purple)]
        text-center cursor-pointer
      "
    >
      الزوار
    </button>

    <button
      className="
        flex-1 sm:flex-none
        text-[13px] sm:text-[14px] font-[600]
        border border-[var(--color-purple)]
        px-4 py-[6px] rounded-md bg-transparent hover:bg-[#f9f9f9]
        text-center cursor-pointer
      "
    >
      المبيعات
    </button>
  </div>

  {/* الفلاتر: الدروب داون + تبديل الشارت + ... */}
  <div
    className="
      flex flex-wrap items-center gap-2
      w-full sm:w-auto        /* على الموبايل ياخذ كل العرض */
      justify-between         /* على الموبايل يملى العرض */
      sm:justify-start        /* على الديسكتوب يسار */
    "
  >
    <Dropdown
      options={["اليوم", "الأسبوع", "الشهر"]}
      value={filter}
      onChange={(val) => {
        setFilter(val);
      }}
      className="w-full sm:w-[96px] !h-[32px] flex-1"
      fieldClassName="flex justify-between items-center bg-black/4 h-[32px] p-2 gap-4 border-[#E5E7EB] font-semibold text-[14px] rounded-[8px]"
    />

    {/* زر تغيير نوع الرسم */}
    <button
      className="
  rounded-[8px] h-[32px]
  flex items-center justify-center
  bg-black/4 gap-1.5 hover:bg-[#f9f9f9]
  px-3 py-2.5 cursor-pointer
  flex-1 sm:flex-none
"
      onClick={toggleChartType}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 2C2.36667 2 2.66699 2.30033 2.66699 2.66699V12C2.66699 12.3666 2.96649 12.6668 3.33301 12.667H14C14.3666 12.667 14.6668 12.9665 14.667 13.333C14.667 13.6997 14.3667 14 14 14H3.33301C2.22649 13.9998 1.33301 13.1066 1.33301 12V2.66699C1.33301 2.30033 1.63333 2 2 2ZM12.9795 4.31348C13.1195 4.17351 13.3397 4.12712 13.5264 4.20703C13.713 4.28036 13.833 4.46699 13.833 4.66699V11.333C13.833 11.6063 13.6063 11.833 13.333 11.833H4C3.72667 11.833 3.5 11.6063 3.5 11.333V9.33301C3.50008 9.19978 3.55322 9.07276 3.64648 8.97949L6.97949 5.64648C7.17278 5.4532 7.49318 5.4533 7.68652 5.64648L9.66699 7.62695L12.9795 4.31348Z"
          fill="var(--color-purple)"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {/* زر الثلاث نقاط */}
    <button
      className="
  rounded-[8px] h-[32px]
  flex items-center justify-center
  bg-black/4 text-[20px] leading-[1] cursor-pointer
  flex-1 sm:flex-none
  sm:w-[32px]        /* يرجّع عرضه الطبيعي على الديسكتوب */
"
    >
      ...
    </button>
  </div>
</div>



      {/* الرسم البياني → يتمدّد لياخذ باقي ارتفاع الكرت */}
      <div className="w-full flex-1 min-h-[160px] sm:min-h-[200px] md:min-h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart
              data={data}
              margin={{ top: 8, right: 10, left: 10, bottom: 8 }} // قلّلنا المسافات
            >
              <XAxis
                dataKey="day"
                interval={0}
                tick={{
                  fontSize: window.innerWidth < 640 ? 9 : 11,
                  fill: "#333",
                  fontFamily: "Cairo",
                }}
                padding={{ left: 15, right: 15 }}
              />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-purple)"
                strokeWidth={3}
                dot
              />
            </LineChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 8, right: 10, left: 10, bottom: 8 }}
            >
              <XAxis
                dataKey="day"
                interval={0}
                tick={{
                  fontSize: window.innerWidth < 640 ? 9 : 11,
                  fill: "#333",
                  fontFamily: "Cairo",
                }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis hide />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="var(--color-purple)"
                barSize={window.innerWidth < 640 ? 18 : 30}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

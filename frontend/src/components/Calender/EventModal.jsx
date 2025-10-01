import React, { useState } from "react";
import TimeRangePicker from "../common/TimeRangePicker";
import CoachSelector from "../common/CoachSelector";
import LocationSelector from "../common/LocationSelector";
import RepeatSelector from "../common/RepeatSelector";
import ReminderSelector from "../common/ReminderSelector";
import ColorSelector from "../common/ColorSelector";

import MembersIcon from "../../icons/members.svg?react";
import AddCircleIcon from "../../icons/addcircle.svg?react";
import SearchIcon from "../../icons/search.svg?react";
import MiniCalender from "../MiniCalender/MiniCalender";
import DeleteIcon from "../../icons/Delete.svg?react";
import CloseIcon from "../../icons/close.svg";

export default function EventModal({
  newEvent,
  setNewEvent,
  handleSaveEvent,
  handleDeleteClick,
  closeModal,
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [openMembers, setOpenMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  const coaches = [
    "مريم محمد",
    "معاذ حجاوي",
    "أحمد علي",
    "سارة يوسف",
    "حنين",
    "بيان",
  ];
  const locations = ["القاعة 1", "القاعة 2", "القاعة 3", "القاعة 4"];
  const members = ["مشترك 1", "مشترك 2", "مشترك 3", "مشترك 4", "مشترك 5"];

  const handleDateChange = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setNewEvent({
      ...newEvent,
      start: dateString + "T08:00:00",
      end: dateString + "T09:00:00",
    });
    setShowCalendar(false);
  };

  return (
    <div className="fixed inset-0 z-[4000] flex justify-center items-center">
      <div className="w-[361px] h-full bg-white rounded-[16px] flex flex-col overflow-hidden p-6 gap-2 shadow-[7.5px_1.5px_25px_rgba(0,0,0,0.25)] text-right text-black text-base font-cairo font-bold leading-6 break-words">
        {/* الهيدر */}
        <div className="w-full h-8 flex items-center justify-between">
          <h3 className="text-right text-black text-[16px] font-['Cairo'] font-bold leading-[24px]">
            تفاصيل الموعد
          </h3>
          <div className="flex w-18 h-full gap-2  items-center justify-between">
            <DeleteIcon
              className="w-8 h-8 object-contain text-red-500"
              onClick={() => {
                if (!newEvent?.id) return;
                handleDeleteClick();
              }}
            />
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                className="max-w-full max-h-full"
                src={CloseIcon}
                alt="close"
                onClick={closeModal}
              />
            </div>
          </div>
        </div>

        {/* المحتوى */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
          {/* العنوان */}
          <div>
            <label className="block font-bold text-sm mb-2">العنوان</label>
            <div className="relative flex items-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-2"
              >
                <path
                  d="M5.99805 12.7032L5.12891 13.5724C4.53647 14.1646 3.73317 14.4972 2.89551 14.4972H2C1.72386 14.4972 1.5 14.2733 1.5 13.9972V13.1046C1.5 12.2668 1.83251 11.4628 2.4248 10.8702L3.29492 10.0001L5.99805 12.7032ZM7.66504 11.0363L6.70605 11.9962L4.00293 9.29309L4.96191 8.33313L7.66504 11.0363ZM11.4551 1.84094C11.9102 1.38576 12.6487 1.38647 13.1035 1.84192L14.1602 2.89954C14.6144 3.35459 14.6139 4.09235 14.1592 4.547L8.37305 10.3322L5.66895 7.62805L11.4551 1.84094Z"
                  fill="  var(--color-purple)
"
                />
              </svg>
              <input
                type="text"
                value={newEvent.title || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                placeholder="مثال: يوغا"
                className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] focus:outline-none"
              />
            </div>
          </div>

          {/* الوصف */}
          <div>
            <label className="block font-bold text-sm mb-2">
              الوصف (اختياري)
            </label>
            <div className="relative flex items-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-2"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.45329 1.5C2.37329 1.5 1.5 2.37329 1.5 3.45329V12.5534C1.5 13.6267 2.37329 14.5 3.45329 14.5H9.29997C9.4733 14.5 9.63993 14.4333 9.75993 14.3066L14.3066 9.75993C14.4333 9.63993 14.5 9.4733 14.5 9.29997V3.45329C14.5 2.37329 13.6266 1.5 12.5533 1.5H3.45329ZM13.2 9.03337L9.03328 13.2V10.0334C9.03328 9.48003 9.47995 9.03337 10.0333 9.03337H13.2Z"
                  fill="  var(--color-purple)
"
                />
              </svg>
              <textarea
                value={newEvent.description || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                placeholder="....."
                className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] focus:outline-none"
              />
            </div>
          </div>

          {/* التاريخ */}
          <div>
            <label className="block font-bold text-sm mb-2">التاريخ</label>
            <div className="relative flex items-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-2 "
              >
                <path
                  d="M14 8V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V8H14ZM10.6667 2C10.8435 2 11.013 2.07024 11.1381 2.19526C11.2631 2.32029 11.3333 2.48986 11.3333 2.66667V3.33333H12.6667C13.0203 3.33333 13.3594 3.47381 13.6095 3.72386C13.8595 3.97391 14 4.31304 14 4.66667V6.66667H2V4.66667C2 4.31304 2.14048 3.97391 2.39052 3.72386C2.64057 3.47381 2.97971 3.33333 3.33333 3.33333H4.66667V2.66667C4.66667 2.48986 4.7369 2.32029 4.86193 2.19526C4.98695 2.07024 5.15652 2 5.33333 2C5.51014 2 5.67971 2.07024 5.80474 2.19526C5.92976 2.32029 6 2.48986 6 2.66667V3.33333H10V2.66667C10 2.48986 10.0702 2.32029 10.1953 2.19526C10.3203 2.07024 10.4899 2 10.6667 2Z"
                  fill="  var(--color-purple)
"
                />
              </svg>
              <input
                type="text"
                value={
                  newEvent.start
                    ? new Date(newEvent.start).toISOString().split("T")[0]
                    : ""
                }
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
                className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] focus:outline-none"
              />
              {showCalendar && (
                <div className="absolute top-full left-0 mt-2 z-50">
                  <MiniCalender
                    currentDate={
                      newEvent.start ? new Date(newEvent.start) : new Date()
                    }
                    handleDateChange={handleDateChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* الوقت */}
          <div>
            <label className="block font-bold text-sm mb-2">الوقت</label>
            <TimeRangePicker
              startTime={
                newEvent.start
                  ? newEvent.start.split("T")[1].slice(0, 5)
                  : "08:00"
              }
              endTime={
                newEvent.end ? newEvent.end.split("T")[1].slice(0, 5) : "09:00"
              }
              onChange={({ start, end }) => {
                const date = newEvent.start
                  ? newEvent.start.split("T")[0]
                  : new Date().toISOString().split("T")[0];
                setNewEvent({
                  ...newEvent,
                  start: `${date}T${start}`,
                  end: `${date}T${end}`,
                });
              }}
            />
          </div>

          {/* المكان */}
          <LocationSelector
            selectedLocation={newEvent.room}
            setSelectedLocation={(room) => setNewEvent({ ...newEvent, room })}
            locationsList={locations}
          />

          {/* المدرب */}
          <CoachSelector
            selectedCoach={newEvent.coach}
            setSelectedCoach={(coach) => setNewEvent({ ...newEvent, coach })}
            coachesList={coaches}
            showIcon={true}
            placeholderColor="text-black"
            borderStyle="#7E818C"
          />

          {/* المشتركين */}
          <div className="relative">
            <label className="block font-bold text-sm mb-2">المشتركين</label>
            <div
              className="w-full h-10 border border-[#7E818C] rounded-md flex items-center justify-between cursor-pointer px-2"
              onClick={() => setOpenMembers(!openMembers)}
            >
              <MembersIcon className="absolute right-2 w-4 h-4 text-[var(--color-purple)]" />
              <span className="h-10 pr-8 pl-2 w-full flex items-center">
                {newEvent.participants?.length > 0
                  ? `${newEvent.participants.length} مشتركين`
                  : "اختر المشتركين"}
              </span>
              <AddCircleIcon className="absolute left-2 w-4 h-4 text-[var(--color-purple)]" />
            </div>

            {openMembers && (
              <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-50 text-[#000000]">
                <div className="w-full h-full p-4 box-border overflow-y-auto">
                  <div className="relative w-full h-[30px] mb-2">
                    <input
                      type="text"
                      placeholder="ابحث عن مشترك..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full h-full rounded-[8px] border border-gray-500 px-3 pr-10 focus:outline-none placeholder-gray-400 text-gray-800"
                    />
                    <SearchIcon className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 text-[var(--color-purple)]" />
                  </div>

                  {/* إضافة جديد */}
                  <div className="flex items-center gap-2 mb-2">
                    <AddCircleIcon className="w-4 h-4 text-[var(--color-purple)]" />
                    <span className="text-gray-800 font-normal">
                      إضافة جديد
                    </span>
                  </div>

                  {members
                    .filter((m) => m.includes(memberSearch))
                    .map((member, idx) => {
                      const isSelected =
                        newEvent.participants?.includes(member);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                          onClick={() => {
                            setNewEvent((prev) => {
                              const updated = isSelected
                                ? prev.participants.filter((m) => m !== member)
                                : [...(prev.participants || []), member];
                              return { ...prev, participants: updated };
                            });
                          }}
                        >
                          <span
                            className={
                              isSelected
                                ? "font-bold text-black"
                                : "font-normal text-gray-800"
                            }
                          >
                            {member}
                          </span>
                          {/* الدائرة */}
                          <div
                            className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm ${
                              isSelected
                                ? "bg-[var(--color-purple)] border-[var(--color-purple)]"
                                : "border-gray-400 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {members.filter((m) => m.includes(memberSearch)).length ===
                    0 && (
                    <div className="px-3 py-2 text-gray-400 font-normal">
                      لا يوجد مشتركين
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* اللون */}
          <ColorSelector
            selectedColor={{
              bg: newEvent.bg,
              border: newEvent.border,
              text: newEvent.text,
            }}
            setSelectedColor={(c) =>
              setNewEvent({
                ...newEvent,
                bg: c.bg,
                border: c.border,
                text: c.text,
              })
            }
          />

          {/* التكرار */}
          <RepeatSelector
            selectedRepeat={newEvent.repeat}
            selectedDays={newEvent.days || []}
            setRepeatAndDays={(repeat, days) =>
              setNewEvent({ ...newEvent, repeat, days })
            }
          />

          {/* التذكير */}
          <ReminderSelector
            selectedReminder={newEvent.reminder}
            setSelectedReminder={(rem) =>
              setNewEvent({ ...newEvent, reminder: rem })
            }
            showIconInInput={true}
            borderStyle="#7E818C"
            placeholderColor="text-gray-400"
          />
        </div>

        {/* زر الحفظ */}
        <div className="pt-2">
          <button
            className="w-full h-10 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-800"
            style={{ backgroundColor: "#6A0EAD" }}
            onClick={() => handleSaveEvent(newEvent)}
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}

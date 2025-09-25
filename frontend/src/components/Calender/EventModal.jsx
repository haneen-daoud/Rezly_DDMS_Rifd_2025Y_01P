import React, { useState } from "react";
import TimeRangePicker from "../common/TimeRangePicker";
import CoachSelector from "../common/CoachSelector";
import LocationSelector from "../common/LocationSelector";
import RepeatSelector from "../common/RepeatSelector";
import ReminderSelector from "../common/ReminderSelector";
import ColorSelector from "../common/ColorSelector";

import notificationIcon from "../../icons/notification.svg";
import muteIcon from "../../icons/mute.svg";
import MiniCalender from "../MiniCalender/MiniCalender";
import DeleteIcon from "../../icons/Delete.svg";
import CloseIcon from "../../icons/close.svg";
import addressIcon from "../../icons/address.svg";
import discIcon from "../../icons/disc.svg";
import calenderIcon from "../../icons/calender.svg";
import hourIcon from "../../icons/hour.svg";
import membersIcon from "../../icons/members.svg";
import addcircleIcon from "../../icons/addcircle.svg";

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
          <div className="flex w-18 h-full gap-2 flex items-center justify-between">
            <img
              className="w-8 h-8 object-contain"
              src={DeleteIcon}
              alt="delete"
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
              <img
                src={addressIcon}
                alt="address"
                className="absolute right-2"
              />
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
              <img src={discIcon} alt="disc" className="absolute right-2" />
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
              <img
                src={calenderIcon}
                alt="calender"
                className="absolute right-2"
              />
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
              className="w-full h-10 border border-[#7E818C] rounded-md flex items-center justify-between cursor-pointer"
              onClick={() => setOpenMembers(!openMembers)}
            >
              <img
                src={membersIcon}
                alt="members"
                className="absolute right-2"
              />
              <span className="h-10 pr-8 pl-2 w-full flex items-center">
                {newEvent.participants?.length > 0
                  ? `${newEvent.participants.length} مشتركين`
                  : "اختر المشتركين"}
              </span>
              <img
                src={addcircleIcon}
                alt="addcircle"
                className="absolute left-2"
              />
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
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <img src={addcircleIcon} alt="add" className="w-4 h-4" />
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
                          <div
                            className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm ${
                              isSelected
                                ? "bg-purple-500 border-purple-500"
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
  setSelectedReminder={(rem) => setNewEvent({ ...newEvent, reminder: rem })}
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

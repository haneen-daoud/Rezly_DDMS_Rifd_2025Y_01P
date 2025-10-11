import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import MiniCalender from "../MiniCalender/MiniCalender.jsx";
import EventModal from "./EventModal.jsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.jsx";
import "./Calender.css";

import CalenderIcon from "../../icons/calender.svg";
import ReSizeIcon from "../../icons/resize.svg";
import DownArrowIcon from "../../icons/downarrow.svg";
import RightArrowIcon from "../../icons/rightarrow.svg";
import LeftArrowIcon from "../../icons/leftarrow.svg";

export default function Calender({ bookings, setBookings }) {
  const calendarRef = useRef(null);

  const generateId = () => Date.now() + "-" + Math.floor(Math.random() * 1000);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("timeGridDay");
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fullScreenMode, setFullScreenMode] = useState(false);

  const handleDateSelect = (selectInfo) => {
    if (!selectInfo.startStr || !selectInfo.endStr) return;

    setNewEvent({
      id: null,
      title: "",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      description: "",
      room: "",
      coach: "",
      participants: [],
      bg: "#DBEAFE",
      border: "#3B82F6",
      text: "#1E3A8A",
      repeatDays: [],
      reminder: "30",
      reminderName: "قبل 30 دقيقة",
      duration: "",
    });

    setEditMode(false);
    setShowModal(true);
    calendarRef.current?.getApi().unselect();
  };

  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;
    const data = ev.extendedProps || {};

    let coachObj = { id: "", name: "" };

    if (typeof data.coach === "object" && data.coach !== null) {
      coachObj = {
        id: data.coach._id || data.coach.id || "",
        name: data.coach.name || data.coach.userName || "",
      };
    } else if (typeof data.coach === "string") {
      coachObj = { id: data.coach, name: "غير معروف" };
    }

    const repeatType =
      data.recurrence && data.recurrence.length > 0 ? "weekly" : "none";
    const selectedDays =
      data.recurrence && Array.isArray(data.recurrence) ? data.recurrence : [];

    const reminderVal =
      typeof data.reminder === "string" ? data.reminder : "30m";

    const eventData = {
      id: String(ev.id || data._id || Math.random().toString(36).slice(2)),
      title: ev.title || data.service || "بدون عنوان",
      start: ev.startStr || data.date || "",
      end: ev.endStr || "",
      description: data.description || "",
      room: data.room || data.location || "",
      coach: coachObj,
      participants: data.members || [],
      bg: data.bg || "#DBEAFE",
      border: data.border || "#3B82F6",
      text: data.text || "#1E3A8A",
      repeat: repeatType,
      days: selectedDays,
      reminder: reminderVal,
      duration: Array.isArray(data.subscriptionDuration)
        ? data.subscriptionDuration[0]
        : data.subscriptionDuration || "",
      originalId: data.originalId || ev.id,
      isSingle: true,
    };

    setNewEvent(eventData);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSaveEvent = (updatedEvent) => {
    setBookings((prev) => {
      return prev.map((ev) => {
        if (
          ev.id === updatedEvent.id ||
          ev.originalId === updatedEvent.originalId
        ) {
          return { ...ev, ...updatedEvent };
        }
        return ev;
      });
    });
    setShowModal(false);
    setEditMode(false);
  };

  const handleDeleteClick = () => setShowDeleteConfirm(true);

  const handleConfirmDelete = () => {
    setBookings((prev) => prev.filter((ev) => ev.id !== newEvent.id));
    setShowDeleteConfirm(false);
    setShowModal(false);
  };

  const handleCancelDelete = () => setShowDeleteConfirm(false);

  const handleDateChange = (date) => {
    setCurrentDate(date);
    setShowDatePicker(false);
    if (calendarRef.current) calendarRef.current.getApi().gotoDate(date);
  };

  const handleChangeView = (newView) => {
    setView(newView);
    setShowViewMenu(false);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(newView);
    }
  };

  const generateDisplayedEvents = (bookings) => {
    if (!Array.isArray(bookings)) return [];

    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const durationInDays = {
      أسبوع: 7,
      أسبوعين: 14,
      "3 أسابيع": 21,
      شهر: 30,
      "3 أشهر": 90,
      "6 أشهر": 180,
      سنة: 365,
    };

    let allEvents = [];

    const parseDateTime = (date, time) => {
      if (!date) return new Date();
      const d = new Date(date);

      if (!time) return d;

      let hour = 0,
        minute = 0;
      if (time.includes("ص") || time.includes("م")) {
        const [hhmm, period] = time.split(" ");
        [hour, minute] = hhmm.split(":").map((t) => parseInt(t, 10));
        if (period === "م" && hour !== 12) hour += 12;
        if (period === "ص" && hour === 12) hour = 0;
      } else {
        [hour, minute] = time.split(":").map((t) => parseInt(t, 10));
      }

      d.setHours(hour, minute, 0, 0);
      return d;
    };

    bookings.forEach((b) => {
      const individualBookings = b.allBookings || [b];

      individualBookings.forEach((ib) => {
        if (!ib.date) return;

        const startTime = parseDateTime(ib.date, ib.timeStart);
        const endTime = parseDateTime(ib.date, ib.timeEnd);

        if (!Array.isArray(ib.recurrence) || ib.recurrence.length === 0) {
          allEvents.push({
            id: ib._id || ib.id || Math.random().toString(36).slice(2),
            title: ib.service || "حجز",
            start: startTime,
            end: endTime,
            extendedProps: { ...ib },
          });
          return;
        }

        const totalDays = durationInDays[ib.subscriptionDuration] || 1;
        for (let i = 0; i < totalDays; i++) {
          const currentDate = new Date(startTime);
          currentDate.setDate(startTime.getDate() + i);
          const weekday = daysMap[currentDate.getDay()];

          if (ib.recurrence.includes(weekday)) {
            const s = new Date(currentDate);
            const e = new Date(currentDate);
            s.setHours(startTime.getHours(), startTime.getMinutes());
            e.setHours(endTime.getHours(), endTime.getMinutes());

            allEvents.push({
              id: `${ib._id || ib.id}-${i}`,
              title: ib.service || "حجز",
              start: s,
              end: e,
              extendedProps: { ...ib },
            });
          }
        }
      });
    });

    return allEvents;
  };

  const renderEvent = (eventInfo) => {
    const ev = eventInfo.event;
    const bg = ev.extendedProps.bg ?? "#DBEAFE";
    const border = ev.extendedProps.border ?? "#3B82F6";
    const text = ev.extendedProps.text ?? "#1E3A8A";
    return (
      <div
        className="self-stretch p-2 rounded inline-flex flex-col justify-center items-start font-[Cairo] text-[10px] sm:text-xs md:text-sm font-bold border-r-4 w-full h-full truncate"
        style={{ background: bg, borderColor: border, color: text }}
      >
        <div className="opacity-90">{eventInfo.timeText}</div>
        <div className="leading-4 truncate">{ev.title}</div>
      </div>
    );
  };
  console.log("bookings from API:", bookings);

  return (
    <>
      <div
        className={`${
          fullScreenMode
            ? "fixed inset-0 z-50 p-4 bg-white flex flex-col"
            : "relative w-full h-full"
        }`}
      >
        <div
          className="bg-white rounded-[16px] overflow-hidden flex-1 flex flex-col"
          dir="rtl"
        >
          {/* الهيدر */}
          <div className="grid grid-cols-[50px_1fr]">
            <div className="border-l border-[#eee] w-[46px] pt-[12px]"></div>
            <div className="flex justify-between items-center px-[12px] pb-[12px] pt-[12px]">
              <div className="flex items-center gap-[12px]">
                <div className="relative">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="h-[32px] w-auto px-2 flex items-center gap-2 rounded-[8px] font-semibold bg-[#F8F9FA] border-0 outline-none"
                  >
                    <img src={CalenderIcon} alt="calender" />
                    <span className="font-cairo text-[14px] font-bold text-black truncate">
                      {currentDate.toLocaleDateString("ar-en", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <img src={DownArrowIcon} alt="downarrow" />
                  </button>
                  {showDatePicker && (
                    <div className="absolute top-full left-0 z-30">
                      <MiniCalender
                        currentDate={currentDate}
                        handleDateChange={handleDateChange}
                      />
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowViewMenu(!showViewMenu)}
                    className="bg-[#F8F9FA] w-[111px] h-[32px] px-[8px] py-2 rounded-[8px] font-semibold flex items-center justify-between gap-x-[12px] !border-0 !outline-none"
                  >
                    <img src={RightArrowIcon} alt="rightarrow" />
                    <span className="font-cairo text-[14px] font-[700] text-black">
                      {view === "timeGridDay"
                        ? "اليوم"
                        : view === "timeGridWeek"
                        ? "أسبوع"
                        : "شهر"}
                    </span>
                    <img src={LeftArrowIcon} alt="leftarrow" />
                  </button>
                  {showViewMenu && (
                    <div className="absolute z-30 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-24">
                      <div
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                        onClick={() => handleChangeView("timeGridDay")}
                      >
                        يوم
                      </div>
                      <div
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                        onClick={() => handleChangeView("timeGridWeek")}
                      >
                        أسبوع
                      </div>
                      <div
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                        onClick={() => handleChangeView("dayGridMonth")}
                      >
                        شهر
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <img
                  src={ReSizeIcon}
                  alt="calender"
                  className="cursor-pointer"
                  onClick={() => {
                    setFullScreenMode(!fullScreenMode);
                    if (calendarRef.current) {
                      const api = calendarRef.current.getApi();
                      setTimeout(() => {
                        api.render();
                      }, 0);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* الكاليندر */}
          <FullCalendar
            key={fullScreenMode ? "fullscreen" : "dashboard"}
            height={fullScreenMode ? "100%" : "auto"}
            contentHeight={fullScreenMode ? "100%" : "auto"}
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView={view}
            selectable={true}
            selectMirror={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            events={generateDisplayedEvents(bookings)}
            headerToolbar={false}
            slotMinTime="08:00:00"
            slotMaxTime="24:00:00"
            slotDuration="00:30:00"
            eventMaxStack={fullScreenMode ? 10 : 4}
            eventDisplay="auto"
            allDaySlot={false}
            locale="ar"
            direction="rtl"
            selectOverlap={true}
            eventOverlap={true}
            slotEventOverlap={true}
            slotLabelContent={(arg) =>
              arg.date
                .toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
                .replace("AM", "")
                .replace("PM", "")
                .trim()
            }
            eventOrder={(a, b) => Number(a.id) - Number(b.id)}
            eventContent={renderEvent}
          />
        </div>
      </div>

      {/* مودال الحدث */}
      {showModal && (
        <EventModal
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleSaveEvent={handleSaveEvent}
          handleDeleteClick={handleDeleteClick}
          closeModal={() => setShowModal(false)}
        />
      )}

      {/* تأكيد الحذف */}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          event={newEvent}
        />
      )}
    </>
  );
}

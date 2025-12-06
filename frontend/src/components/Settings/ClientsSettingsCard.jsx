import React, { useState, useEffect } from "react";
import SettingsLinkRow, { LABEL_BASE_CLASS } from "./SettingsLinkRow";
import AddCircleIcon from "../../icons/addcircle.svg?react";

function ClientsSettingsCard({ onChange }) {
  const [expanded, setExpanded] = useState(null);

  const [durationsData, setDurationsData] = useState([]);
  const [sessionsData, setSessionsData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);

  useEffect(() => {
    if (!onChange) return;

    onChange({
      durations: durationsData,
      sessions: sessionsData,
      rooms: roomsData,
    });
  }, [durationsData, sessionsData, roomsData, onChange]);

  const items = [
    { id: "durations", label: "مدد الاشتراك المتاحة" },
    { id: "sessions", label: "الحصص" },
    { id: "rooms", label: "القاعات" },
  ];

  const handleToggle = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[12px] py-6 px-4 flex flex-col gap-4 h-full text-[#000000]">
      <div>
        <h2 className="text-[18px] font-bold text-[#000000] mb-2">
          إعدادات إدارة العملاء
        </h2>
        <p className="text-[18px] font-normal text-[#7E818C]">
          ضبط أنواع الاشتراكات والحصص والقاعات المتاحة للعملاء
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <SettingsLinkRow
            key={item.id}
            label={item.label}
            isExpanded={expanded === item.id}
            onToggle={() => handleToggle(item.id)}
          >
            {item.id === "durations" && (
              <SubscriptionDurationContent onChange={setDurationsData} />
            )}
            {item.id === "sessions" && (
              <SessionsContent onChange={setSessionsData} />
            )}
            {item.id === "rooms" && (
              <RoomsContent onChange={setRoomsData} />
            )}
          </SettingsLinkRow>
        ))}
      </div>
    </div>
  );
}

export default ClientsSettingsCard;

/* ===== مدد الاشتراك ===== */

function SubscriptionDurationContent({ onChange }) {
  const [durations, setDurations] = useState([""]);

  useEffect(() => {
    if (onChange) {
      onChange(durations);
    }
  }, [durations, onChange]);

  const handleChange = (index, value) => {
    setDurations((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleAdd = () => {
    setDurations((prev) => [...prev, ""]);
  };

  const handleRemove = (index) => {
    setDurations((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3 mt-1">
      <p className="text-[12px] text-[#7E818C]">
        حدّد مدد الاشتراك التي ستكون متاحة للعملاء عند الاشتراك.
      </p>

      <div className="flex flex-col gap-2">
        {durations.map((value, index) => (
          <div key={index} className="flex flex-col gap-1">
            {index === 0 && (
              <span className={LABEL_BASE_CLASS}>مدة الاشتراك</span>
            )}

            <div className="flex items-center gap-1">
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="أدخل مدة الاشتراك (مثلاً: شهري، 3 شهور، سنوي...)"
                className="flex-1 h-[42px] rounded-[8px] border border-[#D1D5DB] px-3 text-[14px] text-black font-normal
             placeholder:text-[12px] placeholder:text-[#7E818C] bg-white
                           focus:outline-none focus:border-[var(--color-purple)] focus:ring-1 focus:ring-[var(--color-purple)]"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="w-[40px] h-[40px] rounded-[8px] bg-[#0000000A] 
                           flex items-center justify-center text-[#000000]
                           hover:border-[#EF4444] hover:text-[#EF4444] transition"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        onClick={handleAdd}
        className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:underline self-start rounded-md"
      >
        <AddCircleIcon className="w-6 h-6 text-[var(--color-purple)]" />
        <span className="text-[var(--color-purple)] text-[14px] font-normal">
          إضافة مدة
        </span>
      </div>
    </div>
  );
}

/* ===== الحصص ===== */

function SessionsContent({ onChange }) {
  const [sessions, setSessions] = useState([""]);

  useEffect(() => {
    if (onChange) {
      onChange(sessions);
    }
  }, [sessions, onChange]);

  const handleChange = (index, value) => {
    setSessions((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleAdd = () => {
    setSessions((prev) => [...prev, ""]);
  };

  const handleRemove = (index) => {
    setSessions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3 mt-1">
      <p className="text-[12px] text-[#7E818C]">
        حدّد أنواع الحصص المتاحة في النظام لتمييزها في التقارير والجدولة.
      </p>

      <div className="flex flex-col gap-2">
        {sessions.map((value, index) => (
          <div key={index} className="flex flex-col gap-1">
            {index === 0 && <span className={LABEL_BASE_CLASS}>اسم الحصة</span>}

            <div className="flex items-center gap-1">
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="أدخل اسم الحصة"
                className="flex-1 h-[42px] rounded-[8px] border border-[#D1D5DB] px-3 
                text-[14px] text-black font-normal
             placeholder:text-[12px] placeholder:text-[#7E818C] bg-white
                           focus:outline-none focus:border-[var(--color-purple)] focus:ring-1 focus:ring-[var(--color-purple)]"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="w-[40px] h-[40px] rounded-[8px] bg-[#0000000A] 
                           flex items-center justify-center text-[#000000]
                           hover:border-[#EF4444] hover:text-[#EF4444] transition"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        onClick={handleAdd}
        className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:underline self-start rounded-md"
      >
        <AddCircleIcon className="w-6 h-6 text-[var(--color-purple)]" />
        <span className="text-[var(--color-purple)] text-[14px] font-normal">
          إضافة حصة
        </span>
      </div>
    </div>
  );
}

/* ===== القاعات  ===== */

function RoomsContent({ onChange }) {
  const [rooms, setRooms] = useState([{ name: "", capacity: "" }]);

  useEffect(() => {
    if (onChange) {
      onChange(rooms);
    }
  }, [rooms, onChange]);

  const handleChange = (index, field, value) => {
    setRooms((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleAdd = () => {
    setRooms((prev) => [...prev, { name: "", capacity: "" }]);
  };

  const handleRemove = (index) => {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3 mt-1">
      <p className="text-[12px] text-[#7E818C]">
        حدّد القاعات المتاحة وسعتها لاستخدامها في الحجوزات.
      </p>

      <div className="flex flex-col gap-3">
        {rooms.map((room, index) => (
          <div key={index} className="flex flex-col gap-1">
            {/* الليبل يظهر مرة واحدة فقط */}
            {index === 0 && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-[14px] font-bold text-[#000000]">
                  اسم القاعة
                </span>
                <span className="text-[14px] font-bold text-[#000000]">
                  سعة القاعة
                </span>
              </div>
            )}

            {/* صف الإدخال */}
            <div className="flex items-end gap-2">
              {/* اسم القاعة */}
              <input
                type="text"
                value={room.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="أدخل اسم القاعة"
                className="flex-1 h-[42px] rounded-[8px] border border-[#D1D5DB] 
                           px-3 text-[14px] text-black font-normal
                           placeholder:text-[12px] placeholder:text-[#7E818C]
                           bg-white focus:outline-none
                           focus:border-[var(--color-purple)] focus:ring-1 focus:ring-[var(--color-purple)]"
              />

              {/* سعة القاعة */}
              <input
                type="number"
                value={room.capacity}
                onChange={(e) =>
                  handleChange(index, "capacity", Number(e.target.value))
                }
                placeholder="أدخل سعة القاعة (عدد الأشخاص)"
                className="flex-1 h-[42px] rounded-[8px] border border-[#D1D5DB] 
                           px-3 text-[14px] text-black font-normal
                           placeholder:text-[12px] placeholder:text-[#7E818C]
                           bg-white focus:outline-none
                           focus:border-[var(--color-purple)] focus:ring-1 focus:ring-[var(--color-purple)]"
              />

              {/* زر الحذف */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="w-[40px] h-[40px] rounded-[8px] bg-[#0000000A] 
                           flex items-center justify-center text-[#000000]
                           hover:border-[#EF4444] hover:text-[#EF4444] transition"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        onClick={handleAdd}
        className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:underline self-start rounded-md"
      >
        <AddCircleIcon className="w-6 h-6 text-[var(--color-purple)]" />
        <span className="text-[var(--color-purple)] text-[14px] font-normal">
          إضافة قاعة
        </span>
      </div>
    </div>
  );
}

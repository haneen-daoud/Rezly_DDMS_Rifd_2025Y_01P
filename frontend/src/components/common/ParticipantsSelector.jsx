import React, { useState } from "react";
import AddCircleIcon from "../../icons/addcircle.svg?react";
import MembersIcon from "../../icons/members.svg?react";
import SearchIcon from "../../icons/search.svg?react";

export default function ParticipantsSelector({
  selectedParticipants,
  setSelectedParticipants,
  membersList,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="relative w-full">
      <label className="block font-bold text-sm mb-2">
        الحد الأقصى للمشتركين
      </label>
      <div
        className="w-full h-10 border border-gray-300 rounded-md flex items-center justify-between cursor-pointer px-2"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`h-10 w-full flex items-center pl-2 ${
            selectedParticipants.length ? "text-black" : "text-gray-400"
          } font-normal`}
        >
          {selectedParticipants.length > 0
            ? `${selectedParticipants.length} مشتركين`
            : "اختر العدد"}
        </span>
        <AddCircleIcon className="w-4 h-4 text-[var(--color-purple)]" />
      </div>

      {open && (
        <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow z-50">
          <div className="w-full h-full p-4 box-border overflow-y-auto">
            <div className="relative w-full h-[30px] mb-2">
              <input
                type="text"
                placeholder="ابحث عن مشترك..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full rounded-[8px] border border-gray-300 px-3 pr-10 focus:outline-none placeholder-gray-400 text-black font-normal"
              />
              <SearchIcon className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 text-[var(--color-purple)]" />
            </div>

            {/* إضافة جديد */}
            <div className="flex items-center gap-2 cursor-pointer mb-2 px-3 py-2 hover:bg-gray-100">
              <AddCircleIcon className="w-4 h-4 text-[var(--color-purple)]" />
              <span className="text-gray-800 font-normal">إضافة جديد</span>
            </div>

            {/* قائمة الأعضاء */}
            {membersList
              .filter((m) => m.includes(search))
              .map((member, idx) => {
                const isSelected = selectedParticipants.includes(member);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                    onClick={() => {
                      let updated;
                      if (isSelected)
                        updated = selectedParticipants.filter(
                          (m) => m !== member
                        );
                      else updated = [...selectedParticipants, member];
                      setSelectedParticipants(updated);
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
                      className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
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
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import SearchIcon from "../../icons/search.svg?react";
import XIcon from "../../icons/x.svg?react";
import AddIcon from "../../icons/addcircle.svg?react";
import { toast } from "react-toastify";
import AddCircleIcon from "../../icons/addcircle.svg?react";
import { searchMembersAPI } from "../../api/bookingsApi";
import MembersIcon from "../../icons/members.svg?react";

export default function ParticipantsSelector({
  booking,
  setBooking,
  membersList = [],
  showLabel = true,
  showIcon = false,
  variant = "booking",
}) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const rootRef = useRef(null);
  const [search, setSearch] = useState("");
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setAllMembers([]);
    }
  }, [open]);

  // المشتركين المسجلين حاليًا في هذا الحجز
  const currentIds = useMemo(
    () =>
      Array.isArray(booking?.members)
        ? booking.members.map((m) =>
            typeof m === "object" ? m.id || m._id : m
          )
        : [],
    [booking?.members]
  );

  const effectiveMembersList = booking._localMembersList || membersList;

  const currentMembers = useMemo(() => {
    if (!Array.isArray(booking.members)) return [];

    return booking.members.map((m) => {
      const id = typeof m === "object" ? m.id || m._id : m;
      const full = effectiveMembersList.find(
        (mm) => mm.id === id || mm._id === id
      );

      if (full) {
        return {
          id,
          firstName: full.firstName,
          lastName: full.lastName,
          userName: full.userName,
          name:
            `${full.firstName || ""} ${full.lastName || ""}`.trim() ||
            full.userName ||
            full.name ||
            "مشترك بدون اسم",
        };
      }

      return {
        id,
        name:
          typeof m === "object"
            ? m.name ||
              `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
              m.userName ||
              "مشترك بدون اسم"
            : "مشترك بدون اسم",
      };
    });
  }, [booking.members, effectiveMembersList]);

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setAllMembers([]);
      return;
    }
    setLoading(true);
    try {
      const members = await searchMembersAPI(term);
      setAllMembers(members);
    } catch (err) {
      toast.error("حدث خطأ أثناء البحث عن المشتركين");
    } finally {
      setLoading(false);
    }
  };

  // كل ما تغيّر البحث، نبدأ الجلب بعد نصف ثانية
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search) handleSearch(search);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  // تفعيل وإلغاء المشترك مؤقتًا (إضافة أو إزالة)
  const toggleMember = (member) => {
    const id = member.id || member._id;

    setBooking((prev) => {
      const currentMembers = prev.members || [];

      const activeCount = currentMembers.filter(
        (m) => !(typeof m === "object" && m._tempRemoved)
      ).length;

      const max = prev.maxMembers;

      const exists = currentMembers.some((m) => m === id || m.id === id);

      if (exists) {
        const updated = currentMembers.map((m) => {
          const memberId = typeof m === "object" ? m.id || m._id : m;

          if (memberId === id) {
            const isBeingReactivated =
              typeof m === "object" && m._tempRemoved === true;

            if (
              isBeingReactivated &&
              max &&
              max !== Infinity &&
              activeCount >= max
            ) {
              toast.warning(
                `لا يمكن إضافة أكثر من ${max} مشترك${
                  max > 1 ? "ين" : ""
                } لهذا الحجز`
              );
              return m;
            }

            return { ...m, _tempRemoved: !m._tempRemoved };
          }
          return m;
        });

        return { ...prev, members: updated };
      }

      if (max && max !== Infinity && activeCount >= max) {
        toast.warning(
          `لا يمكن إضافة أكثر من ${max} مشترك${max > 1 ? "ين" : ""} لهذا الحجز`
        );
        return prev;
      }

      const full = membersList.find((mm) => mm.id === id || mm._id === id);
      const newMember = {
        id,
        name:
          full?.name ||
          `${full?.firstName || ""} ${full?.lastName || ""}`.trim() ||
          full?.userName ||
          "مشترك بدون اسم",
        _tempRemoved: false,
      };

      return { ...prev, members: [...currentMembers, newMember] };
    });
  };

  const addNewMemberLocally = (member) => {
    if (!member) return;

    const id = member._id || member.id;
    const displayName =
      member.name ||
      `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
      member.userName ||
      "مشترك بدون اسم";

    const max = booking.maxMembers;
    const currentCount =
      Array.isArray(booking.members) &&
      booking.members.filter((m) => !m._tempRemoved).length;

    if (max && max !== Infinity && currentCount >= max) {
      toast.warning(
        `لا يمكن إضافة أكثر من ${max} مشترك${max > 1 ? "ين" : ""} لهذا الحجز`
      );
      return;
    }

    setBooking((prev) => {
      const already = prev.members?.some((m) => m === id || m.id === id);
      if (already) return prev;
      return {
        ...prev,
        members: [...(prev.members || []), { id, name: displayName }],
      };
    });

    toast.success(`تمت إضافة ${displayName} مؤقتًا`);
  };

  const renderMemberRow = (member) => {
    const id = member.id || member._id;
    const isRemoved = member._tempRemoved === true;
    const isSelected = !isRemoved;

    return (
      <div
        key={id}
        onClick={(e) => {
          e.stopPropagation();
          toggleMember(member);
        }}
        className="flex items-center justify-between h-[36px] px-3 py-1 cursor-pointer hover:bg-gray-50 transition-colors select-none"
      >
        {/* الاسم */}
        <span
          className={`flex-1 ${
            isRemoved
              ? "text-gray-400 line-through font-normal"
              : "text-black font-bold"
          }`}
        >
          {member.name ||
            `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
            member.userName ||
            "مشترك بدون اسم"}
        </span>

        <div
          className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all duration-150 ${
            isRemoved
              ? "border-gray-400 bg-white"
              : "bg-[var(--color-purple)] border-[var(--color-purple)]"
          }`}
        >
          {!isRemoved && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (typeof onMembersChange === "function") {
      const cleanList = (booking.members || []).map((m) =>
        typeof m === "object" ? m : { id: m }
      );
      onMembersChange(cleanList);
    }
  }, [booking.members]);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تحديد اتجاه الفتح (لفوق أو لتحت) بناءً على المساحة
  useEffect(() => {
    if (open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(spaceBelow < 200 && spaceAbove > spaceBelow);
    }
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full">
      {showLabel && (
        <label className="block font-bold text-sm mb-2">المشتركين</label>
      )}

      {/* الحقل الرئيسي */}
      <div
        className={`h-10 border rounded-[8px] flex items-center justify-between cursor-pointer px-3 relative transition-colors
    ${
      variant === "booking"
        ? "w-[343px] border-[#D9D9D9]"
        : "w-[313px] border-[#7E818C]"
    }`}
        onClick={() => setOpen(!open)}
      >
        {variant !== "booking" && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            <MembersIcon className="w-5 h-5 text-[var(--color-purple)]" />
          </span>
        )}

        <div
          className={`flex items-center justify-between w-full ${
            variant !== "booking" ? "pr-6" : ""
          }`}
        >
          <span
            className={`h-10 flex items-center ${
              currentIds.length
                ? variant === "event"
                  ? "font-bold text-[14px] text-[#000]"
                  : "font-normal text-[14px] text-[#000]"
                : "text-gray-400 font-normal text-[14px]"
            }`}
          >
            {currentIds.length > 0
              ? `${currentIds.length} مشترك${currentIds.length > 1 ? "ين" : ""}`
              : "لا يوجد مشتركين"}
          </span>

          <AddCircleIcon className="w-4 h-4 text-[var(--color-purple)]" />
        </div>
      </div>

      {/* القائمة */}
      {open && (
        <div
          className={`absolute left-0 bg-white rounded-[16px] border shadow-lg z-50 ${
            openUp ? "bottom-[calc(100%-2px)] mb-1" : "top-full mt-1"
          }
      ${
        variant === "booking"
          ? "w-[343px] border-gray-300"
          : "w-[313px] border-gray-300"
      }`}
        >
          <div className="p-3 pb-2">
            {/* مربع البحث */}
            <div className="relative w-full h-[36px] mb-3">
              <input
                type="text"
                placeholder="ابحث عن مشترك..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full rounded-[8px] border border-gray-300 px-3 pr-9 pl-9 focus:outline-none placeholder-gray-400 text-black font-normal"
              />
              <SearchIcon className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 text-[var(--color-purple)]" />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setAllMembers([]);
                  }}
                  className="absolute top-1/2 left-2 -translate-y-1/2"
                >
                  <XIcon className="w-4 h-4 transition text-[var(--color-purple)]" />
                </button>
              )}
            </div>

            {/* القائمة */}
            <div
              className="overflow-y-auto max-h-[200px]"
              style={{ maxHeight: "200px", height: "200px" }}
            >
              {loading ? (
                <p className="text-center text-gray-400 text-sm py-2">
                  جارِ البحث...
                </p>
              ) : search ? (
                // نتائج البحث
                allMembers.length > 0 ? (
                  allMembers.map((m) => {
                    const id = m._id || m.id;
                    const isRemoved = booking.members?.some(
                      (mm) =>
                        (mm.id === id || mm._id === id) &&
                        mm._tempRemoved === true
                    );

                    const isSelected = currentIds.includes(id) && !isRemoved;

                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between h-[36px] px-3 py-1 cursor-pointer hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();

                          if (isSelected) {
                            // لو عليه صح، نشيله من الحجز
                            toggleMember(m);

                            // حدّث قائمة البحث نفسها عشان تعيد الرسم فوراً
                            setAllMembers((prev) =>
                              prev.map((mm) =>
                                mm.id === (m.id || m._id) ||
                                mm._id === (m.id || m._id)
                                  ? { ...mm, _tempRemoved: true }
                                  : mm
                              )
                            );
                          } else {
                            // لو مش مضاف، أضيفه جديد
                            addNewMemberLocally(m);

                            // حدّث قائمة البحث ليظهر عليه الصح فوراً
                            setAllMembers((prev) =>
                              prev.map((mm) =>
                                mm.id === (m.id || m._id) ||
                                mm._id === (m.id || m._id)
                                  ? { ...mm, _tempRemoved: false }
                                  : mm
                              )
                            );
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <div className="w-5 h-5 border-2 rounded-sm flex items-center justify-center bg-[var(--color-purple)] border-[var(--color-purple)]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-3 h-3"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <AddIcon className="w-4 h-4 text-[var(--color-purple)]" />
                          )}

                          <span
                            className={`${
                              isSelected
                                ? "font-bold text-black"
                                : "font-normal text-gray-800"
                            }`}
                          >
                            {m.name ||
                              `${m.firstName || ""} ${
                                m.lastName || ""
                              }`.trim() ||
                              m.userName}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-400 text-sm py-2">
                    لا يوجد نتائج مطابقة
                  </p>
                )
              ) : booking.members && booking.members.length > 0 ? (
                booking.members.map((m) => {
                  const isRemoved = m._tempRemoved === true;
                  const id = m.id || m._id;

                  return (
                    <div
                      key={id}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMember(m);
                      }}
                      className="flex items-center justify-between h-[36px] px-3 py-1 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                    >
                      <span
                        className={`flex-1 ${
                          isRemoved
                            ? "text-gray-400 font-normal"
                            : "text-black font-bold"
                        }`}
                      >
                        {m.name ||
                          `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
                          m.userName ||
                          "مشترك بدون اسم"}
                      </span>

                      <div
                        className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all duration-150 ${
                          isRemoved
                            ? "border-gray-400 bg-white"
                            : "bg-[var(--color-purple)] border-[var(--color-purple)]"
                        }`}
                      >
                        {!isRemoved && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-400 text-sm py-2">
                  لا يوجد مشتركين مضافين
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

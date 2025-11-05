import React, { useState, useEffect } from "react";
import axios from "axios";
import CoachSelector from "../../../components/common/CoachSelector";
import LocationSelector from "../../../components/common/LocationSelector";
import MaxParticipantsSelector from "../../../components/common/MaxParticipantsSelector";
import ParticipantsSelector from "../../../components/common/ParticipantsSelector";

import downarrowIcon from "../../../icons/downarrow.svg";
import SearchIcon from "../../../icons/search.svg?react";
import AddcircleIcon from "../../../icons/addcircle.svg?react";
import XIcon from "../../../icons/x.svg?react";

import { getAllCoachesAPI } from "../../../api/coachesApi";

export default function Step1Booking({
  formData,
  setFormData,
  errors,
  setErrors,
  isIndividual = false,
  isCoach = false,
  members = [],
}) {
  const [coaches, setCoaches] = useState([]);
  const [openClass, setOpenClass] = useState(false);
  const [classSearch, setClassSearch] = useState("");
  const [classes, setClasses] = useState(["يوغا", "كارديو", "ملاكمة"]);
  const [rooms] = useState(["قاعة 1", "قاعة 2", "قاعة 3"]);

  // تأكد من إضافة اسم الحصة الحالية لقائمة الحصص عند فتح التعديل
  useEffect(() => {
    if (!formData?.title || formData.title.trim() === "") return;

    setClasses((prev) => {
      const normalizedPrev = prev.map((c) => c.trim().toLowerCase());
      const normalizedTitle = formData.title.trim().toLowerCase();

      // إذا مش موجود نضيفه
      if (!normalizedPrev.includes(normalizedTitle)) {
        return [...prev, formData.title.trim()];
      }

      // إذا موجود نرجّع القائمة بدون تعديل
      return prev;
    });
  }, [formData?.title]);

  const isReadOnly = !!isIndividual; // حقول مظللة لو تعديل فردي

  // جلب قائمة المدربين
  useEffect(() => {
    const loadCoachesInstantly = async () => {
      try {
        // يحمل مباشرة من localStorage عشان تظهر الأسماء فوراً
        const local = JSON.parse(localStorage.getItem("allEmployees") || "[]");
        if (Array.isArray(local) && local.length > 0) {
          const formattedLocal = local.map((c) => ({
            id: c._id || c.id,
            name:
              c.name ||
              `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
              "مدرب غير معروف",
          }));
          setCoaches(formattedLocal);
        }

        // تحديث من السيرفر بخلفية الصفحة
        const remote = await getAllCoachesAPI();
        if (Array.isArray(remote) && remote.length > 0) {
          const formattedRemote = remote.map((c) => ({
            id: c._id || c.id,
            name:
              c.name ||
              `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
              "مدرب غير معروف",
          }));
          setCoaches(formattedRemote);
          localStorage.setItem("allEmployees", JSON.stringify(remote));
        }
      } catch (err) {
        console.error("[Step1Booking] فشل جلب المدربين:", err);
      }
    };

    loadCoachesInstantly();
  }, []);

  useEffect(() => {
    const fetchMembersSmart = async () => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          localStorage.getItem("token") ||
          "";
        const headers = { Authorization: `Bearer ${token}` };

        //  أول صفحة فوراً بتتحمل
        const firstRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL2}/auth/getAllMembers?page=1`,
          { headers }
        );
        const firstList = firstRes.data?.members || firstRes.data?.data || [];
        const formattedFirst = firstList.map((m) => ({
          id: m._id,
          name:
            `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
            m.userName ||
            "مشترك بدون اسم",
        }));

        // باقي الصفحات بالخلفية
        let page = 2;
        let all = [...firstList];
        let hasMore = true;

        while (hasMore) {
          const res = await axios.get(
            `${
              import.meta.env.VITE_API_BASE_URL2
            }/auth/getAllMembers?page=${page}`,
            { headers }
          );
          const list = res.data?.members || res.data?.data || [];
          if (Array.isArray(list) && list.length > 0) {
            all = [...all, ...list];
            page++;
          } else {
            hasMore = false;
          }
        }

        const formattedAll = all.map((m) => ({
          id: m._id,
          name:
            `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
            m.userName ||
            "مشترك بدون اسم",
        }));
      } catch (err) {
        console.error(" فشل جلب المشتركين:", err);
      }
    };

    fetchMembersSmart();
  }, []);

  const handleClassSelect = (cls) => {
    if (isReadOnly) return;

    setFormData((prev) => ({
      ...prev,
      title: cls,
      service: cls,
    }));

    setOpenClass(false);
    setClassSearch("");
    if (errors?.title) setErrors((prev) => ({ ...prev, title: null }));
  };

  const handleAddNewClass = () => {
    if (isReadOnly) return;
    const newClass = classSearch.trim();
    if (newClass && !classes.includes(newClass)) {
      setClasses([...classes, newClass]);
      handleClassSelect(newClass);
    }
  };

  // إغلاق القوائم عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-step1")) {
        setOpenClass(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!Array.isArray(formData?.members) || formData.members.length === 0) {
      return;
    }
    if (!Array.isArray(members) || members.length === 0) {
      return;
    }

    const enriched = formData.members.map((m) => {
      const id = typeof m === "object" ? m.id || m._id : m;
      const full = members.find((mm) => mm.id === id || mm._id === id);

      if (full) {
        return {
          ...m,
          id,
          name:
            full.name ||
            `${full.firstName || ""} ${full.lastName || ""}`.trim() ||
            full.userName ||
            "مشترك بدون اسم",
        };
      }
      return { id, name: "مشترك بدون اسم" };
    });

    setFormData((prev) => ({
      ...prev,
      members: enriched,
    }));
  }, [members, formData?.members?.length]);

  return (
    <div className="flex justify-center bg-white w-full text-black text-[14px]">
      <form className="w-[343px] flex flex-col gap-3 font-[Cairo]">
        {/* اسم الحصة */}
        <div className="relative dropdown-step1">
          <label className="block font-bold text-sm mb-1">
            اسم الحصة <span className="text-red-500">*</span>
          </label>
          <div
            className={`w-full h-10 rounded-[8px] flex items-center justify-between relative border ${
              errors?.title ? "border-red-500" : "border-gray-300"
            } ${
              isReadOnly
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => {
              if (!isIndividual) setOpenClass(!openClass);
            }}
          >
            <span
              className={`h-10 pr-3 pl-2 w-full flex items-center ${
                formData.title ? "text-black" : "text-gray-400"
              }`}
            >
              {formData.title || "اختر اسم الحصة"}
            </span>
            <img
              src={downarrowIcon}
              alt="downarrow"
              className="absolute left-2"
            />
          </div>
          {errors?.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}

          {openClass && !isReadOnly && (
            <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-300 mt-1 shadow-lg z-50">
              <div className="p-3 max-h-[240px] overflow-y-auto">
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="ابحث عن حصة..."
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    className="w-full h-8 rounded-md pr-8 pl-8 border border-gray-200 focus:outline-none text-gray-800 placeholder-gray-400"
                  />

                  <SearchIcon className="absolute top-1/2 right-2 -translate-y-1/2 w-4 h-4 text-[var(--color-purple)]" />

                  {classSearch && (
                    <XIcon
                      alt="clear"
                      className="absolute top-1/2 left-2 -translate-y-1/2 w-3.5 h-3.5 cursor-pointer opacity-80 hover:opacity-100 text-[var(--color-purple)]"
                      onClick={() => {
                        setClassSearch("");
                      }}
                    />
                  )}
                </div>

                {classSearch && !classes.includes(classSearch) && (
                  <div
                    onClick={handleAddNewClass}
                    className="flex items-center gap-2 mb-2 cursor-pointer px-2 py-1 hover:bg-gray-100 rounded-md"
                  >
                    <AddcircleIcon className="w-4 h-4 text-[var(--color-purple)]" />
                    <span className="text-gray-800 font-normal">
                      إضافة "{classSearch}"
                    </span>
                  </div>
                )}

                {classes
                  .filter((c) =>
                    c.toLowerCase().includes(classSearch.toLowerCase())
                  )
                  .map((cls, idx) => {
                    const isSelected = formData.title === cls;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleClassSelect(cls)}
                        className={`flex items-center justify-between h-[32px] px-3 py-1 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                          isSelected
                            ? "font-semibold text-black"
                            : "text-gray-700"
                        }`}
                      >
                        {cls}
                        <div
                          className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-[var(--color-purple)]"
                              : "border-[var(--color-purple)]"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-[var(--color-purple)]"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                {classes.filter((c) =>
                  c.toLowerCase().includes(classSearch.toLowerCase())
                ).length === 0 && (
                  <div className="text-gray-400 text-center py-2">
                    لا يوجد حصص مطابقة
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* الوصف */}
        <div>
          <label className="block font-bold text-sm mb-1">
            الوصف <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="أدخل الوصف"
            value={formData.description || ""}
            onChange={(e) => {
              if (isIndividual) return;
              setFormData({ ...formData, description: e.target.value });
              if (errors?.description)
                setErrors((prev) => ({ ...prev, description: null }));
            }}
            readOnly={isIndividual}
            disabled={isIndividual}
            className={`w-full h-10 border rounded-md px-3 focus:outline-none placeholder-gray-400 ${
              errors?.description ? "border-red-500" : "border-gray-300"
            } ${
              isReadOnly
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-white"
            }`}
          />
          {errors?.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* المدرب */}
        {!isCoach && (
          <>
            <div>
              <CoachSelector
                selectedCoach={formData.coach}
                setSelectedCoach={(coach) => {
                  setFormData({ ...formData, coachId: coach.id, coach });
                  if (errors?.coach)
                    setErrors((prev) => ({ ...prev, coach: null }));
                }}
                coachesList={coaches}
                placeholderColor="text-gray-400"
                borderStyle={errors?.coach ? "red" : "#D1D5DB"}
              />
            </div>
            {errors?.coach && (
              <p className="text-red-500 text-xs mt-1">{errors.coach}</p>
            )}
          </>
        )}

        {/* القاعة */}
        <div>
          <LocationSelector
            selectedLocation={formData.room}
            setSelectedLocation={(loc) => {
              setFormData((prev) => ({
                ...prev,
                room: loc,
                location: loc,
              }));

              if (errors?.room) setErrors((prev) => ({ ...prev, room: null }));
            }}
            locationsList={rooms}
            placeholderColor="text-gray-400"
            borderColor={errors?.room ? "red" : "#D1D5DB"}
            showIcon={false}
          />
        </div>
        {errors?.room && (
          <p className="text-red-500 text-xs mt-1">{errors.room}</p>
        )}

        {/* عدد المشتركين */}
        <div>
          <MaxParticipantsSelector
            selectedMax={formData.maxMembers}
            setSelectedMax={(value) => {
              setFormData((prev) => ({
                ...prev,
                maxMembers: Number(value),
              }));

              if (errors?.maxMembers)
                setErrors((prev) => ({ ...prev, maxMembers: null }));
            }}
            options={[
              { label: "1 مشترك", value: 1 },
              { label: "5 مشتركين", value: 5 },
              { label: "10 مشتركين", value: 10 },
              { label: "20 مشتركاً", value: 20 },
              { label: "غير محدود", value: Infinity },
              { label: "إدخال مخصص", value: "custom" },
            ]}
            borderColor={errors?.maxMembers ? "red" : "#D1D5DB"}
          />
        </div>

        {/* المشتركين */}
        <div className="h-[66px] w-[313px] flex flex-col justify-between gap-[8px]">
          <label className="text-[12px] font-bold leading-[18px]">
            المشتركين
          </label>
          <div className="relative w-[343px]">
            <ParticipantsSelector
              variant="booking"
              showLabel={false}
              showIcon={false}
              booking={formData}
              setBooking={setFormData}
              membersList={members}
            />
          </div>
        </div>

        {errors?.maxMembers && (
          <p className="text-red-500 text-xs mt-1">{errors.maxMembers}</p>
        )}
      </form>
    </div>
  );
}

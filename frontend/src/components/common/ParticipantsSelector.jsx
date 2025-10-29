import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AddCircleIcon from "../../icons/addcircle.svg?react";
import SearchIcon from "../../icons/search.svg?react";
import { toast } from "react-toastify";

/**
 * 🟣 ParticipantsSelector — تعديل محلي فقط داخل EventModal
 * لا يرسل أي طلب للسيرفر، يعتمد على حفظ EventModal النهائي.
 */
export default function ParticipantsSelector({ booking, setBooking }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("current"); // "current" | "add"
  const [search, setSearch] = useState("");
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const toId = (m) => (typeof m === "object" ? m.id || m._id || "" : m || "");
  const memberIds = useMemo(
    () => (Array.isArray(booking?.members) ? booking.members.map(toId) : []),
    [booking?.members]
  );

  const [selectedIds, setSelectedIds] = useState(memberIds);

  // جلب جميع المشتركين
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const token = import.meta.env.VITE_API_TOKEN;
        const res = await axios.get(
          "https://rezly-ddms-rifd-2025y-01p.onrender.com/auth/getAllMembers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data?.members || res.data?.employees || [];
        const formatted = data.map((m) => ({
          id: m._id,
          name:
            `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
            (m.name || ""),
          email: m.email || "",
        }));
        setAllMembers(formatted);
      } catch (err) {
        console.error("❌ فشل جلب المشتركين:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const currentMembers = allMembers.filter((m) => memberIds.includes(m.id));
  const availableMembers = allMembers.filter((m) => !memberIds.includes(m.id));

  const filteredList =
    mode === "current"
      ? currentMembers.filter((m) =>
          m.name.toLowerCase().includes(search.toLowerCase())
        )
      : availableMembers.filter((m) =>
          m.name.toLowerCase().includes(search.toLowerCase())
        );

  // ✅ تبديل التحديد محليًا فقط
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 💾 حفظ محلي فقط
  const handleApplyChanges = () => {
    const max = booking.maxMembers || 0;
    if (max > 0 && selectedIds.length > max) {
      toast.error(
        `تجاوزت الحد الأقصى لعدد المشتركين (${max}). لا يمكنك إضافة أكثر من ${max} مشترك.`
      );
      return;
    }

    setBooking((prev) => ({ ...prev, members: selectedIds }));
    toast.success("تم تحديث المشتركين محليًا ✅");
    setOpen(false);
    setMode("current");
  };

  useEffect(() => {
    if (open) {
      setSelectedIds(memberIds);
      setMode("current");
    }
  }, [open]);

  return (
    <div className="relative w-full">
      <label className="block font-bold text-sm mb-2">المشتركين</label>

      {/* الحقل الرئيسي */}
      <div
        className="w-full h-10 border border-gray-300 rounded-md flex items-center justify-between cursor-pointer px-2"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`h-10 w-full flex items-center pl-2 ${
            memberIds.length ? "text-black" : "text-gray-400"
          } font-normal`}
        >
          {memberIds.length > 0
            ? `${memberIds.length} مشترك${
                memberIds.length > 1 ? "ين" : ""
              }`
            : "لا يوجد مشتركين"}
        </span>
        <AddCircleIcon className="w-4 h-4 text-[var(--color-purple)]" />
      </div>

      {/* القائمة */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-400 mt-1 shadow z-50">
          <div className="p-4 overflow-y-auto max-h-[300px]">
            {/* البحث */}
            <div className="relative w-full h-[30px] mb-3">
              <input
                type="text"
                placeholder={
                  mode === "current"
                    ? "ابحث بين مشتركين الحجز..."
                    : "ابحث عن مشترك لإضافته..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full rounded-[8px] border border-gray-300 px-3 pr-10 focus:outline-none placeholder-gray-400 text-black font-normal"
              />
              <SearchIcon className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 text-[var(--color-purple)]" />
            </div>

            {/* تبديل الوضع */}
            <div
              onClick={() =>
                setMode(mode === "current" ? "add" : "current")
              }
              className="flex items-center gap-2 cursor-pointer mb-3 px-3 py-2 hover:bg-gray-100 rounded-md transition text-[14px]"
            >
              <AddCircleIcon className="w-4 h-4 text-[var(--color-purple)]" />
              <span className="text-gray-800 font-normal">
                {mode === "current"
                  ? "إضافة مشتركين جدد"
                  : "عرض مشتركين الحجز"}
              </span>
            </div>

            {/* القائمة */}
            {loading && (
              <p className="text-gray-500 text-sm text-center">
                جارِ التحميل...
              </p>
            )}

            {!loading && filteredList.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-2">
                لا يوجد نتائج مطابقة
              </p>
            )}

            {!loading &&
              filteredList.map((member) => {
                const id = member.id;
                const isSelected = selectedIds.includes(id);
                return (
                  <div
                    key={id}
                    onClick={() => toggleSelect(id)}
                    className="flex items-center justify-between h-[36px] px-3 py-1 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                  >
                    <span
                      className={
                        isSelected
                          ? "font-bold text-black"
                          : "font-normal text-gray-800"
                      }
                    >
                      {member.name || "مشترك غير معروف"}
                    </span>

                    {/* مربع الاختيار */}
                    <div
                      className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-colors duration-200 ${
                        isSelected
                          ? "bg-[var(--color-purple)] border-[var(--color-purple)]"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {isSelected && (
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
              })}
          </div>

          {/* زر تطبيق التعديلات */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-center">
            <button
              onClick={handleApplyChanges}
              className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-[var(--color-purple)] hover:bg-[#5a0ca0] transition"
            >
              حفظ التغييرات
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

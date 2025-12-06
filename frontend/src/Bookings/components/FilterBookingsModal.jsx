import React, { useState, useEffect } from "react";
import { filterBookingsAPI, getAllBookingsAPI } from "../../api/bookingsApi";
import { toast } from "react-toastify";

export default function FilterBookingsModal({ isOpen, onClose, onFilter }) {
  const [trainerId, setTrainerId] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🟣 جلب قائمة المدربين عند فتح المودال
  useEffect(() => {
    if (!isOpen) return;

    const fetchCoaches = async () => {
      try {
        const res = await fetch(
          "https://rezly-ddms-rifd-2025y-01p.onrender.com/auth/getAllEmployees",
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        const data = await res.json();
        const onlyCoaches = data.employees
          ?.filter((emp) => emp.role === "Coach")
          .map((c) => ({
            id: c._id,
            name: `${c.firstName} ${c.lastName}`,
          }));
        setCoaches(onlyCoaches || []);
      } catch (err) {
        console.error("❌ فشل في جلب المدربين:", err);
      }
    };

    fetchCoaches();
  }, [isOpen]);

  // 🟢 تطبيق الفلترة
  const handleApply = async () => {
    try {
      setLoading(true);
      const query = {};
if (date) query.date = date;
if (trainerId) query.coach = trainerId; // ✅ تعديل المفتاح الصحيح
if (location) query.location = location;
console.log("🔍 Query sent to API:", query);


      const res = await filterBookingsAPI(query);
      onFilter(res.data || []);
      toast.success("تم تطبيق الفلترة بنجاح ✅");
      onClose();
    } catch (err) {
      console.error("❌ خطأ أثناء تطبيق الفلترة:", err);
      toast.error("حدث خطأ أثناء تطبيق الفلترة");
    } finally {
      setLoading(false);
    }
  };

  // 🟡 إعادة تعيين الفلترة
  const handleReset = async () => {
    try {
      setLoading(true);
      const all = await getAllBookingsAPI();
      onFilter(all);
      toast.info("تمت إعادة تعيين الفلترة ✅");
      setTrainerId("");
      setLocation("");
      setDate("");
      onClose();
    } catch (err) {
      console.error("❌ فشل إعادة التعيين:", err);
      toast.error("حدث خطأ أثناء إعادة التعيين");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[400px] p-6 relative">
        {/* اللودنج */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
            <div className="w-10 h-10 border-4 border-[var(--color-purple)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* العنوان */}
        <h2 className="text-lg font-bold mb-4 text-right text-[var(--color-purple)]">
          فلترة الحجوزات
        </h2>

        {/* المدرب */}
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            المدرب
          </label>
          <select
            className="w-full border rounded-md p-2 text-sm"
            value={trainerId}
            onChange={(e) => setTrainerId(e.target.value)}
          >
            <option value="">الكل</option>
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>
                {coach.name}
              </option>
            ))}
          </select>
        </div>

        {/* القاعة */}
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            القاعة
          </label>
          <select
            className="w-full border rounded-md p-2 text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">الكل</option>
            <option value="قاعة 1">قاعة 1</option>
            <option value="قاعة 2">قاعة 2</option>
            <option value="قاعة 3">قاعة 3</option>
          </select>
        </div>

        {/* التاريخ */}
        <div className="mb-5">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            التاريخ
          </label>
          <input
            type="date"
            className="w-full border rounded-md p-2 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* الأزرار */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-100"
          >
            إعادة تعيين
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-sm text-gray-600 hover:bg-gray-100"
            >
              إلغاء
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-md bg-[var(--color-purple)] text-white text-sm hover:bg-[#5b0da0]"
            >
              تطبيق الفلترة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

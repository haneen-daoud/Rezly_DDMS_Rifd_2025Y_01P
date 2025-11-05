import { createContext, useContext, useState, useEffect } from "react";
import { getAllBookingsAPI } from "../api/bookingsApi";
import { getAllCoachesAPI } from "../api/coachesApi";
import { getUserFromToken } from "../api/bookingsApi";

const BookingsContext = createContext();
export const useBookings = () => useContext(BookingsContext);

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

   const fetchBookings = async () => {
  console.log("🚀 بدأ تنفيذ fetchBookings");
  setLoading(true);

  try {
    // ✅ نحاول نستخدم الكاش بحالة عدم الاتصال
    const cached = localStorage.getItem("cachedBookings");
    if (cached && !navigator.onLine) {
      setBookings(JSON.parse(cached));
      setLoading(false);
      return;
    }

    // 1️⃣ نجلب المستخدم من التوكن
    const user = await getUserFromToken();
    const currentRole = (user?.role || "").toLowerCase();
    setRole(currentRole);
    console.log("🎭 الدور الحالي من الكونتِكست:", currentRole || "(فارغ)");

    const isCoach = currentRole === "coach";
    const isAdmin = currentRole === "admin";

    // 2️⃣ جلب المدربين (Admins فقط)
    let coachesList = [];
    if (isAdmin) {
      try {
        coachesList = await getAllCoachesAPI();
      } catch (e) {
        console.warn(
          "⚠️ فشل جلب المدربين (Admin فقط):",
          e?.response?.data || e?.message
        );
      }
    }

    // 3️⃣ جلب كل الحجوزات
    // 3️⃣ جلب كل الحجوزات
const response = await getAllBookingsAPI();
const allBookings = Array.isArray(response?.data)
  ? response.data
  : Array.isArray(response)
  ? response
  : [];


// 4️⃣ فلترة حجوزات المدرب فقط (لو المستخدم Coach)
const myId = String(user?.id || "");
const filtered = isCoach
  ? allBookings.filter((b) =>
      b.schedules?.some((s) => String(s.coach) === myId)
    )
  : allBookings;

console.log("🎯 بعد الفلترة:", filtered.length);


    // 5️⃣ إنشاء خريطة للمدربين (Admins فقط)
    const coachesMap = {};
    (coachesList || []).forEach((c) => {
      const id = String(c._id || c.id || "");
      const fullName =
        `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
        c.name ||
        "مدرب";
      if (id) coachesMap[id] = { id, name: fullName };
    });

    // 6️⃣ دمج بيانات المدرب داخل كل حجز (حتى لو كانت بياناته ناقصة)
    const formatted = (filtered || []).map((b) => {
      const schedWithCoach =
        (b.schedules || []).find((s) => !!s.coach) || {};
      const rawCoach =
        schedWithCoach.coach ?? b.coach ?? b.coachId ?? null;

      const coachId =
        typeof rawCoach === "object"
          ? rawCoach?._id || rawCoach?.id
          : rawCoach;

      const coach =
        (coachId && coachesMap[String(coachId)]) ||
        (coachId
          ? { id: coachId, name: "مدرب غير معروف" }
          : { id: null, name: "لا يوجد مدرب" });

      return { ...b, coach };
    });

    // 7️⃣ تخزين وتحديث الحالة
    setBookings(formatted);
    localStorage.setItem("cachedBookings", JSON.stringify(formatted));

  } catch (err) {
    console.error("❌ فشل جلب الحجوزات:", err);
  } finally {
    setLoading(false);
  }
};




  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <BookingsContext.Provider value={{ bookings, setBookings, fetchBookings, loading, role }}>
      {children}
    </BookingsContext.Provider>
  );
};

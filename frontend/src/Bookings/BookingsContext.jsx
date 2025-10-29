import { createContext, useContext, useState, useEffect } from "react";
import { getAllBookingsAPI } from "../api/bookingsApi";
import { getAllCoachesAPI } from "../api/coachesApi";
import { getUserFromToken } from "../api/bookingsApi";

const BookingsContext = createContext();
export const useBookings = () => useContext(BookingsContext);

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

   const fetchBookings = async () => {
  setLoading(true);
  try {
    const user = await getUserFromToken();
    const isCoach = user?.role?.toLowerCase() === "coach";

    // ✅ 1) جلب المدربين
    const employeesRes = await getAllCoachesAPI();
    const coachesList = Array.isArray(employeesRes)
      ? employeesRes
      : employeesRes?.employees || [];

    console.log(
      "👥 قائمة المدربين من السيرفر:",
      coachesList.map((c) => ({
        id: c._id,
        name: `${c.firstName} ${c.lastName}`,
        role: c.role,
      }))
    );

    // ✅ 2) بناء خريطة المدربين
    const coachesMap = {};
    (coachesList || []).forEach((emp) => {
      if (emp.role?.toLowerCase() === "coach") {
        const id = String(emp._id);
        const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.trim();
        coachesMap[id] = { id, name: fullName };
      }
    });
    console.log("🗺️ coachesMap بعد البناء:", coachesMap);

    // ✅ 3) جلب الحجوزات
    const data = await getAllBookingsAPI();
    console.log("📦 الحجوزات الأصلية:", data);

    const base = isCoach
      ? data.filter((b) => b.schedules?.some((s) => s.coach === user?.id))
      : data;

    // ✅ 4) دمج الكوتش الصحيح
    const formatted = base.map((b) => {
      // نجيب أول schedule فيه coach
      const firstSchedule = b.schedules?.find((s) => s.coach) || {};
      const coachIdRaw = firstSchedule.coach || b.coachId || null;
      const coachId = coachIdRaw ? String(coachIdRaw) : "";

      // ✅ نطبع لتتبع السبب
      if (coachId && !coachesMap[coachId]) {
        console.log("⚠️ لم يُعثر على الكوتش في الماب:", {
          coachId,
          scheduleCoach: firstSchedule.coach,
          mapKeys: Object.keys(coachesMap),
        });
      }

      const coachData =
        coachId && coachesMap[coachId]
          ? coachesMap[coachId]
          : coachId
          ? { id: coachId, name: "مدرب غير معروف" }
          : { id: null, name: "لا يوجد مدرب" };

      return { ...b, coach: coachData };
    });

    console.log("✅ الحجوزات بعد إصلاح coach:", formatted);
    setBookings(formatted);
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
    <BookingsContext.Provider value={{ bookings, setBookings, fetchBookings, loading }}>
      {children}
    </BookingsContext.Provider>
  );
};

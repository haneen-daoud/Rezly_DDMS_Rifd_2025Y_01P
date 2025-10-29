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
      // 🟣 مين داخل الآن؟
      const user = getUserFromToken();
      const isCoach = user?.role?.toLowerCase() === "coach";

      // 1) جلب كل المدربين وبناء خريطة id → {id, name}
      const employees = await getAllCoachesAPI();
      const coachesOnly = (employees?.employees || employees || []).filter(
        (e) => e.role === "Coach"
      );

      const coachesMap = {};
      coachesOnly.forEach((emp) => {
        const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.trim();
        coachesMap[emp._id] = { id: emp._id, name: fullName || "مدرب" };
      });

      console.log("🗺️ coachesMap:", coachesMap);

      // 2) جلب الحجوزات
      const data = await getAllBookingsAPI();
      console.log("📦 الحجوزات الأصلية:", data);

      // 3) فلترة للمدرب (إن لزم)
      const base = isCoach
        ? data.filter((b) => {
            const cid =
              (typeof b.coach === "string" && b.coach) ||
              b.coachId ||
              b.coach?._id ||
              null;
            return cid === user?.id;
          })
        : data;

      // 4) تحويل coach من ID → كائن {id, name}
      const formatted = base.map((b) => {
        const cid =
          (typeof b.coach === "string" && b.coach) ||
          b.coachId ||
          (b.coach && b.coach._id) ||
          null;

        return {
          ...b,
          coach: cid
            ? coachesMap[cid] || { id: cid, name: "مدرب" }
            : { id: null, name: "لا يوجد مدرب" },
        };
      });

      console.log("✅ الحجوزات بعد تحويل coach:", formatted);

      setBookings(formatted);
    } catch (err) {
      console.error("❌ فشل جلب الحجوزات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadEmployees = async () => {
      const employees = await getAllCoachesAPI();
      localStorage.setItem(
        "allEmployees",
        JSON.stringify(employees?.employees || [])
      );
      console.log("✅ تم تخزين الموظفين:", employees);
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <BookingsContext.Provider
      value={{ bookings, setBookings, fetchBookings, loading }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

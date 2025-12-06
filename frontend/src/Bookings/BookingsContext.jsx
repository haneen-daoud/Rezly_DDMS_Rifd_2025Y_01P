import { createContext, useContext, useState, useEffect } from "react";
import { getAllBookingsAPI, getUserFromToken } from "../api/bookingsApi";
import { getAllCoachesAPI } from "../api/coachesApi";

const BookingsContext = createContext();
export const useBookings = () => useContext(BookingsContext);

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // 🟣 عشان الاسم + الرول

  const fetchBookings = async () => {
    console.log("🚀 بدأ تنفيذ fetchBookings");
    setLoading(true);

    try {
      // ✅ كاش للحجوزات بحالة عدم الاتصال
      const cached = localStorage.getItem("cachedBookings");
      if (cached && !navigator.onLine) {
        setBookings(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // 1️⃣ نجلب المستخدم (أولوية لـ localStorage)
      let appUser = null;
      const savedUser = localStorage.getItem("currentUser");

      if (savedUser) {
        appUser = JSON.parse(savedUser);
        console.log(
          "👤 المستخدم من localStorage داخل BookingsContext:",
          appUser
        );
      } else {
        appUser = await getUserFromToken();
        console.log("👤 المستخدم من التوكن داخل BookingsContext:", appUser);
      }

      if (!appUser) {
        console.warn("⚠️ لم يتم العثور على مستخدم، لن يتم جلب الحجوزات");
        setRole(null);
        setBookings([]);
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const currentRole = (appUser.role || "").toLowerCase();
      setRole(currentRole);
      setCurrentUser(appUser);

      console.log("🎭 الدور الحالي من الكونتِكست:", currentRole || "(فارغ)");

      const isSuperAdmin = currentRole === "superadmin";
      const isCoach = currentRole === "coach";
      const isAdmin = currentRole === "admin" || isSuperAdmin;
      const isReceptionist = currentRole === "receptionist";

      // 2 جلب المدربين (Admins + Receptionist)
      let coachesList = [];
      if (isAdmin || isReceptionist) {
        try {
          coachesList = await getAllCoachesAPI();
        } catch (e) {
          console.warn(
            "⚠️ فشل جلب المدربين (Admins + Receptionist فقط):",
            e?.response?.data || e?.message
          );
        }
      }

      // 3️⃣ جلب كل الحجوزات
      const response = await getAllBookingsAPI();
      const allBookings = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      // 4️⃣ فلترة حجوزات المدرب فقط (لو المستخدم Coach)
      const myId = String(appUser?.id || "");
      const filtered = isCoach
        ? allBookings.filter((b) =>
            b.schedules?.some((s) => String(s.coach) === myId)
          )
        : allBookings;

      console.log("🎯 بعد الفلترة:", filtered.length);

      // 5️⃣ إنشاء خريطة للمدربين (Admins + Receptionist)
      const coachesMap = {};
      (coachesList || []).forEach((c) => {
        const id = String(c._id || c.id || "");
        const fullName =
          `${c.firstName || ""} ${c.lastName || ""}`.trim() || c.name || "مدرب";
        if (id) coachesMap[id] = { id, name: fullName };
      });

      // 6️⃣ دمج بيانات المدرب داخل كل حجز
      const formatted = (filtered || []).map((b) => {
        const schedWithCoach = (b.schedules || []).find((s) => !!s.coach) || {};
        const rawCoach = schedWithCoach.coach ?? b.coach ?? b.coachId ?? null;

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

      // 🟣 تحميل قائمة كل المشتركين من localStorage (من شغل زميلتك)
      const allMembersCache = JSON.parse(
        localStorage.getItem("membersData") || "[]"
      );

      const cleaned = formatted.map((b) => {
        const memberIds =
          Array.isArray(b.uniqueMembers) && b.uniqueMembers.length > 0
            ? b.uniqueMembers
            : Array.isArray(b.members)
            ? b.members.map((m) => m.member || m._id || m.id)
            : [];

        const uniqueMap = new Map();

        memberIds.forEach((id) => {
          if (!uniqueMap.has(id)) {
            const found = allMembersCache.find(
              (mm) => mm._id === id || mm.id === id
            );

            uniqueMap.set(id, {
              _id: id,
              name:
                `${found?.firstName || ""} ${found?.lastName || ""}`.trim() ||
                found?.userName ||
                found?.name ||
                "مشترك بدون اسم",
            });
          }
        });

        return { ...b, members: Array.from(uniqueMap.values()) };
      });

      // 7️⃣ تخزين وتحديث الحالة
      setBookings(cleaned);
      localStorage.setItem("cachedBookings", JSON.stringify(cleaned));
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
    <BookingsContext.Provider
      value={{
        bookings,
        setBookings,
        fetchBookings,
        loading,
        role,
        currentUser,
        isAdmin: role === "admin" || role === "superadmin",
        isCoach: role === "coach",
        isReceptionist: role === "receptionist",
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

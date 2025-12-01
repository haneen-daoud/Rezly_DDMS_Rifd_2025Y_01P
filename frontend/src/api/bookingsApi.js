// src/api/bookingsApi.js
import axios from "axios";

/* ----------------------------------------------------------
   إعداد الاتصال مع السيرفر
---------------------------------------------------------- */
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://rezly-ddms-rifd-2025y-01p.onrender.com/booking";

/* ----------------------------------------------------------
   قراءة التوكن الديناميكية
---------------------------------------------------------- */
function getCurrentToken() {
  const token =
    localStorage.getItem("token") ||
    import.meta.env.VITE_API_TOKEN ||
    "";
  return token.startsWith("Bearer") ? token : `Bearer ${token}`;
}

/* ----------------------------------------------------------
   إنشاء instance لـ axios
---------------------------------------------------------- */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: getCurrentToken(),
  },
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = getCurrentToken();
  return config;
});

/* ----------------------------------------------------------
   فك التوكن واستخراج المستخدم
---------------------------------------------------------- */
export async function getUserFromToken() {
  try {
    const tokenStr =
      localStorage.getItem("token") ||
      "";
    if (!tokenStr) return null;

    const token = tokenStr.startsWith("Bearer ")
      ? tokenStr.split(" ")[1]
      : tokenStr;

    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    const id =
      decoded.id || decoded._id || decoded.userId || decoded.sub || null;
    const role = (decoded.role || decoded.userRole || "").toLowerCase();

    const user = { id, role };
    return user;
  } catch (err) {
    console.error("❌ فشل فك التوكن:", err);
    return null;
  }
}

/* ----------------------------------------------------------
   خرائط مساعدة
---------------------------------------------------------- */
const durationMap = {
  يوم: "1day",
  أسبوع: "1week",
  أسبوعين: "2weeks",
  "3 أسابيع": "3weeks",
  شهر: "1month",
  "3 أشهر": "3months",
  "6 أشهر": "6months",
  سنة: "1year",
};

/* ----------------------------------------------------------
   تجهيز الـpayload قبل الإرسال للباك
---------------------------------------------------------- */
export function buildBookingPayload(raw) {
  return {
    service: raw.service || raw.title || "",
    description: raw.description || "",
    coachId: raw.coachId || raw.trainerId || "",
    location: raw.location || "",
    startDate: raw.startDate || raw.start?.split("T")[0],
    subscriptionDuration:
      durationMap[raw.subscriptionDuration] || raw.subscriptionDuration || "1week",
    maxMembers: Number(raw.maxMembers) || 1,
    members: raw.members || [],
    reminders: raw.reminders || [],
    schedules: (raw.schedules || []).map((s) => ({
      dayOfWeek: s.dayOfWeek,
      timeStart: s.timeStart,
      timeEnd: s.timeEnd,
    })),
  };
}

/* ----------------------------------------------------------
   🟢 إنشاء حجز جديد
---------------------------------------------------------- */
export async function createBookingAPI(bookingData) {
  try {
    const { data } = await api.post("/addBooking", bookingData);
    return data;
  } catch (err) {
    console.error("❌ فشل إنشاء الحجز:", err.response?.data || err.message);
    throw err;
  }
}

/* ----------------------------------------------------------
   🟣 جلب جميع الحجوزات
---------------------------------------------------------- */
export async function getAllBookingsAPI() {
  try {
    const res = await api.get("/all_booking");
    return res.data; // يحتوي على data + metadata
  } catch (err) {
    console.error("خطأ أثناء جلب الحجوزات:", err.response?.data || err);
    throw err;
  }
}

/* ----------------------------------------------------------
   🔵 جلب تفاصيل حجز واحد
---------------------------------------------------------- */
export async function getBookingByIdAPI(id) {
  try {
    const res = await api.get(`/${id}`);
    return res.data;
  } catch (err) {
    console.error("فشل جلب الحجز:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "فشل جلب تفاصيل الحجز");
  }
}

/* ----------------------------------------------------------
   ✏️ تحديث جلسة واحدة أو مجموعة
---------------------------------------------------------- */
export async function updateSingleScheduleAPI(bookingId, body, scheduleId) {
  try {
    const res = await api.put(`/${bookingId}?scheduleId=${scheduleId}`, body);
    return res.data;
  } catch (err) {
    console.error("❌ خطأ أثناء تعديل الجلسة:", err.response?.data || err);
    throw err;
  }
}

export async function updateGeneralBookingAPI(groupId, body) {
  try {
    const res = await api.put(`/${groupId}?updateAllSameGroup=true`, body);
    return res.data;
  } catch (err) {
    console.error("❌ خطأ أثناء تعديل المجموعة:", err.response?.data || err);
    throw err;
  }
}

/* ----------------------------------------------------------
   🗑️ حذف حجز
---------------------------------------------------------- */
export async function deleteBookingAPI(id, options = {}) {
  try {
    const { isGroup = false, scheduleId = null } = options;
    let url = `/${id}`;
    if (isGroup) url += "?type=group";
    else if (scheduleId) url += `?scheduleId=${scheduleId}`;
    const res = await api.delete(url);
    return res.data;
  } catch (err) {
    console.error("خطأ أثناء حذف الحجز:", err.response?.data || err.message);
    throw err;
  }
}

/* ----------------------------------------------------------
   🔍 فلترة الحجوزات
---------------------------------------------------------- */
// ✅ دالة فلترة الحجوزات
export const filterBookingsApi = async ({ date, location, coachId }, token) => {
  const params = {};

  if (date) params.date = date;            // لازم "YYYY-MM-DD"
  if (location) params.location = location;
  if (coachId) params.coachId = coachId;

  const res = await api.get("/filter", {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // { status, data, ... }
};

/* ----------------------------------------------------------
   🚫 إلغاء حجز
---------------------------------------------------------- */
export async function cancelBookingAPI(bookingId) {
  try {
    const res = await api.patch(`/cancel/${bookingId}`);
    return res.data;
  } catch (err) {
    console.error("فشل إلغاء الحجز:", err.response?.data || err.message);
    throw err;
  }
}

/* ----------------------------------------------------------
   🔢 عدد الحجوزات
---------------------------------------------------------- */
export async function getBookingsCountAPI() {
  try {
    const res = await api.get("/all_booking");
    return res.data.metadata?.totalResults || 0;
  } catch (err) {
    console.error("خطأ أثناء جلب عدد الحجوزات:", err.response?.data || err);
    throw err;
  }
}

/* ----------------------------------------------------------
   👥 البحث عن المشتركين
---------------------------------------------------------- */
const BASE2_URL = "https://rezly-ddms-rifd-2025y-01p.onrender.com";
export const searchMembersAPI = async (search = "") => {
  try {
    const token =
      localStorage.getItem("token") ||
      "";
    const res = await axios.get(`${BASE2_URL}/auth/getAllMembers`, {
      params: { search },
      headers: {
        Authorization: token.startsWith("Bearer") ? token : `Bearer ${token}`,
      },
    });
    return res.data?.members || [];
  } catch (err) {
    console.error("❌ خطأ أثناء البحث عن المشتركين:", err.response?.data || err.message);
    return [];
  }
};

/* ----------------------------------------------------------
   🧾 التصدير العام
---------------------------------------------------------- */
export default {
  createBookingAPI,
  getAllBookingsAPI,
  getBookingByIdAPI,
  updateSingleScheduleAPI,
  updateGeneralBookingAPI,
  deleteBookingAPI,
filterBookingsApi,
  cancelBookingAPI,
  getBookingsCountAPI,
  searchMembersAPI,
  getUserFromToken,
  buildBookingPayload,
};

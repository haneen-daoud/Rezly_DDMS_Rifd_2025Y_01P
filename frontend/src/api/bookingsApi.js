// src/api/bookingsApi.js
import axios from "axios";

/* ----------------------------------------------------------
    إعداد الاتصال مع السيرفر
---------------------------------------------------------- */
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://rezly-ddms-rifd-2025y-01p.onrender.com/booking";

/* ----------------------------------------------------------
   قراءة ذكية للتوكن من localStorage أو .env
---------------------------------------------------------- */
function getCurrentToken() {
  const token =
    localStorage.getItem("authToken") ||
    (localStorage.getItem("token")
      ? `Bearer ${localStorage.getItem("token")}`
      : `Bearer ${import.meta.env.VITE_API_TOKEN}`) ||
    "";

  return token.startsWith("Bearer") ? token : `Bearer ${token.trim()}`;
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

// ✅ تحديث الهيدر قبل كل طلب
api.interceptors.request.use((config) => {
  config.headers.Authorization = getCurrentToken();
  return config;
});

/* ----------------------------------------------------------
    استخراج بيانات المستخدم من التوكن
---------------------------------------------------------- */
// 🔁 استبدلي الدالة كاملة بهذا الإصدار
// ✅ دالة قراءة المستخدم والدور من التوكن JWT مباشرة
export async function getUserFromToken() {
  try {
    const tokenStr =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      "";
    if (!tokenStr) {
      console.warn("⚠️ لا يوجد توكن في localStorage");
      return null;
    }

    // نظّفي الصيغة (لو كانت 'Bearer ...')
    const token = tokenStr.startsWith("Bearer ")
      ? tokenStr.split(" ")[1]
      : tokenStr;

    // فكّي الـ payload
    const base64Payload = token.split(".")[1];
    if (!base64Payload) {
      console.error("❌ شكل التوكن غير صالح:", token);
      return null;
    }

    const decoded = JSON.parse(atob(base64Payload));
    console.log("🧩 محتوى التوكن المفكوك:", decoded);

    // خدي منه المعلومات المتوفرة
    const id =
      decoded.id || decoded._id || decoded.userId || decoded.sub || null;
    const role = (decoded.role || decoded.userRole || "").toLowerCase();

    const user = { id, role };
    localStorage.setItem("currentUser", JSON.stringify(user));
    console.log("✅ المستخدم الحالي (من التوكن):", user);

    return user;
  } catch (err) {
    console.error("❌ فشل فك التوكن:", err);
    return null;
  }
}



/* ----------------------------------------------------------
   دوال مساعدة داخلية
---------------------------------------------------------- */
const convertTo12Hour = (time) => {
  if (!time) return "08:00 ص";
  const [h, m] = time.split(":").map(Number);
  let hour = h % 12 || 12;
  const period = h >= 12 ? "م" : "ص";
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

const daysMap = {
  أحد: "Sun",
  إثنين: "Mon",
  ثلاثاء: "Tue",
  أربعاء: "Wed",
  خميس: "Thu",
  جمعة: "Fri",
  سبت: "Sat",
};

const durationMap = {
  أسبوع: "1week",
  أسبوعين: "2weeks",
  "3 أسابيع": "3weeks",
  شهر: "1month",
  "3 أشهر": "3months",
  "6 أشهر": "6months",
  سنة: "1year",
};

const remindersMap = {
  "0": "0",
  "30m": "30m",
  "1h": "1h",
  "1d": "1d",
};

// تنسيق بيانات الحجز قبل الإرسال
function formatPayload(raw) {
  const date = raw.start ? raw.start.split("T")[0] : raw.date || "";
  const recurrence = (raw.repeatDays || []).map((d) => daysMap[d] || d);

  return {
    service: raw.title || raw.service || "",
    description: raw.description || "",
    coachId: raw.coachId || raw.coach || raw.trainerId || "",
    date,
    timeStart: convertTo12Hour(raw.start?.split("T")[1] || raw.timeStart),
    timeEnd: convertTo12Hour(raw.end?.split("T")[1] || raw.timeEnd),
    location: raw.room || raw.location || "",
    maxMembers: parseInt(raw.maxMembers) || 1,
    recurrence,
    subscriptionDuration: durationMap[raw.subscriptionDuration] || "1week",
    reminders:
      Array.isArray(raw.reminders) && raw.reminders.length
        ? raw.reminders.map((r) => remindersMap[r] || r)
        : [],
    members: raw.members || [],
  };
}

/* ----------------------------------------------------------
    CRUD APIs
---------------------------------------------------------- */

// 🟢 إنشاء حجز جديد
export const createBookingAPI = async (bookingData) => {
  try {
    const { data } = await api.post("/addBooking", bookingData);
    return data;
  } catch (err) {
    console.error("❌ فشل إنشاء الحجز:", err.response?.data || err.message);
    throw err;
  }
};

// 🟣 جلب جميع الحجوزات
export async function getAllBookingsAPI() {
  try {
    const res = await api.get("/all_booking");
    return res.data.data;
  } catch (err) {
    console.error("خطأ أثناء جلب الحجوزات:", err.response?.data || err);
    throw err;
  }
}

// 🔵 جلب حجز واحد
export async function getBookingByIdAPI(id) {
  try {
    const res = await api.get(`/${id}`);
    return res.data;
  } catch (err) {
    console.error("فشل جلب الحجز:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "فشل جلب تفاصيل الحجز");
  }
}

// 🟡 تعديل حجز كامل
export async function updateGeneralBookingAPI(groupId, body) {
  try {
    const token = getCurrentToken();
    const res = await axios.put(
      `https://rezly-ddms-rifd-2025y-01p.onrender.com/booking/${groupId}?updateAllSameGroup=true`,
      body,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error(
      "❌ خطأ في updateGeneralBookingAPI:",
      err.response?.data || err.message
    );
    throw err;
  }
}

// 🔵 تعديل تكرار مفرد
export async function updateSingleScheduleAPI(bookingId, body, scheduleId) {
  try {
    const token = getCurrentToken();
    const url = `https://rezly-ddms-rifd-2025y-01p.onrender.com/booking/${bookingId}?scheduleId=${scheduleId}`;
    console.log("🔹 PUT →", url);

    const res = await axios.put(url, body, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Schedule updated:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ خطأ أثناء التعديل:", err.response?.data || err.message);
    throw err;
  }
}


// 🔴 حذف حجز
export async function deleteBookingAPI(id, isGroup = false) {
  try {
    const url = isGroup ? `/${id}?type=group` : `/${id}`;
    const res = await api.delete(url);
    return res.data;
  } catch (err) {
    console.error("خطأ أثناء حذف الحجز:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "فشل حذف الحجز");
  }
}

/* ----------------------------------------------------------
   دوال إضافية
---------------------------------------------------------- */

// فلترة الحجوزات
export async function filterBookingsAPI(query = {}) {
  try {
    const res = await api.get("/filter", { params: query });
    return res.data;
  } catch (err) {
    console.error("فشل فلترة الحجوزات:", err.response?.data || err.message);
    throw new Error("فشل فلترة الحجوزات");
  }
}

// عرض الحجوزات على التقويم
export async function calendarViewAPI() {
  try {
    const res = await api.get("/calendar");
    return res.data;
  } catch (err) {
    console.error("فشل جلب التقويم:", err.response?.data || err.message);
    throw new Error("فشل جلب بيانات التقويم");
  }
}

// إلغاء الحجز
export async function cancelBookingAPI(bookingId) {
  try {
    const res = await api.patch(`/cancel/${bookingId}`);
    return res.data;
  } catch (err) {
    console.error("فشل إلغاء الحجز:", err.response?.data || err.message);
    throw new Error("فشل إلغاء الحجز");
  }
}

// جلب عدد الحجوزات
export async function getBookingsCountAPI() {
  try {
    const res = await api.get("/all_booking");
    return res.data.metadata?.totalResults || 0;
  } catch (err) {
    console.error("خطأ أثناء جلب عدد الحجوزات:", err.response?.data || err);
    throw err;
  }
}
/* -----------------------------------*/


const BASE2_URL = "https://rezly-ddms-rifd-2025y-01p.onrender.com";

// ✅ جلب المشتركين مع دعم البحث
export const searchMembersAPI = async (search = "") => {
  try {
    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      "";

    const res = await axios.get(`${BASE2_URL}/auth/getAllMembers`, {
      params: { search },
      headers: {
        Authorization: token.startsWith("Bearer")
          ? token
          : `Bearer ${token}`,
      },
    });

    return res.data?.members || [];

  } catch (err) {
    console.error("❌ خطأ أثناء البحث عن المشتركين:", err.response?.data || err.message);
    return [];
  }
};

/* ----------------------------------------------------------
   التصدير العام
---------------------------------------------------------- */
export default {
  createBookingAPI,
  getAllBookingsAPI,
  getBookingByIdAPI,
  deleteBookingAPI,
  filterBookingsAPI,
  calendarViewAPI,
  cancelBookingAPI,
  getBookingsCountAPI,
  getUserFromToken,
  updateSingleScheduleAPI,
  updateGeneralBookingAPI,
  searchMembersAPI,
};

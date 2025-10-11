console.log("VITE_API_TOKEN =", import.meta.env.VITE_API_TOKEN);

import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "https://rezly-ddms-rifd-2025y-01p.onrender.com/booking";
const BASE_URL = "https://rezly-ddms-rifd-2025y-01p.onrender.com/booking";

const ACCESS_TOKEN = import.meta.env.VITE_API_TOKEN || "";
const REFRESH_TOKEN = import.meta.env.VITE_API_REFRESH || "";

console.log("API BASE:", BASE);
console.log("ACCESS_TOKEN present?", !!ACCESS_TOKEN);
console.log("ACCESS_TOKEN ASCII?", /^[\x00-\x7F]*$/.test(ACCESS_TOKEN));

const api = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${ACCESS_TOKEN.trim()}`;
  }
  return config;
});

function parsemaxMembers(value) {
  if (value == null) return 1;
  const n = parseInt(String(value).replace(/\D+/g, ""), 10);
  if (!isNaN(n) && n > 0) return n;
  if (String(value).includes("غير")) return 9999;
  return 1;
}

const convertTo12Hour = (t) => {
  if (!t) return "08:00 ص";
  const [hourStr, minuteStr] = t.split(":");
  if (!hourStr || !minuteStr) return "08:00 ص";
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (isNaN(hour) || isNaN(minute)) return "08:00 ص";
  const ampm = hour >= 12 ? "م" : "ص";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

function formatPayload(raw) {
  const date = raw.start ? raw.start.split("T")[0] : raw.date || "";

  const daysMap = {
    "أحد": "Sun",
    "إثنين": "Mon",
    "ثلاثاء": "Tue",
    "أربعاء": "Wed",
    "خميس": "Thu",
    "جمعة": "Fri",
    "سبت": "Sat",
  };
  const recurrenceEnglish = (raw.repeatDays || []).map(day => daysMap[day] || day);

  const durationMap = {
    "أسبوع": "1week",
    "أسبوعين": "2weeks",
    "3 أسابيع": "3weeks",
    "شهر": "1month",
    "3 أشهر": "3months",
    "6 أشهر": "6months",
    "سنة": "1year",
  };

  const remindersMap = {
  "0": "0",
  "30m": "30m",
  "1h": "1h",
  "1d": "1d",
};


  return {
    service: raw.title || raw.service || "",
    description: raw.description || "",
    coachId: raw.coachId || raw.coach || raw.trainerId || "",
    date,
    timeStart: convertTo12Hour(raw.start ? raw.start.split("T")[1] : raw.timeStart),
    timeEnd: convertTo12Hour(raw.end ? raw.end.split("T")[1] : raw.timeEnd),
    location: raw.room || raw.location || "",
    maxMembers: parseInt(raw.maxMembers) || 1,
    recurrence: recurrenceEnglish,
    subscriptionDuration: durationMap[raw.duration] || "1week",
reminders:
  Array.isArray(raw.reminders) && raw.reminders.length > 0
    ? raw.reminders.map(r => remindersMap[r] || r)
    : [],
    members: raw.members || [],
  };
}


// Create booking (POST /booking/)
export async function createBookingAPI(bookingData) {
  const payload = formatPayload(bookingData);
  console.log("Payload being sent to backend:", payload);

  try {
    const res = await api.post("/addBooking", payload);
    return res.data; 
  } catch (err) {
    console.error("Error creating booking:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.data ||
      err.message ||
      "حدث خطأ أثناء إنشاء الحجز"
    );
  }
}

// Get all bookings (GET /booking/all_booking)
export const getAllBookingsAPI = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/all_booking`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      },
    });
    return res.data.data;
  } catch (err) {
    console.error("Error fetching all bookings:", err.response?.data || err);
    throw err;
  }
};

// Get booking by ID (GET /booking/:id)
export async function getBookingByIdAPI(id) {
  try {
    const res = await api.get(`/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching booking by id:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || err.message || "فشل جلب تفاصيل الحجز");
  }
}

// Update booking (PUT /booking/:id)
export async function updateBookingAPI(id, updateData, isGroup = false) {
  const payload = formatPayload(updateData);

  try {
    const url = isGroup ? `/${id}?updateGroup=true` : `/${id}`;
    const res = await api.put(url, payload);
    return res.data;
  } catch (err) {
    console.error("Error updating booking:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || err.message || "فشل تحديث الحجز"
    );
  }
}



// Delete booking (single or group)
export async function deleteBookingAPI(id, isGroup = false) {
  try {
    const url = isGroup ? `/${id}?type=group` : `/${id}`;
    const res = await api.delete(url);
    return res.data;
  } catch (err) {
    console.error("Error deleting booking:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || err.message || "فشل حذف الحجز"
    );
  }
}


// Filter bookings (GET /booking/filter)
export async function filterBookingsAPI(query = {}) {
  try {
    const res = await api.get("/filter", { params: query });
    return res.data;
  } catch (err) {
    console.error("Error filtering bookings:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || err.message || "فشل فلترة الحجوزات");
  }
}

// Calendar view (GET /booking/calendar)
export async function calendarViewAPI() {
  try {
    const res = await api.get("/calendar");
    return res.data;
  } catch (err) {
    console.error("Error fetching calendar view:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || err.message || "فشل جلب بيانات التقويم");
  }
}

// Cancel booking (PATCH /booking/cancel/:bookingId)
export async function cancelBookingAPI(bookingId) {
  try {
    const res = await api.patch(`/cancel/${bookingId}`);
    return res.data;
  } catch (err) {
    console.error("Error cancelling booking:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || err.message || "فشل إلغاء الحجز");
  }
}

export default {
  createBookingAPI,
  getAllBookingsAPI,
  getBookingByIdAPI,
  updateBookingAPI,
  deleteBookingAPI,
  filterBookingsAPI,
  calendarViewAPI,
  cancelBookingAPI,
};

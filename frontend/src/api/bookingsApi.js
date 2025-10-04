console.log("VITE_API_TOKEN =", import.meta.env.VITE_API_TOKEN);

import axios from "axios";


const BASE = import.meta.env.VITE_API_BASE_URL || "https://rezly-ddms-rifd-2025y-01p.onrender.com/booking/add-booking";

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



function parseMaxParticipants(value) {
  if (value == null) return 1;
  const n = parseInt(String(value).replace(/\D+/g, ""), 10);
  if (!isNaN(n) && n > 0) return n;
  if (String(value).includes("غير")) return 9999;
  return 1;
}

function formatPayload(raw) {
  const date = raw.start ? raw.start.split("T")[0] : raw.date || "";

  const getHHMM = (t) => {
    if (!t) return "";
    // لو t بصيغة "08:00" أو "15:30" مباشرة نرجعها
    if (t.includes(":")) return t.slice(0, 5);
    return t;
  };

  return {
    service: raw.title || raw.service || "",
    coachId: raw.coachId || raw.coach || raw.trainerId || "",
    date,
    timeStart: raw.start ? getHHMM(raw.start.split("T")[1]) : getHHMM(raw.timeStart),
    timeEnd: raw.end ? getHHMM(raw.end.split("T")[1]) : getHHMM(raw.timeEnd),
    location: raw.room || raw.location || "",
    numberOfMember: parseInt(raw.maxParticipants) || 1,
  };
}


// ------------ API FUNCTIONS ------------

// Create booking (POST /booking/)
export async function createBookingAPI(bookingData) {
  const payload = formatPayload(bookingData);
  console.log("Payload to API:", payload);

  try {
    const res = await api.post("/", payload);
    console.log("Booking created successfully:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error creating booking:", err.response?.data || err.message);
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.data ||
      err.message ||
      "حدث خطأ أثناء إنشاء الحجز";
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
}

// Get all bookings for current user (GET /booking/all_booking)
export async function getAllBookingsAPI(params = {}) {
  try {
    const res = await api.get("/all_booking", { params });
    return res.data;
  } catch (err) {
    console.error("Error fetching all bookings:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || err.message || "فشل جلب الحجوزات");
  }
}

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
export async function updateBookingAPI(id, updateData) {
  const payload = formatPayload(updateData);
  try {
    const res = await api.put(`/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error("Error updating booking:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || err.message || "فشل تحديث الحجز");
  }
}

// Delete booking (DELETE /booking/:id)
export async function deleteBookingAPI(id) {
  try {
    const res = await api.delete(`/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting booking:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || err.message || "فشل حذف الحجز");
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

// Cancel booking (PATCH /booking/cancel/:bookingId) - note: router used '/cancel/:bookingId' in your controller
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

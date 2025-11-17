import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "https://rezly-ddms-rifd-2025y-01p.onrender.com";

export default function ScanAttendance() {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("جاري معالجة الطلب...");

  useEffect(() => {
    const doScan = async () => {
      const params = new URLSearchParams(location.search);
      const type = params.get("type"); // CHECK_IN أو CHECK_OUT

      if (!type) {
        setStatus("error");
        setMessage("رابط غير صالح: لا يوجد نوع العملية (type).");
        return;
      }

      try {
        // لازم يكون اليوزر/الموظف مسجل دخول وفي توكن
        const token = localStorage.getItem("token");
        if (!token) {
          setStatus("error");
          setMessage("يجب تسجيل الدخول أولاً قبل استخدام هذا الرابط.");
          toast.error("سجّل الدخول ثم أعد المحاولة.");
          return;
        }

        const res = await axios.post(
          `${API_BASE}/attendance/scan`,
          { qrType: type },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const msg = res.data?.message || "تم تسجيل العملية بنجاح ✅";
        setStatus("success");
        setMessage(msg);
        toast.success(msg);
      } catch (err) {
        console.error("Scan attendance error:", err);
        const apiMsg = err?.response?.data?.message;
        setStatus("error");
        setMessage(apiMsg || "حدث خطأ أثناء تسجيل العملية.");
        toast.error(apiMsg || "حدث خطأ أثناء تسجيل العملية.");
      }
    };

    doScan();
  }, [location.search]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#F8F8F8]"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-md px-6 py-8 max-w-sm w-full text-center">
        <h1 className="text-lg font-bold mb-4">
          {status === "loading"
            ? "جاري تسجيل العملية..."
            : status === "success"
            ? "تمت العملية"
            : "حدث خطأ"}
        </h1>

        <p
          className={`text-sm mb-6 ${
            status === "error" ? "text-red-500" : "text-[#555]"
          }`}
        >
          {message}
        </p>

        <button
          onClick={() => navigate("/user")}
          className="px-4 py-2 rounded-xl bg-[var(--color-purple)] text-white text-sm font-bold w-full"
        >
          العودة لصفحة الحضور
        </button>
      </div>
    </div>
  );
}

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

  // 🔁 دالة صغيرة تحدد وين نوجّه اليوزر بعد النجاح
  const redirectByRole = () => {
    const role = localStorage.getItem("role"); // حسب اللي بتخزّلوه بجلسة اللوج إن

    let redirectPath = "/dashboard";

    if (role === "Member") {
      redirectPath = "/user";
    } else {
      // Admin, Coach, Accountant, Receptionist
      redirectPath = "/dashboard";
    }

    navigate(redirectPath, { replace: true });
  };

  useEffect(() => {
    const doScan = async () => {
      const params = new URLSearchParams(location.search);
      const type = params.get("type"); // CHECK_IN أو CHECK_OUT

      if (!type) {
        setStatus("error");
        setMessage("رابط غير صالح: لا يوجد نوع العملية (type).");
        return;
      }

      const token = localStorage.getItem("token");

      // 🟥 لو مش مسجل دخول، نوديه على صفحة اللوج إن ونحفظ مكان الرجوع
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً.");
        const redirectUrl =
          location.pathname + location.search; // /scan?type=CHECK_IN

        navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`, {
          replace: true,
        });
        return;
      }

      try {
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

        // ⏱ نعطيه لحظات يشوف الرسالة، بعدين نودّيه على صفحته
        setTimeout(() => {
          redirectByRole();
        }, 1500);
      } catch (err) {
        console.error("Scan attendance error:", err);
        const apiMsg = err?.response?.data?.message;
        setStatus("error");
        setMessage(apiMsg || "حدث خطأ أثناء تسجيل العملية.");
        toast.error(apiMsg || "حدث خطأ أثناء تسجيل العملية.");
      }
    };

    doScan();
  }, [location.search, navigate]);

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
          onClick={redirectByRole}
          className="px-4 py-2 rounded-xl bg-[var(--color-purple)] text-white text-sm font-bold w-full"
        >
          الانتقال إلى صفحتك
        </button>
      </div>
    </div>
  );
}

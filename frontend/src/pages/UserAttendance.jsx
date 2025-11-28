import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Scanner } from "@yudiel/react-qr-scanner";

const API_BASE = "https://rezly-ddms-rifd-2025y-01p.onrender.com";

export default function UserAttendance() {
  const navigate = useNavigate();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [message, setMessage] = useState("");

  // استخراج نوع العملية من محتوى الكود
  const extractTypeFromQR = (text) => {
    if (!text) return null;

    const raw = text.trim();

    // 1) لو هو لينك فيه ?type=CHECK_IN أو ?type=CHECK_OUT
    try {
      const url = new URL(raw);
      const t = url.searchParams.get("type");
      if (t && (t.toUpperCase() === "CHECK_IN" || t.toUpperCase() === "CHECK_OUT")) {
        return t.toUpperCase();
      }
    } catch {
      // مش URL، نكمّل
    }

    // 2) لو النص نفسه يحتوي CHECK_IN أو CHECK_OUT
    const upper = raw.toUpperCase();
    if (upper.includes("CHECK_IN")) return "CHECK_IN";
    if (upper.includes("CHECK_OUT")) return "CHECK_OUT";

    return null;
  };

  const handleScan = useCallback(
    async (value) => {
      if (isProcessing) return;

      // مكتبة @yudiel/react-qr-scanner بترجع غالباً array من النتائج
      let text = null;

      if (Array.isArray(value) && value.length > 0) {
        // كل عنصر فيه rawValue
        text = value[0]?.rawValue || null;
      } else if (typeof value === "string") {
        text = value;
      } else if (value?.rawValue) {
        text = value.rawValue;
      }

      if (!text) return;

      console.log("QR TEXT:", text);

      const qrType = extractTypeFromQR(text);

      if (!qrType) {
        toast.error("الكود غير صالح أو لا يحتوي على نوع العملية (دخول/خروج).");
        setStatus("error");
        setMessage("الكود غير صالح، اطلب من موظف الاستقبال كود صحيح.");
        return;
      }

      setIsProcessing(true);
      setStatus("idle");
      setMessage("");

      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً.");
        const redirectUrl = "/user"; // صفحة الميمبر
        navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`, {
          replace: true,
        });
        setIsProcessing(false);
        return;
      }

      // نجيب role من currentUser إذا موجود
      let role = null;
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          role = parsed.role;
        } catch (e) {
          console.error("خطأ في قراءة currentUser من localStorage:", e);
        }
      }

      try {
        const payload = {
          qrType, // CHECK_IN أو CHECK_OUT
        };

        if (role) {
          payload.role = role;
        }

        const res = await axios.post(
          `${API_BASE}/attendance/scan`,
          payload,
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

        // نوقف الكاميرا بعد النجاح
        setIsScannerOpen(false);
      } catch (err) {
        console.error("Scan attendance error:", err);
        const apiMsg = err?.response?.data?.message;
        setStatus("error");
        setMessage(apiMsg || "حدث خطأ أثناء تسجيل العملية.");
        toast.error(apiMsg || "حدث خطأ أثناء تسجيل العملية.");
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, navigate]
  );

  const handleError = useCallback((error) => {
    console.error("QR Scanner error:", error);
    toast.error("تعذّر الوصول للكاميرا. تأكدي من إعطاء الصلاحيات للمتصفح.");
  }, []);

  return (
    <div
      className="w-full h-full min-h-[calc(100vh-72px)] flex items-center justify-center bg-[#F8F8F8]"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-md px-6 py-8 max-w-sm w-full text-center">
        <h1 className="text-lg font-bold mb-3">سجل حضورك اليوم 💪</h1>

        <p className="text-sm text-[#6B7280] leading-relaxed mb-2">
          لتسجيل الحضور أو الانصراف:
        </p>
        <p className="text-sm text-[#111827] font-semibold leading-relaxed mb-4">
          افتح كاميرا المسح من هنا، ثم وجّه جوالك نحو كود الـ QR المعروض عند
          موظف الاستقبال.
        </p>

        {/* زر فتح/إغلاق الكاميرا */}
        <button
          onClick={() => {
            setIsScannerOpen((prev) => !prev);
            setStatus("idle");
            setMessage("");
          }}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-white mb-4 transition
                     hover:opacity-90 disabled:opacity-70"
          style={{ backgroundColor: "var(--color-purple)" }}
          disabled={isProcessing}
        >
          {isScannerOpen ? "إيقاف الكاميرا" : "فتح الكاميرا لمسح الكود"}
        </button>

        {/* حالة الرسالة (نجاح / خطأ) */}
        {status !== "idle" && (
          <p
            className={`text-sm mb-4 ${
              status === "error" ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* منطقة السكان بالكاميرا */}
        {isScannerOpen && (
          <div className="mt-2 w-full flex flex-col items-center gap-2">
            <div className="w-full max-w-[260px] aspect-square overflow-hidden rounded-2xl border border-[#E5E7EB]">
              <Scanner
                onScan={handleScan}
                onError={handleError}
                constraints={{ facingMode: "environment" }}
                components={{
                  // نخفي الـ UI الافتراضي (اختياري لو بتحبي واجهته)
                  finder: false,
                }}
              />
            </div>
            <p className="text-[12px] text-[#6B7280] leading-relaxed">
              وجّه الكود داخل الإطار حتى يتم قراءته تلقائياً.
              <br />
              {isProcessing && "جارٍ تسجيل العملية..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

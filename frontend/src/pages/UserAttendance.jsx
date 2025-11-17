import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import QrCodeIcon from "../icons/qrCode.svg";

export default function UserAttendance() {
  const [activeTab, setActiveTab] = useState("CHECK_IN"); // CHECK_IN or CHECK_OUT
  const [qrCodes, setQrCodes] = useState({
    checkInQR: "",
    checkOutQR: "",
  });
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "https://rezly-ddms-rifd-2025y-01p.onrender.com/attendance/qrcodes"
        );
        console.log("QR API response >>>", res.data);
        setQrCodes({
          checkInQR: res.data.checkInQR || "",
          checkOutQR: res.data.checkOutQR || "",
        });
      } catch (error) {
        console.error("خطأ أثناء جلب أكواد الحضور:", error);
        toast.error("حدث خطأ أثناء تحميل أكواد الحضور، حاول مرة أخرى");
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, []);

  const currentQR =
    activeTab === "CHECK_IN" ? qrCodes.checkInQR : qrCodes.checkOutQR;

  const descriptionText =
    activeTab === "CHECK_IN"
      ? "جاهز للإنجاز؟ 🚀 امسح الكود للدخول"
      : "إلى اللقاء! 👋 لا تنسَ تمسح الكود قبل المغادرة";

  return (
    <div
      className="relative w-full h-full min-h-[calc(100vh-72px)] bg-[#F8F8F8]"
      dir="rtl"
    >
      {/* البانل اللي فيه التابات + النص + QR */}
      {isPanelOpen && (
        <div className="absolute bottom-24 left-4 z-20">
          {/* إطار بتدرج ألوان */}
          <div className="bg-gradient-to-l from-[#7C3AED] via-[#10B981] via-[#3B82F6] to-[#FBBF24] p-[1.5px] rounded-2xl shadow-lg">
            <div className="bg-white rounded-2xl p-4 w-[320px] sm:w-[360px]">
              {/* Tabs */}
              <div className="flex w-full bg-[#F3F3F7] rounded-[16px] p-1 mb-4">
                <button
                  onClick={() => setActiveTab("CHECK_IN")}
                  className={`flex-1 py-2 rounded-[12px] text-[13px] font-[700] transition-all
                    ${
                      activeTab === "CHECK_IN"
                        ? "bg-[var(--color-purple)] text-white"
                        : "text-[#7E818C]"
                    }
                  `}
                >
                  سجّل دخولك
                </button>
                <button
                  onClick={() => setActiveTab("CHECK_OUT")}
                  className={`flex-1 py-2 rounded-[12px] text-[13px] font-[700] transition-all
                    ${
                      activeTab === "CHECK_OUT"
                        ? "bg-[var(--color-purple)] text-white"
                        : "text-[#7E818C]"
                    }
                  `}
                >
                  سجّل خروجك
                </button>
              </div>

              {/* نص المحتوى */}
              <div className="mb-4 text-right">
                <h2 className="text-[16px] font-[800] text-center text-[#111827] mb-1">
                  دخولك وخروجك بخطوة واحدة
                </h2>
                <p className="text-[13px] text-center text-[#6B7280] leading-relaxed">
                  {descriptionText}
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center items-center min-h-[180px]">
                {loading ? (
                  <span className="text-[13px] text-[#7E818C]">
                    جاري تحميل الكود...
                  </span>
                ) : currentQR ? (
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-[#E5E7EB]">
                    <img
                      src={currentQR}
                      alt="QR Code"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-[12px] text-red-500 text-center">
                    لم يتم تحميل الكود، تأكد من اتصال السيرفر أو مسار الـ API.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* الزر الدائري البنفسجي تحت عاليسار */}
      <button
        onClick={() => setIsPanelOpen((prev) => !prev)}
        className="
          absolute left-4 bottom-4
          w-20 h-20 rounded-full
          bg-[var(--color-purple)] text-white
          flex items-center justify-center
          shadow-[0_10px_25px_rgba(0,0,0,0.18)]
          hover:scale-105 active:scale-95
          transition-transform duration-150
        "
        aria-label="فتح كود الحضور"
      >
        <img src={QrCodeIcon} alt="QR" className="w-12 h-12" />
      </button>
    </div>
  );
}

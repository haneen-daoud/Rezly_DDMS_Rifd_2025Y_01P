import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BookingsProvider } from "../Bookings/BookingsContext";
import { getUserFromToken, searchMembersAPI } from "../api/bookingsApi";
import { getAllEmployees } from "../api.js";
import SubTopbar from "../components/SubTopbar.jsx";
import AddParticipantModel from "./AddParticipantModel/AddParticipantModel.jsx";
import AddBookingModal from "../Bookings/components/AddBookingModal/AddBookingModal.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import QrCodeIcon from "../icons/qrCode.svg";

export default function Layout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [showAddBookingForm, setShowAddBookingForm] = useState(false);

  const [selectedTab, setSelectedTab] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  //حالة كود الحضور
  const [isQrPanelOpen, setIsQrPanelOpen] = useState(false);
  const [attendanceActiveTab, setAttendanceActiveTab] = useState("CHECK_IN"); // CHECK_IN | CHECK_OUT
  const [attendanceQrCodes, setAttendanceQrCodes] = useState({
    checkInQR: "",
    checkOutQR: "",
  });
  const [qrLoading, setQrLoading] = useState(false);

  //استخراج التاب النشط من الـ URL تلقائياً
  useEffect(() => {
    const path = location.pathname;

    //إدارة العملاء
    if (path.startsWith("/dashboard/clients")) {
      const subPath = path.split("/")[3];
      const mapping = {
        bookings: "الحجوزات",
        members: "المشتركين",
        attendance: "سجل الحضور",
        reports: "التقارير",
        settings: "الإعدادات",
      };

      setSelectedTab("إدارة العملاء");

      if (subPath && mapping[subPath]) {
        setActiveSubTab(mapping[subPath]);
      } else {
        setActiveSubTab("الحجوزات");
        navigate("/dashboard/clients/bookings", { replace: true });
      }
    }

    //طاقم العمل
    else if (path.startsWith("/dashboard/employees")) {
      const subPath = path.split("/")[3];
      const mapping = {
        staff: "الموظفين",
        roles: "الصلاحيات",
        reports: "التقارير",
        settings: "الإعدادات",
      };

      setSelectedTab("طاقم العمل");

      if (subPath && mapping[subPath]) {
        setActiveSubTab(mapping[subPath]);
      } else {
        setActiveSubTab("الموظفين");
        navigate("/dashboard/employees/staff", { replace: true });
      }
    }

    //الصفحة الرئيسية
    else if (path === "/dashboard" || path === "/dashboard/") {
      setSelectedTab("الصفحة الرئيسية");
      setActiveSubTab("");
    }

    //المالية
    else if (path.startsWith("/dashboard/finance")) {
      setSelectedTab("المالية");
      setActiveSubTab("");
    }

    //الإعدادات
    else if (path.startsWith("/dashboard/setting")) {
      setSelectedTab("الإعدادات");
      setActiveSubTab("");
    }
  }, [location.pathname, navigate]);

  //تأكد فيه توكن وإلا رجّعه للوج إن
  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  //تحميل بيانات المستخدم
  useEffect(() => {
    async function loadUser() {
      const saved = localStorage.getItem("currentUser");

      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        console.log("تم تحميل المستخدم من localStorage:", parsed);
        return;
      }

      const u = await getUserFromToken();
      setCurrentUser(u);
      console.log("تم تحميل المستخدم من التوكن فقط:", u);
    }

    loadUser();
  }, []);

  //جلب بروفايل كامل (اسم + صورة) من الداتابيس حسب الرول
  useEffect(() => {
    const fetchUserProfile = async () => {
      // لو ما في يوزر أو الصورة أصلاً موجودة لا تعمل ولا إشي
      if (!currentUser?.id || !currentUser?.role || currentUser?.image) return;

      try {
        const roleLower = currentUser.role.toLowerCase();
        let updatedUser = { ...currentUser };
        let imageUrl = null;
        let firstName = currentUser.firstName;
        let lastName = currentUser.lastName;

        if (roleLower === "member") {
          //مشترك: نجيب كل المشتركين بالتوكن الصح ونفلتر على الـ id
          const members = await searchMembersAPI("");
          const me = members.find((m) => m._id === currentUser.id);

          if (me) {
            imageUrl = me.image || null;
            firstName = me.firstName || firstName;
            lastName = me.lastName || lastName;
          }
        } else {
          //موظف (آدمن، مدرب، استقبال، محاسب): نجيب كل الموظفين ونفلتر
          const employeesRes = await getAllEmployees();
          const employees =
            employeesRes?.employees || employeesRes?.data?.employees || [];
          const me = employees.find((emp) => emp._id === currentUser.id);

          if (me) {
            imageUrl = me.image || null;
            firstName = me.firstName || firstName;
            lastName = me.lastName || lastName;
          }
        }

        updatedUser = {
          ...updatedUser,
          firstName,
          lastName,
          image: imageUrl,
        };

        setCurrentUser(updatedUser);

        //نحدّث الكوبي اللي بالـ localStorage عشان يضل ثابت بعد الريفريش
        const saved = localStorage.getItem("currentUser");
        if (saved) {
          const parsed = JSON.parse(saved);
          localStorage.setItem(
            "currentUser",
            JSON.stringify({ ...parsed, firstName, lastName, image: imageUrl })
          );
        }
      } catch (error) {
        console.error("خطأ أثناء جلب بروفايل المستخدم:", error);
      }
    };

    fetchUserProfile();
  }, [currentUser?.id, currentUser?.role]);

  //جلب أكواد الحضور فقط لو المستخدم Admin أو Receptionist
  useEffect(() => {
    if (!currentUser) return;

    const allowedRoles = ["Admin", "Receptionist"];
    if (!allowedRoles.includes(currentUser.role)) return;

    const fetchQRCodes = async () => {
      try {
        setQrLoading(true);
        const res = await axios.get(
          "https://rezly-ddms-rifd-2025y-01p.onrender.com/attendance/qrcodes"
        );

        setAttendanceQrCodes({
          checkInQR: res.data.checkInQR || "",
          checkOutQR: res.data.checkOutQR || "",
        });
      } catch (error) {
        console.error("خطأ أثناء جلب أكواد الحضور:", error);
        toast.error("حدث خطأ أثناء تحميل أكواد الحضور، حاول مرة أخرى");
      } finally {
        setQrLoading(false);
      }
    };

    fetchQRCodes();
  }, [currentUser]);

  const topbarTitle =
    location.pathname === "/dashboard"
      ? "مرحباً بك في لوحة التحكم، نتمنى لك يوماً مثمراً!"
      : selectedTab;

  const currentQR =
    attendanceActiveTab === "CHECK_IN"
      ? attendanceQrCodes.checkInQR
      : attendanceQrCodes.checkOutQR;

  const descriptionText =
    attendanceActiveTab === "CHECK_IN"
      ? "جاهز للإنجاز؟ 🚀 امسح الكود للدخول"
      : "إلى اللقاء! 👋 لا تنسَ تمسح الكود قبل المغادرة";

  const isDashboardHome =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  const showQrForThisUser =
    currentUser &&
    (currentUser.role === "Admin" || currentUser.role === "Receptionist") &&
    isDashboardHome;

  return (
    //أهم تعديل: نخلي اللفة الأساسية على قد الشاشة وما تسمح للصفحة نفسها تسكرول
    <div className="w-full h-screen flex bg-[#F8F8F8] overflow-hidden">
      {/* Sidebar ثابت على اليسار وبسكرول لحاله لو طول المحتوى */}
      <div className="hidden lg:block w-[22%] max-w-[280px] h-full">
        <Sidebar
          user={currentUser}
          onClose={() => setOpenSidebar(false)}
          onSelectTab={setSelectedTab}
          setActiveSubTab={setActiveSubTab}
        />
      </div>

      {/* Drawer للموبايل */}
      {openSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenSidebar(false)}
          ></div>

          {/* السايدبار */}
          <div className="absolute top-0 right-0 h-full bg-white w-[212px] shadow-xl animate-slideIn">
            <Sidebar
              user={currentUser}
              onClose={() => setOpenSidebar(false)}
              onSelectTab={setSelectedTab}
              setActiveSubTab={setActiveSubTab}
            />
          </div>
        </div>
      )}

      {/* الجزء اليمين (التوب بار + المحتوى) */}
      <BookingsProvider>
        {/*نخلي العمود اليمين كله على قد الشاشة برضه */}
        <div className="flex flex-col w-full h-full">
          {/* Topbar ثابت */}
          <Topbar
            user={currentUser}
            title={topbarTitle}
            onMenuClick={() => setOpenSidebar((prev) => !prev)}
          />

          {/*هذا الجزء هو اللي فيه كل شيء قابل للسكرول (بدون التوب بار) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* SubTopbar لو استقبال في الهوم */}
            {location.pathname === "/dashboard" &&
              (currentUser?.role?.toLowerCase() === "reception" ||
                currentUser?.role?.toLowerCase() === "receptionist") && (
                <SubTopbar
                  onAddMemberClick={() => setShowAddMemberForm(true)}
                  onAddBookingClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("openAddBookingFromHome")
                    )
                  }
                />
              )}

            {/* المودالات ما بتأثر على الارتفاع لأنها أوفرلاي */}
            {showAddMemberForm && (
              <AddParticipantModel
                onClose={() => setShowAddMemberForm(false)}
              />
            )}

            <AddBookingModal
              onChange={() => {}}
              openEventName="openAddBookingFromHome"
              editEventName={null}
            />

            {/* breadcrumb للموبايل */}
            <div className="lg:hidden mt-2 px-4 text-right font-Cairo text-[12px] font-semibold">
              {location.pathname === "/dashboard" ? (
                <span className="text-[var(--color-purple)]">
                  الصفحة الرئيسية
                </span>
              ) : location.pathname.startsWith("/dashboard/clients") ? (
                <>
                  <span className="text-[#7E818C]">إدارة العملاء</span>
                  {activeSubTab && (
                    <>
                      <span className="text-[#7E818C] mx-1">{`>`}</span>
                      <span className="text-[var(--color-purple)]">
                        {activeSubTab}
                      </span>
                    </>
                  )}
                </>
              ) : location.pathname.startsWith("/dashboard/employees") ? (
                <>
                  <span className="text-[#7E818C]">طاقم العمل</span>
                  {activeSubTab && (
                    <>
                      <span className="text-[#7E818C] mx-1">{`>`}</span>
                      <span className="text-[var(--color-purple)]">
                        {activeSubTab}
                      </span>
                    </>
                  )}
                </>
              ) : location.pathname.startsWith("/dashboard/finance") ? (
                <span className="text-[var(--color-purple)]">المالية</span>
              ) : location.pathname.startsWith("/dashboard/setting") ? (
                <span className="text-[var(--color-purple)]">الإعدادات</span>
              ) : null}
            </div>

            {/*هذا هو اللي بسكرول */}
            <main
              className="
                flex-1 w-full overflow-y-auto bg-[#F8F8F8]
                mt-4 pb-6
                px-4 lg:[padding-inline-start:15px] lg:[padding-inline-end:24px]
              "
            >
              <Outlet
                context={{ setActiveSubTab, activeSubTab, currentUser }}
              />
            </main>
          </div>
        </div>
      </BookingsProvider>

      {/* Overlay يغطي الصفحة عند فتح QR */}
      {isQrPanelOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[98]"
          onClick={() => setIsQrPanelOpen(false)}
        ></div>
      )}

      {/* زر و بانل الـ QR زي ما هو */}
      {showQrForThisUser && (
        <>
          {isQrPanelOpen && (
            <div className="fixed bottom-24 left-18 z-99" dir="rtl">
              <div className="bg-gradient-to-l from-[#7C3AED] via-[#10B981] via-[#3B82F6] to-[#FBBF24] p-[1.5px] rounded-2xl shadow-lg">
                <div className="bg-white rounded-2xl p-4 w-[320px] sm:w-[360px]">
                  {/* Tabs */}
                  <div className="flex w-full bg-[#F3F3F7] rounded-[16px] p-1 mb-4">
                    <button
                      onClick={() => setAttendanceActiveTab("CHECK_IN")}
                      className={`flex-1 py-2 rounded-[12px] text-[13px] font-[700] transition-all ${
                        attendanceActiveTab === "CHECK_IN"
                          ? "bg-[var(--color-purple)] text-white"
                          : "text-[#7E818C]"
                      }`}
                    >
                      كود تسجيل الدخول
                    </button>
                    <button
                      onClick={() => setAttendanceActiveTab("CHECK_OUT")}
                      className={`flex-1 py-2 rounded-[12px] text-[13px] font-[700] transition-all ${
                        attendanceActiveTab === "CHECK_OUT"
                          ? "bg-[var(--color-purple)] text-white"
                          : "text-[#7E818C]"
                      }`}
                    >
                      كود تسجيل الخروج
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
                    {qrLoading ? (
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
                        لم يتم تحميل الكود، تأكد من اتصال السيرفر أو مسار الـ
                        API.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* الزر الدائري */}
          <button
            onClick={() => setIsQrPanelOpen((prev) => !prev)}
            className="
              fixed left-4 bottom-4
              w-20 h-20 rounded-full
              bg-[var(--color-purple)] text-white
              flex items-center justify-center
              shadow-[0_10px_25px_rgba(0,0,0,0.18)]
              hover:scale-105 active:scale-95
              transition-transform duration-150
              z-100
            "
            aria-label="فتح كود الحضور"
          >
            <img src={QrCodeIcon} alt="QR" className="w-12 h-12" />
          </button>
        </>
      )}
    </div>
  );
}

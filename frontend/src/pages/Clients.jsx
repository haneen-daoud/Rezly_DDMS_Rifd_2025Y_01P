import React, { useState, useEffect } from "react";
import SubscribersTab from "../components/Tabs/SubscribersTab";
import BookingsPage from "../components/Tabs/BookingsTab.jsx";
import AddParticipantModel from "../components/AddParticipantModel/AddParticipantModel.jsx";
import { useBookings } from "../Bookings/BookingsContext.jsx";
import { getBookingsCountAPI } from "../api/bookingsApi.js";
import ClientsHeader from "../components/ClientsHeader.jsx";
import {
  useOutletContext,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { getAllMembers } from "../api.js";
import FilterBookings from "../components/Filter/FilterBookings.jsx";
import SubscribersFilter from "../components/Filter/SubscribersFilter.jsx";

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState("الحجوزات");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [isBookingsFilterOpen, setIsBookingsFilterOpen] = useState(false);
  const [isSubscribersFilterOpen, setIsSubscribersFilterOpen] = useState(false);

  // سيرتش المشتركين
  const [membersSearch, setMembersSearch] = useState("");

  const { bookings, loading, setBookings } = useBookings();
  const { setActiveSubTab, activeSubTab } = useOutletContext();
  const [filterAnchorRect, setFilterAnchorRect] = useState(null);

  const [subscribersFilterAnchorRect, setSubscribersFilterAnchorRect] =
    useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  //  نقرأ اسم التاب من الـ URL أول ما ندخل الصفحة
  useEffect(() => {
    const path = location.pathname.split("/")[3]; // → bookings / members / reports...
    const mapping = {
      bookings: "الحجوزات",
      members: "المشتركين",
      attendance: "سجل الحضور",
      reports: "التقارير",
      settings: "الإعدادات",
    };

    if (mapping[path]) {
      setActiveTab(mapping[path]);
      setActiveSubTab(mapping[path]);
    }
  }, [location.pathname]);

  // عند تغيّر activeSubTab (من السايدبار) → حدث الرابط تلقائياً
  useEffect(() => {
    const reverseMapping = {
      الحجوزات: "bookings",
      المشتركين: "members",
      "سجل الحضور": "attendance",
      التقارير: "reports",
      الإعدادات: "settings",
    };

    if (activeSubTab && reverseMapping[activeSubTab]) {
      navigate(`/dashboard/clients/${reverseMapping[activeSubTab]}`);
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  //  جلب عدد المشتركين
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getAllMembers();
        setTotalMembers(data.totalMembers || 0);
      } catch (err) {
        console.error("خطأ أثناء جلب المشتركين:", err);
      }
    };
    fetchMembers();
  }, []);

  // تحديث عداد المشتركين كل ما تتغير البيانات (إضافة / تعديل / حذف)
  useEffect(() => {
    const handleMembersUpdated = (e) => {
      let members = e.detail;

      if (!Array.isArray(members)) {
        const localData = localStorage.getItem("membersData");
        members = localData ? JSON.parse(localData) : [];
      }

      setTotalMembers(Array.isArray(members) ? members.length : 0);
    };

    window.addEventListener("membersUpdated", handleMembersUpdated);

    return () => {
      window.removeEventListener("membersUpdated", handleMembersUpdated);
    };
  }, []);

  {
    /*
  //  جلب عدد الحجوزات
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getBookingsCountAPI();
        setTotalBookings(count);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCount();
  }, []);
*/
  }
  useEffect(() => {
    if (Array.isArray(bookings)) {
      setTotalBookings(bookings.length);
    }
  }, [bookings]);

  // لما نكبس زر "إضافة"
  const handleAddBookingClick = () => {
    if (activeTab === "الحجوزات") {
      window.dispatchEvent(new CustomEvent("openAddBooking"));
    } else if (activeTab === "المشتركين") {
      setIsModalOpen(true);
    }
  };

  // الهاندلر اللي بيستقبل قيمة البحث من الهيدر
  const handleSearchChange = (value) => {
    if (activeTab === "المشتركين") {
      setMembersSearch(value);
    }
    // لو حابين نفعّل بحث الحجوزات لاحقاً، منضيف else if هون
  };

  // عرض المحتوى حسب التاب الحالي
  const renderContent = () => {
    switch (activeTab) {
      case "المشتركين":
        return <SubscribersTab searchValue={membersSearch} />;
      case "الحجوزات":
        return <BookingsPage />;
      default:
        return (
          <div className="p-4 bg-white rounded-2xl shadow">
            محتوى {activeTab}
          </div>
        );
    }
  };

  const sanitizeMemberForCache = (member) => {
    if (!member) return member;

    const {
      _id,
      firstName,
      lastName,
      gender,
      idNumber,
      birthDate,
      phone,
      email,
      city,
      address,
      image,
      packageId,
      paymentMethod,
      coachId,
      startDate,
      endDate,
      confirmEmail,
      isActive,
      file,
      createdAt,
      updatedAt,
    } = member;

    return {
      _id,
      firstName,
      lastName,
      gender,
      idNumber,
      birthDate,
      phone,
      email,
      city,
      address,
      image,
      packageId,
      paymentMethod,
      coachId,
      startDate,
      endDate,
      confirmEmail,
      isActive,
      file,
      createdAt,
      updatedAt,
    };
  };

  const handleOpenBookingsFilter = (rect) => {
    if (activeTab === "الحجوزات") {
      setFilterAnchorRect(rect || null); // نخزن مكان الزر
      setIsBookingsFilterOpen(true);
    }
  };

  useEffect(() => {
    const handleOpenSubscribersFilter = (event) => {
      if (activeTab === "المشتركين") {
        const rect = event?.detail?.rect || null;
        setSubscribersFilterAnchorRect(rect);
        setIsSubscribersFilterOpen(true);
      }
    };

    window.addEventListener(
      "openSubscribersFilter",
      handleOpenSubscribersFilter
    );

    return () => {
      window.removeEventListener(
        "openSubscribersFilter",
        handleOpenSubscribersFilter
      );
    };
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-3 flex-1 w-full">
      {/* الهيدر الجديد */}
      <ClientsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalBookings={totalBookings}
        totalMembers={totalMembers}
        handleAddBookingClick={handleAddBookingClick}
        onOpenFilter={handleOpenBookingsFilter}
        onSearchChange={handleSearchChange}
      />

      {/* محتوى الصفحة حسب التاب */}
      {renderContent()}

      {/* مودال إضافة المشتركين */}
      {isModalOpen && activeTab === "المشتركين" && (
        <AddParticipantModel
          onClose={() => setIsModalOpen(false)}
          onSave={(newMember) => {
            //  نخبر باقي السيستم إنه في مشترك جديد انضاف
            window.dispatchEvent(
              new CustomEvent("membersUpdated", {
                detail: { type: "add", member: newMember },
              })
            );

            // نرفع عداد المشتركين في الهيدر (اختياري بس حلو)
            setTotalMembers((prev) => prev + 1);

            // نسكّر المودال
            setIsModalOpen(false);
          }}
        />
      )}

      {/* مودال فلترة الحجوزات */}
      {isBookingsFilterOpen && activeTab === "الحجوزات" && (
        <FilterBookings
          onClose={() => setIsBookingsFilterOpen(false)}
          onApply={(filters) => {
            console.log("Filters applied: ", filters);
            // لاحقًا تربطي الفلاتر مع جدول الحجوزات
            setIsBookingsFilterOpen(false);
          }}
          coachesList={[]}
          locationsList={[]}
          anchorRect={filterAnchorRect} //  مكان زر الفلترة
        />
      )}

      {/* مودال فلترة المشتركين */}
      {subscribersFilterAnchorRect &&
        isSubscribersFilterOpen &&
        activeTab === "المشتركين" && (
          <SubscribersFilter
            isOpen={isSubscribersFilterOpen}
            onClose={() => setIsSubscribersFilterOpen(false)}
            anchorRect={subscribersFilterAnchorRect}
          />
        )}

      <Outlet />
    </div>
  );
}

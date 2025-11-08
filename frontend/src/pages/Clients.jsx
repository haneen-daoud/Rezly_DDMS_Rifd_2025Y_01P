import React, { useState, useEffect } from "react";
import SubscribersTab from "../components/Tabs/SubscribersTab";
import BookingsPage from "../components/Tabs/BookingsTab.jsx";
import AddParticipantModel from "../components/AddParticipantModel/AddParticipantModel.jsx";
import { useBookings } from "../Bookings/BookingsContext.jsx";
import { getBookingsCountAPI } from "../api/bookingsApi.js";
import { BookingsProvider } from "../Bookings/BookingsContext.jsx";
import ClientsHeader from "../components/ClientsHeader.jsx";
import { useOutletContext } from "react-router-dom";

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState("المشتركين");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);

  const { bookings, loading } = useBookings();

const { setActiveSubTab, activeSubTab } = useOutletContext();

// إذا تغيّر التاب الفرعي من السايدبار، فعله مباشرة
useEffect(() => {
  if (activeSubTab && activeSubTab !== activeTab) {
    setActiveTab(activeSubTab);
  }
}, [activeSubTab]);

  // لما نكبس زر "إضافة"
  const handleAddBookingClick = () => {
    if (activeTab === "الحجوزات") {
      window.dispatchEvent(new CustomEvent("openAddBooking"));
    } else if (activeTab === "المشتركين") {
      setIsModalOpen(true);
    }
  };

  // عرض المحتوى حسب التاب
  const renderContent = () => {
    switch (activeTab) {
      case "المشتركين":
        return <SubscribersTab />;
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

  return (
    <div className="flex flex-col gap-3 flex-1 w-full">
      {/* الهيدر المفصول */}
      <ClientsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalBookings={totalBookings}
        handleAddBookingClick={handleAddBookingClick}
      />

      {/* المحتوى */}
      {renderContent()}

      {/* مودال المشتركين فقط */}
      {isModalOpen && activeTab === "المشتركين" && (
        <AddParticipantModel
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => console.log("تم إضافة مشترك:", data)}
        />
      )}
    </div>
  );
}

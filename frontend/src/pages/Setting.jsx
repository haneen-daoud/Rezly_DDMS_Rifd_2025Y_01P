import React, { useState } from "react";
import ClubSettingsContent from "../components/Settings/ClubSettingsContent";
import ProfilePlaceholder from "../components/Settings/ProfilePlaceholder";

export default function Setting() {
  const [activeTab, setActiveTab] = useState("club");
  return (
    <div className="w-full h-full" dir="rtl">
      <div className="w-full">
        <div className="w-full h-[45px] bg-white border border-[#E5E7EB] rounded-[8px] flex">
          {/* الملف الشخصي */}
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={[
              "flex-1 rounded-[8px] text-[14px] font-bold transition-all",
              activeTab === "profile"
                ? "bg-[var(--color-purple)] text-white shadow-sm"
                : "bg-transparent text-[#4B5563] hover:bg-[#F3E8FF]",
            ].join(" ")}
          >
            الملف الشخصي
          </button>

          {/* إعدادات النادي */}
          <button
            type="button"
            onClick={() => setActiveTab("club")}
            className={[
              "flex-1 rounded-[8px] text-[14px] font-bold transition-all",
              activeTab === "club"
                ? "bg-[var(--color-purple)] text-white shadow-sm"
                : "bg-transparent text-[#4B5563] hover:bg-[#F3E8FF]",
            ].join(" ")}
          >
            إعدادات النادي
          </button>
        </div>
      </div>

      {/* محتوى التاب */}
      {activeTab === "club" ? <ClubSettingsContent /> : <ProfilePlaceholder />}
    </div>
  );
}

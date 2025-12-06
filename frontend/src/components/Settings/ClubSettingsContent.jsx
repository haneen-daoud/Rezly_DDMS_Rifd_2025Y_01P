import React, { useState, useRef, useEffect } from "react";
import TextField from "./TextField";
import StaffSettingsCard from "./StaffSettingsCard";
import ClientsSettingsCard from "./ClientsSettingsCard";
import DownloadIcon from "../../icons/download.svg?react";
import { createGym } from "../../api";
import { toast } from "react-toastify";

export default function ClubSettingsContent() {
  const [clubMainData, setClubMainData] = useState({});
  const [staffData, setStaffData] = useState({});
  const [clientsData, setClientsData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const departmentsArray = Array.isArray(staffData.departments)
        ? staffData.departments.filter((d) => d && d.trim() !== "")
        : [];

      const jobTitlesArray = Array.isArray(staffData.jobTitles)
        ? staffData.jobTitles.filter((j) => j && j.trim() !== "")
        : [];

      const departmentsPayload = departmentsArray.map((name) => ({
        name: name.trim(),
        jobTitles: jobTitlesArray,
      }));

      // الأدوار
      const rolesPayload = Array.isArray(staffData.roles)
        ? staffData.roles.map((r) => (r || "").trim()).filter((r) => r !== "")
        : [];

      // العقود
      const contractsPayload = Array.isArray(staffData.contracts)
        ? staffData.contracts
            .map((c) => ({
              name: (c.name || "").trim(),
              duration: (c.duration || "").trim(),
            }))
            .filter((c) => c.name !== "")
        : [];

      // مدد الاشتراك
      const subscriptionsPayload = Array.isArray(clientsData.durations)
        ? clientsData.durations
            .map((d) => (d || "").trim())
            .filter((d) => d !== "")
            .map((name) => ({ name }))
        : [];

      // الحصص
      const classesPayload = Array.isArray(clientsData.sessions)
        ? clientsData.sessions
            .map((s) => (s || "").trim())
            .filter((s) => s !== "")
            .map((name) => ({ name }))
        : [];

      // القاعات
      const hallsPayload = Array.isArray(clientsData.rooms)
        ? clientsData.rooms
            .map((room) => ({
              name: (room.name || "").trim(),
              capacity: room.capacity ? Number(room.capacity) : 0,
            }))
            .filter((r) => r.name !== "")
        : [];

      const payload = {
        name: clubMainData.name || "",
        logo: clubMainData.logo || "",
        email: clubMainData.email || "",
        phone: clubMainData.phone || "",
        location: clubMainData.location || "",
        currency: clubMainData.currency || "",
        status: "active",
        imageFile: clubMainData.imageFile || null,

        departments: departmentsPayload,
        roles: rolesPayload,
        contracts: contractsPayload,
        classes: classesPayload,
        halls: hallsPayload,
        subscriptions: subscriptionsPayload,
      };

      await createGym(payload);
      toast.success("تم حفظ إعدادات النادي بنجاح");
    } catch (error) {
      console.error("Error saving club settings", error);
      toast.error("حدث خطأ أثناء حفظ إعدادات النادي");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full mt-4 flex flex-col gap-4">
      {/* 1) إعدادات النادي الرياضي */}
      <ClubMainSettingsCard onChange={setClubMainData} />

      {/* 2) إعدادات طاقم العمل */}
      <StaffSettingsCard onChange={setStaffData} />

      {/* 3) إعدادات إدارة العملاء */}
      <ClientsSettingsCard onChange={setClientsData} />

      {/* أزرار أسفل صفحة الإعدادات */}
      <div className="mt-2 mb-4 flex justify-end gap-2">
        <button
          type="button"
          className="h-[40px] w-[168px] px-4 rounded-[8px] border border-[var(--color-purple)] bg-white
                     text-[16px] font-normal text-[var(--color-purple)]
                     hover:bg-[#F3F4F6] transition cursor-pointer"
        >
          إلغاء
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="h-[40px] w-[168px] px-4 rounded-[8px] bg-[var(--color-purple)]
                     text-[16px] font-normal text-white
                     hover:bg-[#5B0A98] transition shadow-sm cursor-pointer disabled:opacity-70"
        >
          {isSaving ? "جارٍ الحفظ..." : "حفظ"}
        </button>
      </div>
    </div>
  );
}

/* ===== كارد إعدادات النادي الرياضي ===== */

function ClubMainSettingsCard({ onChange }) {
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [currency, setCurrency] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (onChange) {
      onChange({
        imageFile,
        name,
        logo,
        email,
        phone,
        location,
        currency,
      });
    }
  }, [imageFile, name, logo, email, phone, location, currency, onChange]);

  const handleSelectImage = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[12px] py-6 px-4 flex flex-col gap-4">
      {/* الهيدر + مربع تحميل الصورة */}
      <div className="flex flex-row items-center gap-4">
        {/* إطار خارجي + padding 8 + مربع الحدود المتقطعة */}
        <div
          className="
    w-[136px]
    h-[136px]
    shrink-0
    rounded-[12px]
    border border-[#D1D5DB]
    flex items-center justify-center
    p-2
  "
        >
          {/* مربّع تحميل صورة – 136x136 – حدود متقطّعة */}
          <button
            type="button"
            onClick={handleClickUpload}
            className="
      w-[120px]
      h-[120px]
      rounded-[10px]
      bg-[#F9FAFB]
      border border-dashed border-[var(--color-purple)]
      flex items-center justify-center
      cursor-pointer
      hover:border-[var(--color-purple)]
      transition-colors
    "
          >
            <div className="flex flex-col items-center justify-center">
              {/* المربع البنفسجي */}
              <div className="w-10 h-10 rounded-[8px] bg-[#E1CFEF] shadow-sm flex items-center justify-center">
                <DownloadIcon className="w-6 h-6 text-[var(--color-purple)]" />
              </div>

              {/* النص تحت المربع */}
              <span className="mt-2 text-[12px] font-medium text-black">
                تحميل صورة
              </span>
            </div>
          </button>

          {/* input حقيقي للملف (مخفي) */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleSelectImage}
            className="hidden"
          />
        </div>

        {/* النص على اليسار، المربّع على اليمين */}
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] font-bold text-[#000000]">
            إعدادات النادي الرياضي
          </h2>
          <p className="text-[18px] font-normal text-[#7E818C]">
            إدارة العلامة التجارية والإعدادات العامة للتطبيق
          </p>
        </div>
      </div>

      {/* الحقول */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
        <TextField
          label="اسم النادي"
          placeholder="أدخل اسم النادي الرياضي الخاص بك"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="شعار النادي"
          placeholder="أدخل شعار النادي الرياضي الخاص بك"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
        />
        <TextField
          label="البريد الإلكتروني"
          placeholder="أدخل البريد الإلكتروني الرسمي للنادي"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="الهاتف"
          placeholder="أدخل رقم الهاتف المخصص للتواصل"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          label="العنوان"
          placeholder="أدخل عنوان النادي"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <TextField
          label="العملة"
          placeholder="اختر العملة المستخدمة في معاملات النادي"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />
      </div>
    </div>
  );
}

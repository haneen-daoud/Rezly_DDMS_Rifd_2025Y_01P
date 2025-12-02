import React from "react";
import TextField from "./TextField";
import StaffSettingsCard from "./StaffSettingsCard";
import ClientsSettingsCard from "./ClientsSettingsCard";
import DownloadIcon from "../../icons/download.svg?react";

export default function ClubSettingsContent() {
  return (
    <div className="w-full mt-4 flex flex-col gap-4">
      {/* 1) إعدادات النادي الرياضي */}
      <ClubMainSettingsCard />

      {/* 2) إعدادات طاقم العمل */}
      <StaffSettingsCard />

      {/* 3) إعدادات إدارة العملاء */}
      <ClientsSettingsCard />

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
          className="h-[40px] w-[168px] px-4 rounded-[8px] bg-[#6A0EAD]
                     text-[16px] font-normal text-white
                     hover:bg-[#5B0A98] transition shadow-sm cursor-pointer"
        >
          حفظ
        </button>
      </div>
    </div>
  );
}

function ClubMainSettingsCard() {
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
          {/* المربع الداخلي ذو الحدود المتقطّعة */}
          <button
            type="button"
            className="
      w-full
      h-full
      rounded-[8px]
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
        />
        <TextField
          label="شعار النادي"
          placeholder="أدخل شعار النادي الرياضي الخاص بك"
        />
        <TextField
          label="البريد الإلكتروني"
          placeholder="أدخل البريد الإلكتروني الرسمي للنادي"
        />
        <TextField
          label="الهاتف"
          placeholder="أدخل رقم الهاتف المخصص للتواصل"
        />
        <TextField label="العنوان" placeholder="أدخل عنوان النادي" />
        <TextField
          label="العملة"
          placeholder="اختر العملة المستخدمة في معاملات النادي"
        />
      </div>
    </div>
  );
}

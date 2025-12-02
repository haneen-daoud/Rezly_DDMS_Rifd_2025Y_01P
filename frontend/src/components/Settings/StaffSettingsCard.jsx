import React, { useState } from "react";
import SettingsLinkRow, { LABEL_BASE_CLASS } from "./SettingsLinkRow.jsx";
import AddCircleIcon from "../../icons/addcircle.svg?react";

function StaffSettingsCard() {
  const [expanded, setExpanded] = useState(null);

  const items = [
    { id: "departments", label: "الأقسام" },
    { id: "roles", label: "الأدوار" },
    { id: "contracts", label: "أنواع العقود" },
  ];

  const handleToggle = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[12px] py-6 px-4 flex flex-col gap-4 h-full text-[#000000]">
      <div>
        <h2 className="text-[18px] font-bold text-[#000000] mb-2">
          إعدادات طاقم العمل
        </h2>
        <p className="text-[18px] font-normal text-[#7E818C]">
          إدارة طاقم العمل وإعدادات الموظفين
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <SettingsLinkRow
            key={item.id}
            label={item.label}
            isExpanded={expanded === item.id}
            onToggle={() => handleToggle(item.id)}
          >
            {item.id === "departments" && <DepartmentsContent />}
            {item.id === "roles" && <RolesContent />}
            {item.id === "contracts" && <ContractsContent />}
          </SettingsLinkRow>
        ))}
      </div>
    </div>
  );
}

export default StaffSettingsCard;

/* ===== الأقسام ===== */

function DepartmentsContent() {
  const [departments, setDepartments] = useState([""]);
  const [jobTitles, setJobTitles] = useState([""]);

  const handleChange = (index, value, type) => {
    if (type === "department") {
      setDepartments((prev) =>
        prev.map((item, i) => (i === index ? value : item))
      );
    } else {
      setJobTitles((prev) =>
        prev.map((item, i) => (i === index ? value : item))
      );
    }
  };

  const handleAdd = (type) => {
    if (type === "department") setDepartments((prev) => [...prev, ""]);
    else setJobTitles((prev) => [...prev, ""]);
  };

  const handleRemove = (index, type) => {
    if (type === "department") {
      setDepartments((prev) => prev.filter((_, i) => i !== index));
    } else {
      setJobTitles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-1">
      <p className="text-[12px] text-[#7E818C]">
        أدخل أسماء الأقسام، ثم حدد المسميات الوظيفية التابعة لكل قسم.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
        {/* مجموعة الأقسام */}
        <div className="flex flex-col gap-2">
          {departments.map((value, index) => (
            <div
              key={index}
              className="grid grid-cols-[auto_1fr] items-center gap-x-2"
            >
              {index === 0 ? (
                <span className={LABEL_BASE_CLASS}>القسم</span>
              ) : (
                <span className={`${LABEL_BASE_CLASS} invisible`}>القسم</span>
              )}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleChange(index, e.target.value, "department")
                  }
                  placeholder="أدخل اسم القسم (مثلاً: التدريب، المحاسبة، الاستقبال)"
                  className="flex-1 h-[42px] rounded-[8px] border border-[#D1D5DB] px-3 text-[14px] text-black font-normal
             placeholder:text-[12px] placeholder:text-[#7E818C] bg-white
                             focus:outline-none focus:border-[#6A0EAD] focus:ring-1 focus:ring-[#6A0EAD]"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index, "department")}
                  className="w-[40px] h-[40px] rounded-[8px] bg-[#0000000A] 
                           flex items-center justify-center text-[#000000]
                           hover:border-[#EF4444] hover:text-[#EF4444] transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div
            onClick={() => handleAdd("department")}
            className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:underline self-start rounded-md"
          >
            <AddCircleIcon className="w-6 h-6 text-[var(--color-purple)]" />
            <span className="text-[var(--color-purple)] text-[14px] font-normal">
              إضافة قسم
            </span>
          </div>
        </div>

        {/* مجموعة المسميات الوظيفية */}
        <div className="flex flex-col gap-2">
          {jobTitles.map((value, index) => (
            <div
              key={index}
              className="grid grid-cols-[auto_1fr] items-center gap-x-2"
            >
              {index === 0 ? (
                <span className={LABEL_BASE_CLASS}> المسميات الوظيفية</span>
              ) : (
                <span className={`${LABEL_BASE_CLASS} invisible`}>
                  المسميات الوظيفية
                </span>
              )}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value, "title")}
                  placeholder="أدخل اسم المسمى الوظيفي (مثلاً: مدرب، محاسب...)"
                  className="flex-1 h-[42px] rounded-[8px] border border-[#D1D5DB] px-3 text-[14px] text-black font-normal
             placeholder:text-[12px] placeholder:text-[#7E818C] bg-white
                             focus:outline-none focus:border-[#6A0EAD] focus:ring-1 focus:ring-[#6A0EAD]"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index, "title")}
                  className="w-[40px] h-[40px] rounded-[8px] bg-[#0000000A] 
                           flex items-center justify-center text-[#000000]
                           hover:border-[#EF4444] hover:text-[#EF4444] transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div
            onClick={() => handleAdd("title")}
            className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:underline self-start rounded-md"
          >
            <AddCircleIcon className="w-6 h-6 text-[var(--color-purple)]" />
            <span className="text-[var(--color-purple)] text-[14px] font-normal">
              إضافة مسمى وظيفي
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== الأدوار ===== */

function RolesContent() {
  // أول 3 أدوار ثابتة + اللي بعدهم يضافوا من الزر
  const [roles, setRoles] = useState(["آدمن", "مدرب", "موظف استقبال"]);

  const handleChange = (index, value) => {
    setRoles((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleAdd = () => {
    setRoles((prev) => [...prev, ""]);
  };

  const handleRemove = (index) => {
    // نحذف فقط الأدوار الإضافية (بعد أول 3)
    setRoles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3 mt-1">
      <p className="text-[12px] text-[#7E818C]">
        أضف الأدوار الوظيفية في النادي لتحديد مهام الموظفين ومستوى وصولهم إلى
        النظام.
      </p>

      <div className="flex flex-col gap-2">
        {roles.map((value, index) => (
          <div key={index} className="flex flex-col gap-1">
            {index === 0 && <span className={LABEL_BASE_CLASS}>اسم الدور</span>}

            <div className="flex items-center gap-1">
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="أدخل اسم الدور (مثلاً: مدير، موظف استقبال، مدرب...)"
                className="flex-1 h-[42px] rounded-[8px] border border-[#D1D5DB] px-3 text-[14px] text-black font-normal
             placeholder:text-[12px] placeholder:text-[#7E818C] bg-white
                           focus:outline-none focus:border-[#6A0EAD] focus:ring-1 focus:ring-[#6A0EAD]"
              />

              {/* زر X يظهر فقط للأدوار الإضافية (index >= 3) */}
              {index >= 3 && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="w-[40px] h-[40px] rounded-[8px] bg-[#0000000A] 
                           flex items-center justify-center text-[#000000]
                           hover:border-[#EF4444] hover:text-[#EF4444] transition"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        onClick={handleAdd}
        className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:underline self-start rounded-md"
      >
        <AddCircleIcon className="w-6 h-6 text-[var(--color-purple)]" />
        <span className="text-[var(--color-purple)] text-[14px] font-normal">
          إضافة دور
        </span>
      </div>
    </div>
  );
}

/* ===== أنواع العقود  ===== */

function ContractsContent() {
  const [contracts, setContracts] = useState([{ name: "", duration: "" }]);

  const handleChange = (index, field, value) => {
    setContracts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAdd = () => {
    setContracts((prev) => [...prev, { name: "", duration: "" }]);
  };

  const handleRemove = (index) => {
    setContracts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3 mt-1">
      <p className="text-[12px] text-[#7E818C]">
        أدخل أنواع العقود التي سيتم استخدامها عند تعيين الموظفين.
      </p>

      <div className="flex flex-col gap-3">
        {contracts.map((contract, index) => (
          <div key={index} className="flex flex-col gap-1">
            {/* الليبل يظهر مرة واحدة فقط */}
            {index === 0 && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-[14px] font-bold text-[#000000]">
                  اسم نوع العقد
                </span>
                <span className="text-[14px] font-bold text-[#000000]">
                  المدة
                </span>
              </div>
            )}

            {/* صف الإدخال */}
            <div className="flex items-end gap-2">
              {/* اسم نوع العقد */}
              <input
                type="text"
                value={contract.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="أدخل اسم نوع العقد (مثلاً: دوام كامل، جزئي، عقدر مدرب مؤقت...)"
                className="flex-1 h-[42px] rounded-[8px] border border-[#D1D5DB] 
                           px-3 text-[14px] text-black font-normal
             placeholder:text-[12px] placeholder:text-[#7E818C]
                           bg-white focus:outline-none
                           focus:border-[#6A0EAD] focus:ring-1 focus:ring-[#6A0EAD]"
              />

              {/* مدة العقد */}
              <input
                type="text"
                value={contract.duration}
                onChange={(e) =>
                  handleChange(index, "duration", e.target.value)
                }
                placeholder="أدخل مدة العقد"
                className="flex-1 h-[42px] rounded-[8px] border border-[#D1D5DB] 
                           px-3 text-[12px] text-black font-normal
                           placeholder-[#7E818C]
                           bg-white focus:outline-none
                           focus:border-[#6A0EAD] focus:ring-1 focus:ring-[#6A0EAD]"
              />

              {/* زر الحذف */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="w-[40px] h-[40px] rounded-[8px] bg-[#0000000A] 
                           flex items-center justify-center text-[#000000]
                           hover:border-[#EF4444] hover:text-[#EF4444] transition"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        onClick={handleAdd}
        className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:underline self-start rounded-md"
      >
        <AddCircleIcon className="w-6 h-6 text-[var(--color-purple)]" />
        <span className="text-[var(--color-purple)] text-[14px] font-normal">
          إضافة نوع عقد
        </span>
      </div>
    </div>
  );
}

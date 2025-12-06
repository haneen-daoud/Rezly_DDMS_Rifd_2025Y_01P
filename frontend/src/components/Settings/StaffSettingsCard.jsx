import React, { useState, useEffect } from "react";
import SettingsLinkRow, { LABEL_BASE_CLASS } from "./SettingsLinkRow.jsx";
import AddCircleIcon from "../../icons/addcircle.svg?react";

function StaffSettingsCard({ onChange }) {
  const [expanded, setExpanded] = useState(null);

  // داتا الأقسام + المسميات + الأدوار + العقود لرفعها لفوق
  const [departmentsData, setDepartmentsData] = useState({
    departments: [],
    jobTitles: [],
  });
  const [rolesData, setRolesData] = useState([]);
  const [contractsData, setContractsData] = useState([]);

  useEffect(() => {
    if (!onChange) return;

    onChange({
      departments: departmentsData.departments,
      jobTitles: departmentsData.jobTitles,
      roles: rolesData,
      contracts: contractsData,
    });
  }, [departmentsData, rolesData, contractsData, onChange]);

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
            {item.id === "departments" && (
              <DepartmentsContent onChange={setDepartmentsData} />
            )}
            {item.id === "roles" && (
              <RolesContent onChange={setRolesData} />
            )}
            {item.id === "contracts" && (
              <ContractsContent onChange={setContractsData} />
            )}
          </SettingsLinkRow>
        ))}
      </div>
    </div>
  );
}

export default StaffSettingsCard;

/* ===== الأقسام ===== */

function DepartmentsContent({ onChange }) {
  const [departments, setDepartments] = useState([""]);
  const [jobTitles, setJobTitles] = useState([""]);

  useEffect(() => {
    if (onChange) {
      onChange({
        departments,
        jobTitles,
      });
    }
  }, [departments, jobTitles, onChange]);

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
    <div className="flex flex-col gap-3 mt-1">
      <p className="text-[12px] text-[#7E818C]">
        أضف الأقسام الرئيسية في النادي والمسميات الوظيفية التابعة لكل قسم.
      </p>

      {/* مجموعة الأقسام */}
      <div className="flex flex-col gap-2">
        {departments.map((value, index) => (
          <div
            key={index}
            className="grid grid-cols-[auto_1fr] items-center gap-x-2"
          >
            {index === 0 ? (
              <span className={LABEL_BASE_CLASS}>الأقسام</span>
            ) : (
              <span className={`${LABEL_BASE_CLASS} invisible`}>الأقسام</span>
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
                             focus:outline-none focus:border-[var(--color-purple)] focus:ring-1 focus:ring-[var(--color-purple)]"
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
                onChange={(e) => handleChange(index, e.target.value, "job")}
                placeholder="أدخل المسمى الوظيفي (مثلاً: مدرب كارديو، محاسب...)"
                className="flex-1 h-[42px] rounded-[8px] border border-[#D1D5DB] px-3 text-[14px] text-black font-normal
             placeholder:text-[12px] placeholder:text-[#7E818C] bg-white
                             focus:outline-none focus:border-[var(--color-purple)] focus:ring-1 focus:ring-[var(--color-purple)]"
              />
              <button
                type="button"
                onClick={() => handleRemove(index, "job")}
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
        onClick={() => handleAdd("job")}
        className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:underline self-start rounded-md"
      >
        <AddCircleIcon className="w-6 h-6 text-[var(--color-purple)]" />
        <span className="text-[var(--color-purple)] text-[14px] font-normal">
          إضافة مسمى وظيفي
        </span>
      </div>
    </div>
  );
}

/* ===== الأدوار ===== */

function RolesContent({ onChange }) {
  // أول 3 أدوار ثابتة + اللي بعدهم يضافوا من الزر
  const [roles, setRoles] = useState(["آدمن", "مدرب", "موظف استقبال"]);

  useEffect(() => {
    if (onChange) {
      onChange(roles);
    }
  }, [roles, onChange]);

  const handleChange = (index, value) => {
    setRoles((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleAdd = () => {
    setRoles((prev) => [...prev, ""]);
  };

  const handleRemove = (index) => {
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
                           focus:outline-none focus:border-[var(--color-purple)] focus:ring-1 focus:ring-[var(--color-purple)]"
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

function ContractsContent({ onChange }) {
  const [contracts, setContracts] = useState([{ name: "", duration: "" }]);

  useEffect(() => {
    if (onChange) {
      onChange(contracts);
    }
  }, [contracts, onChange]);

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
                           focus:border-[var(--color-purple)] focus:ring-1 focus:ring-[var(--color-purple)]"
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
                           focus:border-[var(--color-purple)] focus:ring-1 focus:ring-[var(--color-purple)]"
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

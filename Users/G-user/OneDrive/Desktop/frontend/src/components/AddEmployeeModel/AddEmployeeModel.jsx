import React, { useState, useEffect } from "react";
import CloseIcon from "../../icons/close.svg";
import Step1Employee from "./Step1Employee.jsx";
import Step2Employee from "./Step2Employee.jsx";
import Step3Employee from "./Step3Employee.jsx";
import Step4Employee from "./Step4Employee.jsx";
import { createEmployee, updateEmployee } from "../../api";

const AddEmployeeModel = ({ onClose, onSave, type = "add", employeeData = {} }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ تعبئة البيانات في حالة التعديل
  const [employeeDataState, setEmployeeDataState] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    nationalId: "",
    birthDate: "",
    phoneNumber: "",
    email: "",
    address: "",
    jobTitle: "",
    department: "",
    contractType: "",
    startDate: "",
    username: "",
    password: "",
    role: "",
    notes: "",
    image: null,
  });

 useEffect(() => {
  if (type === "edit" && employeeData) {
    console.log(" البيانات الأصلية من السيرفر:", employeeData);

    setEmployeeDataState({
      firstName: employeeData.firstName || "",
      lastName: employeeData.lastName || "",
      birthDate: employeeData.birthDate || "",
      nationalId: employeeData.nationalId || "",
      gender: employeeData.gender || "",
      address: employeeData.address || "",
      email: employeeData.email || "",
      phoneNumber: employeeData.phoneNumber || "",
      contractType: employeeData.contractType || "",
      department: employeeData.department || "",
      jobTitle: employeeData.jobTitle || "",
      notes: employeeData.notes || "",
      password: employeeData.password || "",
      role: employeeData.role || "",
      username: employeeData.username || "",
      startDate: employeeData.startDate || "",
    });
  }
}, [type, employeeData]);


  const steps = ["المعلومات الشخصية", "بيانات الاتصال", "المعلومات الوظيفية", "بيانات النظام"];

  const handleChange = (key, value) => {
    setEmployeeDataState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    console.log(type === "add" ? "🚀 بدء الإضافة" : "🛠 بدء التعديل");
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(employeeDataState).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });

      console.group("📦 محتوى formData قبل الإرسال:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      console.groupEnd();

      let res;
      if (type === "add") {
        res = await createEmployee(formData);
        console.log("✅ تمّت الإضافة بنجاح:", res);
      } else {
        res = await updateEmployee(employeeDataState._id, formData);
        console.log("✅ تمّ التعديل بنجاح:", res);
      }

      if (onSave) onSave(res);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 100);
    } catch (err) {
      console.error("❌ خطأ:", err.response?.data || err.message);
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[849px] h-[712px] flex flex-col p-6 text-right overflow-hidden relative">
        <div className="flex flex-col w-full gap-4 mx-auto">
          <div className="flex justify-between items-start">
            <h2 className="text-[16px] font-bold text-black">
              {type === "add" ? "إضافة موظف جديد" : "تعديل بيانات الموظف"}
            </h2>
            <img
              className="w-8 h-8 cursor-pointer"
              src={CloseIcon}
              alt="close"
              onClick={onClose}
            />
          </div>

          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
              <div className="w-16 h-16 border-4 border-[var(--color-purple)] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[18px] text-[var(--color-purple)] font-medium">
                {type === "add" ? "جاري الإضافة..." : "جاري الحفظ..."}
              </p>
            </div>
          )}

          {!isLoading && isSubmitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h3 className="text-[20px] font-bold text-[var(--color-purple)] mb-2">
                {type === "add" ? "تمت الإضافة بنجاح!" : "تم حفظ التعديلات بنجاح!"}
              </h3>
              <p className="text-gray-600 mb-6">
                {type === "add"
                  ? "تم حفظ بيانات الموظف في النظام بنجاح."
                  : "تم تحديث بيانات الموظف بنجاح."}
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[var(--color-purple)] text-white rounded-lg text-[16px] font-medium hover:bg-purple-800 transition"
              >
                إغلاق
              </button>
            </div>
          ) : (
            <>
              {/* Stepper */}
              <div className="flex justify-center items-center gap-4 mt-6 mb-8">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setActiveStep(index)}
                    >
                      <div
                        className={`w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs font-medium border ${
                          index < activeStep
                            ? "border-[#6A0EAD] bg-[#6A0EAD] text-white"
                            : index === activeStep
                            ? "border-[#6A0EAD] text-[#6A0EAD]"
                            : "border-gray-300 text-gray-500"
                        }`}
                      >
                        {index < activeStep ? "✓" : index + 1}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          index <= activeStep
                            ? "text-[var(--color-purple)]"
                            : "text-gray-500"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-[51px] h-[1px] bg-gray-200"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* محتوى الفورم */}
              <div className="flex-grow flex flex-col justify-between text-[14px] relative">
                {activeStep === 0 && (
                  <Step1Employee data={employeeDataState} onChange={handleChange} />
                )}
                {activeStep === 1 && (
                  <Step2Employee data={employeeDataState} onChange={handleChange} />
                )}
                {activeStep === 2 && (
                  <Step3Employee data={employeeDataState} onChange={handleChange} />
                )}
                {activeStep === 3 && (
                  <Step4Employee data={employeeDataState} onChange={handleChange} />
                )}
              </div>

              {/* أزرار التنقل */}
              <div className="w-[344px] self-center flex gap-4 absolute bottom-12">
                {activeStep > 0 && (
                  <button
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="w-full py-3 border text-[16px] font-medium rounded-[8px] hover:bg-gray-100"
                  >
                    السابق
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="w-full py-3 text-white text-[16px] font-medium rounded-[8px]"
                  style={{ backgroundColor: "#6A0EAD" }}
                >
                  {activeStep === steps.length - 1
                    ? type === "add"
                      ? "إضافة"
                      : "حفظ"
                    : "التالي"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModel;

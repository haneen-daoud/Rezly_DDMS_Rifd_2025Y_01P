import React, { useState, useEffect } from "react";
import CloseIcon from "../../icons/close.svg";
import Step1Employee from "./Step1Employee.jsx";
import Step2Employee from "./Step2Employee.jsx";
import Step3Employee from "./Step3Employee.jsx";
import Step4Employee from "./Step4Employee.jsx";
import { createEmployee, updateEmployee } from "../../api";
import { getApiErrorMessage } from "../getApiErrorMessage.jsx";
import { toast } from "react-toastify";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from "../../components/employeeValidation";

const AddEmployeeModel = ({
  onClose,
  onSave,
  type = "add",
  employeeData = {},
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    if (
      type === "edit" &&
      employeeData &&
      Object.keys(employeeData).length > 0
    ) {
      console.log(" البيانات الأصلية من السيرفر:", employeeData);

      setEmployeeDataState({
        _id: employeeData._id,
        firstName: employeeData.firstName || "",
        lastName: employeeData.lastName || "",
        birthDate: employeeData.birthDate.slice(0, 10) || "",
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
        startDate: employeeData.startDate.slice(0, 10) || "",
      });
    }
  }, [type, employeeData]);

  const steps = [
    "المعلومات الشخصية",
    "بيانات الاتصال",
    "المعلومات الوظيفية",
    "بيانات النظام",
  ];

  const handleChange = (key, value) => {
    setEmployeeDataState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    console.log(type === "add" ? "بدء الإضافة" : " بدء التعديل");
    setIsLoading(true);

    try {
      const formData = new FormData();

      Object.entries(employeeDataState).forEach(([key, value]) => {
        // تجاهل الفاضي
        if (value === null || value === undefined || value === "") return;

        if (key === "image") {
          // ما نبعت الصورة إلا إذا فعلاً ملف
          if (value instanceof File) {
            formData.append("image", value);
          }
        } else {
          formData.append(key, value);
        }
      });

      console.group("محتوى formData قبل الإرسال:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}`, value);
      }
      console.groupEnd();

      let res;

      if (type === "add") {
        // إضافة موظف جديد
        res = await createEmployee(formData);
        console.log("تمّت الإضافة بنجاح:", res);

        // الموظف الجديد من الريسبونس
        const newEmployee =
          res?.data?.employee || res?.employee || res?.data || res;

        // أولاً: نحدّث قائمة الموظفين من خلال الـ parent
        if (onSave) {
          await onSave(newEmployee);
        }

        // بعد ما تتحدّث القائمة فعلياً، نعرض التوست
        toast.success("تم إضافة الموظف بنجاح");
      } else {
        // ➜ تعديل موظف موجود
        if (!employeeDataState._id) {
          console.error("لا يوجد _id لتحديث الموظف");
          setIsLoading(false);
          toast.error("لم يتم حفظ التعديلات");
          return;
        }

        res = await updateEmployee(employeeDataState._id, formData);
        console.log("تمّ التعديل بنجاح:", res);
        toast.success("تم تعديل بيانات الموظف بنجاح");

        if (onSave) {
          const updatedEmployee =
            res?.data?.employee || res?.employee || res?.data || res;
          onSave(updatedEmployee);
        }
      }

      setIsLoading(false);
      onClose();
    } catch (error) {
      const message = getApiErrorMessage(error, "حدث خلل");
      console.log("API error response:", error?.response?.data);
      setIsLoading(false);
      console.log("SHOW TOAST SUCCESS");
      toast.error(<div dangerouslySetInnerHTML={{ __html: message }} />);
    }
  };

  const step1Ref = React.useRef();
  const step2Ref = React.useRef();
  const step3Ref = React.useRef();
  const step4Ref = React.useRef();

  const handleNext = async () => {
    let isValid = false;

    try {
      if (activeStep === 0 && step1Ref.current) {
        isValid = await step1Ref.current.validateAll();
      } else if (activeStep === 1 && step2Ref.current) {
        isValid = await step2Ref.current.validateAll();
      } else if (activeStep === 2 && step3Ref.current) {
        isValid = await step3Ref.current.validateAll();
      } else if (activeStep === 3 && step4Ref.current) {
        isValid = await step4Ref.current.validateAll();
      }

      if (isValid) {
        setErrors({});
        if (activeStep < steps.length - 1) {
          setActiveStep(activeStep + 1);
        } else {
          handleSubmit();
        }
      }
    } catch (err) {
      console.log("خطأ في التحقق", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[849px] h-[712px] flex flex-col p-6 text-right  relative">
        <div className="flex flex-col w-full gap-4 mx-auto">
          <div className="flex justify-between items-start">
            <h2 className="text-[16px] font-bold text-black">
              {type === "add" ? "إضافة موظف جديد" : "تعديل بيانات الموظف"}
            </h2>
            <img
              className="w-8 h-8 cursor-pointer rounded-[8px] bg-gray-100"
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
                {type === "add"
                  ? "تمت الإضافة بنجاح!"
                  : "تم حفظ التعديلات بنجاح!"}
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
              <div className="flex justify-center items-center gap-4 mt-2 mb-4">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setActiveStep(index)}
                    >
                      <div
                        className={`w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs font-medium border ${
                          index < activeStep
                            ? "border-[var(--color-purple)] bg-[var(--color-purple)] text-white"
                            : index === activeStep
                            ? "border-[var(--color-purple)] text-[var(--color-purple)]"
                            : "border-gray-300 text-gray-500"
                        }`}
                      >
                        {index < activeStep ? "✓" : index + 1}
                      </div>
                      <span
                        className={`text-sm hidden sm:inline font-medium ${
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
                  <Step1Employee
                    ref={step1Ref}
                    data={employeeDataState}
                    onChange={handleChange}
                    errors={errors}
                  />
                )}

                {activeStep === 1 && (
                  <Step2Employee
                    ref={step2Ref}
                    data={employeeDataState}
                    onChange={handleChange}
                    errors={errors}
                  />
                )}
                {activeStep === 2 && (
                  <Step3Employee
                    ref={step3Ref}
                    data={employeeDataState}
                    onChange={handleChange}
                    errors={errors}
                  />
                )}
                {activeStep === 3 && (
                  <Step4Employee
                    ref={step4Ref}
                    data={employeeDataState}
                    onChange={handleChange}
                    errors={errors}
                  />
                )}
              </div>

              {/* أزرار التنقل */}
              <div className="w-[344px] self-center flex gap-4 absolute bottom-5">
                {activeStep > 0 && (
                  <button
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="w-full py-3 border border-[var(--color-purple)] text-[var(--color-purple)] text-[16px] font-medium rounded-[8px] hover:bg-gray-100 cursor-pointer"
                  >
                    السابق
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="w-full py-3 text-white text-[16px] font-medium rounded-[8px] cursor-pointer"
                  style={{ backgroundColor: "var(--color-purple)" }}
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

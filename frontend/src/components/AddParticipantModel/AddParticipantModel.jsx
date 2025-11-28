import React, { useEffect, useState, useRef } from "react";
import CloseIcon from "../../icons/close.svg";
import Step1Participant from "./Step1Participant.jsx";
import Step2Participant from "./Step2Participant.jsx";
import Step3Participant from "./Step3Participant.jsx";
import Step4Participant from "./Step4Participant.jsx";
import { addNewMember, updateMember, getAllPackages } from "../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from "../participantValidation.js";

const AddParticipantModel = ({
  onClose,
  isEditMode = false,
  editData = null,
  onSave,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const step1Ref = useRef();
  const step2Ref = useRef();
  const step3Ref = useRef();
  const step4Ref = useRef();
  const validationSchemas = [
    step1Schema,
    step2Schema,
    step3Schema,
    step4Schema,
  ];
  const stepRefs = [step1Ref, step2Ref, step3Ref, step4Ref];
  const [errors, setErrors] = useState({});

  const [memberData, setMemberData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    idNumber: "",
    birthDate: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    image: "",
    packageId: "",
    paymentMethod: "",
    coachId: "",
  });

  const steps = [
    "المعلومات الشخصية",
    "بيانات الاتصال",
    "الملف الصحي",
    "تفاصيل الاشتراك",
  ];

  // جلب الباقات
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getAllPackages();
        setPackages(data);
      } catch (err) {
        console.error("  خطأ أثناء تحميل الباقات:", err);
      }
    };
    fetchPackages();
  }, []);

  // تحميل بيانات العضو للتعديل
  useEffect(() => {
    if (!isEditMode || !editData) return;

    setMemberData((prev) => ({
      ...prev,

      // المعلومات الشخصية
      firstName: editData.firstName || "",
      lastName: editData.lastName || "",
      gender: editData.gender || "",
      idNumber: editData.idNumber || "",
      birthDate: editData.birthDate
        ? editData.birthDate.slice(0, 10) // عشان input type="date"
        : "",

      //بيانات الاتصال
      phone: editData.phone || "",
      email: editData.email || "",
      city: editData.city || "",
      address: editData.address || "",

      //تفاصيل الاشتراك
      packageId: editData.packageId?._id || editData.packageId || "",
      paymentMethod: editData.paymentMethod || "",
      coachId: editData.coachId?._id || editData.coachId || "",
    }));
  }, [isEditMode, editData]);

  const handleNext = async () => {
    try {
      await validationSchemas[activeStep].validate(memberData, {
        abortEarly: false,
      });

      // لو ما فيه أخطاء ➝ انتقل
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
      } else {
        isEditMode ? handleSaveChanges() : handleAddMember();
      }
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });

      stepRefs[activeStep]?.current?.setErrors(formattedErrors);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleAddMember = async () => {
    try {
      if (!memberData.packageId) {
        return toast.warn("يجب اختيار الاشتراك");
      }

      setIsLoading(true);
      const result = await addNewMember(memberData);

      //نحاول نطلع العضو من الريسبونس
      let returnedMember =
        result?.member || result?.data || result?.newMember || result;

      const selectedPackage =
        (packages || []).find((p) => p._id === memberData.packageId) ||
        returnedMember?.packageId || // لو السيرفر رجعها جاهزة
        null;

      //   ونضمن إن packageId يكون OBJECT فيه name/slug عشان الجدول يفهمه
      const createdMember = {
        ...(memberData || {}),
        ...(returnedMember || {}),
        packageId: selectedPackage || memberData.packageId,
      };

      toast.success("تم إضافة المشترك بنجاح!");
      setIsSubmitted(true);

      if (onSave) onSave(createdMember);

      onClose();
    } catch (error) {
      console.error("  خطأ أثناء الإضافة:", error);
      toast.error("حدث خطأ أثناء إضافة المشترك!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);

      const updatedMember = {
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        gender: memberData.gender,
        idNumber: memberData.idNumber,
        birthDate: memberData.birthDate,
        phone: memberData.phone,
        email: memberData.email,
        address: memberData.address,
        packageId: memberData.packageId,
        // إذا paymentMethod فارغ، استخدم القيمة القديمة من editData
        paymentMethod: memberData.paymentMethod || editData.paymentMethod || "",
        coachId: memberData.coachId,
        city: memberData.city,
      };

      const res = await updateMember(editData._id, updatedMember);

      // نحاول نطلع العضو من الريسبونس لو الباك برجع واحد
      let baseMember = res?.member || res?.data || res?.updatedMember || res;

      // نجيب الباقة الكاملة من الـ packages حسب الـ _id الجديد
      const selectedPackage =
        (packages || []).find((p) => p._id === updatedMember.packageId) ||
        baseMember?.packageId ||
        editData?.packageId ||
        null;

      //ندمج القديم + اللي رجع من السيرفر + الباقة الجديدة كـ OBJECT
      const finalMember = {
        ...(editData || {}),
        ...(baseMember || updatedMember),
        packageId: selectedPackage || updatedMember.packageId,
      };

      toast.success("تم حفظ التعديلات بنجاح!");
      setIsSubmitted(true);

      //نبعت كل شيء للأب، ومنه يتعامل مع التوست
      if (onSave) {
        onSave({
          member: finalMember,
          message: res?.message || "تم حفظ التعديلات بنجاح",
          status: "success",
        });
      }
    } catch (error) {
      console.error("  خطأ أثناء التعديل:", error);
      const msg =
        error?.response?.data?.message || "حدث خطأ أثناء حفظ التعديلات!";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[849px] h-[712px] flex flex-col p-6 text-right overflow-hidden relative">
        <div className="flex justify-between items-start">
          <h2 className="text-[16px] font-bold text-black">
            {isEditMode ? "تعديل بيانات المشترك" : "إضافة مشترك جديد"}
          </h2>
          <img
            className="w-8 h-8 cursor-pointer rounded-[8px] bg-gray-100"
            src={CloseIcon}
            alt="close"
            onClick={onClose}
          />
        </div>

        {/* سبينر التحميل */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-[#6A0EAD] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[18px] text-[#6A0EAD] font-medium">
              {isEditMode ? "جاري الحفظ..." : "جاري الإضافة..."}
            </p>
          </div>
        )}

        {/* رسالة النجاح */}
        {!isLoading && isSubmitted ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-[20px] font-bold text-[#6A0EAD] mb-2">
              {isEditMode ? "تم حفظ التعديلات بنجاح!" : "تمت الإضافة بنجاح!"}
            </h3>
            <p className="text-gray-600 mb-6">
              {isEditMode
                ? "تم تحديث بيانات المشترك في النظام بنجاح."
                : "تم حفظ بيانات المشترك في النظام بنجاح."}
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#6A0EAD] text-white rounded-lg text-[16px] font-medium hover:bg-purple-800 transition"
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
                        index <= activeStep ? "text-[#6A0EAD]" : "text-gray-500"
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

            {/* محتوى الخطوات */}
            <div className="flex-grow flex flex-col justify-between pr-2 text-[14px]">
              {activeStep === 0 && (
                <Step1Participant
                  ref={step1Ref}
                  memberData={memberData}
                  setMemberData={setMemberData}
                />
              )}

              {activeStep === 1 && (
                <Step2Participant
                  ref={step2Ref}
                  memberData={memberData}
                  setMemberData={setMemberData}
                />
              )}

              {activeStep === 2 && (
                <Step3Participant
                  memberData={memberData}
                  setMemberData={setMemberData}
                  ref={step3Ref}
                />
              )}
              {activeStep === 3 && (
                <Step4Participant
                  memberData={memberData}
                  setMemberData={setMemberData}
                  packages={packages}
                  ref={step4Ref}
                />
              )}
            </div>

            {/* أزرار التنقل */}
            <div className="w-[344px] mt-4 self-center flex gap-4">
              {activeStep > 0 && (
                <button
                  onClick={handleBack}
                  className="w-full py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-[8px] hover:bg-gray-100"
                >
                  السابق
                </button>
              )}

              <button
                onClick={handleNext}
                className="w-full py-3 text-white text-sm font-medium rounded-[8px]"
                style={{ backgroundColor: "#6A0EAD" }}
              >
                {activeStep === steps.length - 1
                  ? isEditMode
                    ? "حفظ التعديلات"
                    : "إضافة"
                  : "التالي"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddParticipantModel;

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { getAllPackages } from "../../api";
import Select from "react-select";
import selectStyles from "../selectStyles.js";
import { getAllCoaches } from "../../api";

const Step4Participant = forwardRef(({ memberData, setMemberData, packages = [] }, ref) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  // عند تحميل العضو، تحقق من القيمة
  const [paymentMethod, setPaymentMethod] = useState(memberData.paymentMethod || "");

  const [coaches, setCoaches] = useState([]);
  const [errors, setErrors] = useState({});

useImperativeHandle(ref, () => ({
  setErrors: (newErrors) => setErrors(newErrors),
}));

  const paymentOptions = [
    { value: "نقداً", label: "نقداً" },
    { value: "بطاقة", label: "بطاقة" },
    { value: "أونلاين", label: "أونلاين" },
  ];
  const [trainer, setTrainer] = useState(
  memberData.coachId || memberData.trainer || ""
);


  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTgxNjE2YWRkZWM2YmI5OTYzYTBkMyIsImlhdCI6MTc2MDI4ODExOSwiZXhwIjoxNzYyODgwMTE5fQ.otxs7BqWLTxQxjYmMJ8gXqnl5pbyOB0_VgwX1E6OQR0";
  const memberId = memberData._id;

  //  دالة عامة لتحديث أي حقل في الباك
  const updateMemberField = async (fieldName, value) => {
    try {
      if (!memberId) return;
      const response = await axios.put(
        `/auth/updateMember/${memberId}`,
        { [fieldName]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(` تم تحديث ${fieldName}:`, response.data);
    } catch (error) {
      console.error(`  خطأ أثناء تحديث ${fieldName}:`, error);
    }
  };

  // بعد تحميل الباقات، تعيين الباقة الحالية للعضو
  useEffect(() => {
    const fetchCoaches = async () => {
      const allCoaches = await getAllCoaches();
      setCoaches(allCoaches);
    };
    fetchCoaches();
    if (packages.length > 0 && memberData.packageId) {
      const currentPackage = packages.find(
        (pkg) => pkg._id === memberData.packageId
      );
      if (currentPackage) setSelectedPackage(currentPackage);
    }
  }, [packages, memberData.packageId]);


    // مزامنة المدرب المسؤول مع البيانات القادمة من المودال (خصوصاً في وضع التعديل)
  useEffect(() => {
    if (memberData.coachId && memberData.coachId !== trainer) {
      setTrainer(memberData.coachId);
    }
  }, [memberData.coachId]);

  // تغيير الباقة
  const handlePackageChange = (packageId) => {
    const pkg = packages.find((p) => p._id === packageId) || null;
    setSelectedPackage(pkg);

    // تحديث في الواجهة
    setMemberData({
      ...memberData,
      packageId,
      coachId: trainer,
      paymentMethod,
    });
setErrors(prev => ({ ...prev, packageId: "" }));

    // تحديث في الباك
    updateMemberField("packageId", packageId);
  };

  const handlePaymentChange = (newMethod) => {
    setPaymentMethod(newMethod);

    setMemberData({
      ...memberData,
      paymentMethod: newMethod,
    });
setErrors(prev => ({ ...prev, paymentMethod: "" }));

    updateMemberField("paymentMethod", newMethod);
  };


  // تغيير المدرب
  const handleTrainerChange = (e) => {
    const newTrainer = e.target.value;
    setTrainer(newTrainer);

    // تحديث في الواجهة
    setMemberData({
      ...memberData,
      coachId: newTrainer,
    });
  setErrors(prev => ({ ...prev, coachId: "" }));

    // تحديث في الباك
    updateMemberField("coachId", newTrainer);
  };
  useEffect(() => {
    console.log(memberData);

  }, [memberData]);


  return (
    <div className="flex justify-center bg-white w-full">
      <form className="w-[343px] flex flex-col gap-3 font-[Cairo]">
        {/* نوع الاشتراك */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            نوع الاشتراك <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedPackage?._id || ""}
            onChange={(e) => handlePackageChange(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[12px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">اختر نوع الاشتراك</option>
            {packages.map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.name}
              </option>
            ))}
          </select>
          {errors.packageId && <span className="text-red-500 text-xs">{errors.packageId}</span>}

        </div>

        {/* مدة الاشتراك */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            مدة الاشتراك
          </label>
          <input
            type="text"
            value={
              selectedPackage
                ? `${selectedPackage.duration_value || ""} ${selectedPackage.duration_unit || ""
                }`
                : ""
            }
            readOnly
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[12px] text-gray-500 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* السعر */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">الرسوم</label>
          <input
            type="text"
            value={
              selectedPackage?.price_cents
                ? (selectedPackage.price_cents / 100).toString()
                : ""
            }
            readOnly
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[12px] text-gray-500 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* طريقة الدفع */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            طريقة الدفع <span className="text-red-500">*</span>
          </label>

          <Select
            options={paymentOptions}
            value={paymentOptions.find((o) => o.value === paymentMethod)}
            onChange={(opt) => handlePaymentChange(opt.value)}
            placeholder="اختر طريقة الدفع"
            styles={selectStyles}
            isRtl={true}
          />
{errors.paymentMethod && <span className="text-red-500 text-xs">{errors.paymentMethod}</span>}

        </div>



        {/* المدرب */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[700] text-black">
            المدرب المسؤول <span className="text-red-500">*</span>
          </label>

          <Select
            options={coaches.map(coach => ({
              value: coach._id,
              label: `${coach.firstName} ${coach.lastName}`
            }))}
            value={coaches
              .map(coach => ({ value: coach._id, label: `${coach.firstName} ${coach.lastName}` }))
              .find(o => o.value === trainer)}
            onChange={(opt) => handleTrainerChange({ target: { value: opt.value } })}
            placeholder="اختر المدرب المسؤول"
            styles={selectStyles}
            isRtl={true} // لدعم الكتابة العربية
          />
          {errors.coachId && <span className="text-red-500 text-xs">{errors.coachId}</span>}

        </div>



      </form>
    </div>
   );
});

export default Step4Participant;
import React, { useState } from "react";
import UserIcon from "../icons/user.svg?react";
import EmailIcon from "../icons/email.svg?react";
import PasswordIcon from "../icons/password.svg?react";
import EyeOffIcon from "../icons/eyeOff.svg?react";
import SignupBg from "../icons/signup.svg"; // استيراد الخلفية
import { useNavigate } from "react-router-dom";
import { signup } from "../api.js";
import Logo from "../assets/icon/rezly-logo.svg";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    cpassword: "",
    phone: "",
    gender: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.cpassword) {
      alert("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    try {
      setLoading(true);
      await signup(formData);
      alert("تم إنشاء الحساب بنجاح!");
      navigate("/");
    } catch (error) {
      console.error("خطأ أثناء التسجيل:", error);
      alert(
        error.response?.data?.message ||
          "حدث خطأ أثناء التسجيل، حاول مرة أخرى"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex font-[Cairo] justify-center items-start gap-8"
      style={{
        height: "150vh", // ارتفاع الصفحة يكفي لكل المحتوى
        overflow: "hidden", // يمنع أي scroll
        paddingTop: "20px", // مسافة بسيطة من الأعلى
      }}
    >
      {/* نموذج التسجيل */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          flex: 1,
          maxWidth: "600px",
          padding: "2rem",
          height: "auto", // ارتفاع طبيعي حسب المحتوى
        }}
      >
        <div className="mb-4 flex justify-center w-full">
          <img src={Logo} alt="logo" className="logo" />
        </div>

        <h2 className="text-3xl font-bold text-black mb-3">إنشاء حساب</h2>
        <p className="text-lg font-bold text-[#7E818C] mb-5 text-center">
          ابدأ تجربتك مع نظامنا الذكي لإدارة الجيم
        </p>

        <form
          onSubmit={handleSignUp}
          className="w-full text-right text-sm font-bold"
        >
          {/* اسم المستخدم */}
          <div className="mb-4">
            <label className="block mb-2">اسم المستخدم</label>
            <div className="relative w-full">
              <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type="text"
                name="userName"
                placeholder="أدخل اسم المستخدم"
                value={formData.userName}
                onChange={handleChange}
                className="w-full h-12 pr-10 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none placeholder-[#7E818C]"
              />
            </div>
          </div>

          {/* البريد الإلكتروني */}
          <div className="mb-3">
            <label className="block mb-1">البريد الإلكتروني</label>
            <div className="relative w-full">
              <EmailIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-12 pr-10 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none placeholder-[#7E818C]"
              />
            </div>
          </div>

          {/* كلمة المرور */}
          <div className="mb-3">
            <label className="block mb-1">كلمة المرور</label>
            <div className="relative w-full">
              <PasswordIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="*"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-12 pr-10 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none placeholder-[#7E818C]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              >
                <EyeOffIcon />
              </button>
            </div>
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="mb-3">
            <label className="block mb-1">تأكيد كلمة المرور</label>
            <div className="relative w-full">
              <PasswordIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type={showCPassword ? "text" : "password"}
                name="cpassword"
                placeholder="*"
                value={formData.cpassword}
                onChange={handleChange}
                className="w-full h-12 pr-10 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none placeholder-[#7E818C]"
              />
              <button
                type="button"
                onClick={() => setShowCPassword(!showCPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              >
                <EyeOffIcon />
              </button>
            </div>
          </div>

          {/* رقم الهاتف */}
          <div className="mb-3">
            <label className="block mb-1">رقم الهاتف</label>
            <input
              type="text"
              name="phone"
              placeholder="0591234567"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 pr-3 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none placeholder-[#7E818C]"
            />
          </div>

          {/* الجنس */}
          <div className="mb-3">
            <label className="block mb-1">الجنس</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full h-12 pr-3 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none"
            >
              <option value="">اختر الجنس</option>
              <option value="Female">أنثى</option>
              <option value="Male">ذكر</option>
            </select>
          </div>

          {/* مستوى الصلاحية */}
          <div className="mb-5">
            <label className="block mb-1">مستوى الصلاحية</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full h-12 pr-3 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none"
            >
              <option value="">اختر مستوى الصلاحية</option>
              <option value="Admin">مدير</option>
              <option value="Coach">مدرب</option>
              <option value="accountant">محاسبة</option>
              <option value="receptionist">موظف استقبال</option>
            </select>
          </div>

          {/* زر الإنشاء */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-white font-semibold rounded-lg hover:bg-[#580b94] transition"
            style={{ backgroundColor: "#6A0EAD" }}
          >
            {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-3 mb-2">
            لديك حساب بالفعل؟{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-[#6A0EAD] font-semibold hover:underline"
            >
              تسجيل الدخول
            </button>
          </p>
        </form>
      </div>

      {/* خلفية البنفسجية */}
      <div
        style={{
          backgroundImage: `url(${SignupBg})`,
          width: "680px",
          height: "120vh",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          borderRadius: "30px",
          marginLeft: "1px",
        }}
      ></div>
    </div>
  );
};

export default Signup;
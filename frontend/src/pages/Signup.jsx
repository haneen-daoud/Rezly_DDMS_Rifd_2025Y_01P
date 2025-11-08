import React, { useState } from "react";
import UserIcon from "../icons/user.svg?react";
import EmailIcon from "../icons/email.svg?react";
import PasswordIcon from "../icons/password.svg?react";
import EyeOffIcon from "../icons/eyeOff.svg?react";
import SignupBg from "../icons/signup.svg";
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
      const res = await signup(formData);
      console.log("✅ Signup success:", res);
      alert("تم إنشاء الحساب بنجاح!");
      navigate("/");
    } catch (error) {
      console.error("❌ Signup failed:", error);

      if (error.response) {
        const backendErrors = error.response.data.errors || error.response.data;
        alert(
          typeof backendErrors === "string"
            ? backendErrors
            : JSON.stringify(backendErrors, null, 2)
        );
      } else {
        alert(error.message || "حدث خطأ أثناء التسجيل، حاول مرة أخرى");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row font-[Cairo] justify-center items-center md:items-start gap-8 px-4 md:px-10"
      style={{
        minHeight: "100vh",
        paddingTop: "10px",
      }}
    >
      {/* نموذج التسجيل */}
      <div
        className="flex flex-col items-center flex-1 w-full md:max-w-[600px] bg-white rounded-xl p-6 md:p-8 shadow-md"
      >
        <div className="mb-4 flex justify-center w-full">
        
          <img src={Logo} alt="logo" className="logo mb-1 w-[150px] h-auto" />
        </div>

        <h2 className="text-3xl font-bold text-black mb-2">إنشاء حساب</h2>
        <p className="text-lg font-bold text-[#7E818C] mb-5 text-center">
          ابدأ تجربتك مع نظامنا الذكي لإدارة الجيم
        </p>

        <form
          onSubmit={handleSignUp}
          className="w-full text-right text-sm font-bold"
        >
          {/* اسم المستخدم */}
          <div className="mb-4">
            <label className="block mb-2 text-black">اسم المستخدم</label>
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
            <label className="block mb-1 text-black">البريد الإلكتروني</label>
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
            <label className="block mb-1 text-black">كلمة المرور</label>
            <div className="relative w-full">
              <PasswordIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="*****"
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
            <label className="block mb-1 text-black">تأكيد كلمة المرور</label>
            <div className="relative w-full">
              <PasswordIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type={showCPassword ? "text" : "password"}
                name="cpassword"
                placeholder="*****"
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
            <label className="block mb-1 text-black">رقم الجوال</label>
            <input
              type="text"
              name="phone"
              placeholder="0591234567"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 pr-3 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none placeholder-[#7E818C]"
            />
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

      {/* خلفية البنفسجية (تظهر فقط على الشاشات المتوسطة والكبيرة) */}
      <div
        className="hidden md:block"
        style={{
          backgroundImage: `url(${SignupBg})`,
          width: "550px",
          height: "95vh",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          borderRadius: "15px",
          marginTop: "15px",
        }}
      ></div>
    </div>
  );
};

export default Signup;

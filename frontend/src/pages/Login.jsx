import React, { useState } from "react";
import Logo from "../assets/icon/rezly-logo.svg";
import UserIcon from "../icons/user.svg?react";
import PasswordIcon from "../icons/password.svg?react";
import EyeOffIcon from "../icons/eyeOff.svg?react";
import EyeOnIcon from "../icons/eyeOn.svg?react";
import login from "../icons/login.svg";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../components/getApiErrorMessage.jsx";
import { signIn } from "../api.js";
import { toast } from "react-toastify";
const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // التعامل مع الحقول
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // فحص البيانات قبل الإرسال
  const validate = () => {
    if (!formData.identifier.trim()) {
      toast.error("⚠ الرجاء إدخال اسم المستخدم أو البريد الإلكتروني", {});
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("⚠ الرجاء إدخال كلمة المرور", {});
      return false;
    }

    return true;
  };

  // إرسال الطلب
  const handleSubmit = async (e) => {
    console.log("SUBMITTED:", formData);
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      console.log("TRY STARTED");
      const res = await signIn(formData);

      console.log("LOGIN RESPONSE:", res);

      if (res.status === 200) {
        const { token, firstName, lastName, role, id, email } = res.data || {};

        // تخزين التوكن
        if (token) {
          localStorage.setItem("token", token);
        }

        // تخزين اليوزر كامل
        const currentUser = {
          id: id,
          firstName: firstName,
          lastName: lastName,
          role: role,
          email: email || "",
        };

        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        console.log("CURRENT USER SAVED:", currentUser);

        //تحويل المستخدم حسب الرول
        let targetPath = "/dashboard";

        if (role && role.toLowerCase() === "member") {
          targetPath = "/user";
        }

        navigate(targetPath, { replace: true });
      }
    } catch (error) {
      const message = getApiErrorMessage(error, "حدث خلل");
      console.log("API error response:", error?.response?.data);
      toast.error(<div dangerouslySetInnerHTML={{ __html: message }} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen font-[Cairo] flex-col lg:flex-row items-center justify-center gap-8 p-4 lg:p-0"
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      {/* نموذج تسجيل الدخول */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          flex: 1,
          maxWidth: "600px",
          padding: "6.5rem",
          height: "90%",
        }}
        className="w-full sm:p-8 md:p-12 lg:p-[6.5rem]"
      >
        <div className="mb-5 flex justify-center w-full">
          <img
            src={Logo}
            alt="logo"
            className="logo"
            style={{ width: "215px", height: "77px" }}
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2 text-center">
          تسجيل الدخول
        </h2>
        <p className="text-base sm:text-lg font-bold text-[#7E818C] mb-4 text-center">
          أدخل بياناتك للوصول إلى لوحة التحكم الخاصة بك
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full text-right text-sm font-bold"
        >
          {/* حقل اسم المستخدم */}
          <div className="mb-4">
            <label className="block mb-2 text-black">
              اسم المستخدم أو البريد الإلكتروني
            </label>
            <div className="relative w-full">
              <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-purple)]" />
              <input
                type="text"
                name="identifier"
                placeholder="أدخل اسم المستخدم أو بريدك الإلكتروني"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full h-12 pr-10 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none placeholder-[#7E818C]"
              />
            </div>
          </div>

          {/* كلمة المرور */}
          <div className="mb-6">
            <label className="block mb-2 text-black">كلمة المرور</label>
            <div className="relative w-full">
              <PasswordIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-purple)]" />

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
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOnIcon className="text-[var(--color-purple)]" />
                ) : (
                  <EyeOffIcon />
                )}
              </button>
            </div>
          </div>

          {/* تذكرني + نسيت كلمة المرور */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="ml-2 accent-[var(--color-purple)] cursor-pointer"
              />
              تذكرني
            </label>

            <a
              href="#"
              className="text-sm text-[var(--color-purple)] hover:underline font-semibold"
            >
              نسيت كلمة المرور؟
            </a>
          </div>

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-12 text-white font-semibold rounded-lg hover:bg-[#580b94] transition flex items-center justify-center cursor-pointer gap-2 ${
              loading ? "opacity-90 cursor-wait" : ""
            }`}
            style={{ backgroundColor: "var(--color-purple)" }}
          >
            تسجيل الدخول
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>

          {/* الذهاب لإنشاء حساب */}
          <p className="text-center text-sm text-gray-600 mt-4">
            ليس لديك حساب؟{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-[var(--color-purple)] font-semibold hover:underline cursor-pointer"
            >
              أنشئ حساب الآن
            </button>
          </p>
        </form>
      </div>

      {/* الجزء البنفسجي (الصورة) */}
      <div
        style={{
          width: "550px",
          height: "800px",
          flexShrink: 0,
          backgroundImage: `url(${login})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "18px",
          alignSelf: "center",
          margin: "6rem",
        }}
        className="hidden lg:block"
      ></div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import Logo from "../icons/rezly-logo.svg";
import UserIcon from "../icons/user.svg?react";
import PasswordIcon from "../icons/password.svg?react";
import EyeOffIcon from "../icons/eyeOff.svg?react";
import login from "../icons/login.svg";
import { useNavigate } from "react-router-dom";
import { signIn } from "./api.js";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signIn(formData);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Login failed");
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
          <div className="mb-4">
            <label className="block mb-2 text-black">اسم المستخدم أو البريد الالكتروني  </label>
            <div className="relative w-full">
              <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type="text"
                name="identifier"
                placeholder="أدخل اسم المستخدم أو  بريدك الإلكتروني"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full h-12 pr-10 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none placeholder-[#7E818C]"
              />
            </div>
          </div>

          <div className="mb-6">
             <label className="block mb-2 text-black">كلمة المرور</label>
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

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="ml-2 accent-[#6A0EAD]"
              />
              تذكرني
            </label>
            <a
              href="#"
              className="text-sm text-[#6A0EAD] hover:underline font-semibold"
            >
              نسيت كلمة المرور؟
            </a>
          </div>

          <button
            type="submit"
            className="w-full h-12 text-white font-semibold rounded-lg hover:bg-[#580b94] transition"
            style={{ backgroundColor: "var(--color-purple)" }}
          >
            تسجيل الدخول
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            ليس لديك حساب؟{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-[#6A0EAD]  font-semibold hover:underline"
            >
              أنشئ حساب الآن
            </button>
          </p>
        </form>
      </div>

      {/* الجزء البنفسجي */}
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

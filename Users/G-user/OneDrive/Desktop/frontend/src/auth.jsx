/*
import axios from "axios";


export const loginUser = async (data) => {
  try {
    const response = await axios.post(`https://rezly-ddms-rifd-2025y-01p.onrender.com/auth/Signin`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // في حال السيرفر يستخدم كوكيز
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "حدث خطأ أثناء تسجيل الدخول");
    } else {
      throw new Error("تعذر الاتصال بالخادم");
    }
  }
};

*/
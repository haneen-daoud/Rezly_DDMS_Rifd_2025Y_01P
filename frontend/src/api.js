import axios from "axios";

const api = axios.create({
  baseURL: "https://rezly-ddms-rifd-2025y-01p.onrender.com",
});

const FIXED_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTZjYzcyYmU3MzE5YzY1YTFmZTYwNyIsImlhdCI6MTc1OTk1NjIwNCwiZXhwIjoxNzYyNTQ4MjA0fQ.tgBBfR5sReT7oFkpLvTZ9QKXr9R3vQKFfe4UBHQheBM";

// إضافة موظف
export const createEmployee = async (formData) => {
  const res = await api.post("/auth/employeeSignUp", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${FIXED_TOKEN}`,
    },

  });
  console.log("response من API:", res.data);

  return res.data;
};

// جلب جميع الموظفين
export const getAllEmployees = async () => {
  const res = await api.get("/auth/getAllEmployees", {
    headers: { Authorization: `Bearer ${FIXED_TOKEN}` },
  });

  return res.data;
};
// حذف أو تعطيل موظف
export const toggleEmployeeStatus = async (id, active) => {
  const res = await api.patch(
    `/auth/toggleEmployeeStatus?id=${id}&active=${active}`,
    {},
    {
      headers: { Authorization: `Bearer ${FIXED_TOKEN}` },
    }
  );
  return res.data;
};

const handleDeleteEmployee = async (id) => {
  try {
    await toggleEmployeeStatus(id, false);
    const updated = employees.filter(emp => emp._id !== id);
    setEmployees(updated);
    setEmployeeCount(updated.length);
  } catch (err) {
    console.error("خطأ أثناء الحذف:", err);
  }
};

export const updateEmployee = async (employeeId, formData) => {
  try {
    console.log("📝 إرسال بيانات لتحديث الموظف:", employeeId);

    const response = await api.put(
      `/auth/updateEmployee/${employeeId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${FIXED_TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("  رد السيرفر بعد التحديث:", response.data);
    return response.data;
  } catch (err) {
    console.error("   خطأ في updateEmployee:", err);
    throw err;
  }
};


export const updateEmployeeRole = async (id, newRole) => {
  try {
    console.log(" Trying to update role...");
    console.log(" Employee ID:", id);
    console.log(" New Role:", newRole);

    if (!id || !newRole) {
      throw new Error(" Missing required parameters: id or newRole");
    }

    const res = await api.patch(
      `/auth/updateRole/${id}/${newRole}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${FIXED_TOKEN}`,
        },
      }
    );

    console.log(" Role updated successfully:", res.data);
    return res.data;

  } catch (err) {
    console.error(" Error updating role:");
    console.error("Message:", err.message);
    console.error("Response data:", err.response?.data);
    console.error("Full error object:", err);
    throw err;
  }
};

// دالة تسجيل الدخول
export const signIn = async (formData) => {
  try {
    const res = await api.post("/auth/Signin", formData);
    return res;
  } catch (err) {
    console.error("SignIn error:", err);
    throw err;
  }
};


export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "https://rezly-ddms-rifd-2025y-01p.onrender.com",
});

const FIXED_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTgxNjE2YWRkZWM2YmI5OTYzYTBkMyIsImlhdCI6MTc2MDI4ODExOSwiZXhwIjoxNzYyODgwMTE5fQ.otxs7BqWLTxQxjYmMJ8gXqnl5pbyOB0_VgwX1E6OQR0";

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
// جلب جميع الموظفين (مع دعم الفلاتر من الكويري)
export const getAllEmployees = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.id) params.append("id", filters.id);
  if (filters.role) params.append("role", filters.role);
  if (filters.jobTitle) params.append("jobTitle", filters.jobTitle);
  if (filters.department) params.append("department", filters.department);
  if (filters.contractType) params.append("contractType", filters.contractType);

  const queryString = params.toString();
  const url = queryString
    ? `/auth/getAllEmployees?${queryString}`
    : `/auth/getAllEmployees`;

  const res = await api.get(url, {
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
    // نرسل على الراوت الجديد اللي عمله الباك
    const res = await api.post("/auth/SignInv2", {
      identifier: formData.identifier,
      password: formData.password,
      rememberMe: formData.rememberMe,
    });

    return res;
  } catch (err) {
    console.error("SignIn error:", err);
    throw err;
  }
};




export const signup = async (formData) => {
  try {
const res = await api.post("/auth/SignUp", formData);
    return res;
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
};

///////////////////////////////////////////
// إضافة مشترك جديد باستخدام Axios
export const addNewMember = async (memberData) => {
  try {
    // إزالة الحقول غير المسموحة
    const {
      sendMethod,
      healthForm,
      userName,
      password,
      fullName,
      nationalId,
      image, // الصورة مش مدعومة، نمسحها
      ...cleanData
    } = memberData;

    // لو الصورة فاضية احذفها
    if (!image) {
      delete cleanData.image;
    }

    // إرسال JSON وليس FormData
    const res = await api.post("/auth/addNewMember", cleanData, {
      headers: {
        Authorization: `Bearer ${FIXED_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (err) {
    console.error("❌ خطأ أثناء إضافة المشترك:", err.response?.data || err.message);
    throw err;
  }
};


// جلب جميع الأعضاء (المشتركين) مع دعم السيرتش + الفلاتر من الباك
export const getAllMembers = async (page = 1, search = "", filters = {}) => {
  try {
    const params = new URLSearchParams();

    // البيج والليمت
    params.append("page", page);
    // لو بدنا نثبت الليمت 10 نفس منطق التاب
    // params.append("limit", 10);

    // السيرتش
    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }

    // الفلاتر
    if (filters.packageName) {
      params.append("packageName", filters.packageName);
    }

    if (filters.city) {
      params.append("city", filters.city);
    }

    if (filters.coachId) {
      params.append("coachId", filters.coachId);
    }

    if (filters.startDate) {
      params.append("startDate", filters.startDate);
    }

    if (filters.endDate) {
      params.append("endDate", filters.endDate);
    }

    const res = await api.get(`/auth/getAllMembers?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${FIXED_TOKEN}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("❌ خطأ أثناء جلب الأعضاء:", err);
    throw err;
  }
};



export const getmemb =async()=>{
  try{
     const res= await axios.get("/auth/getAllMembers",{
 headers:{
    authorization: `Bearer ${FIXED_TOKEN}`
  }
     });
 

  }catch(e){
    console.log("mmmmmmmmmmmm")
  }
 

}

export const deleteMember = async (id) => {
  if (!id) throw new Error("Missing member ID");

  try {
    const response = await api.delete(`/auth/deleteMember/${id}`, {
      headers: {
        Authorization: `Bearer ${FIXED_TOKEN}`,
      },
    });

    if (response.status === 200) {
      console.log(`تم حذف المشترك بنجاح: ${id}`);
      return response.data;
    } else {
      throw new Error(`حذف المشترك فشل برمز ${response.status}`);
    }
  } catch (error) {
    console.error(" خطأ أثناء حذف المشترك:", error.response?.data || error.message);
    throw error;
  }
};

// جلب قائمة الباقات (Packages)
export const getAllPackages = async () => {
  try {
    const res = await api.get("/package/listPackages", {
      headers: { Authorization: `Bearer ${FIXED_TOKEN}` },
    });

    console.log("📦 قائمة الباقات:", res.data);
    return res.data.packages || [];
  } catch (err) {
    console.error("❌ خطأ أثناء جلب الباقات:", err.response?.data || err.message);
    throw err;
  }
};

// تحديث بيانات مشترك موجود
export const updateMember = async (memberId, memberData) => {
  if (!memberId) throw new Error("Missing member ID");

  try {
    const res = await api.put(`/auth/updateMember/${memberId}`, memberData, {
      headers: {
        Authorization: `Bearer ${FIXED_TOKEN}`,
        "Content-Type": "application/json",
      },
      
    });

    console.log("📦 رد السيرفر بعد تحديث المشترك:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ خطأ أثناء تحديث المشترك:", err.response?.data || err.message);
    throw err;
  }
};
  const updateMemberPayment = async (newPaymentMethod) => {
    try {
      const response = await axios.put(
        `/auth/updateMember/${memberId}`,
        { paymentMethod: newPaymentMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ تم تحديث طريقة الدفع:", response.data);
    } catch (error) {
      console.error("❌ خطأ أثناء تحديث طريقة الدفع:", error);
    }
  };


  // جلب جميع المدربين
// 🟣 جلب جميع المدربين (Employees بدور Coach)
export const getAllCoaches = async () => {
  try {
    const res = await api.get("/auth/getAllEmployees?role=Coach", {
      headers: {
        Authorization: `Bearer ${FIXED_TOKEN}`,
      },
    });

    // حسب استجابة الباك، بس غالباً employees
    const coaches = res.data.employees || res.data.data || [];
    return coaches;
  } catch (err) {
    console.error(
      "❌ خطأ أثناء جلب المدربين:",
      err.response?.data || err.message
    );
    throw err;
  }
};


/////////////////

//  دالة خاصة للداشبورد: إحصائيات الأعضاء
export const getMembersStats = async () => {
  try {
    const res = await api.get(
      "/auth/getAllMembers?page=1&limit=1000",
      {
        headers: {
          Authorization: `Bearer ${FIXED_TOKEN}`,
        },
      }
    );
    return res.data; // { message, page, totalPages, totalMembers, members: [...] }
  } catch (err) {
    console.error(
      "❌ خطأ أثناء جلب إحصائيات الأعضاء:",
      err.response?.data || err.message
    );
    throw err;
  }
};
export default api;
/////////////////////////////////

// إنشاء Gym جديد (إعدادات النادي من صفحة الإعدادات)
export const createGym = async (data) => {
  try {
    const formData = new FormData();

    // الحقول البسيطة
    formData.append("name", data.name || "");
    formData.append("phone", data.phone || "");
    formData.append("email", data.email || "");
    formData.append("location", data.location || "");
    formData.append("currency", data.currency || "");
    formData.append("logo", data.logo || "");
    formData.append("status", data.status || "active");

    // الصورة (لو فيه)
    if (data.imageFile) {
      formData.append("image", data.imageFile);
    }

    // الحقول المركّبة (لازم JSON.stringify لأن الباك بعمل JSON.parse)
    formData.append("departments", JSON.stringify(data.departments || []));
    formData.append("roles", JSON.stringify(data.roles || []));
    formData.append("contracts", JSON.stringify(data.contracts || []));
    formData.append("classes", JSON.stringify(data.classes || []));
    formData.append("halls", JSON.stringify(data.halls || []));
    formData.append("subscriptions", JSON.stringify(data.subscriptions || []));

    // نجيب التوكن اللي اتخزن بعد اللوجين
    const token = localStorage.getItem("token");

    const res = await api.post("/gym", formData, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });

    return res.data;
  } catch (err) {
    console.error("CreateGym error:", err);
    throw err;
  }
};


/*
// إضافة مشترك جديد باستخدام Axios
export const addNewMember = async (memberData) => {
  try {
    const formData = new FormData();

    // إزالة الحقول اللي ما بدنا نبعتها للباك مثل الأصل
    const {
      sendMethod,
      healthForm,
      userName,
      password,
      fullName,
      nationalId,
      image, // رح نضيفه يدوي تحت
      ...cleanData
    } = memberData;

    // أولاً: نضيف الحقول الباقية (cleanData) إلى formData
    Object.entries(cleanData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    // ثانياً: لو فيه صورة نضيفها بشكل صحيح
    if (memberData.image instanceof File) {
      formData.append("image", memberData.image);
    }

    // إرسال الطلب كـ FormData بدلاً من JSON
    const res = await api.post("/auth/addNewMember", formData, {
      headers: {
        Authorization: `Bearer ${FIXED_TOKEN}`,
        // مهم جداً: لا نضيف Content-Type يدوياً
        // axios automatically sets multipart/form-data with boundary
      },
    });

    return res.data;
  } catch (err) {
    console.error(
      "❌ خطأ أثناء إضافة المشترك:",
      err.response?.data || err.message
    );
    throw err;
  }
};
*/
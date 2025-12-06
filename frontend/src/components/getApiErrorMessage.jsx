export function getApiErrorMessage(error, defaultMessage = "حدث خطأ غير متوقع") {
  const data = error?.response?.data;

  if (!data) return defaultMessage;

  let collectedErrors = [];

  // 1) التعامل مع errors كمصفوفة
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    data.errors.forEach((errItem) => {
      // لو العنصر نفسه ستـرينغ (زي: "البريد الإلكتروني مستخدم بالفعل")
      if (typeof errItem === "string" && errItem.trim() !== "") {
        collectedErrors.push(errItem);
      }

      // لو العنصر أوبجيكت (زي: { lastName: '"lastName" is required' })
      else if (errItem && typeof errItem === "object") {
        const values = Object.values(errItem).filter(
          (v) => typeof v === "string" && v.trim() !== ""
        );
        collectedErrors.push(...values);
      }
    });
  }

  // لو جمعنا رسائل من errors
  if (collectedErrors.length > 0) {
    //عشان كل ايرور ييجي بسطر
    return collectedErrors.join("<br/>");
  }

  // 2) لو في message عامة
  if (typeof data.message === "string" && data.message.trim() !== "") {
    return data.message;
  }

  return defaultMessage;
}

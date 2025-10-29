export const formatBookingData = (booking) => {
  if (!booking) return {};

  try {
    const schedules = booking.schedules || [];
    const firstSchedule = schedules[0] || {};

    // أسماء الأيام حسب أرقام JS getDay()
    // 0: أحد ... 6: سبت
    const dayNamesShort = [
      "أحد",
      "إثنين",
      "ثلاثاء",
      "أربعاء",
      "خميس",
      "جمعة",
      "سبت",
    ];

    // يحول "9:00 ص" أو "09:00 م" أو "14:30" → "HH:MM" بصيغة 24h عشان الـ TimePicker
    const normalizeTimeTo24 = (raw) => {
      if (!raw) return "";

      let str = String(raw).trim();

      // هل فيها ص/م بالعربي؟
      const hasAM = /ص/.test(str);
      const hasPM = /م/.test(str);

      // طلع الأرقام "9:00" من "9:00 ص"
      str = str.replace(/[^\d:]/g, "");
      // الآن str زي "9:00" أو "14:30"
      let [h, m] = str.split(":").map((n) => parseInt(n, 10));
      if (Number.isNaN(h)) return "";

      if (Number.isNaN(m)) m = 0;

      // لو فيها "م" و الساعة أقل من 12 → +12
      if (hasPM && h < 12) h += 12;
      // لو فيها "ص" و الساعة 12 → 0
      if (hasAM && h === 12) h = 0;

      // safe
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      return `${hh}:${mm}`;
    };

    // نستخرج startDate الأساسي لعرض التاريخ ولبناء formData.start/end
    const startDate = booking.startDate
      ? new Date(booking.startDate)
      : firstSchedule.date
      ? new Date(firstSchedule.date)
      : null;

    const safeDateString =
      startDate && !isNaN(startDate)
        ? startDate.toISOString().split("T")[0]
        : "";

    // ========== نجمع الأيام بدون تكرار ==========
    // map dayOfWeek -> { day, start, end }
    const groupedDays = new Map();

    for (const sch of schedules) {
      const d = sch.dayOfWeek; // رقم اليوم 0..6
      if (d === undefined || d === null) continue;

      if (!groupedDays.has(d)) {
        groupedDays.set(d, {
          day: dayNamesShort[d] || "", // "أحد"
          start: normalizeTimeTo24(sch.timeStart), // "08:00"
          end: normalizeTimeTo24(sch.timeEnd), // "09:00"
        });
      }
    }

    // رجعهم كأراي بنفس ترتيب ظهورهم الأصلي بالداتا
    const daysSchedule = [];
    const seenDays = new Set();
    for (const sch of schedules) {
      const d = sch.dayOfWeek;
      if (groupedDays.has(d) && !seenDays.has(d)) {
        daysSchedule.push(groupedDays.get(d));
        seenDays.add(d);
      }
    }

    // repeatDays = أسماء الأيام بدون تكرار (قصيرة)
    const repeatDays = daysSchedule.map((obj) => obj.day);

    // خريطة الـ subscriptionDuration → عربي للعرض
    const durationMapReverse = {
      "1week": "أسبوع",
      "2weeks": "أسبوعين",
      "3weeks": "3 أسابيع",
      "1month": "شهر",
      "3months": "3 أشهر",
      "6months": "6 أشهر",
      "1year": "سنة",
    };

    // لأول شاشة تعديل فردي (dropdown فوق في المودال):
    // نبني start/end based on أول schedule
    const firstStartNorm = normalizeTimeTo24(firstSchedule.timeStart);
    const firstEndNorm = normalizeTimeTo24(firstSchedule.timeEnd);

    const composedStart =
      safeDateString && firstStartNorm
        ? `${safeDateString}T${firstStartNorm}`
        : "";
    const composedEnd =
      safeDateString && firstEndNorm
        ? `${safeDateString}T${firstEndNorm}`
        : "";

    return {
      ...booking,

      // ---- Step1 ----
  title: booking.service || "",
  service: booking.service || "",

  // ✅ لو الموقع والعدد داخل أول schedule
  room:
    booking.location ||
    firstSchedule.location ||
    "",
  location:
    booking.location ||
    firstSchedule.location ||
    "",

  coachId:
    booking.coach?._id || booking.coachId || booking.coach || undefined,

  // ✅ نفس الفكرة للـ maxMembers
  maxMembers:
    booking.maxMembers ||
    firstSchedule.maxMembers ||
    "",

  description: booking.description || "",

  // ✅ نقرأ الريمايندر من أول schedule إذا موجود
reminders:
  (firstSchedule.reminders && firstSchedule.reminders.length > 0)
    ? firstSchedule.reminders
    : booking.reminders || [],


      // ---- Step2 ----
      dateOnly: safeDateString,
      daysSchedule, // ← صار فيه [{day:"أحد",start:"08:00",end:"09:00"}, ...]
      repeatDays,
      subscriptionDuration:
        durationMapReverse[booking.subscriptionDuration] ||
        booking.subscriptionDuration ||
        "",

      start: composedStart, // "2025-11-02T08:00"
      end: composedEnd, // "2025-11-02T09:00"

      // خلي الـ schedules الأصلية معنا (عشان الدروبداون تبع تعديل يوم واحد حسب التاريخ)
      schedules: schedules || [],
    };
  } catch (err) {
    console.error("❌ خطأ أثناء تهيئة بيانات الحجز:", err);
    return booking;
  }
};

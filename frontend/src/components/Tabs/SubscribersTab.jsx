import React, { useEffect, useState } from "react";
import "../AttendanceTable/AttendanceTable.css";
import { getAllMembers, deleteMember } from "../../api";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import AddParticipantModel from "../AddParticipantModel/AddParticipantModel.jsx";
import { toast, ToastContainer } from "react-toastify";

// ✅ دالة لتنضيف بيانات المشترك قبل تخزينها في localStorage أو تمريرها بالإيفنت
const sanitizeMember = (member) => {
  if (!member) return member;

  const {
    _id,
    firstName,
    lastName,
    gender,
    idNumber,
    birthDate,
    phone,
    email,
    city,
    address,
    image,
    packageId,
    paymentMethod,
    coachId,
    startDate,
    endDate,
    confirmEmail,
    isActive,
    file,
    createdAt,
    updatedAt,
  } = member;

  return {
    _id,
    firstName,
    lastName,
    gender,
    idNumber,
    birthDate,
    phone,
    email,
    city,
    address,
    image,
    packageId,
    paymentMethod,
    coachId,
    startDate,
    endDate,
    confirmEmail,
    isActive,
    file,
    createdAt,
    updatedAt,
  };
};

const sanitizeMembers = (members = []) =>
  (Array.isArray(members) ? members : [])
    .filter(Boolean)
    .map(sanitizeMember);

// ✅ دالة موحّدة للفرز تنازلي (الأحدث أولاً)
const getSortDate = (m) =>
  (m && (m.createdAt || m.startDate || m.updatedAt)) || 0;

const sortMembersDescending = (members = []) =>
  [...(members || [])].sort(
    (a, b) => new Date(getSortDate(b)) - new Date(getSortDate(a))
  );

export default function SubscribersTab({ searchValue = "" }) {
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editClientData, setEditClientData] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClientToDelete, setSelectedClientToDelete] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);

   // نقرأ الرول من currentUser
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const role = (parsed.role || "").toLowerCase();
        setUserRole(role);
      }
    } catch (err) {
      console.error("[SubscribersTab] فشل قراءة currentUser من localStorage:", err);
    }
  }, []);

  const isCoach = userRole === "coach";

  const displayValue = (value) => {
    return value && value !== "" ? value : "—";
  };

    // جلب جميع المشتركين (مع دعم السيرتش من الباك)
  useEffect(() => {
    // 👇 نقرأ البيانات اللي في localStorage أولاً (بس لما ما يكون في سيرتش)
    let localMembers = [];
    if (!searchValue) {
      const localData = localStorage.getItem("membersData");
      if (localData) {
        try {
          localMembers = sanitizeMembers(JSON.parse(localData) || []);

          // نرتبهم تنازلي قبل العرض
          const sortedLocal = sortMembersDescending(localMembers);

          setClients(sortedLocal); // نعرضهم فوراً بعد التنضيف
        } catch (e) {
          console.error("خطأ في قراءة membersData من localStorage", e);
        }
      }
    }

    const fetchAllMembers = async () => {
      try {
        let allMembers = [];
        let currentPage = 1;
        let hasMore = true;

        while (hasMore) {
          const data = await getAllMembers(currentPage, searchValue);
          const members = data.members || data.data || [];
          console.log("📦 API DATA PAGE:", currentPage, data);
          console.log("📦 MEMBERS FROM API:", members);

          allMembers = [...allMembers, ...members];

          if (members.length < 10) {
            hasMore = false;
          } else {
            currentPage++;
          }
        }

        // 👇 نحول الـ localMembers لماب حسب الـ id
        const localById = {};
        localMembers.forEach((m) => {
          if (m && m._id) {
            localById[m._id] = m;
          }
        });

        const mergedMembersRaw = allMembers.map((m) =>
          m && m._id && localById[m._id]
            ? { ...localById[m._id], ...m } // السيرفر يغلب لو في تعارض
            : m
        );

        // ✅ ننضف قبل التخزين والعرض
        const mergedMembers = sanitizeMembers(mergedMembersRaw);

        // ✅ نرتب تنازلي دائماً
        const sortedMembers = sortMembersDescending(mergedMembers);

        setClients(sortedMembers);

        // نخزن في localStorage فقط لو مش سيرتش
        if (!searchValue) {
          localStorage.setItem("membersData", JSON.stringify(sortedMembers));
        }

        console.log("تم جلب جميع المشتركين:", sortedMembers.length);
      } catch (error) {
        console.error(" حدث خطأ أثناء جلب المشتركين", error);
      }
    };

    fetchAllMembers();
  }, [searchValue]);


  // تحديث جدول المشتركين لما أي جزء من السيستم يغيّر البيانات (إضافة/تعديل/حذف)
  useEffect(() => {
    const handleMembersUpdated = (e) => {
      const detail = e.detail;

      // 🟣 حالة: إضافة مشترك جديد من الهيدر (Clients.jsx)
      if (detail && detail.type === "add" && detail.member) {
        const cleanedMember = sanitizeMember(detail.member);

        setClients((prev) => {
          // نتأكد ما نكرّر نفس المشترك لو موجود
          if (prev.some((c) => c._id === cleanedMember._id)) {
            return prev;
          }

          const updated = [cleanedMember, ...prev];
          const cleaned = sanitizeMembers(updated);
          const sorted = sortMembersDescending(cleaned);

          localStorage.setItem("membersData", JSON.stringify(sorted));

          return sorted;
        });

        return;
      }

      // 🟣 حالة: تحديث القائمة كاملة (مثلاً بعد حذف أو تحديث جماعي)
      if (Array.isArray(detail)) {
        const cleaned = sanitizeMembers(detail);
        const sorted = sortMembersDescending(cleaned);

        setClients(sorted);
        localStorage.setItem("membersData", JSON.stringify(sorted));

        return;
      }

      // غير هيك نتجاهل الإيفنت (ما يهمنا)
    };

    window.addEventListener("membersUpdated", handleMembersUpdated);

    return () => {
      window.removeEventListener("membersUpdated", handleMembersUpdated);
    };
  }, []);

  // حذف المشترك
  const handleDeleteClick = (client) => {
  setSelectedClientToDelete(client);
  setIsDeleting(false);           // نتأكد إن اللودر مطفي
  setIsDeleteModalOpen(true);
};


  const handleConfirmDelete = async () => {
  if (!selectedClientToDelete) return;

  setIsDeleting(true); // شغّل اللودر

  try {
    await deleteMember(selectedClientToDelete._id);

    setClients((prev) => {
      const updated = prev.filter(
        (c) => c._id !== selectedClientToDelete._id
      );

      const cleaned = sanitizeMembers(updated);
      const sorted = sortMembersDescending(cleaned);

      // تحديت اللوكال ستوريج
      localStorage.setItem("membersData", JSON.stringify(sorted));

      // نبعث الإيفنت محدث بعد الحذف
      window.dispatchEvent(
        new CustomEvent("membersUpdated", { detail: sorted })
      );

      return sorted;
    });

    // توست النجاح
    toast.success("تم حذف المشترك بنجاح");
  } catch (error) {
    console.error("خطأ أثناء حذف المشترك:", error);

    // توست الفشل
    const errorMsg =
      error?.response?.data?.message || "حدث خطأ أثناء حذف المشترك";
    toast.error(errorMsg);
  } finally {
    setIsDeleting(false);          // نطفي اللودر
    setIsDeleteModalOpen(false);   // نسكر المودال
    setSelectedClientToDelete(null);
  }
};


  const handleEditClick = (client) => {
    setEditClientData(client);
    setIsModalOpen(true);
  };

  const handleSelectAll = () => {
  setSelectAll((prev) => {
    const newValue = !prev;
    if (newValue) {
      // اختار كل المشتركين
      setSelectedClients(clients.map((c) => c._id));
    } else {
      // ألغِ اختيار الكل
      setSelectedClients([]);
    }
    return newValue;
  });
};


  const handleSelectClient = (id) => {
  setSelectedClients((prevSelected) => {
    let updated;
    if (prevSelected.includes(id)) {
      // إزالة مشترك من الاختيار
      updated = prevSelected.filter((c) => c !== id);
    } else {
      // إضافة مشترك للاختيار
      updated = [...prevSelected, id];
    }

    // لو شلنا الصح عن واحد → نشيل "اختيار الكل"
    // ولو صارت كلهم مختارين يدويّاً → نحط صح على "اختيار الكل"
    if (updated.length === clients.length && clients.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }

    return updated;
  });
};

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);

    // تنسيق عربي (dd/mm/yyyy)
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="">
      {/* جدول المشتركين */}
      <table className="attendance-table SubscribersTab-table">
       <thead>
  <tr>
    {/* إخفاء عمود التحديد بالكامل لو المستخدم مدرب */}
    {!isCoach && (
      <th>
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
        />
      </th>
    )}
    <th>الاسم</th>
    <th>البريد الإلكتروني</th>
    <th>رقم الهاتف</th>
    <th>نوع الاشتراك</th>
    <th>تاريخ بدء الاشتراك</th>
    <th>تاريخ انتهاء الاشتراك</th>
    <th>الملف الشخصي</th>
    {/* إخفاء عمود الإجراءات لو المستخدم مدرب (من التعديل السابق) */}
    {!isCoach && <th>الإجراءات</th>}
  </tr>
</thead>


        <tbody>
  {clients.map((client) => (
    <tr key={client._id}>
      {/* إخفاء تشيك بوكس الصف لو المستخدم مدرب */}
      {!isCoach && (
        <td>
          <input
            type="checkbox"
            checked={selectedClients.includes(client._id)}
            onChange={() => handleSelectClient(client._id)}
          />
        </td>
      )}
              <td className="table-text">
                {client.firstName} {client.lastName}
              </td>
              <td className="table-text">{displayValue(client.email)}</td>
              <td className="table-text">{displayValue(client.phone)}</td>
              <td>
                <span
                  className={`subscription-badge ${
                    client.packageId?.slug === "شهري"
                      ? "badge-month"
                      : client.packageId?.slug === "أسبوعي"
                      ? "badge-week"
                      : client.packageId?.slug === "يومي"
                      ? "badge-day"
                      : client.packageId?.slug === "سنوي"
                      ? "badge-year"
                      : "badge-empty"
                  }`}
                >
                  {displayValue(
                    client.packageId?.name || client.packageId?.slug
                  )}
                </span>
              </td>
              <td className="table-text">
                {displayValue(formatDate(client.startDate))}
              </td>
              <td className="table-text">
                {displayValue(formatDate(client.endDate))}
              </td>

              <td className="table-text text-[var(--color-purple)] underline cursor-pointer">
  {client.file || <span>عرض</span>}
</td>

{/* نخفي عمود الإجراءات بالكامل لو المستخدم مدرب */}
{!isCoach && (
  <td className="table-text flex justify-center gap-2">
    {/* زر التعديل */}
    <button
      onClick={() => handleEditClick(client)}
      className="p-2.5 rounded-full hover:bg-purple-100 hover:scale-110 transition cursor-pointer"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M5.99805 12.7034L5.12891 13.5725C4.53647 14.1647 3.73317 14.4973 2.89551 14.4973H2C1.72386 14.4973 1.5 14.2735 1.5 13.9973V13.1047C1.5 12.2669 1.83251 11.4629 2.4248 10.8704L3.29492 10.0002L5.99805 12.7034ZM7.66504 11.0364L6.70605 11.9963L4.00293 9.29321L4.96191 8.33325L7.66504 11.0364ZM11.4551 1.84106C11.9102 1.38588 12.6487 1.38659 13.1035 1.84204L14.1602 2.89966C14.6144 3.35471 14.6139 4.09247 14.1592 4.54712L8.37305 10.3323L5.66895 7.62817L11.4551 1.84106Z"
          fill="#6A0EAD"
        />
      </svg>
    </button>

    {/* زر الحذف */}
    <button
      onClick={() => handleDeleteClick(client)}
      className="p-2.5 rounded-full hover:bg-purple-100 hover:scale-110 transition cursor-pointer"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M9.22461 0.833984C9.75792 0.834042 10.2401 1.15238 10.4502 1.64258L11.1035 3.16699H13.9971C14.3653 3.16699 14.6641 3.46579 14.6641 3.83398C14.6641 4.20217 14.3653 4.50098 13.9971 4.50098H13.4492L12.9072 13.4443C12.8485 14.4118 12.0463 15.1667 11.0771 15.167H4.91992C3.95073 15.1668 3.14954 14.4118 3.09082 13.4443L2.54883 4.50098H1.99707C1.62903 4.5008 1.33105 4.20207 1.33105 3.83398C1.33105 3.4659 1.62903 3.16717 1.99707 3.16699H4.8916L5.54492 1.64258C5.75503 1.15233 6.23714 0.833984 6.77051 0.833984H9.22461ZM7 9.83301C6.72417 9.83325 6.50018 10.0572 6.5 10.333C6.5 10.609 6.72406 10.8328 7 10.833H9C9.27594 10.8328 9.5 10.609 9.5 10.333C9.49982 10.0572 9.27583 9.83325 9 9.83301H7ZM6 7.16699C5.72406 7.16723 5.5 7.391 5.5 7.66699C5.50018 7.94284 5.72417 8.16675 6 8.16699H10C10.2758 8.16675 10.4998 7.94284 10.5 7.66699C10.5 7.391 10.2759 7.16723 10 7.16699H6ZM6.8584 2.16699C6.80506 2.16699 6.75636 2.19902 6.73535 2.24805L6.3418 3.16699H9.65332L9.25879 2.24805C9.23776 2.19918 9.18993 2.16705 9.13672 2.16699H6.8584Z"
          fill="#FF0000"
        />
      </svg>
    </button>
  </td>
)}

            </tr>
          ))}
        </tbody>
      </table>

      {/* مودال التعديل/الإضافة */}
      {isModalOpen && (
  <AddParticipantModel
    onClose={() => {
      setIsModalOpen(false);
      setEditClientData(null);
    }}
    isEditMode={!!editClientData}
    editData={editClientData}
    onSave={(response) => {
      console.log("📩 الريسبونس الراجع من المودال:", response);

      const memberFromResponse =
        response?.member || response?.data || response;
      

      let member = memberFromResponse;

      if (!member?._id && editClientData?._id) {
        member = { ...member, _id: editClientData._id };
      }

      if (!member || !member._id) {
        console.error(
          "⚠ ما قدرنا نحدد بيانات العضو بعد التعديل",
          response
        );
        return;
      }

      const oldClient = clients.find((c) => c._id === member._id);

      let fixedPackage;
      if (typeof member.packageId === "string") {
        fixedPackage = {
          _id: member.packageId,
          slug: oldClient?.packageId?.slug || "غير معروف",
          name: oldClient?.packageId?.name || oldClient?.packageId?.slug,
        };
      } else {
        fixedPackage = member.packageId || oldClient?.packageId;
      }

      const cleanedMember = sanitizeMember({
        ...member,
        packageId: fixedPackage,
      });

      setClients((prev) => {
        let updated;

        if (editClientData) {
          updated = prev.map((c) =>
            c._id === cleanedMember._id ? cleanedMember : c
          );
        } else {
          updated = [cleanedMember, ...prev];
        }

        const uniqueById = [];
        const seen = new Set();
        for (const m of updated) {
          if (m && m._id && !seen.has(m._id)) {
            seen.add(m._id);
            uniqueById.push(m);
          }
        }

        const cleanedList = sanitizeMembers(uniqueById);
        const sorted = sortMembersDescending(cleanedList);

        localStorage.setItem("membersData", JSON.stringify(sorted));

        return sorted;
      });

      // ✅ أولاً نسكر المودال
      setIsModalOpen(false);
      setEditClientData(null);

      // ✅ بعد ما يسكر المودال و يصير الريريندر، نطلع التوست
      setTimeout(() => {
        
      }, 50);
    }}
  />
)}



      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        employeeName={
          selectedClientToDelete
            ? `${selectedClientToDelete.firstName} ${selectedClientToDelete.lastName}`
            : ""
        }
      />

       <ToastContainer position="top-left" autoClose={3000} />
    </div>
  );
}

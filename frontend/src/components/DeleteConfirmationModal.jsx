import React from "react";

const DeleteConfirmationModal = ({
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
  employeeName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60  z-50 p-4 ">
      <div className="relative bg-white rounded-2xl w-[452px] h-[222px] text-center  shadow-[0_0_25px_rgba(0,0,0,0.2)] transition-all duration-300">
        <div className="upsec h-[174px] flex  flex-col items-center justify-center ">
          {/* الأيقونة */}
          <div className="flex items-center justify-center mx-auto mb-1">
            <svg
              width="56"
              height="57"
              viewBox="0 0 80 82"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                y="0.5"
                width="80"
                height="81"
                rx="16"
                fill="#FF0000"
                fillOpacity="0.12"
              />
              <path
                d="M38.667 42.667C44.3738 42.6672 49 47.2932 49 53C49 53.5523 48.5523 54 48 54H26.667C26.1147 54 25.667 53.5523 25.667 53C25.667 47.2931 30.2931 42.667 36 42.667H38.667ZM52.3906 34.7236C52.9113 34.2031 53.7557 34.203 54.2764 34.7236C54.797 35.2443 54.7969 36.0887 54.2764 36.6094L51.8857 39L54.2764 41.3906C54.7969 41.9113 54.797 42.7557 54.2764 43.2764C53.7557 43.797 52.9113 43.7969 52.3906 43.2764L50 40.8857L47.6094 43.2764C47.0887 43.7969 46.2443 43.797 45.7236 43.2764C45.203 42.7557 45.2031 41.9113 45.7236 41.3906L48.1143 39L45.7236 36.6094C45.2031 36.0887 45.203 35.2443 45.7236 34.7236C46.2443 34.203 47.0887 34.2031 47.6094 34.7236L50 37.1143L52.3906 34.7236ZM37.333 28C40.8307 28 43.6668 30.8354 43.667 34.333C43.667 37.8308 40.8308 40.667 37.333 40.667C33.8354 40.6668 31 37.8307 31 34.333C31.0002 30.8355 33.8355 28.0002 37.333 28Z"
                fill="#FF0000"
              />
            </svg>
          </div>

          {/* الاسم */}
          <h2 className="text-red-600 font-bold text-lg mb-1">
            {employeeName}
          </h2>

          {/* النص */}
          <p className="text-gray-700 mb-1 text-sm">
            هل أنت متأكد من حذف الموظف ؟
          </p>
        </div>

        {/* الأزرار */}
        <div className="flex justify-center gap-3 ">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-red-600 text-white rounded-md px-4 py-1.5 font-semibold hover:bg-red-700 transition-all duration-200"
          >
            <svg
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.22461 0.833984C8.75792 0.834042 9.24011 1.15238 9.4502 1.64258L10.1035 3.16699H12.9971C13.3653 3.16699 13.6641 3.46579 13.6641 3.83398C13.6641 4.20217 13.3653 4.50098 12.9971 4.50098H12.4482L11.9062 13.4443C11.8475 14.4119 11.0456 15.167 10.0762 15.167H3.91992C2.95056 15.1669 2.14854 14.4119 2.08984 13.4443L1.54785 4.50098H0.99707C0.62903 4.5008 0.331055 4.20207 0.331055 3.83398C0.331055 3.4659 0.62903 3.16717 0.99707 3.16699H3.8916L4.54492 1.64258C4.75503 1.15233 5.23714 0.833984 5.77051 0.833984H8.22461ZM6 9.83301C5.72402 9.83307 5.50018 10.0571 5.5 10.333C5.5 10.6091 5.72391 10.8329 6 10.833H8C8.27609 10.833 8.5 10.6091 8.5 10.333C8.49982 10.0571 8.27598 9.83307 8 9.83301H6ZM5 7.16699C4.72391 7.16705 4.5 7.39089 4.5 7.66699C4.50018 7.94295 4.72402 8.16693 5 8.16699H9C9.27598 8.16693 9.49982 7.94295 9.5 7.66699C9.5 7.39089 9.27609 7.16705 9 7.16699H5ZM5.8584 2.16699C5.80506 2.16699 5.75636 2.19902 5.73535 2.24805L5.3418 3.16699H8.65332L8.25879 2.24805C8.23776 2.19918 8.18993 2.16705 8.13672 2.16699H5.8584Z"
                fill="white"
              />
            </svg>

            {isLoading ? "جارٍ الحذف..." : "حذف"}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="border border-red-600 text-red-600 rounded-md px-5 py-1.5 font-semibold hover:bg-red-50 transition-all duration-200"
          >
            إلغاء
          </button>
        </div>
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
            <div className="w-10 h-10 border-4 border-[#6A0EAD33] border-t-[var(--color-purple)] rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

import React from "react";

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    employeeName = "يوسف محمد"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60  z-50 p-4 ">
            <div className="bg-white rounded-2xl w-[452px] h-[222px] text-center  shadow-[0_0_25px_rgba(0,0,0,0.2)] transition-all duration-300">
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
                        <rect y="0.5" width="80" height="81" rx="16" fill="#FF0000" fillOpacity="0.12" />
                        <path
                            d="M38.667 42.667C44.3738 42.6672 49 47.2932 49 53C49 53.5523 48.5523 54 48 54H26.667C26.1147 54 25.667 53.5523 25.667 53C25.667 47.2931 30.2931 42.667 36 42.667H38.667ZM52.3906 34.7236C52.9113 34.2031 53.7557 34.203 54.2764 34.7236C54.797 35.2443 54.7969 36.0887 54.2764 36.6094L51.8857 39L54.2764 41.3906C54.7969 41.9113 54.797 42.7557 54.2764 43.2764C53.7557 43.797 52.9113 43.7969 52.3906 43.2764L50 40.8857L47.6094 43.2764C47.0887 43.7969 46.2443 43.797 45.7236 43.2764C45.203 42.7557 45.2031 41.9113 45.7236 41.3906L48.1143 39L45.7236 36.6094C45.2031 36.0887 45.203 35.2443 45.7236 34.7236C46.2443 34.203 47.0887 34.2031 47.6094 34.7236L50 37.1143L52.3906 34.7236ZM37.333 28C40.8307 28 43.6668 30.8354 43.667 34.333C43.667 37.8308 40.8308 40.667 37.333 40.667C33.8354 40.6668 31 37.8307 31 34.333C31.0002 30.8355 33.8355 28.0002 37.333 28Z"
                            fill="#FF0000"
                        />
                    </svg>
                </div>

                {/* الاسم */}
                <h2 className="text-red-600 font-bold text-lg mb-1">{employeeName}</h2>

                {/* النص */}
                <p className="text-gray-700 mb-1 text-sm">هل أنت متأكد من حذف الموظف ؟</p>


                </div>
               
                {/* الأزرار */}
                <div className="flex justify-center gap-3 ">

                    <button
                        onClick={onConfirm}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white rounded-md px-5 py-1.5 font-semibold hover:bg-red-700 transition-all duration-200"
                    >
                        حذف
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 6h18" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                    <button
                        onClick={onClose}
                        className="border border-red-600 text-red-600 rounded-md px-5 py-1.5 font-semibold hover:bg-red-50 transition-all duration-200"
                    >
                        إلغاء
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;

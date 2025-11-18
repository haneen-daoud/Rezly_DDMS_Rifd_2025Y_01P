import React from "react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";

const WaitingList = ({ items }) => {
    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg font-Cairo p-4">
            {/* رأس القائمة */}
            <div className="flex items-center justify-between mb-4">

                <span className="font-bold text-gray-700 font-cairo text-[16px]">قائمة الإنتظار</span>
                <div className="flex items-center justify-between" >
                    <span className="text-black font-bold bg-gray-100 px-2.5 py-1 rounded-md text-l">
                        {items.length}</span>
                    <button className="p-1 rounded hover:bg-gray-100">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                width="32"
                                height="32"
                                rx="8"
                                fill="black"
                                fillOpacity="0.04"
                            />
                            <path
                                d="M19.2999 12.7002H12.7002M12.7002 12.7002V19.2998M12.7002 12.7002L19.2999 19.2998"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

            </div>

            {/* قائمة العناصر */}
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-1 rounded-lg "
                    >
                        {/* أيقونات أقصى اليسار */}
                        <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        {/* التفاصيل النصية بالوسط */}
                        <div className="flex-1 flex flex-col text-right mr-3 font-cairo text-[14px]">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="text-gray-500 text-xs mt-0.5">
                                {item.session} - {item.coach} - {item.time}
                            </span>
                        </div>

                        {/* الصورة أقصى اليمين */}

                        <div className="flex  items-center justify-between ml-3 gap-2">
                            <CheckIcon className="w-5 h-5 text-green-500 cursor-pointer" />

                            <XMarkIcon className="w-5 h-5 text-red-500 cursor-pointer mb-1" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// مثال للاستخدام
const items = [
    {
        name: "فاطمة علي",
        avatar: "https://i.pravatar.cc/150?img=32",
        session: "حصة يوغا",
        coach: "سجي أحمد",
        time: "3:00 - 4:00",
    },
    {
        name: "خالد السالم",
        avatar: "https://i.pravatar.cc/150?img=33",
        session: "حصة بيلاتس",
        coach: "ريم الحربي",
        time: "4:00 - 5:00",
    },
    {
        name: "أحمد محمد",
        avatar: "https://i.pravatar.cc/150?img=34",
        session: "حصة كارديو",
        coach: "عمر السعيد",
        time: "5:00 - 6:00",
    },
];

export default function App() {
    return <WaitingList items={items} />;
}

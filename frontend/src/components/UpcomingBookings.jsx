import React from "react";
import User1 from "../img/User1.svg";
import User2 from "../img/User2.svg";
import User3 from "../img/User3.svg";

const bookings = [
    {
        time: "8:00 - 9:00 ص",
        date: "10/8",
        users: [User1, User2, User3, User2, User1],
        maxUsers: 8,
    },
    {
        time: "9:00 - 10:00 ص",
        date: "10/8",
        users: [User1, User2, User3, User2, User1],
        maxUsers: 8,
    },
    {
        time: "10:00 - 11:00 ص",
        date: "10/8",
        users: [User1, User2, User3, User2, User1],
        maxUsers: 8,
    },
];

export default function UpcomingBookings() {
    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-lg text-black font-semibold mb-4">حجوزاتك القادمة</h2>
            <div className="space-y-3">
                {bookings.map((booking, idx) => (
                    <div
                        key={idx}
                        className="items-center p-3 bg-gray-50 rounded-xl shadow-sm"
                    > {/* الوسط: الحصة */}
                        <p className="text-sm font-medium text-gray-700">
                            حصة قوة للمتقدمين
                        </p>
                        <div className="div">

                            <div className="text-right text-gray-500 text-sm flex flex-col items-end gap-0.5">
                                <span>{booking.date}</span>
                                <span className="flex items-center gap-1">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 0C12.4183 1.61064e-08 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 1.61069e-08 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM8 4.2793C7.589 4.2793 7.25586 4.61243 7.25586 5.02344V8C7.25586 8.19737 7.33407 8.38681 7.47363 8.52637L8.96191 10.0146C9.25254 10.3053 9.72403 10.3053 10.0146 10.0146C10.3053 9.72403 10.3053 9.25254 10.0146 8.96191L8.74414 7.69141V5.02344C8.74414 4.61243 8.411 4.2793 8 4.2793Z" fill="var(--color-purple)" />
                                    </svg>

                                    {booking.time}
                                </span>
                            </div>
                             <div className=" items-center space-x-2">
                            <div className="flex -space-x-2">
                                <span className="text-sm flex items-center gap-1 text-gray-600">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.39992 2.40706C5.36659 2.97373 4.65993 4.07366 4.65993 5.33366C4.65993 6.00699 4.85992 6.64033 5.20658 7.16699C3.87992 7.10033 2.8266 6.00699 2.8266 4.66699C2.8266 3.32699 3.9466 2.16699 5.3266 2.16699C5.7066 2.16699 6.07326 2.25373 6.39992 2.40706ZM5.51992 8.16699C3.86658 8.66033 2.66659 10.187 2.66659 12.0003V13.167H1.33325C1.05992 13.167 0.833252 12.9403 0.833252 12.667V11.3337C0.833252 9.58699 2.25325 8.16699 3.99992 8.16699H5.51992ZM7.99992 2.83366C6.61992 2.83366 5.49992 3.95366 5.49992 5.33366C5.49992 6.71366 6.61992 7.83366 7.99992 7.83366C9.37992 7.83366 10.4999 6.71366 10.4999 5.33366C10.4999 3.95366 9.37992 2.83366 7.99992 2.83366ZM6.66658 8.83366C4.91992 8.83366 3.49992 10.2537 3.49992 12.0003V13.3337C3.49992 13.607 3.72659 13.8337 3.99992 13.8337H11.9999C12.2733 13.8337 12.4999 13.607 12.4999 13.3337V12.0003C12.4999 10.2537 11.0799 8.83366 9.33325 8.83366H6.66658ZM13.1666 4.66699C13.1666 6.00699 12.1133 7.10033 10.7866 7.16699C11.1333 6.64033 11.3333 6.00699 11.3333 5.33366C11.3333 4.07366 10.6333 2.97373 9.59326 2.40706C9.91993 2.25373 10.2799 2.16699 10.6666 2.16699C12.0466 2.16699 13.1666 3.28699 13.1666 4.66699ZM14.6666 13.167H13.3333V12.0003C13.3333 10.187 12.1333 8.66033 10.4799 8.16699H11.9999C13.7466 8.16699 15.1666 9.58699 15.1666 11.3337V12.667C15.1666 12.9403 14.9399 13.167 14.6666 13.167Z" fill="var(--color-purple)" />
                                    </svg>

                                    {booking.users.length}/{booking.maxUsers}
                                </span>
                                {booking.users.map((user, i) => (
                                    <img
                                        key={i}
                                        src={user}
                                        alt="user"
                                        className="w-8 h-8 rounded-full border-2 border-white"
                                    />
                                ))}
                            </div>

                        </div>

                        </div>





                       
                    </div>
                ))}
            </div>
        </div>
    );
}

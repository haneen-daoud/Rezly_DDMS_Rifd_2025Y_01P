import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div
      className="
        flex flex-col justify-between px-4 py-4 rounded-[16px] 
        bg-white sm:bg-white lg:bg-white 
        shadow-none sm:shadow-[0_2px_8px_rgba(0,0,0,0.08)] 
        transition-all
        min-h-[125px]
      "
    >
      <div className="flex w-full justify-between items-center">
        <p className="text-black text-[13px] font-cairo font-[700] leading-[18px]">
          {title}
        </p>
        <img src={icon} alt={title} className="w-[46px] h-[46px]" />
      </div>
      <p className="text-[24px] font-bold text-black mt-2">{value}</p>
    </div>
  );
};

export default StatCard;

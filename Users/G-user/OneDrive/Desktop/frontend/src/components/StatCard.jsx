import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="flex flex-col items-start  px-4 py-6 gap-[10px] rounded-xl shadow bg-white">
      
      <div className="flex w-full justify-between items-start">
        <p className="text-black text-[12px] py-1 font-cairo leading-[18px] break-words font-[700]">{title}</p>
        <img src={icon} alt={title} className="w-[46px] h-[48px]" />
      </div>

      <p className="text-[28px] font-bold text-black">{value}</p>
    </div>
  );
};

export default StatCard;

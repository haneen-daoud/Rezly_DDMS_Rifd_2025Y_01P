import React from "react";

export default function TextField({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
}) {
  const inputProps = {};
  if (name !== undefined) inputProps.name = name;
  if (value !== undefined) inputProps.value = value;
  if (onChange) inputProps.onChange = onChange;

  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-[14px] font-bold text-[#000000] mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...inputProps}
        className="h-[42px] w-full rounded-[8px] border border-[#D1D5DB] p-3 text-[14px] text-black font-normal
             placeholder:text-[12px] placeholder:text-[#7E818C] bg-white
                   focus:outline-none focus:border-[var(--color-purple)] focus:ring-1 focus:ring-[var(--color-purple)]"
      />
    </div>
  );
}

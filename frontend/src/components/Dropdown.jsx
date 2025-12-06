import React, { useState, useRef, useEffect } from "react";
import DownArrowIcon from "../icons/downarrow.svg";

export default function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = "اختر...",
  className = "", // تحكم بالـ container (العرض)
  disabled = false,
  fieldClassName = "", // ستايل الحقل نفسه (tailwind)
  menuClassName = "", // ستايل المنيو (tailwind)
  hideArrow = false, // جديد: عشان نقدر نخفي السهم في TimeRangePicker بس
}) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const containerRef = useRef(null);
  const menuRef = useRef(null);

  // دعم options كـ string أو object { value, label }
  const getOptionValue = (opt) =>
    typeof opt === "string" ? opt : opt?.value ?? "";

  const getOptionLabel = (opt) =>
    typeof opt === "string" ? opt : opt?.label ?? opt?.value ?? "";

  const selectedOption = options.find(
    (opt) => getOptionValue(opt) === value
  );

  const label = selectedOption ? getOptionLabel(selectedOption) : placeholder;

  const toggleOpen = () => {
    if (disabled) return;

    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }

    setOpen((prev) => !prev);
  };

  const handleSelect = (val) => {
    if (onChange) {
      onChange(val);
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      const container = containerRef.current;
      const menu = menuRef.current;

      if (
        container &&
        !container.contains(e.target) &&
        (!menu || !menu.contains(e.target))
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* الحقل */}
      <div
        ref={containerRef}
        className={`custom-select-container ${className}`}
      >
        <div
          className={`${fieldClassName} ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
          onClick={toggleOpen}
        >
          <span className="flex-1 text-right">{label}</span>

          {!hideArrow && (
            <span className="custom-arrow flex items-center justify-center ml-2">
              <img src={DownArrowIcon} alt="اختر" />
            </span>
          )}
        </div>
      </div>

      {/* المنيو */}
      {open && (
        <div
          ref={menuRef}
          className={`custom-menu ${menuClassName}`}
          style={{
            position: "fixed",
            top: menuPosition.top,
            left: menuPosition.left,
            width: menuPosition.width,
          }}
        >
          {options.map((opt) => {
            const optValue = getOptionValue(opt);
            const optLabel = getOptionLabel(opt);
            const key = optValue || optLabel;

            return (
              <div
                key={key}
                className={`custom-option ${
                  value === optValue ? "selected" : ""
                }`}
                onClick={() => handleSelect(optValue)}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

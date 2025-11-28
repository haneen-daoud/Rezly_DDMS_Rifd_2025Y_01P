import React, { useState, useEffect, useRef } from "react";
import downarrowIcon from "../../icons/downarrow.svg";
import AddCircleIcon from "../../icons/addcircle.svg?react";
import SearchIcon from "../../icons/search.svg?react";
import XIcon from "../../icons/x.svg?react";
import LocationIcon from "../../icons/location.svg?react";

export default function LocationSelector({
  selectedLocation,
  setSelectedLocation,
  locationsList = [],
  borderColor = "#7E818C",
  placeholderColor = "text-black",
  showIcon = true,
  showLabel = true,
  variant = "booking",
}) {
  const [openLocation, setOpenLocation] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [localList, setLocalList] = useState(locationsList || []);
  const ref = useRef(null);

  // لإدخال القيمة المختارة داخل القائمة لو ناقصة (بدون تكرار)
  const ensureIncluded = (list, value) => {
    if (!value) return Array.isArray(list) ? list : [];
    const base = Array.isArray(list) ? list : [];
    const normalized = base.map((l) => String(l).trim().toLowerCase());
    const target = String(value).trim().toLowerCase();
    if (normalized.includes(target)) return base;
    return [...base, String(value).trim()];
  };

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenLocation(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setLocalList((prev) => ensureIncluded(locationsList, selectedLocation));
  }, [locationsList]);

  useEffect(() => {
    setLocalList((prev) => ensureIncluded(prev, selectedLocation));
  }, [selectedLocation]);

  // اختيار القاعة
  const handleSelect = (location) => {
    setSelectedLocation(location);
    setOpenLocation(false);
    setSearchText("");
  };

  // إضافة قاعة جديدة وتظهر فوراً ومحددة
  const handleAddNew = () => {
    const newRoom = searchText.trim();
    if (!newRoom) return;
    if (newRoom.length > 10) {
      return;
    }

    // نضيفها آخر القائمة
    setLocalList((prev) => [...prev, newRoom]);
    setLocalList((prev) => ensureIncluded(prev, newRoom));
    setSelectedLocation(newRoom);
    setSearchText("");
    setOpenLocation(false);
  };

  // فلترة القاعات
  const filteredList = (localList || []).filter((loc) =>
    String(loc).toLowerCase().includes(searchText.toLowerCase())
  );

  const isSame = (a, b) =>
    String(a || "")
      .trim()
      .toLowerCase() ===
    String(b || "")
      .trim()
      .toLowerCase();

  return (
    <div ref={ref} className="relative w-full">
      {showLabel && (
        <label className="block font-bold text-sm mb-2">القاعة</label>
      )}

      {/* الحقل الرئيسي */}
      <div
        className="w-full h-10 rounded-md flex items-center justify-between cursor-pointer p-3 relative"
        onClick={() => setOpenLocation(!openLocation)}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <div className="flex items-center gap-2">
          {showIcon && (
            <LocationIcon className="w-4 h-4 text-[var(--color-purple)]" />
          )}
          <span
            className={`${
              selectedLocation
                ? variant === "event"
                  ? "font-bold text-[14px] text-[#000]"
                  : "font-normal text-[14px] text-[#000]"
                : `${placeholderColor} font-normal text-[14px]`
            }`}
          >
            {selectedLocation || "اختر المكان"}
          </span>
        </div>
        <img
          src={downarrowIcon}
          alt="downarrow"
          className="w-4 h-4 pointer-events-none"
        />
      </div>

      {/* القائمة */}
      {openLocation && (
        <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-300 mt-1 shadow-lg z-50 text-[#000000]">
          <div className="p-3">
            {/* مربع البحث */}
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="ابحث عن قاعة..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                maxLength={10}
                className="w-full h-8 rounded-md pr-8 pl-8 border border-gray-200 focus:outline-none text-gray-800 placeholder-gray-400 text-[12px]"
              />
              <SearchIcon className="absolute top-1/2 right-2 -translate-y-1/2 w-4 h-4 text-[var(--color-purple)]" />
              {searchText && (
                <XIcon
                  className="absolute top-1/2 left-2 -translate-y-1/2 w-3.5 h-3.5 cursor-pointer opacity-80 hover:opacity-100 text-[var(--color-purple)]"
                  onClick={() => setSearchText("")}
                />
              )}
            </div>

            {/* خيار الإضافة */}
            {searchText &&
              !(localList || [])
                .map((l) => String(l).trim().toLowerCase())
                .includes(searchText.trim().toLowerCase()) && (
                <div
                  onClick={handleAddNew}
                  className="flex items-center gap-2 mb-2 cursor-pointer px-2 py-1 hover:bg-gray-100 rounded-md"
                >
                  <AddCircleIcon className="w-4 h-4 text-[var(--color-purple)]" />
                  <span className="text-gray-800 text-[12px] font-normal">
                    إضافة "{searchText}"
                  </span>
                </div>
              )}

            {/* القاعات */}
            {filteredList.length > 0 ? (
              filteredList.map((location, idx) => {
                const selected = isSame(selectedLocation, location);
                return (
                  <div
                    key={`${String(location)}-${idx}`}
                    onClick={() => handleSelect(location)}
                    className={`flex items-center justify-between h-[32px] px-3 py-1 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                      selected ? "font-semibold text-black" : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <LocationIcon className="w-4 h-4 text-[var(--color-purple)]" />
                      <span
  className={`text-[12px] text-[#000] ${
    selected ? "font-bold" : "font-normal"
  }`}
>
  {location}
</span>

                    </div>
                    <div
                      className={`w-4 h-4 flex items-center justify-center rounded-full border-2 border-[var(--color-purple)]`}
                    >
                      {selected && (
                        <div className="w-2 h-2 rounded-full bg-[var(--color-purple)]"></div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-400 text-center text-[12px] py-2">
                لا توجد قاعات مطابقة
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function DropdownPortal({
  anchorRef,      // ref لمكان الانبوت (element)
  isOpen,
  onClose,
  children,
  maxHeight = 360, // px
  margin = 8,
  zIndex = 9999,
}) {
  const [style, setStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
    transformOrigin: "top",
    maxHeight: maxHeight,
  });

  useEffect(() => {
    if (!isOpen) return;

    function updatePosition() {
      const anchor = anchorRef?.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      const viewportHeight = window.innerHeight;

      // available space
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      let placeAbove = false;
      // إذا المساحة تحت أقل من نصف الارتفاع المسموح لكن فوق أكثر → نعرض فوق
      if (spaceBelow < Math.min(180, maxHeight / 2) && spaceAbove > spaceBelow) {
        placeAbove = true;
      }

      let computedTop;
      if (placeAbove) {
        // نحاول نعرض فوق العنصر
        const topCandidate = scrollY + rect.top - maxHeight - margin;
        // إذا topCandidate صغير جداً خليه 8px من فوق
        computedTop = Math.max(topCandidate, scrollY + 8);
      } else {
        // عرض تحت العنصر
        computedTop = scrollY + rect.bottom + margin;
      }

      setStyle({
        top: computedTop,
        left: scrollX + rect.left,
        width: rect.width,
        transformOrigin: placeAbove ? "bottom" : "top",
        maxHeight,
      });
    }

    // حدث أولي
    updatePosition();

    // حدث عند التمرير أو تغيير الحجم
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, anchorRef, maxHeight, margin]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40"
      onMouseDown={(e) => {
        // أي ضغط برا يغلق القايمة
        onClose?.();
      }}
      style={{ pointerEvents: "auto" }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()} // يمنع إغلاق لما تضغط داخل القائمة
        className="bg-white rounded-[12px] border shadow-[0_6px_20px_rgba(0,0,0,0.18)] overflow-hidden"
        style={{
          position: "absolute",
          top: style.top,
          left: style.left,
          width: style.width,
          maxHeight: style.maxHeight,
          overflowY: "auto",
          zIndex,
          transformOrigin: style.transformOrigin,
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

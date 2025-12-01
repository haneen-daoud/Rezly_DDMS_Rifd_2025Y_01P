const selectStyles = {
  control: (base) => ({
    ...base,
    height: "42px",
    borderRadius: "8px",
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    boxShadow: "none",
    fontFamily: "Cairo",
    fontSize: "12px",
    "&:hover": { borderColor: "#6A0EAD" },
    cursor: "pointer",
    padding: "2px 2px",
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    borderColor: "#6A0EAD",
  }),

  // 👈 هذا اللي أضفناه
  menuList: (base) => ({
    ...base,
    maxHeight: "160px",   // أقصى ارتفاع للمنيو قبل ما يطلع سكرول
    overflowY: "auto",    // تفعيل السكرول العمودي
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#6A0EAD"
      : state.isFocused
      ? "#E1CFEF"
      : "#fff",
    color: state.isSelected ? "#fff" : "#111827",
    fontSize: "12px",
    fontFamily: "Cairo",
    borderRadius: "8px",
  }),
};

export default selectStyles;

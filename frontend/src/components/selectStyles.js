const selectStyles = {
  control: (base) => ({
    ...base,
    height: "40px",
    borderRadius: "12px",
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    boxShadow: "none",
    fontFamily: "Cairo",
    fontSize: "12px",
    padding: "2px 8px",
    "&:hover": { borderColor: "#6A0EAD" },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    marginTop: 4,
    borderColor: "#6A0EAD",
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
  }),
};

export default selectStyles;

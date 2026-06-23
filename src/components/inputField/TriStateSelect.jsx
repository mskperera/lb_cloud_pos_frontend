import React from "react";
import Select from "./Select";

const TriStateSelect = ({
  id,
  label,
  value,
  onChange,
  trueLabel = "True",
  falseLabel = "False",
  allLabel = "All",
  className = "",
}) => {
  const selectedValue = value === null ? "" : value === true ? "true" : "false";

  const handleChange = (e) => {
    const rawValue = e.target.value;
    onChange(rawValue === "true" ? true : rawValue === "false" ? false : null);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <Select
        id={id}
        value={selectedValue}
        onChange={handleChange}
        className="w-full px-3.5 py-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-2xl shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition duration-200"
      >
        <option value="">{allLabel}</option>
        <option value="true">{trueLabel}</option>
        <option value="false">{falseLabel}</option>
      </Select>
    </div>
  );
};

export default TriStateSelect;

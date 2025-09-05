import React from "react";

const DropdownField = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  isDisabled = false,
  required = false,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
        value={value}
        onChange={onChange}
        disabled={isDisabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id} className="">
            {option.displayName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownField;
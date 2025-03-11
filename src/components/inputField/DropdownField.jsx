import React from "react";

const DropdownField = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  isDisabled = false,
  required = false, // Default is optional
}) => {
  return (
    <div className="flex flex-col">
      <label className="label" htmlFor={id}>
        <span className="label-text text-lg">
          {label}{" "}
          {required && <span className="text-red-500">*</span>} {/* Star for required */}
        </span>
      </label>
      <select
        id={id}
        className="select select-bordered w-full"
        value={value}
        onChange={onChange}
        disabled={isDisabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id} className="text-lg">
            {option.displayName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownField;

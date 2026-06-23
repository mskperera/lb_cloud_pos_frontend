import React from "react";

const TextAreaField = ({
  label,
  value,
  onChange,
  validationMessages,
  placeholder = "",
  isDisabled = false,
  isReadOnly = false,
  required = false,
  rows = 4,
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        className={`w-full px-3 py-2  text-gray-700 border border-gray-300 
    rounded-lg outline-gray-400 duration-150 placeholder:text-gray-500 ${
          isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        readOnly={isReadOnly}
        rows={rows}
      />
      {validationMessages && (
        <span className="text-red-500 text-sm mt-1">{validationMessages}</span>
      )}
    </div>
  );
};

export default TextAreaField;
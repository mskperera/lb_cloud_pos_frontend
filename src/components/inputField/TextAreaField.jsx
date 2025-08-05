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
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        className={`w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 ${
          isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        readOnly={isReadOnly}
      />
      {validationMessages && (
        <span className="text-red-500 text-sm mt-1">{validationMessages}</span>
      )}
    </div>
  );
};

export default TextAreaField;
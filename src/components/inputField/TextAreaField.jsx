import React from "react";

const TextAreaField = ({
  label,
  value,
  onChange,
  validationMessages,
  placeholder = "",
  isDisabled = false,
  isReadOnly = false,
  required = false, // Default to optional
}) => {
  return (
    <div className="flex flex-col">
      <label className="label">
        <span className="label-text text-lg">
          {label}{" "}
          {required && <span className="text-red-500">*</span>} {/* Star for required */}
        </span>
      </label>
      <textarea
        className="textarea textarea-bordered w-full"
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

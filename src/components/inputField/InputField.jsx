import React from "react";

const InputField = ({
  label,
  value,
  onChange,
  validationMessages,
  placeholder = "",
  isDisabled = false,
  isReadOnly = false,
  type = "text",
  required = false, // Default is optional
}) => {
  return (
    <div className="flex flex-col">
      <label className="label">
        <span className="label-text text-lg">
          {label}{" "}
          {required && <span className="text-red-500">*</span>} {/* Star for required */}
        </span>
      </label>
      <input
        type={type}
        className="input input-bordered w-full"
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

export default InputField;


// import React from "react";

// const InputField = ({
//   label,
//   value,
//   onChange,
//   validationMessages,
//   placeholder = "",
//   isDisabled = false,
//   isReadOnly=false,
//   type = "text",
// }) => {
//   return (
//     <div className="flex flex-col">
//       <label className="label">
//         <span className="label-text text-lg">{label}</span>
//       </label>
//       <input
//         type={type}
//         className="input input-bordered w-full"
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         disabled={isDisabled}
//         readOnly={isReadOnly}
//       />
//       {validationMessages}
//     </div>
//   );
// };

// export default InputField;

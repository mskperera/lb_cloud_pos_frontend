import React from "react";

const InputField = ({
  id,
  label,
  value,
  onChange,
  validationMessages,
  placeholder = "",
  isDisabled = false,
  isReadOnly = false,
  type = "text",
  required = false,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={id} className=" font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white ${
          isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
        } ${isReadOnly ? "bg-gray-50 cursor-default" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        readOnly={isReadOnly}
      />
      {validationMessages && (
        <span className="text-red-500 text-xs mt-1 animate-fade-in">
          {validationMessages}
        </span>
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



const CheckBox = ({ id, checked, onChange, label, size = "medium", className = "" }) => {
  const sizeClasses = size === "small" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        id={id}
        className={`${sizeClasses} text-sky-600 border-gray-300 rounded focus:ring-sky-500`}
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={id} className="font-medium text-gray-700 text-sm">
        {label}
      </label>
    </div>
  );
};

export default CheckBox;
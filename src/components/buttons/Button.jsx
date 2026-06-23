import React from "react";

const VARIANT_CLASSES = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  success: "bg-green-600 text-white hover:bg-green-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
  warning: "bg-yellow-500 text-black hover:bg-yellow-600",
  default: "bg-white border border-[#E5E5EA] text-gray-700 hover:bg-gray-50",
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  type = "button",
  disabled = false,
  ...rest
}) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES["default"];

  const base =
    "rounded-full shadow-sm px-6 py-3 sm:px-10 sm:py-3.5 font-semibold flex items-center justify-center gap-2 transition-colors";

  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variantClass} ${disabledClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

import React from "react";
import PropTypes from "prop-types";

const GhostButton = ({
  onClick,
  iconClass,
  label,
  className,
  hoverClass,
  style,
  color,
  tooltip,
  disabled,
  labelClass = "",
}) => {
  return (
    <div className="relative flex group m-0 p-0">
      <button
        type="button"
        className={`flex items-center p-0 m-0 ${color} ${
          disabled ? "text-gray-400 cursor-not-allowed" : `${hoverClass}`
        } ${className}`}
        onClick={onClick}
        style={style}
        disabled={disabled}
      >
        <i className={`${iconClass}`}></i>
        {label && <span className={`ml-1 mt-1 ${labelClass}`}>{label}</span>}
      </button>

      {tooltip && !disabled && (
        <div
          className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 text-sm font-normal bg-white text-black rounded-lg shadow-md py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-48"
        >
          {tooltip}
        </div>
      )}
    </div>
  );
};


export default GhostButton;
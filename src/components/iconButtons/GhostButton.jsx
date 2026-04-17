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
          className="absolute left-1/2 bottom-full mb-2 z-50 w-max max-w-xs px-3 py-1 rounded bg-gray-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-lg transform -translate-x-1/2 transition-opacity duration-200"
          role="tooltip"
        >
          {tooltip}
        </div>
      )}
    </div>
  );
};


export default GhostButton;
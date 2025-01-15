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
}) => {
  return (
<div className="relative group">
  <button
    className={`flex items-center btn btn-ghost p-0 m-0 ${color} ${hoverClass} ${className}`}
    onClick={onClick}
    style={style}
  >
    <i className={`${iconClass} text-xl`}></i>
    {label && <span className="ml-2">{label}</span>}
  </button>

  {tooltip && (
    <div
      className="absolute z-50 left-1/2 transform -translate-x-1/2 mt-2 bg-white text-black rounded-lg shadow py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-48"
      style={{ marginTop: "5px" }}
    >
      {tooltip}
    </div>
  )}
</div>

  );
};

GhostButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  iconClass: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  hoverClass: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.string,
  tooltip: PropTypes.string,
};

GhostButton.defaultProps = {
  label: "",
  className: "",
  hoverClass: "hover:text-primaryColorHover",
  style: {},
  color: "text-gray-600",
  tooltip: "",
};

export default GhostButton;

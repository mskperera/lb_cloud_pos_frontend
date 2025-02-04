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
    <div className="relative group flex m-0 p-0">
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
          className="absolute z-50 left-1/2 transform -translate-x-1/2 mt-2 font-normal text-sm bg-white text-black rounded-lg shadow py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-48"
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
  disabled: PropTypes.bool,
};

GhostButton.defaultProps = {
  label: "",
  className: "",
  hoverClass: "hover:text-primaryColorHover",
  style: {},
  color: "text-gray-600",
  tooltip: "",
  disabled: false,
};

export default GhostButton;


// import React from "react";
// import PropTypes from "prop-types";

// const GhostButton = ({
//   onClick,
//   iconClass,
//   label,
//   className,
//   hoverClass,
//   style,
//   color,
//   tooltip,
//   disabled,
//   labelClass=''
// }) => {
//   return (
// <div className="relative group flex m-0 p-0 ">
//   <button
//   type="button"
//     className={`flex items-center p-0 m-0 ${color} ${hoverClass} ${className}`}
//     onClick={onClick}
//     style={style}
//     disabled={disabled}
//   >
//     <i className={`${iconClass} `}></i>
//     {label && <span className={`ml-1 mt-1 ${labelClass} `}>{label}</span>}
//   </button>

//   {tooltip && (
//     <div
//       className="absolute z-50 left-1/2 transform -translate-x-1/2 mt-2 font-normal text-sm bg-white text-black rounded-lg shadow py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-48"
//       style={{ marginTop: "5px" }}
//     >
//       {tooltip}
//     </div>
//   )}
// </div>

//   );
// };

// GhostButton.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   iconClass: PropTypes.string.isRequired,
//   label: PropTypes.string,
//   className: PropTypes.string,
//   hoverClass: PropTypes.string,
//   style: PropTypes.object,
//   color: PropTypes.string,
//   tooltip: PropTypes.string,
// };

// GhostButton.defaultProps = {
//   label: "",
//   className: "",
//   hoverClass: "hover:text-primaryColorHover",
//   style: {},
//   color: "text-gray-600",
//   tooltip: "",
// };

// export default GhostButton;

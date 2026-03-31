import React from "react";
import PropTypes from "prop-types";
import LeftArrowIcon from "./icons/LeftArrowIcon";

const BackButton = ({ onClick, title = "Go Back", icon: Icon = LeftArrowIcon, size = "md" }) => {
  // Size variants with tailwind classes
  const sizeClasses = {
    sm: {
      padding: "p-1.5",
      iconSize: "h-4 w-4",
    },
    md: {
      padding: "p-2.5",
      iconSize: "h-5 w-5",
    },
    lg: {
      padding: "p-3",
      iconSize: "h-6 w-6",
    },
    xl: {
      padding: "p-4",
      iconSize: "h-7 w-7",
    },
  };

  const sizeConfig = sizeClasses[size] || sizeClasses.md;

  return (
    <button
      onClick={onClick}
      className={`group  flex items-center justify-center ${sizeConfig.padding}  rounded-full
       text-gray-700 font-semibold  hover:shadow-md hover:border-gray-300 hover:bg-gray-50 
       transition-all duration-200 ease-out active:scale-95`}
      title={title}
    >
      <Icon className={`${sizeConfig.iconSize} text-sky-600 group-hover:text-sky-700 transition-colors duration-200`} />
    </button>
  );
};

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  icon: PropTypes.elementType,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
};

BackButton.defaultProps = {
  title: "Go Back",
  icon: LeftArrowIcon,
  size: "md",
};

export default BackButton;

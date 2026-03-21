import React, { useState, useEffect, useRef } from "react";
import { FaDownload, FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";

const ExportDropdown = ({ disabled = false, menuItems = [] }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={disabled}
        className="px-6 py-2.5 bg-[#ffffff] text-gray-700 font-semibold rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-60 flex items-center gap-2"
      >
        <FaDownload />
        Export <FaChevronDown />
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                item.onClick();
                setShowDropdown(false);
              }}
              className={`block w-full text-left px-4 py-2 ${item.className || "hover:bg-gray-100"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

ExportDropdown.propTypes = {
  disabled: PropTypes.bool,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string,
    })
  ),
};

ExportDropdown.defaultProps = {
  disabled: false,
  menuItems: [],
};

export default ExportDropdown;
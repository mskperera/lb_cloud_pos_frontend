import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
import PropTypes from "prop-types";

const MoreMenu = ({ disabled, menuItems }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        type="button"
        className="px-3 py-2 bg-white text-gray-700 font-semibold rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-60 flex items-center gap-1"
      >
        <FaEllipsisV />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setOpen(false);
                item.onClick();
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

MoreMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string,
    })
  ).isRequired,
  disabled: PropTypes.bool,
};

MoreMenu.defaultProps = {
  disabled: false,
};
MoreMenu.defaultProps = {
  disabled: false,
};

export default MoreMenu;

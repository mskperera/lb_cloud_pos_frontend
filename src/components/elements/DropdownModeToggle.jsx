import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const DropdownModeToggle = ({
  items = [],
  activeItemId,
  onSelect,
  isMobile = false,
  className = '',
  buttonClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  // Find active item configuration or fallback to first item
  const activeItem = items.find((item) => item.id === activeItemId) || items[0];
  const ActiveIcon = activeItem?.icon;

  const handleToggleClick = (e) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (item, e) => {
    e.stopPropagation();
    setIsOpen(false);

    // Execute item specific action handler if provided
    if (typeof item.onClick === 'function') {
      item.onClick(item, e);
    }

    // Fire global state selection callback
    if (typeof onSelect === 'function') {
      onSelect(item.id, item, e);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!items || items.length === 0) return null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <div ref={buttonRef}>
        <button
          type="button"
          onClick={handleToggleClick}
          className={`flex items-center gap-2.5 px-4 py-3 font-semibold text-gray-800 hover:bg-black/5 transition-all focus:outline-none ${buttonClassName}`}
        >
          {ActiveIcon && (
            <ActiveIcon
              className={`text-xl ${activeItem?.iconColor || 'text-gray-700'}`}
            />
          )}

          {!isMobile && activeItem?.label && (
            <span className="text-xs font-bold tracking-widest uppercase">
              {activeItem.label}
            </span>
          )}

          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Multipurpose Dropdown Portal / Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-50 animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden min-w-[200px] py-1.5 animate-in zoom-in-95 duration-150"
            style={{
              top: `${menuPosition.top + 4}px`,
              left: `${menuPosition.left}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item) => {
              const ItemIcon = item.icon;
              const isActive = item.id === activeItemId;

              return (
                <button
                  key={item.id || item.label}
                  type="button"
                  onClick={(e) => handleItemClick(item, e)}
                  disabled={item.disabled}
                  className={`flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                    item.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : isActive
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {ItemIcon && (
                      <ItemIcon
                        className={`text-lg ${
                          item.iconColor || 'text-gray-600'
                        }`}
                      />
                    )}
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownModeToggle;
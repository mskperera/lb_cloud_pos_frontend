import React from "react";
import { FaTimes } from "react-icons/fa";

/**
 * Reusable Modal/Popup window
 * Props:
 * - visible: boolean
 * - onClose: function
 * - title: string or ReactNode (optional)
 * - children: content
 * - maxWidth: string (e.g. 'max-w-4xl' or 'max-w-2xl')
 * - className: extra classes for modal panel
 */
export default function Modal({
  visible,
  onClose,
  title,
  children,
  maxWidth = "max-w-4xl",
  className = "",
}) {
  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between py-2 pl-6 pr-2 border-b border-gray-200 bg-gradient-to-r from-slate-200 to-slate-200 text-gray-600">
            <h3 className="text-xl font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="p-3 rounded-full hover:text-red-500 transition-all duration-200"
              aria-label="Close"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        )}
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

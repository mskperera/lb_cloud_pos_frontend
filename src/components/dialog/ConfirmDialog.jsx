import React from 'react';
import PropTypes from 'prop-types';

function ConfirmDialog({ message, onConfirm, onCancel, isVisible, title, severity }) {
  // Define color classes based on severity
  const severityClasses = {
    success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-800',
        warning: 'bg-orange-400 text-white',
        info: 'bg-blue-100 text-blue-800'
  };

  const severityClassesText = {
    success: 'text-green-800',
        danger: 'text-red-800',
        warning: 'text-orange-400',
        info: 'text-blue-800'
  };

  // Assign a default class if severity is not provided
  const severityClass = severityClasses[severity] || 'bg-gray-500 text-white';
  const severityClasseText = severityClassesText[severity] || 'text-gray-500';

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black bg-opacity-50">
          <div className="modal modal-open">
            <div className={`modal-box relative`}>
              <button
                onClick={onCancel}
                className="btn btn-sm btn-circle absolute right-2 top-2"
                aria-label="Close"
              >
                ✕
              </button>
              <h3 className={`font-bold text-lg ${severityClasseText}`}>{title}</h3>
              <p className="py-4 text-defalutTextColor">{message}</p>
              <div className="modal-action">
                <button
                  onClick={onConfirm}
                  className={`btn  ${severityClass}`}
                  aria-label="Confirm"
                >
                  Confirm
                </button>
                <button
                  onClick={onCancel}
                  className="btn"
                  aria-label="Cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

ConfirmDialog.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['danger', 'success', 'warning']).isRequired,
};

export default ConfirmDialog;

import React from 'react';
import PropTypes from 'prop-types';

function FormElementMessage({ className, severity, text }) {
  // Define Tailwind CSS classes based on severity
  const severityClasses = {
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    warn: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300',
  };

  const baseClasses = 'p-3 rounded-md border flex items-center';
  const severityClass = severityClasses[severity] || severityClasses.info;

  return (
    <div className={`${baseClasses} ${severityClass} ${className || ''}`}>
      <span>{text}</span>
    </div>
  );
}

FormElementMessage.propTypes = {
  className: PropTypes.string,
  severity: PropTypes.oneOf(['info', 'success', 'warn', 'error']).isRequired,
  text: PropTypes.string.isRequired,
};

export default FormElementMessage;
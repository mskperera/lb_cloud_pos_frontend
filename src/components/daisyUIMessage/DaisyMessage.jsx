import React from 'react';
import PropTypes from 'prop-types';

function DaisyMessage({ className, severity, text }) {
  // Define base classes for the alert component
  const baseClasses = 'alert';

  // Map severity to DaisyUI classes
  const severityClasses = {
    info: 'alert-info text-white',
    success: 'alert-success text-white',
    warn: 'alert-warning text-white',
    error: 'alert-error text-white',
  };

  // Combine base classes, severity class, and additional class names
  const combinedClasses = `${baseClasses} ${severityClasses[severity]} ${className ? className : ''}`;

  return (
    <div className={combinedClasses}>
      <span>{text}</span>
    </div>
  );
}

DaisyMessage.propTypes = {
  className: PropTypes.string,
  severity: PropTypes.oneOf(['info', 'success', 'warn', 'error']).isRequired,
  text: PropTypes.string.isRequired,
};

export default DaisyMessage;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Toast = ({ messages, removeToast }) => {
  const severityClasses = {
    success: 'bg-green-100 text-green-800 border-green-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-4 border rounded-lg shadow-md ${
            severityClasses[message.severity] || severityClasses.info
          } animate-slide-in transform transition-all duration-300`}
        >
          <div className="flex flex-col">
            <span className="font-semibold">{message.summary}</span>
            <span className="text-sm">{message.detail}</span>
          </div>
          <button
            className="p-1 rounded-full hover:bg-gray-200 hover:bg-opacity-50"
            onClick={() => removeToast(index)}
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
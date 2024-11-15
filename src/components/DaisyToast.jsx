import React from 'react';

const DaisyToast = ({ messages, removeToast }) => {
    // Map of severity to DaisyUI alert background classes
    const severityClasses = {
        success: 'bg-green-100 text-green-800',
        danger: 'alert-error text-white',
        warning: 'bg-orange-400 text-white',
        info: 'bg-blue-100 text-blue-800'
    };

    return (
        <div className="toast toast-top toast-center mt-20 z-50">
            {messages.map((msg, index) => (
                <div key={index} className={`alert ${severityClasses[msg.severity] || 'bg-gray-100 text-gray-800'} flex items-center justify-between border-none`}>
                    <span>{msg.detail}</span>
                    <button 
                        onClick={() => removeToast(index)}
                        className="ml-2 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DaisyToast;

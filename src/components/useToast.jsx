import React, { createContext, useContext, useState } from 'react';
import DaisyToast from './DaisyToast';

// Toast Context
const ToastContext = createContext(null);

// Toast Provider Component
export const ToastProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    const showToast = (severity, summary, detail) => {
        setMessages((prev) => [...prev, { severity, summary, detail }]);
        // Automatically remove the toast after 5 seconds
        setTimeout(() => {
            setMessages((prev) => prev.slice(1)); // Adjust this if needed to match behavior
        }, 5000);
    };

    const removeToast = (index) => {
        setMessages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <ToastContext.Provider value={showToast}>
            <DaisyToast messages={messages} removeToast={removeToast} />
            {children}
        </ToastContext.Provider>
    );
};

// Custom hook to use the toast
export const useToast = () => {
    return useContext(ToastContext);
};

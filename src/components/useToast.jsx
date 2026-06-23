import React, { createContext, useContext, useState } from 'react';
import Toast from './Toast';

// Toast Context
const ToastContext = createContext(null);

// Toast Provider Component
export const ToastProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    const showToast = (severity, summary, detail) => {
        setMessages((prev) => [...prev, { severity, summary, detail }]);
        setTimeout(() => {
            setMessages((prev) => prev.slice(1));
        }, 8000);
    };

    const removeToast = (index) => {
        setMessages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <ToastContext.Provider value={showToast}>
            <Toast messages={messages} removeToast={removeToast} />
            {children}
        </ToastContext.Provider>
    );
};

// Custom hook to use the toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

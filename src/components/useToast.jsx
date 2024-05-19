import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

// Toast Context
const ToastContext = createContext(null);

// Toast Provider Component
export const ToastProvider = ({ children }) => {
    const toastRef = useRef(null);

    const showToast = (severity, summary, detail) => {
        toastRef.current.show({ severity, summary, detail });
    };

    return (
        <ToastContext.Provider value={showToast}>
            <Toast ref={toastRef} position='bottom-center' />
            {children}
        </ToastContext.Provider>
    );
};

// Custom hook to use the toast
export const useToast = () => {
    return useContext(ToastContext);
};

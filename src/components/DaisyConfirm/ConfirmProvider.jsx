import React, { createContext, useState, useContext, useCallback } from 'react';
import DaisyConfirmDialog from './DaisyConfirmDialog';

// Define ConfirmContext
const ConfirmContext = createContext();

export const useConfirm = () => {
    return useContext(ConfirmContext);
};

export const ConfirmProvider = ({ children }) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogHeader, setDialogHeader] = useState('');
    const [acceptHandler, setAcceptHandler] = useState(() => () => {});
    const [rejectHandler, setRejectHandler] = useState(() => () => {});

    // Memoize confirm to prevent unnecessary re-renders
    const confirm = useCallback((message, header, onAccept, onReject) => {
        setDialogMessage(message);
        setDialogHeader(header);
        setAcceptHandler(() => () => {
            onAccept();
            setDialogVisible(false);
        });
        setRejectHandler(() => () => {
            if (onReject) onReject();
            setDialogVisible(false);
        });
        setDialogVisible(true);
    }, []);

    return (
        <ConfirmContext.Provider value={confirm}>
            <DaisyConfirmDialog 
                visible={dialogVisible}
                message={dialogMessage}
                header={dialogHeader}
                onAccept={acceptHandler}
                onReject={rejectHandler}
            />
            {children}
        </ConfirmContext.Provider>
    );
};

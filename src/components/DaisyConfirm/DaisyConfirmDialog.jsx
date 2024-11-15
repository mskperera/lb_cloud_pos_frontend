import React from 'react';

const DaisyConfirmDialog = ({ visible, message, header, onAccept, onReject }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium">{header}</h3>
                    <button onClick={onReject} className="text-gray-400 hover:text-gray-600">
                        ×
                    </button>
                </div>
                <div className="mt-2">
                    <p>{message}</p>
                </div>
                <div className="flex justify-end mt-4">
                    <button 
                        onClick={onReject} 
                        className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onAccept} 
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DaisyConfirmDialog;

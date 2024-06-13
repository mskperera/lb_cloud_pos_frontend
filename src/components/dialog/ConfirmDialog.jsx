import React from 'react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded shadow-md">
          <p className="text-lg">{message}</p>
          <div className="mt-4 flex justify-end">
            <button onClick={onCancel} className="btn btn-secondary mr-4">Cancel</button>
            <button onClick={onConfirm} className="btn btn-primary">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

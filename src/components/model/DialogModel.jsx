import React from 'react';

const DialogModel = ({ header, visible, maximizable, maximized, onHide, children }) => {
  return (
    <div className={`fixed mb-5 inset-0 z-50 overflow-auto ${visible ? 'block' : 'hidden'}`}>
      <div className="flex m-10 items-center">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block  bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-full h-[40rem]">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <DialogHeader header={header} onHide={onHide} />
            <div className="">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DialogHeader = ({ header, onHide }) => {
  return (
    <div className="flex justify-between items-center ">
      <DialogHeaderTitle title={header} />
      <DialogCloseButton onHide={onHide} />
    </div>
  );
};

const DialogHeaderTitle = ({ title }) => {
  return <h3 className="text-lg font-medium text-gray-900">{title}</h3>;
};

const DialogCloseButton = ({ onHide }) => {
  return (
    <button
      type="button"
      onClick={onHide}
      className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
      aria-label="Close"
    >
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default DialogModel;

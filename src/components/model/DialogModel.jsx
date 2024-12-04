import React from 'react';

const DialogModel = ({
  header,
  visible,
  onHide,
  children,
  width = 'fit-content', // Default width to fit content
  height = 'fit-content', // Default height to fit content
}) => {
  return (
    <div className={`fixed mb-5 inset-0 z-50 overflow-auto ${visible ? 'block' : 'hidden'}`}>
      <div className="flex justify-center items-center ">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          className="bg-white mt-10 rounded-lg overflow-hidden shadow-xl transform transition-all"
          style={{
            width: width, // Set width dynamically
            height: height, // Set height dynamically
          }}
        >
          <div className=" ">
            <DialogHeader header={header} onHide={onHide} />
            <div className='p-2'>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DialogHeader = ({ header, onHide }) => {
  return (
    <div className="flex justify-between items-center pl-5">
      <DialogHeaderTitle title={header} />
      <DialogCloseButton onHide={onHide} />
    </div>
  );
};

const DialogHeaderTitle = ({ title }) => {
  return <h3 className="text-lg mt-3 font-medium text-gray-900">{title}</h3>;
};

const DialogCloseButton = ({ onHide }) => {
  return (
    <button
    type="button"
    onClick={onHide}
    className="text-gray-400 absolute right-0 top-0 bg-red-600 btn-sm p-0 m-0 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
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

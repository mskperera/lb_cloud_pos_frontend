import React from 'react';

const DialogModel = ({
  header,
  visible,
  onHide,
  children,
  width = 'fit-content', // Default width to fit content
  height = 'fit-content', // Default height to fit content
  fullWidth = false, // New prop for full width
  fullHeight = false, // New prop for full height
}) => {
  return (
    <div
      className={`fixed inset-0 z-40 overflow-auto transition-opacity duration-300 mt-5 ${
        visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-700 bg-opacity-75"></div>

      {/* Dialog Container */}
      <div className="flex justify-center items-center min-h-screen">
        <div
          className="bg-white rounded-xl shadow-2xl transform transition-all overflow-hidden"
          style={{
            width: fullWidth ? '100%' : width, // Use full width if fullWidth is true
            height: fullHeight ? '100%' : undefined, // Use full height if fullHeight is true
            maxWidth: fullWidth ? '100%' : '90%', // Adjust max width for responsiveness
            maxHeight: fullHeight ? '100%' : '90%', // Adjust max height for responsiveness
          }}
        >
          {/* Header */}
          <DialogHeader header={header} onHide={onHide} />

          {/* Content with auto-scroll */}
          <div
            className="p-5 overflow-y-auto"
            style={{
              height: fullHeight ? 'calc(100% - 60px)' : height, // Adjust height for fullHeight
              maxHeight: fullHeight ? '100%' : 'calc(90vh - 60px)', // Ensure content fits viewport
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const DialogHeader = ({ header, onHide }) => {
  return (
    <div className="flex justify-between items-center px-5 py-2 bg-gradient-to-r from-sky-700 to-sky-600 text-white">
      <DialogHeaderTitle title={header} />
      <DialogCloseButton onHide={onHide} />
    </div>
  );
};

const DialogHeaderTitle = ({ title }) => {
  return <h3 className="text-lg font-bold">{title}</h3>;
};

const DialogCloseButton = ({ onHide }) => {
  return (
    <button
      type="button"
      onClick={onHide}
      className="text-white hover:bg-red-500 hover:text-white rounded-full p-1 transition ease-in-out duration-200"
      aria-label="Close"
    >
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
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

// import React from 'react';

// const DialogModel = ({
//   header,
//   visible,
//   onHide,
//   children,
//   width = 'fit-content', // Default width to fit content
//   height = 'fit-content', // Default height to fit content
// }) => {
//   return (
//     <div
//       className={`fixed inset-0 z-40 overflow-auto transition-opacity duration-300 mt-5 ${
//         visible ? 'opacity-100 visible' : 'opacity-0 invisible'
//       }`}
//     >
//       {/* Backdrop */}
//       <div className="fixed inset-0 bg-gray-700 bg-opacity-75"></div>

//       {/* Dialog Container */}
//       <div className="flex justify-center items-center min-h-screen">
//         <div
//           className="bg-white rounded-xl shadow-2xl transform transition-all overflow-hidden"
//           style={{
//             width: width, // Set width dynamically
//             maxWidth: '90%', // Limit max width for responsiveness
//             maxHeight: '90%', // Limit max height for responsiveness
//           }}
//         >
//           {/* Header */}
//           <DialogHeader header={header} onHide={onHide} />

//           {/* Content with auto-scroll */}
//           <div
//             className="p-5 overflow-y-auto"
//             style={{
//               height: height, // Set height dynamically
//               maxHeight: 'calc(90vh - 60px)', // Ensure content doesn't exceed viewport height
//             }}
//           >
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DialogHeader = ({ header, onHide }) => {
//   return (
//     <div className="flex justify-between items-center px-5 py-2 bg-gradient-to-r from-sky-700 to-sky-600 text-white">
//       <DialogHeaderTitle title={header} />
//       <DialogCloseButton onHide={onHide} />
//     </div>
//   );
// };

// const DialogHeaderTitle = ({ title }) => {
//   return <h3 className="text-lg font-bold">{title}</h3>;
// };

// const DialogCloseButton = ({ onHide }) => {
//   return (
//     <button
//       type="button"
//       onClick={onHide}
//       className="text-white hover:bg-red-500 hover:text-white rounded-full p-1 transition ease-in-out duration-200"
//       aria-label="Close"
//     >
//       <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
//         <path
//           fillRule="evenodd"
//           d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
//           clipRule="evenodd"
//         />
//       </svg>
//     </button>
//   );
// };

// export default DialogModel;

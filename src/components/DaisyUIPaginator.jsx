import React from 'react';

const Paginator = ({ currentPage, rowsPerPage, totalRecords, onPageChange, rowsPerPageOptions = [] }) => {
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handlePageChange = (page) => {
    onPageChange({ page, rows: rowsPerPage });
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = Number(event.target.value);
    onPageChange({ page: 0, rows: newRowsPerPage }); // Reset to first page on rows per page change
  };

  return (
    <div className="flex items-center justify-between p-2  rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          &laquo;
        </button>
        {/* Page Buttons */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-200 ${
              index === currentPage
                ? 'bg-sky-500 text-white'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800'
            }`}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}
        {/* Next Button */}
        <button
          className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        >
          &raquo;
        </button>
      </div>

      {/* Rows per Page Dropdown */}
      {rowsPerPageOptions.length > 0 && (
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Items</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Paginator;

// import React from 'react';
// const DaisyUIPaginator = ({ currentPage, rowsPerPage, totalRecords, onPageChange, rowsPerPageOptions = [] }) => {
//   const totalPages = Math.ceil(totalRecords / rowsPerPage);

//   const handlePageChange = (page) => {
//     onPageChange({ page, rows: rowsPerPage });
//   };

//   const handleRowsPerPageChange = (event) => {
//     const newRowsPerPage = Number(event.target.value);
//     onPageChange({ page: 0, rows: newRowsPerPage }); // Reset to first page on rows per page change
//   };

//   return (
//     <div className="flex items-center space-x-4 p-0 m-0">
//       <div className="flex gap-2 items-center">
//         {/* Previous Button */}
//         <button
//           className="text-lg p-2 bg-transparent text-gray-500 px-4 hover:text-primaryColorHover hover:bg-slate-200 rounded-lg font-bold"
//           onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
//           disabled={currentPage === 0}
//         >
//           «
//         </button>
//         {/* Page Buttons */}
//         {Array.from({ length: totalPages }, (_, index) => (
//           <button
//             key={index}
//             className={`text-lg p-2 bg-transparent text-gray-500 px-4 hover:text-primaryColorHover hover:bg-slate-200 rounded-lg font-bold ${index === currentPage ? 'bg-primaryColor text-base-100' : ''}`}
//             onClick={() => handlePageChange(index)}
//           >
//             {index + 1}
//           </button>
//         ))}

//         {/* Next Button */}
//         <button
//           className="text-lg p-2 bg-transparent text-gray-500 px-4 hover:text-primaryColorHover hover:bg-slate-200 rounded-lg font-bold"
//           onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
//           disabled={currentPage === totalPages - 1}
//         >
//           »
//         </button>
//       </div>

//       {/* Rows per Page Dropdown */}
 
//       {rowsPerPageOptions.length>0&& <div className="flex items-center space-x-2">
//         <span className='text-md'>Page Size </span>
//         <select
//           value={rowsPerPage}
//           onChange={handleRowsPerPageChange}
//           className="select select-bordered select-sm text-lg"
//         >
//           {rowsPerPageOptions.map(option => (
//             <option key={option} value={option}>{option}</option>
//           ))}
//         </select>
//       </div>}
//     </div>
//   );
// };

// export default DaisyUIPaginator;

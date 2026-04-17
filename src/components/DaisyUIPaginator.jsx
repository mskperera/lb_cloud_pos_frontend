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
      
      {totalRecords > rowsPerPage &&

      <>
        {/* Previous Button */}
        <button
          className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          &laquo;
        </button>
        {/* Page Buttons */}
       

        {/* Industrial standard pagination: max 5 page buttons, always show first, last, current, and neighbors, with ellipsis as needed */}
        {(() => {
          const pageButtons = [];
          const maxButtons = 5;
          if (totalPages <= maxButtons) {
            for (let i = 0; i < totalPages; i++) {
              pageButtons.push(
                <button
                  key={i}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition duration-200 ${
                    i === currentPage
                      ? 'bg-sky-600 text-white'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800'
                  }`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              );
            }
          } else {
            // Always show first page
            pageButtons.push(
              <button
                key={0}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition duration-200 ${
                  currentPage === 0
                    ? 'bg-sky-600 text-white'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800'
                }`}
                onClick={() => handlePageChange(0)}
              >
                1
              </button>
            );

            // Show left ellipsis if needed
            if (currentPage > 2) {
              pageButtons.push(<span key="left-ellipsis" className="px-2">...</span>);
            }

            // Show up to 3 middle page buttons (current, neighbors)
            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages - 2, currentPage + 1);
            if (currentPage === 1) {
              end = Math.min(totalPages - 2, currentPage + 2);
            }
            if (currentPage === totalPages - 2) {
              start = Math.max(1, currentPage - 2);
            }
            for (let i = start; i <= end; i++) {
              pageButtons.push(
                <button
                  key={i}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition duration-200 ${
                    i === currentPage
                      ? 'bg-sky-600 text-white'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800'
                  }`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              );
            }

            // Show right ellipsis if needed
            if (currentPage < totalPages - 3) {
              pageButtons.push(<span key="right-ellipsis" className="px-2">...</span>);
            }

            // Always show last page
            pageButtons.push(
              <button
                key={totalPages - 1}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition duration-200 ${
                  currentPage === totalPages - 1
                    ? 'bg-sky-600 text-white'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800'
                }`}
                onClick={() => handlePageChange(totalPages - 1)}
              >
                {totalPages}
              </button>
            );
          }
          return pageButtons;
        })()}

        {/* Next Button */}
        <button
          className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={(currentPage === totalPages - 1) || totalRecords === 0}
        >
          &raquo;
        </button>

         </>}
      </div>
     

      {/* Rows per Page Dropdown */}
      {rowsPerPageOptions.length > 0 && (
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700"></span>
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
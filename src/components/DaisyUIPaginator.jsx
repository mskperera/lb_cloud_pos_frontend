import React from 'react';
const DaisyUIPaginator = ({ currentPage, rowsPerPage, totalRecords, onPageChange, rowsPerPageOptions = [] }) => {
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handlePageChange = (page) => {
    onPageChange({ page, rows: rowsPerPage });
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = Number(event.target.value);
    onPageChange({ page: 0, rows: newRowsPerPage }); // Reset to first page on rows per page change
  };

  return (
    <div className="flex items-center space-x-4 p-0 m-0">
      <div className="flex gap-2 items-center">
        {/* Previous Button */}
        <button
          className="text-lg p-2 bg-transparent text-gray-500 px-4 hover:text-primaryColorHover hover:bg-slate-200 rounded-lg font-bold"
          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          «
        </button>
        {/* Page Buttons */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`text-lg p-2 bg-transparent text-gray-500 px-4 hover:text-primaryColorHover hover:bg-slate-200 rounded-lg font-bold ${index === currentPage ? 'bg-primaryColor text-base-100' : ''}`}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          className="text-lg p-2 bg-transparent text-gray-500 px-4 hover:text-primaryColorHover hover:bg-slate-200 rounded-lg font-bold"
          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        >
          »
        </button>
      </div>

      {/* Rows per Page Dropdown */}
 
      {rowsPerPageOptions.length>0&& <div className="flex items-center space-x-2">
        <span className='text-md'>Page Size </span>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="select select-bordered select-sm text-lg"
        >
          {rowsPerPageOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>}
    </div>
  );
};

export default DaisyUIPaginator;

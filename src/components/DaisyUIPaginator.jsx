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
    <div className="flex items-center space-x-4">
      <div className="flex gap-2 items-center">
        {/* Previous Button */}
        <button
          className="btn btn-outline btn-sm text-lg "
          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          «
        </button>
        {/* Page Buttons */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`btn btn-outline btn-sm text-lg ${index === currentPage ? 'bg-primaryColor text-base-100' : ''}`}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          className="btn btn-outline btn-sm text-lg"
          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        >
          »
        </button>
      </div>

      {/* Rows per Page Dropdown */}
 
      {rowsPerPageOptions.length>0&& <div className="flex items-center space-x-2">
        <span className='text-lg'>Rows per page </span>
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

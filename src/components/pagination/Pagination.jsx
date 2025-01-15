import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  rowsPerPageOptions,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <div className="flex justify-center items-center mt-4">
      {/* Previous Button */}
      <button
        className={`flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 ${
          currentPage === 1
             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 text-sm rounded-md text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <span className="text-lg font-bold text-gray-500">&lt;</span>
      </button>

      {/* Page Number Buttons */}
      <div className="flex gap-2 mx-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 hover:bg-blue-200"
            }`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        className={`flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 text-sm rounded-md text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="text-lg font-bold text-gray-500">&gt;</span>
      </button>

      {/* Rows per Page Dropdown */}
      <select
        value={rowsPerPage}
        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        className="ml-4 px-4 py-2 border border-gray-300 rounded-md transition-all duration-300"
      >
        {rowsPerPageOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;

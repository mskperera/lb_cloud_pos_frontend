import React from "react";

// Table component that accepts dynamic columns and data
const TableView = ({ columns, data, title }) => {
  // Function to map alignment values to CSS classes
  const getAlignmentClass = (align) => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl mb-4">{title}</h3>
      <table className="w-full text-sm text-gray-500 bg-white border-separate border-spacing-0">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 border-b border-r border-gray-200 ${getAlignmentClass(column.align)}`} // Applying alignment class to header
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } border-b border-gray-200`}
            >
              {columns.map((column, idx) => (
                <td
                  key={idx}
                  className={`px-6 py-4 border-r border-gray-200 ${getAlignmentClass(column.align)}`} // Applying alignment class to row data
                >
                  {typeof row[column.key] === "number"
                    ? `$${row[column.key].toLocaleString()}`
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;

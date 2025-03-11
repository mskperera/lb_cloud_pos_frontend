import React, { useState, useEffect } from "react";

const ReusableTable = ({
  tableHeaders,
  reportData,
  tableBottom = null,
  actionButtons = null,
  fixedHeader = false, // New prop to toggle fixed header
}) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "categoryName",
    direction: "ascending",
  });

  useEffect(() => {
    setSortedData(reportData);
  }, [reportData]);

  const handleSort = (columnKey) => {
    let direction = "ascending";
    if (sortConfig.key === columnKey && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sorted = [...reportData].sort((a, b) => {
      if (a[columnKey] < b[columnKey]) return direction === "ascending" ? -1 : 1;
      if (a[columnKey] > b[columnKey]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortedData(sorted);
    setSortConfig({ key: columnKey, direction });
  };

  return (
    <div className="overflow-x-auto bg-white">
      <div className={`${fixedHeader ? "max-h-[400px] overflow-y-auto" : ""}`}>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className={`${fixedHeader ? "sticky top-0 bg-gray-200 z-10" : "bg-gray-200"}`}>
            <tr className="text-gray-700">
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`border border-gray-200 px-4 py-2 text-${header.alignment || "left"}`}
                >
                  {header.text}
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSort(header.key);
                    }}
                  >
                    {sortConfig.key === header.key ? (
                      sortConfig.direction === "ascending" ? "↑" : "↓"
                    ) : (
                      "↕️"
                    )}
                  </span>
                </th>
              ))}
              {actionButtons && <th className="px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((data, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100">
                {tableHeaders.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border border-gray-200 px-4 py-2 text-${header.alignment || "left"}`}
                  >
                    {data[header.key]}
                  </td>
                ))}
                {actionButtons && (
                  <td className="border border-gray-200 px-4 py-2">
                    {React.cloneElement(actionButtons, { rowData: data })}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          {tableBottom && <tfoot>{tableBottom}</tfoot>}
        </table>
      </div>
    </div>
  );
};

export default ReusableTable;




// import React, { useState, useEffect } from "react";

// const ReusableTable = ({
//   tableHeaders,
//   reportData,
//   tableBottom = null,
//   actionButtons = null,  // New prop for action buttons
// }) => {
//   const [sortedData, setSortedData] = useState([]);
//   const [sortConfig, setSortConfig] = useState({
//     key: "categoryName", // Set default column to sort by (adjust as needed)
//     direction: "ascending", // Default sort direction
//   });

//   useEffect(() => {
//     // Initially, set sorted data to the provided report data
//     setSortedData(reportData);
//   }, [reportData]); // When reportData changes, update sortedData

//   // Function to handle sorting when clicking the sorting icon
//   const handleSort = (columnKey) => {
//     let direction = "ascending";
//     if (sortConfig.key === columnKey && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }

//     const sorted = [...reportData].sort((a, b) => {
//       if (a[columnKey] < b[columnKey]) {
//         return direction === "ascending" ? -1 : 1;
//       }
//       if (a[columnKey] > b[columnKey]) {
//         return direction === "ascending" ? 1 : -1;
//       }
//       return 0;
//     });

//     setSortedData(sorted);
//     setSortConfig({ key: columnKey, direction });
//   };

//   return (
//     <table className="table-auto w-full border-collapse border border-gray-300">
//       <thead>
//         <tr className="bg-gray-200 text-gray-700">
//           {tableHeaders.map((header, index) => (
//             <th
//               key={index}
//               className={`border border-gray-300 px-4 py-2 text-${header.alignment || "left"} cursor-pointer`}
//             >
//               {header.text}
//               <span
//                 className="ml-2 cursor-pointer"
//                 onClick={(e) => {
//                   // Prevent table header click from triggering sorting
//                   e.stopPropagation();
//                   handleSort(header.key);
//                 }}
//               >
//                 {/* Show sorting arrows only if the column is being sorted */}
//                 {sortConfig.key === header.key ? (
//                   sortConfig.direction === "ascending" ? (
//                     <span>↑</span> // Ascending arrow
//                   ) : (
//                     <span>↓</span> // Descending arrow
//                   )
//                 ) : (
//                   <span>↕️</span> // Default unsorted arrow
//                 )}
//               </span>
//             </th>
//           ))}
//           {actionButtons && <th className="px-4 py-2">Actions</th>} {/* Action column */}
//         </tr>
//       </thead>
//       <tbody>
//         {sortedData.map((data, rowIndex) => (
//           <tr key={rowIndex} className="hover:bg-gray-100">
//             {tableHeaders.map((header, colIndex) => (
//               <td
//                 key={colIndex}
//                 className={`border border-gray-300 px-4 py-2 text-${header.alignment || "left"}`}
//               >
//                 {data[header.key]}
//               </td>
//             ))}
//             {actionButtons && (
//               <td className="border border-gray-300 px-4 py-2">
//                 {/* Render action buttons */}
//                 {React.cloneElement(actionButtons, { rowData: data })}
//               </td>
//             )}
//           </tr>
//         ))}
//       </tbody>
//       {tableBottom && <tfoot>{tableBottom}</tfoot>}
//     </table>
//   );
// };

// export default ReusableTable;




// import React from "react";

// const ReusableTable = ({
//   tableHeaders,
//   reportData,
//   tableBottom = null,
// }) => {
//   return (
//     <table className="table-auto w-full border-collapse border border-gray-300">
//       <thead>
//         <tr className="bg-gray-200 text-gray-700">
//           {tableHeaders.map((header, index) => (
//             <th
//               key={index}
//               className={`border border-gray-300 px-4 py-2 text-${header.alignment || "left"}`}
//             >
//               {header.text} {/* Display the header text */}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {reportData.map((data, rowIndex) => (
//           <tr key={rowIndex} className="hover:bg-gray-100">
//             {tableHeaders.map((header, colIndex) => (
//               <td
//                 key={colIndex}
//                 className={`border border-gray-300 px-4 py-2 text-${header.alignment || "left"}`}
//               >
//                 {data[header.key]} {/* Access the data using the 'key' field */}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//       {tableBottom && <tfoot>{tableBottom}</tfoot>}
//     </table>
//   );
// };

// export default ReusableTable;

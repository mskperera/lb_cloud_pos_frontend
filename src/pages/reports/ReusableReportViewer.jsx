

import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import './Reportm.css';
import GhostButton from "../../components/iconButtons/GhostButton";

const ReportViewer = ({ reportData, tableHeaders, title, lblLeft, lblRight, tableBottom,injectableComponents }) => {
  const printRef = useRef();
  const [showRowNumber, setShowRowNumber] = useState(true);
  const [columns, setColumns] = useState(tableHeaders); // State to manage columns in the table
  const [availableColumns, setAvailableColumns] = useState([]); // Available columns for addition
  const [selectedColumn, setSelectedColumn] = useState(''); // Track selected column to add

  useEffect(() => {
    // Set available columns to add from the original tableHeaders
    const availableCols = tableHeaders
      .map(header => header.text) // Get column names
      .filter(col => !columns.some(existingCol => existingCol.text === col)); // Filter out columns already in the table

    setAvailableColumns(availableCols);
  }, [columns, tableHeaders]); // Recalculate when columns or tableHeaders change

  // Dynamically generate the table headers from the keys of the first report data object
  const tableDataKeyNames = reportData.length > 0 ? Object.keys(reportData[0]) : [];

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: title,
    pageStyle: `
      @page {
        margin: 20mm;
      }
      .page-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 12px;
        padding: 10px 0;
      }
    `
  });

  const handleAddColumn = () => {
    // Add the selected column to the table headers
    const columnToAdd = tableHeaders.find(col => col.text === selectedColumn);
    if (columnToAdd) {
      setColumns(prevColumns => [...prevColumns, columnToAdd]);
      setAvailableColumns(prev => prev.filter(col => col !== selectedColumn)); // Remove added column from available list
    }
  };

  const handleRemoveColumn = (columnName) => {
    // Remove the selected column from the table
    setColumns(prevColumns => prevColumns.filter(col => col.text !== columnName));
    setAvailableColumns(prev => [...prev, columnName]); // Add back to available list
  };

  const handleLoadDefaultColumns = () => {
    setColumns(tableHeaders); // Reset to the default columns
    setAvailableColumns([]); // Clear available columns after reset
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
   
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center ml-2">
          <input
            type="checkbox"
            id="showRowNumber"
            className="checkbox checkbox-primary"
            checked={showRowNumber}
            onChange={() => setShowRowNumber(prevState => !prevState)}
          />
          <label htmlFor="showRowNumber" className="ml-2">Show Row Number</label>
        </div>

        <div className="flex items-center">
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className="border p-2 rounded mr-4"
        >
          <option value="">Select Column</option>
          {availableColumns.map((col, index) => (
            <option key={index} value={col}>{col}</option>
          ))}
        </select>
        <button
          onClick={handleAddColumn}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Column
        </button>
        <button
          onClick={handleLoadDefaultColumns}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-4"
        >
          Load Default Columns
        </button>
      </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handlePrint}
        >
          Print Report
        </button>
      </div>

      <div ref={printRef} className="bg-white rounded-lg p-6 flex flex-col gap-2">
        <div className="flex justify-center">
          <h2 className="text-xl font-semibold text-center">{title}</h2>
        </div>
        <div className="flex justify-between">
          <div>{lblLeft}</div>
          <div>{lblRight}</div>
        </div>

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              {showRowNumber && <th className="border border-gray-300 px-4 py-2 text-center">#</th>}
              {columns.map((header, index) => (
                <th key={index} className={`border border-gray-300 px-4 py-2 text-${header.alignment || "left"}`}>
                  {header.text}
                
                  <GhostButton
                 onClick={() => handleRemoveColumn(header.text)}
                    iconClass="pi pi-trash"
                    label=""
                    tooltip="Remove Column"
                    color="text-red-500"
                    hoverClass="hover:text-red-700 hover:bg-transparent"
                    className="btn-sm remove-column-button"
                  />

              
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData.map((data, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100">
                {/* Row number */}
                {showRowNumber && <td className="border border-gray-300 px-4 py-2 text-center">{rowIndex + 1}</td>}
                {/* Dynamically create table cells with alignment */}
                {columns.map((header, colIndex) => (
                  <td key={colIndex} className={`border border-gray-300 px-4 py-2 text-${header.alignment || "left"}`}>
                    {data[tableDataKeyNames[colIndex]]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {/* Grand Total Row */}
          {tableBottom}
        </table>
      
   
      {/* New Page Content */}
  <div className="new-page">
    {injectableComponents}
  </div>
  
      
      </div>
   
    </div>
  );
};

export default ReportViewer;


// import React, { useRef, useState } from "react";
// import { useReactToPrint } from "react-to-print";
// import './Reportm.css';

// const ReportViewer = ({ reportData, tableHeaders, title, lblLeft, lblRight, tableBottom }) => {
//   const printRef = useRef();
//   const [showRowNumber, setShowRowNumber] = useState(true);
  
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: title,
//     pageStyle: `
//       @page {
//         margin: 20mm;
//       }
//       .page-footer {
//         position: fixed;
//         bottom: 0;
//         left: 0;
//         right: 0;
//         text-align: center;
//         font-size: 12px;
//         padding: 10px 0;
//       }
//     `
//   });

//   // Dynamically generate the table headers from the keys of the first report data object
//   const tableDataKeyNames = reportData.length > 0 ? Object.keys(reportData[0]) : [];

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       {/* Print Button */}
//       <div className="flex justify-between mb-4">
//          <div className="flex items-center ml-2">
//                     <input
//                       type="checkbox"
//                       id="showRowNumber"
//                       className="checkbox checkbox-primary"
//                       checked={showRowNumber} 
//                       onChange={() => setShowRowNumber(prevState => !prevState)}
//                     />
//                     <label htmlFor="showRowNumber" className="ml-2">
//                     Show Row Number
//                     </label>
//                   </div>
       
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           onClick={handlePrint}
//         >
//           Print Report
//         </button>
//       </div>

//       {/* Report Table */}
//       <div ref={printRef} className="bg-white rounded-lg p-6 flex flex-col gap-2">
//       <div className="flex justify-center">
//           <h2 className="text-xl font-semibold text-center">{title}</h2>
//         </div>
//         <div className="flex justify-between">
//           <div>{lblLeft}</div>
//           <div>{lblRight}</div>
//         </div>

//         <table className="table-auto w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200 text-gray-700">
//             {showRowNumber && <th className="border border-gray-300 px-4 py-2 text-center">#</th>}
//               {tableHeaders.map((header, index) => (
//                 <th key={index} className={`border border-gray-300 px-4 py-2 text-${header.alignment || "left"}`}>
//                   {header.text}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {reportData.map((data, rowIndex) => (
//               <tr key={rowIndex} className="hover:bg-gray-100">
//                 {/* Row number */}
//               {showRowNumber &&  <td className="border border-gray-300 px-4 py-2 text-center">{rowIndex + 1}</td>}
//                 {/* Dynamically create table cells with alignment */}
//                 {tableHeaders.map((header, colIndex) => (
//                   <td key={colIndex} className={`border border-gray-300 px-4 py-2 text-${header.alignment || "left"}`}>
//                     {data[tableDataKeyNames[colIndex]]}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//           {/* Grand Total Row */}
//           {tableBottom}
//         </table>

//         {/* Page Footer */}
//         {/* <div className="page-footer">
//           <p>Page <span className="page-number"></span></p>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default ReportViewer;




// import React, { useRef } from "react";
// import { useReactToPrint } from "react-to-print";
// import './Reportm.css'

// const ReportViewer = ({ reportData, title, lblLeft, lblRight, tableHeaders, columnAlignments,tableBottom }) => {
//   const printRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: title,
//     pageStyle: `
//       @page {
//         margin: 20mm;
//       }
//       .page-footer {
//         position: fixed;
//         bottom: 0;
//         left: 0;
//         right: 0;
//         text-align: center;
//         font-size: 12px;
//         padding: 10px 0;
//       }
//     `
//   });

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       {/* <h1 className="text-2xl font-bold text-center mb-6">{title}</h1> */}

//       {/* Print Button */}
//       <div className="flex justify-end mb-4">
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           onClick={handlePrint}
//         >
//           Print Report
//         </button>
//       </div>

//       {/* Report Table */}
//       <div ref={printRef} className="bg-white rounded-lg p-6">
//         <div className="flex justify-between">
//           <div>{lblLeft}</div>
//           <h2 className="text-xl font-semibold mb-4 text-center">Sales Report</h2>
//           <div>{lblRight}</div>
//         </div>

//         <table className="table-auto w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200 text-gray-700">
//               {tableHeaders.map((header, index) => (
//                 <th key={index} className={`border border-gray-300 px-4 py-2 text-${columnAlignments[index] || "left"}`}>
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {reportData.map((data, index) => (
//               <tr key={data.id} className="hover:bg-gray-100">
//                 <td className={`border border-gray-300 px-4 py-2 text-${columnAlignments[0] || "left"}`}>{index + 1}</td>
//                 <td className={`border border-gray-300 px-4 py-2 text-${columnAlignments[1] || "left"}`}>{data.item}</td>
//                 <td className={`border border-gray-300 px-4 py-2 text-${columnAlignments[2] || "right"}`}>{data.quantity}</td>
//                 <td className={`border border-gray-300 px-4 py-2 text-${columnAlignments[3] || "right"}`}>{data.price}</td>
//                 <td className={`border border-gray-300 px-4 py-2 text-${columnAlignments[4] || "right"}`}>{data.total}</td>
//               </tr>
//             ))}
//           </tbody>
//              {/* Grand Total Row */}
//              {tableBottom}
//              {/* <tr className="bg-gray-200 font-bold">
//               <td colSpan={tableHeaders.length - 1} className="border border-gray-300 px-4 py-2 text-right">
//                 Grand Total:
//               </td>
//               <td className={`border border-gray-300 px-4 py-2 text-right`}>
//                 USD {grandTotal.toLocaleString()}
//               </td>
//             </tr> */}
//         </table>
// {/* 
//         <div className="mt-6 text-right">
//           <p className="font-bold">Grand Total: USD {reportData.reduce((sum, row) => sum + row.total, 0).toLocaleString()}</p>
//         </div> */}

//         {/* Page Footer */}
//         <div className="page-footer">
//           <p>Page <span className="page-number"></span></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportViewer;

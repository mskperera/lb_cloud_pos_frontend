
import React from 'react';
import { FaPrint } from 'react-icons/fa';

const PrintFeature = ({
  isSelected,
  onSelect,
  itemName = 'Receipt',
  isTauriApp = false,
  isPrinterLoading = false,
  tauriPrinterList = [],
  selectedPrinter = '',
  onPrinterChange = () => {},
  onDropdownFocus = () => {}
}) => (
  <div
    className={`rounded-xl border shadow-sm transition-all duration-200 ${
      isSelected
        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow-md'
        : 'bg-white border-sky-200 text-slate-700 hover:bg-slate-50'
    }`}
  >
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-full items-center gap-3 p-3 text-left focus:outline-none"
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${
          isSelected
            ? 'bg-white/20 text-white'
            : 'bg-gradient-to-br from-sky-500 to-blue-600 text-white'
        }`}
      >
        <FaPrint className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
          Print
        </div>
        <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
          Print the {itemName.toLowerCase()} at the counter
        </div>
      </div>

      <div
        className={`h-3.5 w-3.5 rounded-full border-2 ${
          isSelected ? 'border-white bg-white' : 'border-slate-300 bg-transparent'
        }`}
      />
    </button>

    {isSelected && isTauriApp && (
      <div className="px-3 pb-3 pt-1 border-t border-white/20">
        <label className={`block text-xs font-semibold mb-1 ${isSelected ? 'text-white/90' : 'text-slate-700'}`}>
          Select Printer:
        </label>
        <select
          value={selectedPrinter}
          onChange={(e) => onPrinterChange(e.target.value)}
          onFocus={onDropdownFocus} // Trigger system printer load on click/focus
          onClick={(e) => e.stopPropagation()}
          disabled={isPrinterLoading}
          className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs font-medium text-slate-800 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-75"
        >
          {isPrinterLoading ? (
            <option value="">Loading printers...</option>
          ) : tauriPrinterList.length === 0 ? (
            <option value="">No printer detected</option>
          ) : (
            tauriPrinterList.map((printer, index) => {
              const printerName = printer?.Name || printer?.name || printer;
              return (
                <option key={index} value={printerName}>
                  {printerName}
                </option>
              );
            })
          )}
        </select>
      </div>
    )}
  </div>
);

export default PrintFeature;






// import React from 'react';
// import { FaPrint } from 'react-icons/fa';

// const PrintFeature = ({
//   isSelected,
//   onSelect,
//   itemName = 'Receipt',
//   isTauriApp = false,
//   isPrinterLoading = false, // <-- Accept prop
//   tauriPrinterList = [],
//   selectedPrinter = '',
//   setSelectedPrinter = () => {}
// }) => (
//   <div
//     className={`rounded-xl border shadow-sm transition-all duration-200 ${
//       isSelected
//         ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow-md'
//         : 'bg-white border-sky-200 text-slate-700 hover:bg-slate-50'
//     }`}
//   >
//     {/* Main Selection Header */}
//     <button
//       type="button"
//       onClick={onSelect}
//       className="group flex w-full items-center gap-3 p-3 text-left focus:outline-none"
//     >
//       <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${
//         isSelected 
//           ? 'bg-white/20 text-white' 
//           : 'bg-gradient-to-br from-sky-500 to-blue-600 text-white'
//       }`}>
//         <FaPrint className="h-5 w-5" />
//       </div>

//       <div className="flex-1">
//         <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
//           Print
//         </div>
//         <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
//           Print the {itemName.toLowerCase()} at the counter
//         </div>
//       </div>

//       <div
//         className={`h-3.5 w-3.5 rounded-full border-2 ${
//           isSelected ? 'border-white bg-white' : 'border-slate-300 bg-transparent'
//         }`}
//       />
//     </button>

//     {/* Printer Dropdown */}
//     {isSelected && isTauriApp && (
//       <div className="px-3 pb-3 pt-1 border-t border-white/20">
//         <label className={`block text-xs font-semibold mb-1 ${isSelected ? 'text-white/90' : 'text-slate-700'}`}>
//           Select Printer:
//         </label>
//         <select
//           value={selectedPrinter}
//           onChange={(e) => setSelectedPrinter(e.target.value)}
//           onClick={(e) => e.stopPropagation()}
//           disabled={isPrinterLoading} // Optionally disable during fetch
//           className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs font-medium text-slate-800 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-75"
//         >
//           {isPrinterLoading ? (
//             <option value="">Loading printers...</option>
//           ) : tauriPrinterList.length === 0 ? (
//             <option value="">No printer detected</option>
//           ) : (
//             tauriPrinterList.map((printer, index) => {
//               const printerName = printer?.Name || printer?.name || printer;
//               return (
//                 <option key={index} value={printerName}>
//                   {printerName}
//                 </option>
//               );
//             })
//           )}
//         </select>
//       </div>
//     )}
//   </div>
// );

// export default PrintFeature;

// import React from 'react';
// import { FaPrint } from 'react-icons/fa';

// const PrintFeature = ({
//   isSelected,
//   onSelect,
//   itemName = 'Receipt',
//   isTauriApp = false,
//   tauriPrinterList = [],
//   selectedPrinter = '',
//   setSelectedPrinter = () => {}
// }) => (
//   <div
//     className={`rounded-xl border shadow-sm transition-all duration-200 ${
//       isSelected
//         ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow-md'
//         : 'bg-white border-sky-200 text-slate-700 hover:bg-slate-50'
//     }`}
//   >
//     {/* Main Selection Header */}
//     <button
//       type="button"
//       onClick={onSelect}
//       className="group flex w-full items-center gap-3 p-3 text-left focus:outline-none"
//     >
//       <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${
//         isSelected 
//           ? 'bg-white/20 text-white' 
//           : 'bg-gradient-to-br from-sky-500 to-blue-600 text-white'
//       }`}>
//         <FaPrint className="h-5 w-5" />
//       </div>

//       <div className="flex-1">
//         <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
//           Print
//         </div>
//         <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
//           Print the {itemName.toLowerCase()} at the counter
//         </div>
//       </div>

//       <div
//         className={`h-3.5 w-3.5 rounded-full border-2 ${
//           isSelected ? 'border-white bg-white' : 'border-slate-300 bg-transparent'
//         }`}
//       />
//     </button>

//     {/* Printer Dropdown (Only visible when Print option is selected in Tauri Desktop App) */}
//     {isSelected && isTauriApp && (
//       <div className="px-3 pb-3 pt-1 border-t border-white/20">
//         <label className={`block text-xs font-semibold mb-1 ${isSelected ? 'text-white/90' : 'text-slate-700'}`}>
//           Select Printer:
//         </label>
//         <select
//           value={selectedPrinter}
//           onChange={(e) => setSelectedPrinter(e.target.value)}
//           onClick={(e) => e.stopPropagation()} // Prevents toggling parent button onClick
//           className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs font-medium text-slate-800 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
//         >
//           {tauriPrinterList.length === 0 ? (
//             <option value="">No printers detected</option>
//           ) : (
//             tauriPrinterList.map((printer, index) => {
//               const printerName = printer?.Name || printer?.name || printer;
//               return (
//                 <option key={index} value={printerName}>
//                   {printerName}
//                 </option>
//               );
//             })
//           )}
//         </select>
//       </div>
//     )}
//   </div>
// );

// export default PrintFeature;


// import React from 'react';
// import { FaPrint } from 'react-icons/fa';

// const PrintFeature = ({ isSelected, onSelect, itemName = 'Receipt' }) => (
//   <button
//     key="print"
//     type="button"
//     onClick={onSelect}
//     className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
//       isSelected
//         ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent'
//         : 'bg-white border-sky-200 text-slate-700 hover:bg-slate-50'
//     }`}
//   >
//     <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm">
//       <FaPrint className="h-5 w-5" />
//     </div>
//     <div className="flex-1">
//       <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
//         Print
//       </div>
//       <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
//         Print the {itemName.toLowerCase()} at the counter
//       </div>
//     </div>
//     <div className={`h-3.5 w-3.5 rounded-full border-2 ${isSelected ? 'border-white bg-white' : 'border-slate-300 bg-transparent'}`} />
//   </button>
// );

// export default PrintFeature;

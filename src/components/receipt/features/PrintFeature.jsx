import React from 'react';
import { FaPrint } from 'react-icons/fa';

const PrintFeature = ({ isSelected, onSelect, itemName = 'Receipt' }) => (
  <button
    key="print"
    type="button"
    onClick={onSelect}
    className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
      isSelected
        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent'
        : 'bg-white border-sky-200 text-slate-700 hover:bg-slate-50'
    }`}
  >
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm">
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
    <div className={`h-3.5 w-3.5 rounded-full border-2 ${isSelected ? 'border-white bg-white' : 'border-slate-300 bg-transparent'}`} />
  </button>
);

export default PrintFeature;

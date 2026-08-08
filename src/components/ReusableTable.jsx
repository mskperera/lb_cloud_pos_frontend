import React from "react";

export default function ReusableTable({
  data = [],
  isLoading = false,
  columns = [], // Array of column definitions
  customActions,
}) {
  // Safely fallback to an empty array if columns is null or undefined
  const activeColumns = columns || [];
  const totalColSpan = Math.max(activeColumns.length + (customActions ? 1 : 0), 1);

  return (
    <div className="flex flex-col h-[65vh] overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <div className="flex-1 overflow-y-auto bg-white">
        <table className="w-full border-collapse text-left">
          <thead className="relative bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200 sticky top-0 z-10 uppercase tracking-wider">
            <tr>
              {/* Dynamic Headers */}
              {activeColumns.map((col, idx) => (
                <th key={col.key || idx} className={`px-4 py-3.5 ${col.headerClass || ""}`}>
                  {col.header}
                </th>
              ))}

              {customActions && <th className="px-4 py-3.5 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={totalColSpan} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={totalColSpan} className="px-4 py-8 text-center text-gray-400 text-sm">
                  No records found matching your search criteria.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id || item.orderId || item.allProductId || index}
                  className="text-sm hover:bg-slate-50/80 transition-colors duration-150"
                >
                  {/* Dynamic Cells */}
                  {activeColumns.map((col, idx) => (
                    <td key={col.key || idx} className={`px-4 py-3 ${col.cellClass || ""}`}>
                      {col.render ? col.render(item, index) : item[col.accessor || col.key]}
                    </td>
                  ))}

                  {/* Optional Actions Cell */}
                  {customActions && (
                    <td className="px-4 py-3 text-center">
                      {customActions(item, index)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
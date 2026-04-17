import React from "react";

/**
 * ReusableTable component
 * @param {Array} columns - [{ key: 'orderNo', label: 'Invoice No', render: (row) => ... }]
 * @param {Array} data - Array of row objects
 * @param {string} emptyMessage - Message to show when no data
 * @param {boolean} loading - Show loading spinner if true
 */
export default function ReusableTable({ columns, data, emptyMessage = "No data found", loading = false }) {
  return (
    <>
      {/* Table for md+ screens */}
      <div className="w-full overflow-x-auto hidden md:block">
        <table className="min-w-full text-xs md:text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-2 py-3 md:px-6 md:py-4 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200">
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Waiting...
                    </div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.id || row.orderId || idx} className="hover:bg-gray-50 transition">
                  {columns.map((col) => (
                    <td key={col.key} className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile screens */}
      <div className="block md:hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200">
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Waiting...
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{emptyMessage}</div>
        ) : (
          <div className="space-y-4">
            {data.map((row, idx) => (
              <div key={row.id || row.orderId || idx} className="bg-white rounded-xl shadow border border-gray-200 p-4 flex flex-col gap-2">
                {columns.map((col) => (
                  <div key={col.key} className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-500">{col.label}</span>
                    <span className={col.key === 'actions' ? '' : 'text-gray-800'}>
                      {col.render ? col.render(row) : row[col.key]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

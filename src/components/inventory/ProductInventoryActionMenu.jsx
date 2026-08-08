import React from "react";
import { MoreVertical, History, Pencil, Trash2, Settings, EyeIcon } from "lucide-react";

const ProductInventoryActionMenu = ({
  item,
  openMenuId,
  setOpenMenuId,
  onHistoryClick,
  onEditClick,
  onDeleteClick,
  onManageClick,
  onViewClick,
}) => {
  const isOpen = openMenuId === item.allProductId;

  return (
    <div className="relative flex justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenuId(isOpen ? null : item.allProductId);
        }}
        className="w-8 h-8 rounded-lg border border-slate-300 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 transition"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-9 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1"
          onClick={(e) => e.stopPropagation()}
        >

{/* View Details Action */}
          {onViewClick && (
            <button
              onClick={() => {
                setOpenMenuId(null);
                onViewClick(item);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 transition"
            >
              <EyeIcon size={16} className="text-blue-600" />
              <span>View Details</span>
            </button>
          )}

          {/* History */}
          <button
            onClick={() => {
              onHistoryClick(item);
              setOpenMenuId(null);
            }}
            className="w-full px-4 py-2 flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
          >
            <History size={16} className="text-blue-600" />
            <span>History</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => {
              onEditClick(item);
              setOpenMenuId(null);
            }}
            className="w-full px-4 py-2 flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
          >
            <Pencil size={16} className="text-green-600" />
            <span>Edit</span>
          </button>

          {/* Manage Stock (Conditional) */}
   
            <button
              onClick={() => {
                onManageClick(item);
                setOpenMenuId(null);
              }}
              disabled={!item.inventoryId}
              className="w-full px-4 py-2 flex items-center gap-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              <Settings size={16} className="text-amber-500" />
              <span>Manage</span>
            </button>
     

          <div className="border-t border-slate-100 my-1" />

          {/* Delete */}
          <button
            onClick={() => {
              onDeleteClick(item);
              setOpenMenuId(null);
            }}
            className="w-full px-4 py-2 flex items-center gap-2.5 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductInventoryActionMenu;
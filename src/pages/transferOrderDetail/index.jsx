import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { FaCheckCircle, FaEdit, FaEllipsisV, FaPaperPlane, FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import { useToast } from "../../components/useToast";
import { FastForward } from "lucide-react";
import LeftArrowIcon from "../../components/icons/LeftArrowIcon";
import ConfirmDialog from "../../components/dialog/ConfirmDialog";
import ExportDropdown from "../../components/ExportDropdown";
import MoreMenu from "../../components/MoreMenu";
import BackButton from "../../components/BackButton";
// import other components as needed (Input, Button, etc.)

const TransferOrderDetail = () => {
  const { id } = useParams();           // e.g. /transferorders/TO1012
  const navigate = useNavigate();
  const showToast = useToast();

  // In real app → fetch from API / localStorage / context
  // For demo we hard-code data that matches your screenshot style
  const [transfer, setTransfer] = useState(null);
  const [isReceiving, setIsReceiving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'send' | 'receive' | 'delete'
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    // hide more menu on outside click
    const handleClickOutsideMore = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideMore);
    return () => document.removeEventListener("mousedown", handleClickOutsideMore);
  }, []);

  useEffect(() => {
    // Simulate fetching the transfer order
    // In real app: axios.get(`/api/transfers/${id}`)
    setTimeout(() => {
      setTransfer({
        id: id || "TO1012",
        number: id || "TO1012",
        status: "In transit",
        date: "Jun 18, 2021",
        orderedBy: "Owner",
        source: {
          name: "Pizzerria",
          label: "Pizzeria store"
        },
        destination: {
          name: "Coffee shop",
          address: "21 Avenue, Brooklyn, New York, NY, United States"
        },
        notes: "Desserts & Pizza",
        items: [
          {
            name: "Banana cake",
            sku: "SKU10054",
            quantityOrdered: 120,
            quantityReceived: 0   // user will update this
          },
          {
            name: "Berry cake",
            sku: "SKU10080",
            quantityOrdered: 120,
            quantityReceived: 0
          },
          {
            name: "Cake with strawberry",
            sku: "SKU10068",
            quantityOrdered: 21,
            quantityReceived: 0
          }
        ]
      });
    }, 300);
  }, [id]);

  const handleReceiveAll = () => {
    setTransfer(prev => ({
      ...prev,
      items: prev.items.map(item => ({
        ...item,
        quantityReceived: item.quantityOrdered
      })),
      status: "Received"
    }));
    showToast("success", "Success", "All items received successfully");
  };

  const handleSend = () => {
    setTransfer(prev => ({
      ...prev,
      status: "Sent"
    }));
    showToast("success", "Success", "Transfer order marked as sent");
  };

  const handleEdit = () => {
    showToast("info", "Edit", "Open edit screen (placeholder)");
    setShowMoreMenu(false);
  };

  const handleDelete = () => {
    setConfirmAction("delete");
    setShowConfirmDialog(true);
    setShowMoreMenu(false);
  };

  const handleConfirmAction = () => {
    if (confirmAction === "send") {
      handleSend();
    } else if (confirmAction === "receive") {
      handleReceiveAll();
    } else if (confirmAction === "delete") {
      setTransfer(prev => ({ ...prev, status: "Deleted" }));
      showToast("success", "Deleted", "Transfer order has been deleted");
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleReceivePartial = () => {
    // You can add more logic: check if all match ordered qty, etc.
    const allReceived = transfer.items.every(i => i.quantityReceived === i.quantityOrdered);
    setTransfer(prev => ({ ...prev, status: allReceived ? "Received" : "Partially received" }));
    showToast("success", "Success", "Transfer order updated");
  };

  const updateReceivedQty = (index, value) => {
    setTransfer(prev => {
      const newItems = [...prev.items];
      newItems[index].quantityReceived = Number(value) || 0;
      return { ...prev, items: newItems };
    });
  };

  const handleExportPDF = () => {
    // Placeholder for PDF export logic
    showToast("success", "Export", "PDF exported successfully");
  };

  const handleExportCSV = () => {
    // Placeholder for CSV export logic
    showToast("success", "Export", "CSV exported successfully");
  };

  if (!transfer) return <div className="p-10 text-center">Loading transfer order...</div>;

  const isInTransit = transfer.status === "In transit";
  const totalOrdered = transfer.items.reduce((sum, i) => sum + i.quantityOrdered, 0);
  const totalReceived = transfer.items.reduce((sum, i) => sum + (i.quantityReceived || 0), 0);

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-7 pb-20 font-sans">
      <div className="max-w-[1060px] mx-auto flex flex-col gap-5">

        {/* Header / Top bar – very similar to screenshot */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">

<div className="flex items-center">
                      <BackButton
                        onClick={() => navigate("/inventory/transferorders/list")}
                        title="Back to Transfer Orders"
                        size="lg"
                      />

              <h1 className="text-[26px] font-bold text-[#1C1C1E] tracking-[-0.5px]">
            
            Transfer Order {transfer.number}
              </h1>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-blue-100/70 rounded-full px-3 py-1 text-sm font-semibold text-blue-600">
                {transfer.status}
              </div>
            </div>
            <div className="text-sm text-[#6D6D72] mt-1">
              Date: {transfer.date} • Ordered by: {transfer.orderedBy}
            </div>
          </div>

          <div className="flex gap-3 items-center">
      

            {isInTransit ? (
                <>
                               <button
                onClick={() => {
                  setConfirmAction("receive");
                  setShowConfirmDialog(true);
                }}
                disabled={isReceiving}
                className="px-6 py-2.5 btn-primary  font-semibold rounded-full shadow-sm disabled:opacity-60 flex items-center gap-2"
              >
                <FaArrowAltCircleLeft />
                Receive
              </button>
                
                         <button
                onClick={() => {
                  setConfirmAction("send");
                  setShowConfirmDialog(true);
                }}
                disabled={isReceiving}
                className="px-6 py-2.5 btn-primary  font-semibold rounded-full shadow-sm disabled:opacity-60 flex items-center gap-2"
              >
                <FaArrowAltCircleRight />
                Send
              </button>

        

                      <MoreMenu
                        disabled={isReceiving}
                        menuItems={[
                          { key: "edit", label: "Edit", onClick: handleEdit },
                          {
                            key: "delete",
                            label: "Delete",
                            onClick: handleDelete,
                            className: "text-red-600 hover:bg-gray-100"
                          }
                        ]}
                      />

                </>
       
            ):

  
                      <ExportDropdown
                        disabled={isReceiving}
                        menuItems={[
                          { key: "pdf", label: "Export as PDF", onClick: handleExportPDF },
                          { key: "csv", label: "Export as CSV", onClick: handleExportCSV }
                        ]}
                      />

}

          </div>
        </div>

        <ConfirmDialog
          isVisible={showConfirmDialog}
          message={
            confirmAction === "send"
              ? "Are you sure you want to send this order?"
              : confirmAction === "receive"
              ? "Are you sure you want to mark this order as received?"
              : "Are you sure you want to delete this order?"
          }
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
          title={
            confirmAction === "send"
              ? "Confirm Send"
              : confirmAction === "receive"
              ? "Confirm Receive"
              : "Confirm Delete"
          }
          severity={confirmAction === "delete" ? "danger" : "info"}
        />

        {/* Main content card */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden shadow-sm">

          {/* Transfer info */}
          <div className="p-6 border-b grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-xs uppercase font-bold text-[#6D6D72] mb-1">Source store</div>
              <div className="font-medium">{transfer.source.name}</div>
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-[#6D6D72] mb-1">Destination store</div>
              <div className="font-medium">{transfer.destination.name}</div>
              <div className="text-sm text-[#6D6D72]">{transfer.destination.address}</div>
            </div>
            {transfer.notes && (
              <div className="md:col-span-2 mt-2">
                <div className="text-xs uppercase font-bold text-[#6D6D72] mb-1">Notes</div>
                <div className="text-[#1C1C1E]">{transfer.notes}</div>
              </div>
            )}
          </div>

          {/* Items section – matches screenshot layout closely */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Item List</h2>
              <div className="text-sm text-[#6D6D72]">
                Total: {totalReceived} / {totalOrdered} received
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transfer.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors duration-150 ease-in-out group">
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                          {item.sku}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="font-medium text-gray-900 group-hover:text-gray-800 transition-colors">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className="inline-flex items-center justify-center w-12 h-8 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200">
                          {item.quantityOrdered}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default TransferOrderDetail;
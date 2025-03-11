import React, { useState, useEffect } from "react";
import { getInventoryTransactionHistory } from "../../functions/stockEntry";
import { formatUtcToLocal } from "../../utils/format";
import { useToast } from "../useToast";
import Pagination from "../pagination/Pagination";
const ProductInfo = ({ product }) => {
  const { productName, measurementUnitName, sku, productNo, qty } = product;

  return (
    <div className="p-4 ">
      <div className="flex justify-between gap-4">
        <div className="flex flex-col justify-between items-start">
          <span className="font-bold mb-2">Product Name</span>
          <span className="text-gray-800">{productName}</span>
        </div>
        <div className="flex flex-col justify-between items-start">
          <span className="font-bold mb-2">Stock Qty</span>
          <span className="text-gray-800">
            {qty} {measurementUnitName}
          </span>
        </div>
        <div className="flex flex-col justify-between items-start">
          <span className="font-bold mb-2">SKU</span>
          <span className="text-gray-800">{sku}</span>
        </div>
        <div className="flex flex-col justify-between items-start">
          <span className="font-bold mb-2">Product No</span>
          <span className="text-gray-800">{productNo}</span>
        </div>
      </div>
    </div>
  );
};
const InventoryTransactionHistory = ({ inventoryId, product }) => {
  const [loading, setLoading] = useState(true);
  const [stockInfo, setStockInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const rowsPerPageOptions = [5, 10, 20, 50, 100]; // Options for rows per page
  const store = JSON.parse(localStorage.getItem("selectedStore"));
  const showToast = useToast();


  const loadDetails = async () => {
    setLoading(true);
    const payload = {
      inventoryId,
      storeId: store.storeId,
      limit: 500,
      skip: 0,
    };

    try {
      const stockInfoRes = await getInventoryTransactionHistory(payload);
      const { results } = stockInfoRes.data;
      if (Array.isArray(results) && results.length > 0) {
        setStockInfo(results.flat());
      } else {
        setStockInfo([]);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      showToast("Failed to load stock batch details.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [inventoryId]);

  const totalRecords = stockInfo.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const currentRecords = stockInfo.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const renderStockInfo = () => {
    if (loading) {
      return <div>Loading stock batch details...</div>;
    }

    if (!stockInfo.length) {
      return <div>No stock batch details available.</div>;
    }

    return (
      <div className="px-10">
    
        <div className="p-4 rounded-md w-full overflow-x-auto bg-slate-50">
        <ProductInfo product={product} />
          <div className="flex justify-between items-center pb-5">
          <div className="flex flex-col justify-start items-start space-y-1">
  <span className="bg-gray-100 text-gray-700 font-semibold text-sm py-1 px-3 rounded-md shadow-sm border border-gray-200">
    Total Records Found: {totalRecords}
  </span>
</div>

            <h3 className="font-bold text-xl mb-4">Inventory Transaction History</h3>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPageOptions={rowsPerPageOptions}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </div>
          
          <table className="table border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10 text-[1rem] border-b border-gray-300">
              <tr>
                <th className="px-2 py-2">Batch No</th>
                <th className="px-2 py-2">Quantity</th>
                <th className="px-2 py-2">Transaction Type</th>
                <th className="px-2 py-2">Reason</th>
                <th className="px-2 py-2">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    item.qty < 0
                      ? "bg-red-200 hover:bg-red-300"
                      : "bg-slate-50 hover:bg-gray-100"
                  }`}
                >
                  <td className="px-2 py-2">{item.batchNumber}</td>
                  <td className="px-2 py-2">{item.qty}</td>
                  <td className="px-2 py-2">{item.transactionType}</td>
                  <td className="px-2 py-2">{item.reason || "-"}</td>
                  <td className="px-2 py-2">
                    {formatUtcToLocal(item.CreatedDate_UTC)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="px-10">
      {renderStockInfo()}
    </div>
  );
};

export default InventoryTransactionHistory;

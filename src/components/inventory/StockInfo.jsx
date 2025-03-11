import React, { useState, useEffect } from 'react';
import { formatUtcToLocal } from '../../utils/format';
import { getStockInfo } from '../../functions/stockEntry';

const StockInfo = ({ inventoryId }) => {
  const [loading, setLoading] = useState(true);
  const [stockInfo, setStockInfo] = useState([]);

  const loadDetails = async () => {
    console.log('inventoryId', inventoryId);

    if (inventoryId === null) return;
    setLoading(true);
    try {
      const stockInfoRes = await getStockInfo(inventoryId);
      const stockInfo = stockInfoRes.data;
      console.log('stockInfo', stockInfo);
      setStockInfo(stockInfo); // Set stock info here
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [inventoryId]);

  const renderStockInfo = () => {
    if (loading) {
      return <div>Loading stock batch details...</div>;
    }

    return (
      <div className="p-4 rounded-md w-full overflow-x-auto">
        <h3 className="text-center font-bold pb-5">Stock Batch Details</h3>

        <div className="text-center mb-4 w-full">
          <p className="text-sm text-gray-600">
            The item highlighted below is the next to be sold out based on the <span className="font-bold">Batch queue number</span>.
          </p>
        </div>

        <table className="table border-collapse w-full">
          <thead>
            <tr>
              <th className="px-2 py-2">Batch No</th>
              <th className="px-2 py-2">Qty</th>
              <th className="px-2 py-2">Batch Queue No</th>
              <th className="px-2 py-2">Expiration Date</th>
              <th className="px-2 py-2">Production Date</th>
              <th className="px-2 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {stockInfo.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Stock batch details not found.
                </td>
              </tr>
            ) : (
              stockInfo
                .sort((a, b) => {
                  // Sort by Batch Queue Number first, then by Expiration Date
                  return (
                    a.batchQueueNumber - b.batchQueueNumber ||
                    new Date(a.expDate) - new Date(b.expDate)
                  );
                })
                .map((item, index) => {
                  const isStockOutOrder = index === 0; // Highlight the first row in the sorted list
                  return (
                    <tr
                      key={index}
                      className={isStockOutOrder ? "bg-yellow-200" : ""}
                    >
                      <td className="px-2 py-2">{item.batchNo}</td>
                      <td className="px-2 py-2">{item.qty}</td>
                      <td className="px-2 py-2">{item.batchQueueNumber}</td>
                      <td className="px-2 py-2">
                        {formatUtcToLocal(item.expDate, true)}
                      </td>
                      <td className="px-2 py-2">
                        {formatUtcToLocal(item.prodDate, true)}
                      </td>
                      <td className="px-2 py-2">
                        {formatUtcToLocal(item.createdDate_utc)}
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return <div className="p-2 mb-2">{renderStockInfo()}</div>;
};

export default StockInfo;

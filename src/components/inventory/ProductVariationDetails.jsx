import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency, formatUtcToLocal } from '../../utils/format';
import { getStockInfo } from '../../functions/stockEntry';


const ProductVariationDetails = ({ variationProductSkuBarcodes }) => {



    
    return (
    
      <div className='m-4 p-4 rounded-md'>
      <h3 className='text-center font-bold pb-5'>Variations</h3>
      <table className="table w-auto">
              <thead className="sticky top-0 text-sm border-b">
                <tr>
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2">Barcode</th>
                  <th className="px-4 py-2">Unit Price</th>
                  {variationProductSkuBarcodes[0]?.variationDetails &&
                    variationProductSkuBarcodes[0]?.variationDetails.map((c) => (
                      <th key={c.variationTypeId} className="px-4 py-2 ">
                        <span className='text-sm'>{c.variationTypeName}</span>
                    
                      </th>
                    ))}
                  <th className="px-4 py-2"></th>{" "}
                </tr>
              </thead>

              <tbody>
                {variationProductSkuBarcodes && variationProductSkuBarcodes.map((variation,index) => (
                  <tr key={variation.variationProductId}>
                    <td className="px-4 py-2">
                    {variation.sku}
                    </td>
                    <td className="px-4 py-2">
                    {variation.barcode}
                    </td>
                    <td className="px-4 py-2">
                    {variation.unitPrice}
                    </td>
                    {variation.variationDetails &&
variation.variationDetails.map((detail) => (
<td key={detail.variationTypeId} className="px-4 py-2">
{detail.variationValue}
</td>
))}

                
                  </tr>
                ))}
              </tbody>
            </table>


    </div>
    );
  };

export default ProductVariationDetails;
import React, { useState } from "react";
import moment from "moment";
import { validate } from "../../utils/formValidation";
import { getOrderFull } from "../../functions/order";
import "./module.returnOrder.css";

export default function ReturnOrderComp({ onAddReturnedProducts }) {
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [selectedFilterBy, setSelectedFilterBy] = useState({
    label: "Filter by",
    value: 1,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });
  const [searchValue, setSearchValue] = useState({
    label: "Search Value",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [returnQty, setReturnQty] = useState({
    label: "Enter Return Qty",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [orderHeader, setOrderHeader] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrder = async (value) => {
    try {
      setIsOrderLoading(true);
      const payload = { orderId: null, orderNo: value };
      const ress = await getOrderFull(payload);

      const orderHeader = ress.data.results[0][0];
      const orderDetails = ress.data.results[1];

      const modifiedOrderDetails = [...orderDetails];
      modifiedOrderDetails.map(
        (o) => (
          (o.returnQty = 0),
          (o.remainingQty = o.qty)
        )
      );

      setOrderHeader(orderHeader);
      setOrderDetails(modifiedOrderDetails);
      setIsOrderLoading(false);
    } catch (err) {
      alert("Error: " + err.message);
      setIsOrderLoading(false);
    }
  };

  const handleInputChange = (setState, state, value) => {
    if (!state.rules) {
      console.error("No rules defined for validation in the state", state);
      return;
    }
    const validation = validate(value, state);
    setState({
      ...state,
      value: value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };

  const onOrderSelectHandler = () => {
    loadOrder(searchValue.value);
  };

  const modifiedDateBodyTemplate = (date) => {
    const utcOffsetMinutes = moment().utcOffset();
    const localFormattedDate = moment(date).add(utcOffsetMinutes, "minutes").format("YYYY-MMM-DD hh:mm:ss A");
    return <span>{date ? localFormattedDate : ""}</span>;
  };

  return (
    <div className="p-6 bg-gray-100 rounded-xl">
      <div className="mb-6">
        <label htmlFor="orderNumber" className="block text-lg font-medium mb-2">
          Enter Order Number Here
        </label>
        <input
          id="orderNumber"
          type="text"
          className="input input-bordered w-full"
          placeholder="Order Number"
          value={searchValue.value}
          onChange={(e) =>
            handleInputChange(setSearchValue, searchValue, e.target.value)
          }
        />
        <button
          className="btn btn-primary mt-4"
          onClick={onOrderSelectHandler}
        >
          Submit
        </button>
      </div>

      {isTableDataLoading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Order Detail ID</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Gross Amount</th>
                <th>Net Amount</th>
                <th>Remaining Qty</th>
                <th>Return Qty</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((detail) => (
                <tr key={detail.orderDetailId}>
                  <td>{detail.orderDetailId}</td>
                  <td>{`${detail.productNo} | ${detail.productName}`}</td>
                  <td>{`${detail.qty} ${detail.measurementUnitName}`}</td>
                  <td>{detail.unitPrice}</td>
                  <td>{detail.grossAmount}</td>
                  <td>{detail.netAmount}</td>
                  <td>{`${detail.remainingQty} ${detail.measurementUnitName}`}</td>
                  <td>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={detail.returnQty}
                      onChange={(e) => {
                        const index = orderDetails.findIndex(
                          (i) => i.orderDetailId === detail.orderDetailId
                        );
                        if (index !== -1) {
                          const updatedOrderDetails = [...orderDetails];
                          updatedOrderDetails[index] = {
                            ...updatedOrderDetails[index],
                            returnQty: e.target.value,
                          };
                          setOrderDetails(updatedOrderDetails);
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        className="btn btn-info mt-6"
        onClick={() => {
          const returnedProducts = [
            ...orderDetails.filter((i) => i.returnQty !== null),
          ];
          onAddReturnedProducts({ returnedProducts, orderNo: searchValue.value });
        }}
      >
        Add to List
      </button>
    </div>
  );
}

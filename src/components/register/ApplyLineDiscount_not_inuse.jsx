import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { applyDiscount, cancelDiscount } from "../../state/orderList/orderListSlice"; // Import actual actions
import FormElementMessage from "../messges/FormElementMessage";
import { InputTextarea } from "primereact/inputtextarea";
import {DISCOUNT_TYPES, OTHER_DISCOUNT_REASON_ID} from '../../utils/constants';

const LineDiscountType = ({ title, isSelected, onClick }) => {
  return (
    <div className="md:col-3 sm:col-6" style={{ cursor: "pointer" }} onClick={onClick}>
      <div className={`shadow-1 hover:shadow-4 surface-card border-round`}>
        <div className={`flex justify-content-center flex-wrap p-3 border-round ${isSelected ? 'bg-primary' : ''}`}>
          <span className="font-bold">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default function ApplyLineDiscount({ orderListId, visible, onHide }) {
  const dispatch = useDispatch();
  const orderList = useSelector(state => state.orderList);
  const order = orderList.list.find(o => o.orderListId === orderListId);


  const [selectedDiscountTypeId, setSelectedDiscountTypeId] = useState(DISCOUNT_TYPES.PERCENTAGE);

  const [discount, setDiscount] = useState({ value: null, isTouched: false, isValid: false });
  const [reason, setReason] = useState({ value: null, isTouched: false, isValid: false });
  const [otherReasonRemark, setOtherReasonRemark] = useState({ value: null, isTouched: false, isValid: false });
  const [isShowOtherReasonRemark, setIsShowOtherReasonRemark] = useState(null);

// Initialize state with default type id

// Handler for when a discount type is selected
const onDiscountTypeHandler = (typeId) => {
  setSelectedDiscountTypeId(typeId);
};

  const reasonOptions = [
    { name: "Customer Requested Change", id: 1 },
    { name: "Product Unavailability", id: 2 },
    { name: "Other Reason", id: OTHER_DISCOUNT_REASON_ID },
  ];


  useEffect(() => {
    if (order) {
      setSelectedDiscountTypeId(order.discountTypeId || DISCOUNT_TYPES.PERCENTAGE);
      setDiscount({
        value: order.discountValue ? order.discountValue.toString() : '',
        isTouched: false,
        isValid: !!order.discountValue
      });
  
      const isOtherReason = order.discountReason && order.discountReason.id === -1;
      setReason({
        value: isOtherReason ? { name: "Other Reason", id: OTHER_DISCOUNT_REASON_ID } : order.discountReason,
        isTouched: false,
        isValid: !!order.discountReason
      });
      setIsShowOtherReasonRemark(isOtherReason);

          // Only reset otherReasonRemark if switching to an order without it
      if (isOtherReason) {
        setOtherReasonRemark(prev => ({
          ...prev,
          value: order.discountReason?.remark || "",
          isValid: !!order.discountReason?.remark
        }));
      } else if (otherReasonRemark.value && !isOtherReason) {
        // Clear out only if needed when switching orders
        setOtherReasonRemark({ value: null, isTouched: false, isValid: false });
      }
    }
  }, [orderListId, order]);

  const onDiscountChange = (event) => {
    const newValue = event.target.value;
    const isValid = !isNaN(newValue) && parseFloat(newValue) > 0;
    setDiscount({ value: newValue, isTouched: true, isValid: isValid });
  };

  const onReasonChange = (selectedOption) => {
    const isValid = selectedOption && selectedOption.id !== 0;
    setReason({ value: selectedOption, isTouched: true, isValid: isValid });
    
    // Check if "Other Reason" is selected and update accordingly
    const showOther = selectedOption && selectedOption.id === OTHER_DISCOUNT_REASON_ID;
    setIsShowOtherReasonRemark(showOther);
  
    if (showOther) {
      // Initialize otherReasonRemark if it's going to be shown
      setOtherReasonRemark({ ...otherReasonRemark, isTouched: false });
    } else {
      // Clear otherReasonRemark when not relevant and ensure it's marked as valid
      setOtherReasonRemark({ value: null, isTouched: false, isValid: true });
    }
};


const handleApplyDiscount = () => {
  // Validate otherReasonRemark only if it's supposed to be shown
  const otherReasonValid = !isShowOtherReasonRemark || (otherReasonRemark.isValid && otherReasonRemark.value);

  if (discount.isValid && reason.isValid && otherReasonValid) {
    // Update reason with remark if otherReasonRemark is shown and valid
    let discountReason = { ...reason.value };
    if (isShowOtherReasonRemark && otherReasonRemark.isValid) {
      discountReason.remark = otherReasonRemark.value;
    }

    dispatch(applyDiscount({
      orderListId: orderListId,
      discountValue: parseFloat(discount.value),
      discountTypeId: selectedDiscountTypeId,
      discountReason: discountReason, // Updated reason object
    }));
    onHide();
  } else {
    setDiscount(prev => ({ ...prev, isTouched: true }));
    setReason(prev => ({ ...prev, isTouched: true }));
    if (isShowOtherReasonRemark) {
      setOtherReasonRemark(prev => ({ ...prev, isTouched: true }));
    }
  }
};

  return (
    <div className="">
      <Dialog
        header="Apply Line Discount"
        style={{ width: "40vw" }}
        visible={visible}
        onHide={onHide}
      >
        <div className="grid">
          <div className="col-12 mb-0 pb-0">
            <h3 className="my-0 py-0">Product Information</h3>
          </div>
          <div className="col-6">
            <div className="card">
              <p>
                <strong>Description:</strong> {order?.description}
              </p>
              <p>
                <strong>Product No:</strong> {order?.productNo}
              </p>
              <p>
                <strong>Quantity:</strong> {order?.qty}
              </p>
            </div>
          </div>
          <div className="col-6">
            <div className="card">
              <p>
                <strong>Gross Amount:</strong> {order?.grossAmount}
              </p>
              <p>
                <strong>Net Amount:</strong> {order?.netAmount}
              </p>
            </div>
          </div>
          {/* Reason Selection */}
          <div className="col-12 m-0 p-0">
            <div className="field">
              <label htmlFor="void-reason" className="col-fixed mb-0 pb-0">
                Discount Reason
              </label>
              <div className="col">
                <Dropdown
                  id="void-reason"
                  value={reason.value}
                  onChange={(e) => onReasonChange(e.value)}
                  options={reasonOptions}
                  optionLabel="name"
                  placeholder="Select the reason"
                  className="w-full"
                />
                {!reason.isValid && reason.isTouched && (
                  <FormElementMessage
                    className="mt-2"
                    severity="error"
                    text="Reason is required."
                  />
                )}
              </div>
            </div>
          </div>

          {/* Additional Remark Input */}
          {isShowOtherReasonRemark && (
            <div className="col-12 m-0 p-0">
              <div className="field">
                <label htmlFor="discount-perc" className="col-fixed mb-0 pb-0">
                  Other Reason
                </label>
                <div className="col">
                  <InputTextarea
                    id="discount-perc"
                    className="w-full"
                    rows={3}
                    value={otherReasonRemark.value || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setOtherReasonRemark({
                        value: newValue,
                        isTouched: true,
                        isValid: !!newValue.trim(),
                      });
                    }}
                  />
                  {!otherReasonRemark.isValid &&
                    otherReasonRemark.isTouched && (
                      <FormElementMessage
                        className="mt-2 w-full"
                        severity="error"
                        text="Other Reason is required."
                      />
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Discount Type Selection */}
          <div className="col-12 m-0 p-0">
            <div className="flex flex-row flex-wrap mb-4">
            <LineDiscountType
  title="Percentage"
  isSelected={selectedDiscountTypeId === DISCOUNT_TYPES.PERCENTAGE}
  onClick={() => onDiscountTypeHandler(DISCOUNT_TYPES.PERCENTAGE)}
/>
<LineDiscountType
  title="Fixed Amount"
  isSelected={selectedDiscountTypeId === DISCOUNT_TYPES.FIXED_AMOUNT}
  onClick={() => onDiscountTypeHandler(DISCOUNT_TYPES.FIXED_AMOUNT)}
/>
            </div>
          </div>

          {/* Discount Value Input */}
          <div className="col-12 m-0 p-0">
            <div className="field">
              <label htmlFor="discount-value" className="col-fixed mb-0 pb-0">
                {selectedDiscountTypeId === DISCOUNT_TYPES.PERCENTAGE
                  ? "Percentage (%)"
                  : "Fixed Amount($)"}
              </label>
              <div className="col">
                <InputText
                  id="discount-value"
                  type="number"
                  value={discount.value}
                  onChange={onDiscountChange}
                  className="p-inputtext w-full"
                />
                {!discount.isValid && discount.isTouched && (
                  <FormElementMessage
                    className="mt-2 w-full"
                    severity="error"
                    text="Invalid discount value."
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-12">
            <div className="flex justify-content-around mt-4 gap-4">
              {/* <Button
                label="Cancel Discount"
                severity="danger"
                className="w-full p-3"
                onClick={handleCancelDiscount}
              /> */}
              <Button
                label="Apply Discount"
                severity="primary"
                className="w-full p-3"
                onClick={handleApplyDiscount}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

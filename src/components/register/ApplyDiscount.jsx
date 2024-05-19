import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  applyDiscount,
  applyOverallDiscount,
} from "../../state/orderList/orderListSlice"; // Import actual actions
import FormElementMessage from "../messges/FormElementMessage";
import { InputTextarea } from "primereact/inputtextarea";
import {
  DISCOUNT_SCOPE,
  DISCOUNT_TYPES
} from "../../utils/constants";

import {validate} from '../../utils/formValidation';

const LineDiscountType = ({ title, isSelected, onClick }) => {
  return (
    <div
      className="md:col-3 sm:col-6"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <div className={`shadow-1 hover:shadow-4 surface-card border-round`}>
        <div
          className={`flex justify-content-center flex-wrap p-3 border-round ${
            isSelected ? "bg-primary" : ""
          }`}
        >
          <span className="font-bold">{title}</span>
        </div>
      </div>
    </div>
  );
};



const handleInputChange = (setState, state, value) => {
  console.log("Nlllll", state);
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

const reasonOptions = [
  { name: "Customer Requested Change", id: 3 },
  { name: "Product Unavailability", id: 2 },
  { name: "Other Reason", id: 1 },
];

export default function ApplyDiscount({
  orderListId,
  visible,
  onHide,
  discountScope,
  loadCount,
}) {

  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  //const order = orderList.list.find(o => o.orderListId === orderListId);
  const order =
    discountScope === DISCOUNT_SCOPE.PRODUCT_LEVEL
      ? orderList.list.find((o) => o.orderListId === orderListId)
      : orderList.orderSummary; // If overall, you might want to load from orderSummary or similar

  //const [selectedDiscountTypeId, setSelectedDiscountTypeId] = useState(DISCOUNT_TYPES.PERCENTAGE);
  const [discountType, setDiscountType] = useState({
    label: "Discount Type",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });
  const [reason, setReason] = useState({
    label: "Reason",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });
  const [discount, setDiscount] = useState({
    label: "Discount",
    value: "",
    isTouched: false,
    isValid: false,
    validationMessages: [],
    rules: { required: true, dataType: "decimal" },
  });
  const [otherReasonRemark, setOtherReasonRemark] = useState({
    label: "Remark",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const validateAll = () => {
    // List of all states to validate
    const states = [reason, discountType, discount, otherReasonRemark];
    const updatedStates = states.map((state) => {
      // Validate each state
      const validation = validate(state.value, state);

      // Return updated state
      return {
        ...state,
        isValid: validation.isValid,
        isTouched: true, // or based on some other logic
        validationMessages: validation.messages,
      };
    });

    // Now update all states
    setReason(updatedStates[0]);
    setDiscountType(updatedStates[1]);
    setDiscount(updatedStates[2]);
    setOtherReasonRemark(updatedStates[3]);

    // Check if all states are valid
    const allValid = updatedStates.every((state) => state.isValid);
    return allValid;
  };

  const clearControllers = () => {
    setDiscountType((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));

    setReason((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));

    setOtherReasonRemark((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));

    setDiscount((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
  };

  useEffect(() => {
    console.log("load discount details", order);
    if (discountScope === DISCOUNT_SCOPE.PRODUCT_LEVEL && order) {
      // setSelectedDiscountTypeId(order.discountTypeId || DISCOUNT_TYPES.PERCENTAGE);

      if (order.discount) {
        const {   reasonId,reasonName,reasonRemark, discountValue, discountTypeId } =
          order.discount;

        setDiscountType((prev) => ({
          ...prev,
          value: discountTypeId,
          isTouched: false,
          isValid: !!discountTypeId,
        }));

        setReason((prev) => ({
          ...prev,
          value: reasonId,
          isTouched: false,
          isValid: !!reasonId,
        }));

        setOtherReasonRemark((prev) => ({
          ...prev,
          value: reasonRemark || "",
          isTouched: false,
          isValid: !!reasonRemark,
        }));

        setDiscount((prev) => ({
          ...prev,
          value: discountValue.toString(),
          isTouched: false,
          isValid: !!discountValue,
        }));
      } else {
        clearControllers();
      }
    } else if (discountScope === DISCOUNT_SCOPE.ORDER_LEVEL) {
      const {
        overallDiscountTypeId,
        overallDiscountReasonId,
        overallDiscountReasonName,
        overallDiscountReasonRemark,
        overallDiscountValue,
      } = order;

      setDiscountType((prev) => ({
        ...prev,
        value: overallDiscountTypeId || "",
        isTouched: false,
        isValid: !!overallDiscountTypeId,
      }));

      setReason((prev) => ({
        ...prev,
        value: overallDiscountReasonId || "",
        isTouched: false,
        isValid: !!overallDiscountReasonId,
      }));

      setOtherReasonRemark((prev) => ({
        ...prev,
        value: overallDiscountReasonRemark || "",
        isValid: !!overallDiscountReasonRemark,
      }));

      setDiscount((prev) => ({
        ...prev,
        value: (overallDiscountValue && overallDiscountValue.toString()) || "",
        isTouched: false,
        isValid: !!overallDiscountValue,
      }));

      // ... [Handle other reason remark if applicable]
    }
  }, [orderListId, order, discountScope, loadCount]);

  const validationMessages = (state) => {
    // Ensure that the function returns JSX or null
    return (
      !state.isValid &&
      state.isTouched && (
        <div>
          {state.validationMessages.map((message, index) => (
            <FormElementMessage
              key={index}
              className="mt-2 w-full"
              severity="error"
              text={`Validation: ${message}`}
            />
          ))}
        </div>
      )
    );
  };

  const handleApplyDiscount = () => {
    const allValid = validateAll();

    if (!allValid) {
      // Handle validation errors
      console.error("Validation errors", {
        reason,
        discount,
        otherReasonRemark,
      });
      return; // Stop the dispatch or handle it accordingly
    }
    const _reason = reasonOptions.filter((r) => r.id === reason.value)[0];
    // const discountReason = {
    //   id: _reason.id,
    //   name: _reason.name,
    //   remark: otherReasonRemark.value,
    // };

    if (discountScope === DISCOUNT_SCOPE.PRODUCT_LEVEL) {
      dispatch(
        applyDiscount({
          orderListId: orderListId,
          discount: {
            discountValue: parseFloat(discount.value),
            discountTypeId: discountType.value,
            reasonId: _reason.id,
            reasonName: _reason.name,
            reasonRemark: otherReasonRemark.value,
          },
        })
      );
    } else if (discountScope === DISCOUNT_SCOPE.ORDER_LEVEL) {
      dispatch(
        applyOverallDiscount({
          discountValue: parseFloat(discount.value),
          discountTypeId: discountType.value,
          reasonId: _reason.id,
          reasonName: _reason.name,
          reasonRemark: otherReasonRemark.value,
        })
      );
    }
    onHide();
  };

  return (
    <div className="">
      <Dialog
        header={
          discountScope === DISCOUNT_SCOPE.PRODUCT_LEVEL
            ? "Apply Line Discount"
            : "Apply Overall Discount"
        }
        style={{ width: "40vw" }}
        visible={visible}
        onHide={onHide}
      >
        <div className="grid">
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
                  onChange={(e) => {
                    console.log("discount reason", reason);
                    handleInputChange(setReason, reason, e.value);
                  }}
                  options={reasonOptions}
                  optionLabel="name" // Property to use as the label
                  optionValue="id" // Property to use as the value
                  placeholder="Select the reason"
                  className="w-full"
                />
                {validationMessages(reason)}
              </div>
            </div>
          </div>

          {/* Additional Remark Input */}

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
                  onChange={(e) =>
                    handleInputChange(
                      setOtherReasonRemark,
                      otherReasonRemark,
                      e.target.value
                    )
                  }
                />
                {validationMessages(otherReasonRemark)}
              </div>
            </div>
          </div>

          {/* Discount Type Selection */}
          <div className="col-12 m-0 p-0">
            <div className="flex flex-row flex-wrap mb-4">
              <LineDiscountType
                title="Percentage"
                isSelected={discountType.value === DISCOUNT_TYPES.PERCENTAGE}
                onClick={() => {
                  handleInputChange(
                    setDiscountType,
                    discountType,
                    DISCOUNT_TYPES.PERCENTAGE
                  );
                  //onDiscountTypeHandler(DISCOUNT_TYPES.PERCENTAGE)
                }}
              />
              <LineDiscountType
                title="Fixed Amount"
                isSelected={discountType.value === DISCOUNT_TYPES.FIXED_AMOUNT}
                onClick={() => {
                  handleInputChange(
                    setDiscountType,
                    discountType,
                    DISCOUNT_TYPES.FIXED_AMOUNT
                  );
                  //onDiscountTypeHandler(DISCOUNT_TYPES.FIXED_AMOUNT)
                }}
              />
            </div>
            {validationMessages(discountType)}
          </div>

          {/* Discount Value Input */}
          <div className="col-12 m-0 p-0">
            <div className="field">
              <label htmlFor="discount-value" className="col-fixed mb-0 pb-0">
                {discountType.value === DISCOUNT_TYPES.PERCENTAGE
                  ? "Percentage (%)"
                  : "Fixed Amount($)"}
              </label>
              <div className="col">
                <InputText
                  id="discount-value"
                  type="number"
                  value={discount.value}
                  onChange={(e) => {
                    console.log("discount", e.target.value);
                    handleInputChange(setDiscount, discount, e.target.value); // Ensure 'discount' state has 'rules'
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(discount)}
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

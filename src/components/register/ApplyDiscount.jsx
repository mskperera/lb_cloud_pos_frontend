import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  applyDiscount,
  applyOverallDiscount,
} from "../../state/orderList/orderListSlice";
import {
  DISCOUNT_SCOPE,
  DISCOUNT_TYPES
} from "../../utils/constants";
import { validate } from '../../utils/formValidation';
import FormElementMessage from "../messges/FormElementMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import { faPercent, faTags } from "@fortawesome/free-solid-svg-icons";
import DialogModel from "../model/DialogModel";

const LineDiscountType = ({ title, isSelected, onClick, icon }) => {
  return (
    <div
      className="p-2 cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`flex items-center space-x-2 p-4 rounded-lg border ${isSelected ? "bg-blue-600 text-white border-blue-700" : "bg-white border-gray-200 hover:bg-gray-50"} shadow-md transition-colors duration-200`}
      >
        <FontAwesomeIcon icon={icon} className={`text-xl ${isSelected ? "text-white" : "text-blue-600"}`} />
        <span className="font-semibold text-center">{title}</span>
      </div>
    </div>
  );
};

const handleInputChange = (setState, state, value) => {
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

  const order =
    discountScope === DISCOUNT_SCOPE.PRODUCT_LEVEL
      ? orderList.list.find((o) => o.orderListId === orderListId)
      : orderList.orderSummary;

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
    const states = [reason, discountType, discount, otherReasonRemark];
    const updatedStates = states.map((state) => {
      const validation = validate(state.value, state);
      return {
        ...state,
        isValid: validation.isValid,
        isTouched: true,
        validationMessages: validation.messages,
      };
    });

    setReason(updatedStates[0]);
    setDiscountType(updatedStates[1]);
    setDiscount(updatedStates[2]);
    setOtherReasonRemark(updatedStates[3]);

    return updatedStates.every((state) => state.isValid);
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
    if (discountScope === DISCOUNT_SCOPE.PRODUCT_LEVEL && order) {
      if (order.discount) {
        const { reasonId, reasonName, reasonRemark, discountValue, discountTypeId } = order.discount;

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
    }
  }, [orderListId, order, discountScope, loadCount]);

  const validationMessages = (state) => {
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
    if (!validateAll()) {
      console.error("Validation errors", {
        reason,
        discount,
        otherReasonRemark,
      });
      return;
    }

    const _reason = reasonOptions.find((r) => r.id === parseInt(reason.value));

    if (!_reason) {
      console.error("Invalid reason selected");
      return;
    }

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
    <DialogModel
      header={
        discountScope === DISCOUNT_SCOPE.PRODUCT_LEVEL
          ? "Apply Line Discount"
          : "Apply Overall Discount"
      }
      onHide={onHide}
      visible={visible}
    >
      <div className="relative w-full max-w-xl">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <LineDiscountType
              title="Percentage"
              isSelected={discountType.value === DISCOUNT_TYPES.PERCENTAGE}
              onClick={() => handleInputChange(setDiscountType, discountType, DISCOUNT_TYPES.PERCENTAGE)}
              icon={faPercent}
            />
            <LineDiscountType
              title="Fixed Amount"
              isSelected={discountType.value === DISCOUNT_TYPES.FIXED_AMOUNT}
              onClick={() => handleInputChange(setDiscountType, discountType, DISCOUNT_TYPES.FIXED_AMOUNT)}
              icon={faTags}
            />
          </div>
          {validationMessages(discountType)}

          <div className="space-y-2">
            <label htmlFor="void-reason" className="block text-sm font-medium text-gray-700">
              Discount Reason
            </label>
            <select
              id="void-reason"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={reason.value}
              onChange={(e) => handleInputChange(setReason, reason, e.target.value)}
            >
              <option value="" disabled>Select the reason</option>
              {reasonOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            {validationMessages(reason)}
          </div>

          <div className="space-y-2">
            <label htmlFor="discount-perc" className="block text-sm font-medium text-gray-700">
              Other Reason
            </label>
            <textarea
              id="discount-perc"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              value={otherReasonRemark.value || ""}
              onChange={(e) => handleInputChange(setOtherReasonRemark, otherReasonRemark, e.target.value)}
            ></textarea>
            {validationMessages(otherReasonRemark)}
          </div>

          <div className="space-y-2">
            <label htmlFor="discount-value" className="block text-sm font-medium text-gray-700">
              {discountType.value === DISCOUNT_TYPES.PERCENTAGE ? "Percentage" : "Fixed Amount"}
            </label>
            <input
              id="discount-value"
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={discount.value}
              onChange={(e) => handleInputChange(setDiscount, discount, e.target.value)}
            />
            {validationMessages(discount)}
          </div>

          <div className="flex justify-between mt-6 space-x-2">
            <button
              type="button"
              className="w-1/2 py-2 px-4 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:ring-2 focus:ring-red-500"
              onClick={onHide}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-1/2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              onClick={handleApplyDiscount}
            >
              Apply Discount
            </button>
          </div>
        </div>
      </div>
    </DialogModel>
  );
}

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   applyDiscount,
//   applyOverallDiscount,
// } from "../../state/orderList/orderListSlice";
// import {
//   DISCOUNT_SCOPE,
//   DISCOUNT_TYPES
// } from "../../utils/constants";
// import { validate } from '../../utils/formValidation';
// import FormElementMessage from "../messges/FormElementMessage";


// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPercent, faTags } from "@fortawesome/free-solid-svg-icons";
// import DialogModel from "../model/DialogModel";

// const LineDiscountType = ({ title, isSelected, onClick,icon  }) => {
//   return (
//     <div
//       className={` p-2 cursor-pointer`}
//       onClick={onClick}
//     >
//       <div
//         className={`card bordered shadow-md ${isSelected ? "bg-primary text-white" : "bg-base-100"} p-4`}
//       >
//         <div className="flex items-center space-x-2">
//           <FontAwesomeIcon  icon={icon} className={` text-xl ${isSelected ? "text-white" : "text-primaryColor"}`} />
//           <span className="font-bold text-center">{title}</span>
//         </div>
//       </div>
//     </div>
//   );
// };




// const handleInputChange = (setState, state, value) => {
//   const validation = validate(value, state);
//   setState({
//     ...state,
//     value: value,
//     isValid: validation.isValid,
//     isTouched: true,
//     validationMessages: validation.messages,
//   });
// };

// const reasonOptions = [
//   { name: "Customer Requested Change", id: 3 },
//   { name: "Product Unavailability", id: 2 },
//   { name: "Other Reason", id: 1 },
// ];

// export default function ApplyDiscount({
//   orderListId,
//   visible,
//   onHide,
//   discountScope,
//   loadCount,
// }) {
//   const dispatch = useDispatch();
//   const orderList = useSelector((state) => state.orderList);

//   const order =
//     discountScope === DISCOUNT_SCOPE.PRODUCT_LEVEL
//       ? orderList.list.find((o) => o.orderListId === orderListId)
//       : orderList.orderSummary;

//   const [discountType, setDiscountType] = useState({
//     label: "Discount Type",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "integer" },
//   });

//   const [reason, setReason] = useState({
//     label: "Reason",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "string" },
//   });

//   const [discount, setDiscount] = useState({
//     label: "Discount",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     validationMessages: [],
//     rules: { required: true, dataType: "decimal" },
//   });

//   const [otherReasonRemark, setOtherReasonRemark] = useState({
//     label: "Remark",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });

//   const validateAll = () => {
//     const states = [reason, discountType, discount, otherReasonRemark];
//     const updatedStates = states.map((state) => {
//       const validation = validate(state.value, state);
//       return {
//         ...state,
//         isValid: validation.isValid,
//         isTouched: true,
//         validationMessages: validation.messages,
//       };
//     });

//     setReason(updatedStates[0]);
//     setDiscountType(updatedStates[1]);
//     setDiscount(updatedStates[2]);
//     setOtherReasonRemark(updatedStates[3]);

//     return updatedStates.every((state) => state.isValid);
//   };

//   const clearControllers = () => {
//     setDiscountType((prev) => ({
//       ...prev,
//       value: "",
//       isTouched: false,
//       isValid: false,
//     }));

//     setReason((prev) => ({
//       ...prev,
//       value: "",
//       isTouched: false,
//       isValid: false,
//     }));

//     setOtherReasonRemark((prev) => ({
//       ...prev,
//       value: "",
//       isTouched: false,
//       isValid: false,
//     }));

//     setDiscount((prev) => ({
//       ...prev,
//       value: "",
//       isTouched: false,
//       isValid: false,
//     }));
//   };

//   useEffect(() => {
//     if (discountScope === DISCOUNT_SCOPE.PRODUCT_LEVEL && order) {
//       if (order.discount) {
//         const { reasonId, reasonName, reasonRemark, discountValue, discountTypeId } = order.discount;

//         setDiscountType((prev) => ({
//           ...prev,
//           value: discountTypeId,
//           isTouched: false,
//           isValid: !!discountTypeId,
//         }));

//         setReason((prev) => ({
//           ...prev,
//           value: reasonId,
//           isTouched: false,
//           isValid: !!reasonId,
//         }));

//         setOtherReasonRemark((prev) => ({
//           ...prev,
//           value: reasonRemark || "",
//           isTouched: false,
//           isValid: !!reasonRemark,
//         }));

//         setDiscount((prev) => ({
//           ...prev,
//           value: discountValue.toString(),
//           isTouched: false,
//           isValid: !!discountValue,
//         }));
//       } else {
//         clearControllers();
//       }
//     } else if (discountScope === DISCOUNT_SCOPE.ORDER_LEVEL) {
//       const {
//         overallDiscountTypeId,
//         overallDiscountReasonId,
//         overallDiscountReasonRemark,
//         overallDiscountValue,
//       } = order;

//       setDiscountType((prev) => ({
//         ...prev,
//         value: overallDiscountTypeId || "",
//         isTouched: false,
//         isValid: !!overallDiscountTypeId,
//       }));

//       setReason((prev) => ({
//         ...prev,
//         value: overallDiscountReasonId || "",
//         isTouched: false,
//         isValid: !!overallDiscountReasonId,
//       }));

//       setOtherReasonRemark((prev) => ({
//         ...prev,
//         value: overallDiscountReasonRemark || "",
//         isValid: !!overallDiscountReasonRemark,
//       }));

//       setDiscount((prev) => ({
//         ...prev,
//         value: (overallDiscountValue && overallDiscountValue.toString()) || "",
//         isTouched: false,
//         isValid: !!overallDiscountValue,
//       }));
//     }
//   }, [orderListId, order, discountScope, loadCount]);

//   const validationMessages = (state) => {
//     return (
//       !state.isValid &&
//       state.isTouched && (
//         <div>
//           {state.validationMessages.map((message, index) => (
//             <FormElementMessage
//               key={index}
//               className="mt-2 w-full"
//               severity="error"
//               text={`Validation: ${message}`}
//             />
//           ))}
//         </div>
//       )
//     );
//   };

//   const handleApplyDiscount = () => {
//     if (!validateAll()) {
//       console.error("Validation errors", {
//         reason,
//         discount,
//         otherReasonRemark,
//       });
//       return;
//     }

//     const _reason = reasonOptions.find((r) => r.id === parseInt(reason.value));

//     if (!_reason) {
//       console.error("Invalid reason selected");
//       return;
//     }

//     if (discountScope === DISCOUNT_SCOPE.PRODUCT_LEVEL) {
//       dispatch(
//         applyDiscount({
//           orderListId: orderListId,
//           discount: {
//             discountValue: parseFloat(discount.value),
//             discountTypeId: discountType.value,
//             reasonId: _reason.id,
//             reasonName: _reason.name,
//             reasonRemark: otherReasonRemark.value,
//           },
//         })
//       );
//     } else if (discountScope === DISCOUNT_SCOPE.ORDER_LEVEL) {
//       dispatch(
//         applyOverallDiscount({
//           discountValue: parseFloat(discount.value),
//           discountTypeId: discountType.value,
//           reasonId: _reason.id,
//           reasonName: _reason.name,
//           reasonRemark: otherReasonRemark.value,
//         })
//       );
//     }
//     onHide();
//   };

//   return (
//     <DialogModel
//     header={ 
//       discountScope === DISCOUNT_SCOPE.PRODUCT_LEVEL
//         ? "Apply Line Discount"
//         : "Apply Overall Discount"}
//         onHide={onHide}
//     visible={visible}
 
//   >

   
//           <div className="relative w-full max-w-xl">



        
//             <form onSubmit={(e) => {
//               e.preventDefault();
//               handleApplyDiscount();
//             }}>
//               <div className="form-control mb-4">
//                 <label htmlFor="void-reason" className="label">
//                   Discount Reason
//                 </label>
//                 <select
//                   id="void-reason"
//                   className="select select-bordered w-full"
//                   value={reason.value}
//                   onChange={(e) => handleInputChange(setReason, reason, e.target.value)}
//                 >
//                   <option value="" disabled>Select the reason</option>
//                   {reasonOptions.map(option => (
//                     <option key={option.id} value={option.id}>
//                       {option.name}
//                     </option>
//                   ))}
//                 </select>
//                 {validationMessages(reason)}
//               </div>

//               <div className="form-control mb-4">
//                 <label htmlFor="discount-perc" className="label">
//                   Other Reason
//                 </label>
//                 <textarea
//                   id="discount-perc"
//                   className="textarea textarea-bordered w-full"
//                   rows={3}
//                   value={otherReasonRemark.value || ""}
//                   onChange={(e) => handleInputChange(setOtherReasonRemark, otherReasonRemark, e.target.value)}
//                 ></textarea>
//                 {validationMessages(otherReasonRemark)}
//               </div>

//               <div className="flex flex-wrap gap-2 mb-4">
//                 <LineDiscountType
//                   title="Percentage"
//                   isSelected={discountType.value === DISCOUNT_TYPES.PERCENTAGE}
//                   onClick={() => handleInputChange(setDiscountType, discountType, DISCOUNT_TYPES.PERCENTAGE)}
//                   icon={faPercent}
//                 />
//                 <LineDiscountType
//                   title="Fixed Amount"
//                   isSelected={discountType.value === DISCOUNT_TYPES.FIXED_AMOUNT}
//                   onClick={() => handleInputChange(setDiscountType, discountType, DISCOUNT_TYPES.FIXED_AMOUNT)}
//                   icon={faTags}
//                 />
//               </div>
//               {validationMessages(discountType)}

//               <div className="form-control mb-4">
//                 <label htmlFor="discount-value" className="label">
//                   {discountType.value === DISCOUNT_TYPES.PERCENTAGE ? "Percentage" : "Fixed Amount"}
//                 </label>
//                 <input
//                   id="discount-value"
//                   type="number"
//                   className="input input-bordered w-full"
//                   value={discount.value}
//                   onChange={(e) => handleInputChange(setDiscount, discount, e.target.value)}
//                 />
//                 {validationMessages(discount)}
//               </div>

//               <div className="flex justify-between mt-4">
//                 <button
//                   type="button"
//                   className="btn btn-outline btn-danger w-1/2 mr-2"
//                   onClick={onHide}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary w-1/2"
//                 >
//                   Apply Discount
//                 </button>
//               </div>
//             </form>
        
//           </div>
//        </DialogModel>
    
//   );
// }

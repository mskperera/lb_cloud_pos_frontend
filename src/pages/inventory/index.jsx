
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { validate } from "../../utils/formValidation";

import { useNavigate } from "react-router-dom";
import { getSuppliers } from "../../functions/dropdowns";
import { stockAdd } from "../../functions/stockEntry";
import InputField from "../../components/inputField/InputField";
import ProductSearch from "../../components/productSearch/ProductSearch";
import { formatCurrency } from "../../utils/format";
import TextAreaField from "../../components/inputField/TextAreaField";
import { useToast } from "../../components/useToast";
import FormElementMessage from "../../components/messges/FormElementMessage";

const StockAdjustment = () => {
  const navigate = useNavigate();
  const store = JSON.parse(localStorage.getItem("stores"))[0];

  const [stockEntryList, setStockEntryList] = useState([]);
  const [stockEntry, setStockEntry] = useState(null);

  const showToast = useToast();

  const [grnNo, setGrnNo] = useState("[New]");

  const [supplierBillNo, setSupplierBillNo] = useState({
    label: "Supplier Bill No",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [supplier, setSupplier] = useState({
    label: "Supplier",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });

  const [supplierOptions, setSupplierOptions] = useState([]);

  const [grnDate, setGrnDate] = useState({
    label: "GRN Date",
    value: moment().format("YYYY-MM-DD"), // Format the date for default display in the date input
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "date" },
  });

  const [amountPaid, setAmountPaid] = useState({
    label: "Amount Paid",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [remark, setRemark] = useState({
    label: "Remark",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDrpSupplier();
  }, []);

  const loadDrpSupplier = async () => {
    const objArr = await getSuppliers();
    console.log("objArr", objArr.data.results[0]);
    setSupplierOptions(objArr.data.results[0]);
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

  const validationMessages = (state) => {
    return (
      !state.isValid &&
      state.isTouched && (
        <div>
          {state.validationMessages.map((message, index) => (
            <FormElementMessage key={index} severity="error" text={message} />
          ))}
        </div>
      )
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!supplierBillNo.value || !supplier.value || !amountPaid.value) {
      showToast("danger", "Exception", "Fill all required fields.");
      return;
    }

    // const payLoad = {
    //   supplierId: supplier.value,
    //   storeId: store.storeId,
    //   stockReceivedDate: grnDate.value,
    //   amountPaid: amountPaid.value,
    //   remark: remark.value,
    //   orderList: [
    //     {
    //       productId: 160,
    //       unitPrice: "200",
    //       unitCost: "100",
    //       qty: 1,
    //       productTypeId: 2,
    //     },
    //     {
    //       productId: 161,
    //       unitPrice: "200",
    //       unitCost: "150",
    //       qty: 1,
    //       productTypeId: 2,
    //     },
    //     {
    //       productId: 245,
    //       unitPrice: "200",
    //       unitCost: "150",
    //       qty: 1,
    //       productTypeId: 1,
    //     },
    //   ],
    //   isConfirm: true,
    // };

    const orderList = stockEntryList.map((entry) => ({
      productId:
        entry.productTypeId === 2 ? entry.variationProductId : entry.productId,
      unitPrice: entry.unitPrice,
      unitCost: entry.unitCost,
      qty: entry.qty,
      productTypeId: entry.productTypeId,
      productionDate: entry.productionDate,
      expirationDate: entry.expirationDate,
    }));

    const payLoad = {
      supplierId: supplier.value,
      storeId: store.storeId,
      stockReceivedDate: grnDate.value,
      amountPaid: amountPaid.value,
      remark: remark.value,
      supplierBillNo: supplierBillNo.value,
      orderList, // Use the dynamically created orderList
      isConfirm: true,
    };

    const res = await stockAdd(payLoad);

    if (res.data.error) {
      showToast("danger", "Exception", res.data.error.message);
      return;
    }

    const responseStatus = res.data.outputValues.responseStatus;

    if (responseStatus === "falied") {
      showToast("danger", "Exception", "Fill all required fields.");
      return;
    }

    showToast("success", "Success", res.data.outputValues.outputMessage);

    setSupplierBillNo({ ...supplierBillNo, value: "" });
    setSupplier({ ...supplier, value: "" });
    setAmountPaid({ ...amountPaid, value: "" });

    setStockEntryList([]);
  };

  const addProductHandler = () => {
    if (
      !stockEntry ||
      !stockEntry.unitPrice ||
      !stockEntry.unitCost ||
      !stockEntry.qty
    ) {
      showToast("danger", "Exception", "Fill all required fields.");
      return;
    }

    if (
      stockEntry.isExpiringProduct === 1 &&
      (!stockEntry.productionDate || !stockEntry.expirationDate)
    ) {
      showToast(
        "danger",
        "Exception",
        "Expirationdate and production date is required."
      );
      return;
    }
    setStockEntryList((prev) => [...prev, stockEntry]);
    setStockEntry(null); // Clear current stock entry
    showToast("success", "Success", "Product added to the list.");
  };

  const handleProductClick = (p) => {
    console.log("unitPrice", p);
    const order = { ...p };

    setStockEntry(order);
  };

  const totalCost = stockEntryList.reduce(
    (acc, item) => acc + item.qty * item.unitCost,
    0
  );

  const [isExpiringProductChecked, setIsExpiringProductChecked] =
    useState(false);

  return (
    <>
      <div className="container mx-auto p-6">
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Combo Ingredients Section */}
            <div className="col-span-2">
              <h3 className="text-center font-bold text-xl">Stock Adjustment</h3>
            </div>
            <div className="col-span-2">
              <button
                className="flex items-center btn btn-ghost text-gray-600 p-0 m-0 hover:bg-transparent hover:text-primaryColorHover text-right"
                onClick={() => navigate("/stockEntryList")}
              >
                <i className="pi pi-book text-xl"></i>
                <span className="">Stock Adjustments History</span>
              </button>
            </div>

            <div className="col-span-2">
              <div className="grid grid-cols-4 gap-4">
             

                <div className="flex flex-col"></div>

                <div className="col-span-2 pt-10">
                  <ProductSearch onProductSelect={handleProductClick} />
                </div>
              </div>

              {stockEntry && (
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mt-5 mb-5 bg-slate-50 p-4 round-lg">
                  <>
                    <InputField
                      label="Product No"
                      isReadOnly={true}
                      value={stockEntry.productNo}
                    />
                    <InputField
                      label="Product Name"
                      isReadOnly={true}
                      value={stockEntry.productName}
                    />
                    <InputField
                      label="Product Type"
                      isReadOnly={true}
                      value={stockEntry.productTypeName}
                    />

                    <InputField
                      label="Unit Price"
                      type="number"
                      value={stockEntry.unitPrice}
                      onChange={(e) =>
                        setStockEntry({
                          ...stockEntry,
                          unitPrice: e.target.value,
                        })
                      }
                    />
                    <InputField
                      label="Unit Cost"
                      type="number"
                      required={true}
                      value={stockEntry.unitCost}
                      onChange={(e) =>
                        setStockEntry({
                          ...stockEntry,
                          unitCost: e.target.value,
                        })
                      }
                      placeholder="Enter Unit Cost"
                    />
                    <div className="flex gap-2">
                      <InputField
                        label="Qty"
                        type="number"
                        required={true}
                        value={stockEntry.qty}
                        onChange={(e) =>
                          setStockEntry({ ...stockEntry, qty: e.target.value })
                        }
                        placeholder="Enter Qty"
                      />
                      <span className="mt-auto mb-3">
                        {stockEntry.measurementUnitName}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mt-10 justify-end">
                      <input
                        type="checkbox"
                        id="singleProduct"
                        className="cursor-pointer"
                        checked={isExpiringProductChecked}
                        onChange={(e) =>
                          setIsExpiringProductChecked(e.target.checked)
                        }
                      />
                      <label
                        htmlFor="singleProduct"
                        className="text-lg cursor-pointer"
                      >
                        Expiring Product
                      </label>
                    </div>

                    <InputField
                      label="Production Date"
                      value={stockEntry.productionDate}
                      onChange={(e) =>
                        setStockEntry({
                          ...stockEntry,
                          productionDate: e.target.value,
                        })
                      }
                      placeholder=""
                      type="date"
                      isDisabled={!stockEntry.isExpiringProduct}
                    />

                    <InputField
                      label="Expiration Date"
                      value={stockEntry.expirationDate}
                      onChange={(e) =>
                        setStockEntry({
                          ...stockEntry,
                          expirationDate: e.target.value,
                        })
                      }
                      placeholder=""
                      type="date"
                      isDisabled={!stockEntry.isExpiringProduct}
                    />

                    <button
                      type="button"
                      className="btn btn-primary w-[50%] mt-auto"
                      onClick={addProductHandler}
                    >
                      Add
                    </button>
                  </>
                </div>
              )}

              <div className="mt-5">
                {stockEntryList.length > 0 ? (
                  <table className="table border-collapse w-full">
                    <thead className="sticky top-0 bg-base-100 z-10 text-sm border-b border-gray-300">
                      <tr>
                        <th className="px-4 py-2">Product Name</th>
                        <th className="px-4 py-2">Product Type</th>
                        <th className="px-4 py-2">SKU</th>
                        <th className="px-4 py-2">Qty</th>
                        <th className="px-4 py-2">
                          Production and Expiration Date
                        </th>
                        <th className="px-4 py-2">Unit Cost</th>
                        <th className="px-4 py-2">Unit Price</th>
                        <th className="px-4 py-2">Total Cost</th>{" "}
                        {/* New Column */}
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {stockEntryList.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 hover:bg-gray-100 bg-slate-50 text-[1rem]"
                        >
                          <td className="px-4 py-2">{item.productName}</td>
                          <td className="px-4 py-2">{item.productTypeName}</td>
                          <td className="px-4 py-2">{item.sku}</td>
                          <td className="px-4 py-2">
                            {item.qty} {item.measurementUnitName}
                          </td>
                          <td className="px-4 py-2">
                            {item.productionDate} - {item.expirationDate}
                          </td>
                          <td className="px-4 py-2">{item.unitCost}</td>
                          <td className="px-4 py-2">{item.unitPrice}</td>

                          <td className="px-4 py-2">
                            {/* Calculate and display total cost */}
                            {(item.qty * item.unitCost).toFixed(2)}{" "}
                            {/* Display Total Cost */}
                          </td>
                          <td className="px-4 py-2">
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-red-500 hover:text-red-700 cursor-pointer"
                              onClick={() =>
                                setStockEntryList(
                                  stockEntryList.filter((_, i) => i !== index)
                                )
                              }
                              title="Remove Item"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex justify-center h-20 items-center rounded-lg text-gray-400 bg-slate-50">
                    {" "}
                    No items in the stock entry list.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-20 mt-5 mb-5  p-4 rounded-lg">
            <div className="col-span-2">
              <TextAreaField
                label={remark.label}
                value={remark.value}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter Remark"
                rows={5}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="mt-4 flex justify-between">
                <span className="font-semibold text-lg">Total Cost</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(totalCost)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-lg mt-auto mb-3">
                  Amount Paid
                </span>
                <InputField
                  // label={amountPaid.label}
                  value={amountPaid.value}
                  type="number"
                  onChange={(e) =>
                    handleInputChange(setAmountPaid, amountPaid, e.target.value)
                  }
                  validationMessages={validationMessages(amountPaid)}
                  placeholder="Enter Paid Amount"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              className={`btn btn-primary w-56 ${
                isSubmitting ? "loading" : ""
              }`}
              onClick={onSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit Stock Entry"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default StockAdjustment;

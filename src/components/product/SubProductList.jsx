import React, { useState } from 'react';
import { useToast } from '../useToast';
import { getProducts } from '../../functions/register';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ProductSearch2 from '../productSearch/ProductSearch2';
import InputField from '../inputField/InputField';
import { validate } from '../../utils/formValidation';
import FormElementMessage from '../messges/FormElementMessage';

const SubProductList = ({
  subProductsList,
  setSubProductsList,
}) => {
  const showToast = useToast();
  const [productDetails, setProductDetails] = useState(null);
  const [showInputSection, setShowInputSection] = useState(false); // State to control visibility

  const [subProductQty, setSubProductQty] = useState({
    label: "Qty",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
    validationMessages: [],
  });

  const [subProductSku, setSubProductSku] = useState({
    label: "Sub-Product Sku",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
    validationMessages: [],
  });

  const handleProductClick = (p) => {
    setProductDetails(p);
    handleInputChange(setSubProductSku, subProductSku, p.sku);
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

  const validateAll = () => {
    let invalidCount = 0;

    if (!productDetails) {
      setSubProductSku({
        ...subProductSku,
        isValid: false,
        isTouched: true,
        validationMessages: ["SKU is required"],
      });
      invalidCount++;
    }

    if (!subProductQty.value) {
      setSubProductQty({
        ...subProductQty,
        isValid: false,
        isTouched: true,
        validationMessages: ["Quantity is required"],
      });
      invalidCount++;
    }

    return invalidCount === 0;
  };

  const validationMessages = (state) => {
    return (
      !state.isValid &&
      state.isTouched && (
        <div className='mt-2'>
          {state.validationMessages.map((message, index) => (
            <FormElementMessage key={index} severity="error" text={message} />
          ))}
        </div>
      )
    );
  };

  const addSubProduct = async () => {
    const isValidatedAll = validateAll();
    if (!isValidatedAll) {
      return;
    }

    const newSubProduct = {
      allProductId: productDetails.allProductId,
      qty: subProductQty.value,
      productDescription: productDetails.productDescription,
      productTypeName: productDetails.productTypeName,
      sku: productDetails.sku,
      measurementUnitName: productDetails.measurementUnitName,
    };

    if (subProductsList.find((i) => i.sku === productDetails.sku)) {
      showToast("danger", "Exception", "The Product already exists.");
      return;
    }

    setSubProductsList([...subProductsList, newSubProduct]);
    setProductDetails(null);
    setSubProductSku({ ...subProductSku, value: "", isTouched: false, isValid: false });
    setSubProductQty({ ...subProductQty, value: "", isTouched: false, isValid: false });
    setShowInputSection(false); // Hide input section after adding
  };

  const cancelSubProduct = () => {
    setProductDetails(null);
    setSubProductSku({ ...subProductSku, value: "", isTouched: false, isValid: false });
    setSubProductQty({ ...subProductQty, value: "", isTouched: false, isValid: false });
    setShowInputSection(false); // Hide input section
  };

  return (
    <div className="bg-sky-100 p-4 rounded-md shadow-sm">
      <div className='flex justify-between items-center'>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Sub-Products</h3>
        {!showInputSection && (
          <button
            type="button"
            className="mb-4 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200"
            onClick={() => setShowInputSection(true)}
          >
            Add Sub-Product
          </button>
        )}
      </div>
      <div>
        {showInputSection && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center mb-4">
              <div className="flex flex-col col-span-2">
                <label className="font-medium text-gray-700 mb-1">Search Sub-Product</label>
                <ProductSearch2 onProductSelect={handleProductClick} />
                {validationMessages(subProductSku)}
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">{subProductQty.label}</label>
                <div className='flex justify-start gap-1 items-center'>
                  <div>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                      value={subProductQty.value}
                      onChange={(e) => handleInputChange(setSubProductQty, subProductQty, e.target.value)}
                      placeholder="Enter Quantity"
                    />
                    {validationMessages(subProductQty)}
                  </div>
                  {productDetails?.measurementUnitName}
                </div>
              </div>
              <div className="flex gap-2 self-end">
                <button
                  type="button"
                  className="px-4 py-3 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200"
                  onClick={addSubProduct}
                >
                  Add to list
                </button>
                <button
                  type="button"
                  className="px-4 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                  onClick={cancelSubProduct}
                >
                  Cancel
                </button>
              </div>
            </div>

            {productDetails && (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div className='flex flex-col gap-2'>
                    <p className="text-base font-medium">Product Name:</p>
                    <p className="text-gray-600">{productDetails.productName}</p>
                  </div>
                  {productDetails.variationValue && productDetails.variationValue !== 'null' && (
                    <div className='flex flex-col gap-2'>
                      <p className="text-base font-medium">Variation:</p>
                      <p className="text-gray-600">
                        {JSON.parse(productDetails.variationValue).join(', ')}
                      </p>
                    </div>
                  )}
                  <div className='flex flex-col gap-2'>
                    <p className="text-base font-medium">SKU:</p>
                    <p className="text-gray-600">{productDetails.sku}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
   <div className="overflow-x-auto">
  {subProductsList.length > 0 ? (
    <table className="w-full border-collapse">
      <thead className="bg-gray-100 border-b border-gray-200">
        <tr>
          <th className="px-4 py-2 text-left">Sub-Product Description</th>
          <th className="px-4 py-2 text-left">SKU</th>
          <th className="px-4 py-2 text-left">Quantity</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {subProductsList.map((item) => (
          <tr key={item.allProductId} className="bg-white border">
            <td className="px-4 py-2">{item.productDescription}</td>
            <td className="px-4 py-2">{item.sku}</td>
            <td className="px-4 py-2">
              {item.qty} {item.measurementUnitName}
            </td>
            <td className="px-4 py-2">
              <button
                type="button"
                className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors duration-200"
                onClick={() => {
                  setSubProductsList(
                    subProductsList.filter(
                      (c) => c.allProductId !== item.allProductId
                    )
                  );
                }}
                aria-label="Delete Sub-Product"
                title="Delete Sub-Product"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="text-center text-gray-500 py-4 bg-white">
      No sub-products found.
    </div>
  )}
</div>

    </div>
  );
};

export default SubProductList;
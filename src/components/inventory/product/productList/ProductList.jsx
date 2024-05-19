import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

//import { ProductService } from './service/ProductService';
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "../../../../utils/format";
import { deleteProduct, getProducts } from "../../../../functions/register";
import { InputSwitch } from "primereact/inputswitch";
import ProductMenuPaginator from "../../../TablePaginator";
import { useNavigate } from "react-router-dom";
import { Badge } from "primereact/badge";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useToast } from "../../../useToast";
import moment from 'moment';
import { Skeleton } from "primereact/skeleton";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { getDropdownMeasurementUnit, getDrpdownCategory } from "../../../../functions/dropdowns";
import { validate } from "../../../../utils/formValidation";
import FormElementMessage from "../../../messges/FormElementMessage";
import './productList.css';

export default function ProductOrderList({ }) {
  const [products, setProducts] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState([]);
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [selectedMeasurmentUnitId, setSelectedMeasurmentUnitId] = useState(-1);

  const [currentPage, setCurrentPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(10);

  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
    loadProducts(selectedCategoryId, event.page, rowsPerPage);
  };

  const [selectedFilterBy,setSelectedFilterBy] =useState({
    label: "Filter by",
    value: 1,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });

  const [searchValue,setSearchValue] =useState({
    label: "Search Value",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });


  const loadProducts = async () => {
    try{
    setIsTableDataLoading(true);
    const skip = currentPage * rowsPerPage;
    const limit = rowsPerPage;

    const filteredData = {
      productId: null,
      productNo: selectedFilterBy.value===1 ? searchValue.value:null,
      productName: selectedFilterBy.value===2 ? searchValue.value:null,

      barcode: selectedFilterBy.value===3 ? searchValue.value:null,
      categoryId: selectedCategoryId,
      measurementUnitId:selectedMeasurmentUnitId,
      searchByKeyword: false,
      skip: skip,
      limit: limit,
    };
    const _result = await getProducts(filteredData, null);
    const { totalRows } = _result.data.outputValues;
    setTotalRecords(totalRows);
    console.log("ppppp", _result.data);

    setProducts(_result.data.results[0]);
    setIsTableDataLoading(false);
  }
  catch(err){
    setIsTableDataLoading(false);
    console.log('error:',err);
  }
  };

  useEffect(() => {
    console.log("useEffect lo");
    loadProducts();
  }, [selectedCategoryId,selectedMeasurmentUnitId, currentPage, rowsPerPage]);



  useEffect(() => {
    
    if(searchValue.value){
    console.log("useEffect search by value");
    const delayedLoadProducts = setTimeout(() => {
      loadProducts();
    }, 1000);
    
    return () => clearTimeout(delayedLoadProducts);
  }

}, [searchValue.value]);


  const [filterByOptions,setFilterByOptions] =useState([{id:1,displayName:'Product No'},{id:2,displayName:'Product Name'},{id:3,displayName:'Barcode'}]);

  const [categoryOptions,setCategoryOptions] =useState([]);
  const [measurementUnitOptions,setMeasurementUnitOptions] =useState([]);



  useEffect(()=>{
    loadDrpCategory();
    loadDrpMeasurementUnit();
  },[]);

  const loadDrpCategory=async ()=>{
    const objArr=await getDrpdownCategory();
    setCategoryOptions([{id:-1,displayName:'All'},...objArr.data.results[0]])
  }

  const loadDrpMeasurementUnit=async ()=>{
    const objArr=await getDropdownMeasurementUnit();
    setMeasurementUnitOptions([{id:-1,displayName:'All'},...objArr.data.results[0]])
  }




  const actionButtons = (product) => {
    return (
      <div className="action-button-group">
        <Button
          icon="pi pi-times"
          onClick={async () => {
            console.log("deleteAcceptHandler :", product);
            const result = await deleteProduct(product.productId, false);
            const { outputMessage, responseStatus } = result.data.outputValues;

            console.log("result :", result.data.outputValues);

            confirm(outputMessage, product.productId);
          }}
          rounded
          text
          severity="danger"
          tooltip="Delete Product"
          aria-label="Delete"
        />
        <Button
          icon="pi pi-pencil"
          onClick={() => {
            navigate(`/addProduct/update/${product.productId}`);
          }}
          rounded
          text
          severity="warning"
          tooltip="Edit Product"
          aria-label="Edit"
        />
      </div>
    );
  };




  

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
              text={`${message}`}
            />
          ))}
        </div>
      )
    );
  };

  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

  const deleteAcceptHandler = async (productId) => {
    try {
      console.log("deleteAcceptHandler :", productId);
      const result = await deleteProduct(productId, true);

      const { data } = result;
      if (data.error) {
        showToast("error", "Exception", data.error.message);
        return;
      }

      setProducts(products.filter(p=>p.productId!==productId));
      showToast("success", "Successful", data.outputValues.outputMessage);
    } catch (err) {
      console.log("err :", err);
    }
  };
  const deleteCancelHandler = () => {
    console.log("delted");
    setSelectedIdToDelete(null);
  };

  const confirm = (outputMessage, id) => {
    confirmDialog({
      message: outputMessage,
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      //defaultFocus: 'reject',
      acceptClassName: "p-button-danger",
      accept: () => deleteAcceptHandler(id),
      reject: deleteCancelHandler,
    });
  };

  const productNoBodyTemplate = (rowData) => {
    return isTableDataLoading ? <Skeleton /> : <span>{rowData.productNo}</span>;
  };

  const productNameBodyTemplate = (rowData) => {
    return isTableDataLoading ? <Skeleton /> : <span>{rowData.productName}</span>;
  };

  const measurementUnitNameBodyTemplate = (rowData) => {
    return isTableDataLoading ? <Skeleton /> : <span>{rowData.measurementUnitName}</span>;
  };
  const unitPriceBodyTemplate = (rowData) => {
    return isTableDataLoading ? <Skeleton /> : <span>{formatCurrency(rowData.unitPrice)}</span>;
  };
  const barcodeBodyTemplate = (rowData) => {
    return isTableDataLoading ? <Skeleton /> : <span>{rowData.barcode}</span>;
  };
  const taxRate_percBodyTemplate = (rowData) => {
    return isTableDataLoading ? <Skeleton /> : <span>{rowData.taxRate_perc}</span>;
  };

  const categoriesBodyTemplate = (product) => {
    const categories = JSON.parse(product.categories);
    return (
       isTableDataLoading ? <Skeleton /> : <>
      {categories.map((c) => (
        <Badge
          size="small"
          className="m-1"
          key={c.id}
          value={c.displayName}
        ></Badge>
      ))}
    </>
    );
  };
  const modifiedDateBodyTemplate = (product) => {
    const localFormattedDate = moment.utc(product.modifiedDate_UTC).format('YYYY-MMM-DD hh:mm:ss A');
    
    return isTableDataLoading ? <Skeleton /> : <span>{product.modifiedDate_UTC ? localFormattedDate:''}</span>;
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

  return (
    <>
      <ConfirmDialog />

        <div className="flex justify-content-between align-items-center px-5 gap-2">
          <div className="col-9">
            <div className="grid w-full">
            <div className="col-12 lg:col-3">
                <div className="flex">
                  <div className="flex-1 flex flex-column mr-3">
                    <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5"
                    >
                      Category
                    </label>
                    <Dropdown
                      id="void-reason"
                      value={selectedCategoryId}
                      onChange={(e) => {
                        setSelectedCategoryId(e.value);
                      }}
                      options={categoryOptions}
                      optionLabel="displayName" // Property to use as the label
                      optionValue="id" // Property to use as the value
                      placeholder="Category"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 lg:col-3">
                <div className="flex">
                  <div className="flex-1 flex flex-column mr-3">
                    <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5"
                    >
                      Measurement Unit
                    </label>
                    <Dropdown
                      id="void-reason"
                      value={selectedMeasurmentUnitId}
                      onChange={(e) => {
                        setSelectedMeasurmentUnitId(e.value);
                      }}
                      options={measurementUnitOptions}
                      optionLabel="displayName" // Property to use as the label
                      optionValue="id" // Property to use as the value
                      placeholder="Measurement Unit"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 lg:col-2">
           
                  <div className="flex-1 flex flex-column mr-3">
                    <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5"
                    >
                      Filter By
                    </label>
                    <Dropdown
                      id="void-reason"
                      value={selectedFilterBy.value}
                      onChange={(e) => {
                        handleInputChange(
                          setSelectedFilterBy,
                          selectedFilterBy,
                          e.value
                        );
                      }}
                      options={filterByOptions}
                      optionLabel="displayName" // Property to use as the label
                      optionValue="id" // Property to use as the value
                    //  placeholder="Filter by"
                      className="w-full dropdown-field"
                    />
                  </div>
         

              </div>
              <div className="col-12 lg:col-4">
                <div className="flex">
                  <div className="flex-1 flex flex-column mr-3">
                    <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5"
                    >
                      Search Value
                    </label>
                    <InputText
                      id="searchValue"
                     // placeholder="Search here"
                      value={searchValue.value}
                      onChange={(e) => {
                        handleInputChange(
                          setSearchValue,
                          searchValue,
                          e.target.value
                        );
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
          
            </div>
          </div>

          <Button
            label="Add Product"
            onClick={() => {
              navigate(`/addProduct/add/0`);
            }}
            icon="pi pi-plus"
            rounded
          />
        </div>

        {isTableDataLoading ? (
          <div className="flex justify-content-center">
            <p className="text-lg">Loading...</p>
          </div>
        ) : (
          <>
            {" "}
            <DataTable
              value={products}
              scrollable
              scrollHeight="500px"
              selectionMode="single" // or "multiple" for multiple row selection
              tableStyle={{ minWidth: "50rem" }}
            >
              {/* Columns */}
              <Column field="productId" header="Product Id"></Column>
              <Column
                field="productNo"
                body={productNoBodyTemplate}
                header="Product No"
              ></Column>
              <Column
                field="productName"
                body={productNameBodyTemplate}
                header="Product Name"
              ></Column>
              <Column
                field="measurementUnitName"
                body={measurementUnitNameBodyTemplate}
                header="Measurement Unit"
              ></Column>

              <Column
                field="unitPrice"
                body={unitPriceBodyTemplate}
                header="Unit Price"
              ></Column>
              <Column
                field="barcode"
                body={barcodeBodyTemplate}
                header="Barcode"
              ></Column>
              <Column
                field="categories"
                body={categoriesBodyTemplate}
                header="Category"
              ></Column>
              <Column
                field="taxRate_perc"
                body={taxRate_percBodyTemplate}
                header="Tax Rate(%)"
              ></Column>
              <Column
                field="modifiedDate_UTC"
                body={modifiedDateBodyTemplate}
                header="Modified"
              ></Column>
              <Column header="" body={actionButtons}></Column>
            </DataTable>
            <ProductMenuPaginator
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRecords={totalRecords}
              onPageChange={onPageChange}
            />
          </>
        )}
    
    </>
  );
}

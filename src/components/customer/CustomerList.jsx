import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

//import { ProductService } from './service/ProductService';
import { InputSwitch } from "primereact/inputswitch";
import TablePaginator from "../TablePaginator";
import { useNavigate, useRouteError } from "react-router-dom";
import { Badge } from "primereact/badge";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useToast } from "../useToast";
import moment from 'moment';
import { Skeleton } from "primereact/skeleton";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { validate } from "../../utils/formValidation";
import FormElementMessage from "../messges/FormElementMessage";
import { deleteCustomer, getCustomers } from "../../functions/customer";

export default function CustomerList({selectingMode,onselect }) {
  const [products, setCustomers] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState([]);
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [selectedMeasurmentUnitId, setSelectedMeasurmentUnitId] = useState(-1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(10);

  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
    loadCustomers(selectedCategoryId, event.page, rowsPerPage);
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


  const loadCustomers = async () => {
    try{
    setIsTableDataLoading(true);
    const skip = currentPage * rowsPerPage;
    const limit = rowsPerPage;

    const filteredData = {
      customerId: null,
      customerCode: selectedFilterBy.value===1 ? searchValue.value:null,
      customerName: selectedFilterBy.value===2 ? searchValue.value:null,

      email: selectedFilterBy.value===3 ? searchValue.value:null,
      mobile: selectedFilterBy.value===4 ? searchValue.value:null,
      tel: selectedFilterBy.value===5 ? searchValue.value:null,
      whatsappNumber: selectedFilterBy.value===6 ? searchValue.value:null,

      searchByKeyword: false,
      skip: skip,
      limit: limit,
    };
    const _result = await getCustomers(filteredData, null);
    const { totalRows } = _result.data.outputValues;
    setTotalRecords(totalRows);
    console.log("ppppp", _result.data);

    setCustomers(_result.data.results[0]);
    setIsTableDataLoading(false);
  }
  catch(err){
    setIsTableDataLoading(false);
    console.log('error:',err);
  }
  };

  useEffect(() => {
    console.log("useEffect lo");
    loadCustomers(selectedCategoryId);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    console.log("useEffect search by value");
    if(searchValue.value){
    const delayedLoadCustomers = setTimeout(() => {
        loadCustomers(selectedCategoryId);
    }, 1000);

    return () => clearTimeout(delayedLoadCustomers);
  }
  
}, [searchValue.value]);



  const [filterByOptions,setFilterByOptions] =useState([{id:1,displayName:'Customer Code'},{id:2,displayName:'Customer Name'},{id:3,displayName:'Email'},{id:4,displayName:'Mobile'},{id:5,displayName:'Tel'},{id:6,displayName:'Whatsapp'}]);



  const actionButtons = (customer) => {
    return (
      <div className="action-button-group">
              {selectingMode ?       
         <Button
          icon="pi pi-play"
          onClick={() => {
            onselect(customer.customerId); 
          }}
          rounded
          text
          severity="info"
          tooltip="Select"
          aria-label="Select"
        />:
        <>
        <Button
          icon="pi pi-times"
          onClick={async () => {
            console.log("deleteAcceptHandler :", customer);
            const result = await deleteCustomer(customer.customerId, false);
            const { outputMessage, responseStatus } = result.data.outputValues;

            console.log("result :", result.data.outputValues);

            confirm(outputMessage, customer.customerId);
          }}
          rounded
          text
          severity="danger"
          tooltip="Delete Customer"
          aria-label="Delete"
        />
        <Button
          icon="pi pi-pencil"
          onClick={() => {
            navigate(`/addCustomer/update/${customer.customerId}`);
          }}
          rounded
          text
          severity="warning"
          tooltip="Edit Customer"
          aria-label="Edit"
        />
        </>
        }
      </div>
    );
  };



  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

  const deleteAcceptHandler = async (customerId) => {
    try {
      console.log("deleteAcceptHandler :", customerId);
      const result = await deleteCustomer(customerId, true);

      const { data } = result;
      if (data.error) {
        showToast("error", "Exception", data.error.message);
        return;
      }

      setCustomers(products.filter(p=>p.customerId!==customerId));
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



  const modifiedDateBodyTemplate = (customer) => {
    const localFormattedDate = moment.utc(customer.modifiedDate_UTC).format('YYYY-MMM-DD hh:mm:ss A');
    
    return isTableDataLoading ? <Skeleton /> : <span>{customer.modifiedDate_UTC ? localFormattedDate:''}</span>;
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
              <div className="col-12 lg:col-2">
                <div className="flex">
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
                      className="w-full"
                    />
                  </div>
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

<div className="flex align-items-center gap-4">
          <Button
            tooltip="Select cutomer"
            disabled={!selectedCustomer}
            tooltipOptions={{ position: "left" }}
            rounded
            // outlined
            onClick={() => {
              onselect(selectedCustomer.customerId); 
            }}
            icon="pi pi-play"
          />

          <Button
            tooltip="Add new cutomer"
            tooltipOptions={{ position: "left" }}
            rounded
            
            onClick={() => {
              navigate(`/addCustomer/add/0`);
            }}
            icon="pi pi-plus"
          />
          </div>
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
              tableStyle={{ minWidth: "50rem" }}
              selectionMode="single" // or "multiple" for multiple row selection
              selection={selectedCustomer}
              onSelectionChange={(e) => setSelectedCustomer(e.value)}
            >
              {/* Columns */}
              <Column field="customerId" header="Customer Id"></Column>
              <Column field="customerCode" header="Customer Code"></Column>
              <Column field="customerName" header="Customer Name"></Column>
              <Column field="email" header="Email"></Column>

              <Column field="mobile" header="Mobile"></Column>
              <Column field="tel" header="Tel"></Column>
              <Column field="whatsappNumber" header="Whatsapp Number"></Column>
              <Column
                field="modifiedDate_UTC"
                body={modifiedDateBodyTemplate}
                header="Modified"
              ></Column>
              <Column header="" body={actionButtons}></Column>
            </DataTable>
            <TablePaginator
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

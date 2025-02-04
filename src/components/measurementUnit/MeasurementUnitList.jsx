import React, { useEffect, useState } from 'react';
import ReusableTable from '../table/ReusableTable';
import Pagination from '../pagination/Pagination';
import GhostButton from '../iconButtons/GhostButton';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { useToast } from '../useToast';
import DialogModel from '../model/DialogModel';
import { SAVE_TYPE } from '../../utils/constants';
import ManageMeasurementUnit from './ManageMeasurementUnit';
import { deleteMeasurementUnit, getMeasurementUnits } from '../../functions/measurementUnit';

const MeasurementUnitList = ({ isTableDataLoading }) => {
  const showToast = useToast();

  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Start from page 1
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const rowsPerPageOptions = [5, 10, 15, 20]; // Option for rows per page

  const [idToDelete, setIdToDelete] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [measurementUnitToEdit, setMeasurementUnitToEdit] = useState(null); // For editing measurementUnit
  
      const [saveType, setSaveType] = useState(SAVE_TYPE.ADD);

const [isManageModalOpen,setIsManageModalOpen]=useState(false);


  // Load measurementUnits based on pagination and filter
  const loadMeasurementUnitData = async () => {
    try {
      const skip = (currentPage - 1) * rowsPerPage;
      const limit = rowsPerPage;

      const filteredData = {
        measurementUnitId: null,
        skip: skip,
        limit: limit,
      };

      const result = await getMeasurementUnits(filteredData, null);
      const { totalRows } = result.data.outputValues;
      setTotalRecords(totalRows);

      const records = result.data.results[0];
      console.log('MeasurementUnits:', records);

      const orderedData = records.map((e) => ({
        measurementUnitId: e.measurementUnitId,
        measurementUnitName: e.measurementUnitName,
      }));

      setMeasurementUnits(orderedData);
    } catch (err) {
      console.log('Error fetching measurementUnits:', err);
    }
  };

  useEffect(() => {
    loadMeasurementUnitData();
  }, [currentPage, rowsPerPage]);

  if (isTableDataLoading) {
    return <p>Loading measurementUnits...</p>;
  }

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when rows per page change
  };

  const tableHeaders = [
    { text: 'Unit Name', key: 'measurementUnitName', alignment: 'left' },
    { text: 'Unit Id', key: 'measurementUnitId', alignment: 'left' },
  ];

  const handleCancel = () => {
    setShowDialog(false);
    setIdToDelete('');
  };

  const deleteAcceptHandler = async (id) => {
    try {
      const result = await deleteMeasurementUnit(idToDelete);
      const { data } = result;
      if (data.error) {
        showToast("danger", "Exception", data.error.message);
        return;
      }
      setMeasurementUnits(measurementUnits.filter((p) => p.measurementUnitId !== id));
      setTotalRecords(totalRecords - 1);
      setIdToDelete("");
      setShowDialog(false);
      loadMeasurementUnitData();
      showToast("success", "Successful", data.outputValues.outputMessage);
    } catch (err) {
      console.log("err :", err);
    }
  };

  // Edit function
  const handleEdit = (measurementUnit) => {
    setMeasurementUnitToEdit(measurementUnit);
    setSaveType(SAVE_TYPE.UPDATE);
    setIsManageModalOpen(true);
  };

  const loadItemsHandler=()=>{
    loadMeasurementUnitData();
    console.log ('loadMeasurementUnitData');
  }
  const setIsMangeModalOpenHandler=(isOpen)=>{
    console.log ('isOpen',isOpen);
setIsManageModalOpen(isOpen)
  }

  const ActionButtons = React.memo(({ rowData }) => {
    const handleDelete = () => {
      setIdToDelete(rowData.measurementUnitId);
      setShowDialog(true);
    };

    return (
      <div className='flex justify-center gap-4 m-0 p-0'>
        <GhostButton
          onClick={() => handleEdit(rowData)}
          iconClass="pi pi-pencil text-lg"
           labelClass="text-md font-normal"
          label="Edit"
          color="text-blue-500"
          hoverClass="hover:text-blue-700 hover:bg-transparent"
        />
        <GhostButton
          onClick={handleDelete}
          iconClass="pi pi-trash  text-lg"
           labelClass="text-md font-normal"
          label="Delete"
          color="text-red-500"
          hoverClass="hover:text-red-700 hover:bg-transparent"
        />
      </div>
    );
  });



  return (
    <div>

<DialogModel
                header={saveType === SAVE_TYPE.ADD ? 'Add New Measurement Unit' : 'Update Measurement Unit'}
                visible={isManageModalOpen}
                maximizable
                onHide={() => {
                  setIsManageModalOpen(false);
                  setSaveType(SAVE_TYPE.ADD);
                  setMeasurementUnitToEdit(null);
                }}
            >
  <ManageMeasurementUnit loadItems={loadItemsHandler} isManageModalOpen={setIsMangeModalOpenHandler} measurementUnitToEdit={measurementUnitToEdit} />
  </DialogModel>


    
        <ConfirmDialog
          isVisible={showDialog}
          message={measurementUnitToEdit ? `Edit measurementUnit ${measurementUnitToEdit.measurementUnitName}` : "Are you sure you want to delete this item?"}
          onConfirm={deleteAcceptHandler}
          onCancel={handleCancel}
          title={measurementUnitToEdit ? "Edit Measurement Unit" : "Confirm Delete"}
          severity={measurementUnitToEdit ? "info" : "danger"}
        />

 <div className="">
      <h3 className='text-xl font-bold text-center pt-10'>Measurement Units</h3>

      <div className='flex justify-between items-center mb-2'>
        <span>Total Records: {totalRecords}</span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPageOptions={rowsPerPageOptions}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

<GhostButton
          onClick={()=>{
            setIsManageModalOpen(true);
            setMeasurementUnitToEdit(null);
            setSaveType(SAVE_TYPE.ADD);
          }}
          iconClass="pi pi-plus"
          label="Add Measurement Unit"
          color="text-blue-500"
          hoverClass="hover:text-blue-700 hover:bg-transparent"
        />
      </div>
     </div>

      <ReusableTable
        tableHeaders={tableHeaders}
        reportData={measurementUnits}
        fixedHeader={true}
        actionButtons={<ActionButtons />}
      />
    </div>
  );
};

export default MeasurementUnitList;

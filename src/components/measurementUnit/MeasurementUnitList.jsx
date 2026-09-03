import React, { useEffect, useState } from 'react';
import ReusableTable from '../../components/ReusableTable';
import DaisyUIPaginator from '../DaisyUIPaginator';
import GhostButton from '../iconButtons/GhostButton';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { useToast } from '../useToast';
import DialogModel from '../model/DialogModel';
import { SAVE_TYPE } from '../../utils/constants';
import ManageMeasurementUnit from './ManageMeasurementUnit';
import { deleteMeasurementUnit, getMeasurementUnits } from '../../functions/measurementUnit';
import { Ruler } from 'lucide-react';

const MeasurementUnitList = ({ isTableDataLoading }) => {
 const showToast = useToast();

  const [measurementUnits, setMeasurementUnits] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(10);




  const [idToDelete, setIdToDelete] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [measurementUnitToEdit, setMeasurementUnitToEdit] = useState(null);
  const [saveType, setSaveType] = useState(SAVE_TYPE.ADD);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const loadMeasurementUnitData = async () => {
    try {
      const skip = currentPage * rowsPerPage;
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


  const onPageChange = ({ page, rows }) => {
    setCurrentPage(page);
    setRowsPerPage(rows);
  };




  const tableColumns = [
    {
      header: "Unit Name",
      key: "measurementUnitName",
      accessor: "measurementUnitName",
      headerClass: "text-left font-bold text-black",
      cellClass: "font-semibold text-black",
      render: (item) => (
        <span className="text-sm font-semibold text-black">
          {item.measurementUnitName}
        </span>
      ),
    },
  ];

  const handleCancel = () => {
    setShowDialog(false);
    setIdToDelete('');
  };

  const deleteAcceptHandler = async (id) => {
    try {
      const result = await deleteMeasurementUnit(idToDelete);
      setShowDialog(false);
      const { data } = result;

      if (data.error) {
        showToast("danger", "Exception", data.error.message);
        return;
      }

      const { outputMessage, responseStatus } = data.outputValues;
      if (responseStatus === "failed") {
        showToast("warning", "Exception", outputMessage);
        return;
      }

      setMeasurementUnits(measurementUnits.filter((p) => p.measurementUnitId !== id));
      setTotalRecords(totalRecords - 1);
      setIdToDelete("");
      showToast("success", "Successful", outputMessage);
      loadMeasurementUnitData();
    } catch (err) {
      console.log("err :", err);
    }
  };

  const handleEdit = (measurementUnit) => {
    setMeasurementUnitToEdit(measurementUnit);
    setSaveType(SAVE_TYPE.UPDATE);
    setIsManageModalOpen(true);
  };

  const loadItemsHandler = () => {
    loadMeasurementUnitData();
  };

  const setIsMangeModalOpenHandler = (isOpen) => {
    setIsManageModalOpen(isOpen);
  };

  if (isTableDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-4 ">
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
        <ManageMeasurementUnit 
          loadItems={loadItemsHandler} 
          isManageModalOpen={setIsMangeModalOpenHandler} 
          measurementUnitToEdit={measurementUnitToEdit} 
        />
      </DialogModel>

      <ConfirmDialog
        isVisible={showDialog}
        message={measurementUnitToEdit ? `Edit measurementUnit ${measurementUnitToEdit.measurementUnitName}` : "Are you sure you want to delete this item?"}
        onConfirm={deleteAcceptHandler}
        onCancel={handleCancel}
        title={measurementUnitToEdit ? "Edit Measurement Unit" : "Confirm Delete"}
        severity={measurementUnitToEdit ? "info" : "danger"}
      />

      <div className="overflow-hidden">
        
        <div className="px-6 py-4  flex items-center justify-between">
         <div className="flex items-center gap-2.5">
 
  <div className="p-2 text-gray-600  flex items-center justify-center">
    <Ruler className="w-7 h-7" />
  </div>

  <h2 className="text-xl font-bold text-gray-600 tracking-tight">
    Measurement Units
  </h2>
</div>

          <button
            onClick={() => {
              setIsManageModalOpen(true);
              setMeasurementUnitToEdit(null);
              setSaveType(SAVE_TYPE.ADD);
            }}
                 className="flex text-sm items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold 
                rounded-lg md:rounded-xl shadow-md hover:bg-emerald-700 transition ml-auto"  >
            <i className="pi pi-plus text-xs"></i>
            <span>Add Unit</span>
          </button>
        </div>

        {/* Table Content Container */}
         <div className="p-4 ">
    
         <ReusableTable
  data={measurementUnits}
  isLoading={isTableDataLoading}
  columns={tableColumns}
  currentPage={currentPage}
  rowsPerPage={rowsPerPage}
  totalRecords={totalRecords}
  onPageChange={onPageChange}
  rowsPerPageOptions={[10, 30, 50, 100]}
  paginationPosition="bottom"
  customActions={(item) => (
    <div className="flex justify-end gap-2 pr-2">
      <GhostButton
        onClick={() => handleEdit(item)}
        iconClass="pi pi-pencil"
        labelClass="text-sm font-medium"
        label="Edit"
        color="text-amber-600"
        hoverClass="hover:text-amber-700 hover:bg-amber-50 px-2 py-1 rounded"
      />
      <GhostButton
        onClick={() => {
          setIdToDelete(item.measurementUnitId);
          setShowDialog(true);
        }}
        iconClass="pi pi-trash"
        labelClass="text-sm font-medium"
        label="Delete"
        color="text-red-600"
        hoverClass="hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded"
      />
    </div>
  )}
/>
     


  {/* <div className="py-2 px-6 bg-white border-t border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">

<div className="text-xs text-gray-500 font-medium">
   <span className="font-bold text-gray-900">
   

    {measurementUnits.length ? (currentPage * rowsPerPage) + 1 : 0}</span> - <span className="font-bold text-gray-800">{Math.min((currentPage + 1) * rowsPerPage, totalRecords)}

   
   </span>
    <span> of </span>
    <span className="font-bold text-gray-900">{totalRecords}</span>
    <span> items found</span>
  </div>

  <div className="flex items-center">
    <DaisyUIPaginator
      currentPage={currentPage}
      rowsPerPage={rowsPerPage}
      totalRecords={totalRecords}
      onPageChange={onPageChange}
      rowsPerPageOptions={[10, 30, 50, 100]}
    />
  </div>
</div> */}

        </div>






      </div>
    </div>
  );
};

export default MeasurementUnitList;
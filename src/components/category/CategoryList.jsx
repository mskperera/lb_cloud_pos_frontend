import React, { useEffect, useState } from 'react';
import { deleteCategory, getCategories, updateCategory } from '../../functions/category'; // Make sure updateCategory is available in the functions
import ReusableTable from '../table/ReusableTable';
import Pagination from '../pagination/Pagination';
import GhostButton from '../iconButtons/GhostButton';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { useToast } from '../useToast';
import DialogModel from '../model/DialogModel';
import ManageCategory from './ManageCategory';
import { SAVE_TYPE } from '../../utils/constants';

const CategoryList = ({ isTableDataLoading }) => {
  const showToast = useToast();

  const [categories, setCategories] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Start from page 1
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const rowsPerPageOptions = [5, 10, 15, 20]; // Option for rows per page

  const [idToDelete, setIdToDelete] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null); // For editing category
  
      const [saveType, setSaveType] = useState(SAVE_TYPE.ADD);

const [isManageModalOpen,setIsManageModalOpen]=useState(false);


  // Load categories based on pagination and filter
  const loadCategoriesData = async () => {
    try {
      const skip = (currentPage - 1) * rowsPerPage;
      const limit = rowsPerPage;

      const filteredData = {
        categoryId: null,
        skip: skip,
        limit: limit,
      };

      const result = await getCategories(filteredData, null);
      const { totalRows } = result.data.outputValues;
      setTotalRecords(totalRows);

      const records = result.data.results[0];
      console.log('Categories:', records);

      const orderedData = records.map((e) => ({
        categoryId: e.categoryId,
        categoryName: e.categoryName,
      }));

      setCategories(orderedData);
    } catch (err) {
      console.log('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    loadCategoriesData();
  }, [currentPage, rowsPerPage]);

  if (isTableDataLoading) {
    return <p>Loading categories...</p>;
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
    { text: 'Category Name', key: 'categoryName', alignment: 'left' },
    { text: 'Category Id', key: 'categoryId', alignment: 'left' },
  ];

  const handleCancel = () => {
    setShowDialog(false);
    setIdToDelete('');
  };

  const deleteAcceptHandler = async (id) => {
    try {
      const result = await deleteCategory(idToDelete);
      const { data } = result;
      if (data.error) {
        showToast("danger", "Exception", data.error.message);
        return;
      }
      setCategories(categories.filter((p) => p.categoryId !== id));
      setTotalRecords(totalRecords - 1);
      setIdToDelete("");
      setShowDialog(false);
      loadCategoriesData();
      showToast("success", "Successful", data.outputValues.outputMessage);
    } catch (err) {
      console.log("err :", err);
    }
  };

  // Edit function
  const handleEdit = (category) => {
    setCategoryToEdit(category);
    setSaveType(SAVE_TYPE.UPDATE);
    setIsManageModalOpen(true);
  };

  const loadItemsHandler=()=>{
    loadCategoriesData();
    console.log ('loadCategoriesData');
  }
  const setIsMangeModalOpenHandler=(isOpen)=>{
    console.log ('isOpen',isOpen);
setIsManageModalOpen(isOpen)
  }

  const ActionButtons = React.memo(({ rowData }) => {
    const handleDelete = () => {
      setIdToDelete(rowData.categoryId);
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
                header={saveType === SAVE_TYPE.ADD ? 'Add New Category' : 'Update Category'}
                visible={isManageModalOpen}
                maximizable
                onHide={() => {
                  setIsManageModalOpen(false);
                  setSaveType(SAVE_TYPE.ADD);
                  setCategoryToEdit(null);
                }}
            >
  <ManageCategory loadItems={loadItemsHandler} isManageModalOpen={setIsMangeModalOpenHandler} categoryToEdit={categoryToEdit} />
  </DialogModel>


    
        <ConfirmDialog
          isVisible={showDialog}
          message={categoryToEdit ? `Edit category ${categoryToEdit.categoryName}` : "Are you sure you want to delete this item?"}
          onConfirm={deleteAcceptHandler}
          onCancel={handleCancel}
          title={categoryToEdit ? "Edit Category" : "Confirm Delete"}
          severity={categoryToEdit ? "info" : "danger"}
        />

 <div className="">
      <h3 className='text-xl font-bold text-center pt-10'>Categories</h3>

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
            setCategoryToEdit(null);
            setSaveType(SAVE_TYPE.ADD);
          }}
          iconClass="pi pi-plus"
          label="Add Category"
          color="text-blue-500"
          hoverClass="hover:text-blue-700 hover:bg-transparent"
        />
      </div>
     </div>

      <ReusableTable
        tableHeaders={tableHeaders}
        reportData={categories}
        fixedHeader={true}
        actionButtons={<ActionButtons />}
      />
    </div>
  );
};

export default CategoryList;

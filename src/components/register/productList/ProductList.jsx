
import React, { useState, useEffect } from 'react';
import ProductSearch from '../../ProductSearch';
import { getCategoryMenu, getProducts } from '../../../functions/register';
import { ScrollPanel } from 'primereact/scrollpanel';
import TablePaginator from '../../TablePaginator';
import { useDispatch } from 'react-redux';
import { addOrder } from '../../../state/orderList/orderListSlice';
import Decimal from 'decimal.js';
import './productList.css'
import ProductItem from './productItem/ProductItem';

 const  ProductList=() =>{

  const dispatch=useDispatch();
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);
 const [selectedCategoryId, setSelectedCategoryId] = useState(-1); // State to track the selected category

    // Function to handle category selection
    const handleCategorySelect = (categoryId) => {
      setSelectedCategoryId(categoryId);
      // Optional: Update products based on selected category
      // loadProducts(categoryId);
    };


    const [currentPage, setCurrentPage] = useState(0);

    const [rowsPerPage,setRowsPerPage] = useState(30);
    const [totalRecords,setTotalRecords] = useState(10);

    const onPageChange = (event) => {
        setCurrentPage(event.page);
        setRowsPerPage(event.rows);
        loadProducts(selectedCategoryId, event.page, rowsPerPage);
    };


  const loadProducts=async(categoryId )=>{

    const skip = currentPage * rowsPerPage;
        const limit = rowsPerPage;

    const filteredData={
      "productId":null,
        "productNo": null,
       "productName": null,
     
       "barcode": null,
       categoryId:categoryId,
         "searchByKeyword":false,
           skip:skip,
       limit:limit
     }
   const _result=await getProducts(filteredData,null);
   const {totalRows}=_result.data.outputValues;
   setTotalRecords(totalRows)
console.log('products',_result
)

   setProducts(_result.data.results[0]);
  }

  useEffect(() => {
    console.log('useEffect lo')
    loadProducts(selectedCategoryId);
}, [selectedCategoryId, currentPage,rowsPerPage]);




  const loadCategories=async()=>{
    const filteredData={
           "skip":null,
       "limit":null
     }
   const _result=await getCategoryMenu(filteredData,null);
console.log('ppppp',_result.data.results[0])

setCategories(_result.data.results[0]);
  }

  useEffect(() => {
    loadCategories();
  }, []);


  const [layout, setLayout] = useState("grid");

  // useEffect(() => {
  //     ProductService.getProducts().then((data) => setProducts(data.slice(0, 12)));
  // }, []);

  const handleProductClick=(p)=>{

//     "orderList":[
//       {"productId":2 , "unitPrice": "200", "qty": 4, "lineDiscount_perc": "0"},
// //   {"productId": 2, "unitPrice": "200", "qty": -1, "lineDiscount_perc": "0","returnItem":{"isReturned":"1","orderDetailId":46}}
//     //  {"productId": 4, "unitPrice": "900", "qty": -1, "lineDiscount_perc": "0","returnItem":{"isReturned":"1","orderDetailId":2}}
//     ],

console.log('pprrrr', p);
const description = p.productName;
const qty = 1;

const unitPrice =Number(p.unitPrice);
// Update the 'order' object to use netAmount
const order = {
  productNo:p.productNo,
  description,
  productId: p.productId,
  unitPrice,
  lineTaxRate:p.taxRate_perc,//perc
  qty
};

dispatch(addOrder(order));
  }
  
  

  return (
    <>
      <div className=" " style={{ margin: "0px", display: "flex" }}>
        <div className="" style={{}}>
          <ScrollPanel style={{ height: "75vh" }}>
            <div className="categoryContainer">
              {categories.map((c) => (
                <button
                  key={c.categoryId}
                  onClick={() => handleCategorySelect(c.categoryId)}
                  className={`categoryItem ${selectedCategoryId === c.categoryId && 'categoryItem-active'}`}
                  // style={{
                  //   background:
                  //      ? "#3F51B5" : "white", // Highlight selected category
                  //   color:
                  //     selectedCategoryId === c.categoryId ? "white" : "inherit", // Highlight selected category
                  // }}
                >
                  <div className="">
                    <span className="text-md">{c.categoryName}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollPanel>
        </div>

        <div className="productMenuPanelContainer">
          <div style={{margin:'0px 40px 0px 10px'}}>
          <ProductSearch />
          </div>
  
          <ScrollPanel style={{ height: "70vh" }}>
            {/* {JSON.stringify(products)} */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
              
              }}
            >
              {products.map((p, index) => (
                <ProductItem key={index} p={p} handleProductClick={handleProductClick} />
              ))}
            </div>
          </ScrollPanel>
          <TablePaginator
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      
      />
        </div>
      </div>

    </>
  );
}
    
export default ProductList;
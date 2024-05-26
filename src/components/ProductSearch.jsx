import './module.productSearch.css';
const ProductSearch = () => {
    return (
        <div className="" >
        {/* <span className="p-input-icon-right card " style={{ width: '100%',background:'white',borderWidth:0,borderRadius:30 }}> */}
            {/* <i className="pi pi-search " /> */}
            {/* <InputText placeholder="Barcode / Product Search" style={{ width: '100%',borderWidth:0,borderRadius:30 }} type="text"
             className="p-inputtext-md" /> */}
       
    <div className="menu-search-box-container">
      <div className="preicon">
       <i className="pi pi-search text-gray-500 sm:text-xl" />
      </div>
      <input type="text" name="price" id="price" className="menu-search-box" 
      placeholder="Barcode / Product Search" />
   
    </div>

        {/* </span> */}
        </div>
    );
}

export default ProductSearch;

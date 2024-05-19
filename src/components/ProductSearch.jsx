import { InputText } from "primereact/inputtext";

const ProductSearch = () => {
    return (
        <div className="" >
        <span className="p-input-icon-right card " style={{ width: '100%',background:'white',borderWidth:0,borderRadius:30 }}>
            <i className="pi pi-search " />
            <InputText placeholder="Barcode / Product Search" style={{ width: '100%',borderWidth:0,borderRadius:30 }} type="text"
             className="p-inputtext-md" />
        </span>
        </div>
    );
}

export default ProductSearch;

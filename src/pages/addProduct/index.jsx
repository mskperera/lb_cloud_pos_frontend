import { useLocation, useParams } from "react-router-dom";
import AddProducts from "../../components/product/AddProduct";

const Products=()=>{
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const saveType = queryParams.get('saveType');
  const id = queryParams.get('id');
  
  return <>

  <AddProducts saveType={saveType} id={id} />
  </>
}

export default Products;
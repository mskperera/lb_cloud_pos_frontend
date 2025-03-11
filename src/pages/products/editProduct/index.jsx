import { useLocation, useParams } from "react-router-dom";
import AddProducts from "../../../components/product/AddProduct";
import { SAVE_TYPE } from "../../../utils/constants";

const Products=()=>{
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const saveType = SAVE_TYPE.UPDATE;
  const id = queryParams.get('id');
  console.log('saveType',saveType)
  return <>

  <AddProducts saveType={saveType} id={id} />
  </>
}

export default Products;
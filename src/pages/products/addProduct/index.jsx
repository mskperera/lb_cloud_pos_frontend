import AddProducts from "../../../components/product/AddProduct";
import { SAVE_TYPE } from "../../../utils/constants";

const Products=()=>{
  const saveType = SAVE_TYPE.ADD;

  console.log('saveType',saveType)
  return <>

  <AddProducts saveType={saveType} />
  </>
}

export default Products;
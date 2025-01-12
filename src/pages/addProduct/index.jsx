import { useParams } from "react-router-dom";
import AddProducts from "../../components/product/AddProduct";

const Products=()=>{
  let { saveType,id } = useParams();
  return <>

  <AddProducts saveType={saveType} id={id} />
  </>
}

export default Products;
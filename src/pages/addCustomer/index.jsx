import { useParams } from "react-router-dom";
import AddCustomerComp from "../../components/customer/AddCustomerComp";

const AddCustomer=()=>{
  let { saveType,id } = useParams();
  return <>

  <AddCustomerComp saveType={saveType} id={id} />
  </>
}

export default AddCustomer;
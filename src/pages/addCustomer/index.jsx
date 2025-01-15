import { useLocation, useParams } from "react-router-dom";
import AddCustomerComp from "../../components/customer/AddCustomerComp";

const AddCustomer=()=>{
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const saveType = queryParams.get('saveType');
  const id = queryParams.get('id');

  return <>

  <AddCustomerComp saveType={saveType} id={id} />
  </>
}

export default AddCustomer;
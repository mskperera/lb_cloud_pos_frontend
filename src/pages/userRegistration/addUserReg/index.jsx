import { useLocation, useParams } from "react-router-dom";
import AddCustomerComp from "../../../components/customer/AddCustomerComp";
import { SAVE_TYPE } from "../../../utils/constants";

const AddCustomer=()=>{
  const saveType = SAVE_TYPE.ADD;

  
    console.log('saveType',saveType)
    return <>
  <AddCustomerComp saveType={saveType} />
  </>
}

export default AddCustomer;
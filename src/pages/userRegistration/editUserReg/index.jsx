import { useLocation, useParams } from "react-router-dom";
import AddCustomerComp from "../../../components/customer/AddCustomerComp";
import { SAVE_TYPE } from "../../../utils/constants";

const EditUserReg=()=>{
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const saveType = SAVE_TYPE.UPDATE;
  const id = queryParams.get('id');

  return <>
  <AddCustomerComp saveType={saveType} id={id} />
  </>
}

export default EditUserReg;
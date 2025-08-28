import { useLocation } from "react-router-dom";
import StockAdjustmentList from "../../../components/inventory/StockAdjustmentList";

const Page = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const inventoryId = queryParams.get('inventoryId');

return (
    <StockAdjustmentList inventoryId={inventoryId} />
  );

}


export default Page;

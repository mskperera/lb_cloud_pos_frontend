import { useLocation } from "react-router-dom";
import StockAdjustmentList from "../../../components/inventory/StockAdjustmentList";

const Page = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const inventoryId = queryParams.get('inventoryId');
  const productName = queryParams.get('prodN');
  const measurementUnitName = queryParams.get('measU');
  const sku = queryParams.get('sku');
  const productNo = queryParams.get('prodNo');
  const qty = queryParams.get('qty');
  
  const product={productName,measurementUnitName,sku,productNo,qty};

return (
    <StockAdjustmentList inventoryId={inventoryId} product={product}/>
  );

}


export default Page;

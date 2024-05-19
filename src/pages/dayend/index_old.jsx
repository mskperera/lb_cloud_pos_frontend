import { InputText } from "primereact/inputtext";
import { useState } from "react";
import DayEndReportPreview from "../../components/DayEndReportPreview";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import InputSwitchCustom from "../../components/InputSwitchCustom";
import { useNavigate} from "react-router-dom";
const CashDenomination=({label,onChange,value})=>{
    return (
        <div className="mb-2">
        {/* <div className="flex flex-row align-items-center justify-content-between">
    <label htmlFor="lastname3" className="col-fixed" >{label} X</label>
    <InputText onChange={onChange} />
    </div> */}
    <span className="p-input-icon-left">
    <i className="pi pi-money-bill" />
    <InputText placeholder={`Enter qty for ${label}`} />
</span>
    </div>
    )
}



const DayendDetail=({label,value})=>{
    return (
        <div className="mb-2 p-2 pl-4 pr-4 card">
        <div className="flex flex-row align-items-center justify-content-between">
    <span className="font-bold">{label}</span>
    <span>{value}</span>
    </div></div>
    )
}

const TextInputWithLabel=({readonly,label,value,placeholder})=>{
 return <div className="mb-2 bg-primary" style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}>
  <span className="p-input-icon-left" style={{ display: 'flex', alignItems: 'center' }}>
    <span className="custom-icon" style={{ marginRight: '5px',marginLeft:'10px',fontWeight:'bold' }}>{label} </span>
    <InputText readOnly={readonly} style={{ border: 'none', boxShadow: 'none' }} placeholder={placeholder} value={value} />
  </span>
</div>
}





const DayEnd = () => {
  const navigate=useNavigate()
const cashDenominations=[{label:"Rs 5",value:5},
{label:"Rs 10",value:10},
{label:"Rs 20",value:20}
,{label:"Rs 50",value:50}
,{label:"Rs 100",value:100}
,{label:"Rs 500",value:500}
,{label:"Rs 1000",value:1000}
,{label:"Rs 5000",value:5000}];

  return (
    <div className="grid pl-5">
        <div className="col-12">
        <div className='flex flex-row align-items-center justify-content-between p-0 gap-5 pr-4'>
    <Button icon="pi pi-chevron-left custom-target-icon" 
    rounded text aria-label="Filter" size='large' tooltip="Back to Home" 
    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
     onClick={()=>{
      navigate("/register")
     }} />

    <div className='flex flex-row gap-3 align-items-center justify-content-end p-2'>
    <Button
            className="p-3 w-full"
            icon="pi pi-at"
            aria-label="Pay"
            severity="primary"
            onClick={() => {}}
            size="small"
            rounded
          >
            <span className="px-2">Email</span>
          </Button>
    <Button
        className="p-3 w-full"
            icon="pi pi-print"
            aria-label="Pay"
            severity="primary"
            onClick={() => {}}
            size="small"
            rounded
          >
            <span className="px-2">Print</span>
          </Button>

        

    </div>
  
</div>
     
        </div>

        <div className="col-6">
      <div className="flex-column align-items-center">
        <div className="w-full pl-5 pr-5">
          <DayendDetail label="Numberof Transactions" value="1000.00" />
          <DayendDetail label="No Of Sold Items" value="1000.00" />
          <DayendDetail label="No of Returned Items" value="1000.00" />
          <DayendDetail label="Total Sold" value="1000.00" />
          <DayendDetail label="Total Customers" value="1000.00" />

          <DayendDetail label="Cash Sales" value="1000.00" />
          <DayendDetail label="Card Sales" value="1000.00" />

          <DayendDetail label="Total Refunds" value="1000.00" />
          <DayendDetail label="Total Discount" value="1000.00" />
          <DayendDetail label="Total tax" value="1000.00" />
          <DayendDetail label="Gross Sales" value="1000.00" />
          <DayendDetail
            label="Average Transaction Value (ATV)"
            value="1000.00"
          />
          <DayendDetail label="Net Sales" value="1000.00" />
        </div>
      </div>
</div>

      <div className="col-6">
    
  <h4>Please enter the quantities of each cash denomination in the fields below</h4>
  <div className="flex flex-wrap gap-2">
    {cashDenominations.map((m,index) => (
      <CashDenomination key={index} label={m.label} value={m.value} />
    ))}
  </div>

  <div className="col-6 col-offset-6 pr-5"> 




  <div className="mb-4 mt-4">
    <div className="card border-round p-3">
      <div className="flex flex-row justify-content-between">
        <span className="text-lg font-bold">Closing Cash</span>
        <span className="text-lg font-bold">10000.00</span>
      </div>
    </div>
  </div>
  </div>

  <div className="col-6 pr-5 col-offset-3"> 
  <div className="col-12 flex justify-content-center">

    <Button
      className="p-3"
      aria-label="Pay"
      severity="primary"
      onClick={() => {}}
      style={{ width: "100%", display: "block" }}
      size="large"
      rounded
    >
      <span className="px-2">Finish Day</span>
    </Button>
  </div>

</div>
</div>
 
  
     
    </div>
  );
};

  export default DayEnd;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './dayend.css';
import { endSession, getLatestSessionDetails, getSessionEnd } from "../../functions/session";
import { formatCurrency } from "../../utils/format";
import { useToast } from "../../components/useToast";
import ConfirmDialog from "../../components/dialog/ConfirmDialog";

const BoldDetail = ({ label, value }) => (
  <div className="mb-2 p-2">
    <div className="flex flex-row items-center justify-between">
      <span className="font-bold mt-1">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  </div>
);

const NormalDetail = ({ label, value }) => (
  <div className="mb-2 p-2">
    <div className="flex flex-row items-center justify-between">
      <span className="font-normal">{label}</span>
      <span>{value}</span>
    </div>
  </div>
);


const CashDenomination = ({ label, value,onChangeHandler }) => {


 return <div className="flex flex-col gap-0.5 text-colorLight">
    <p className="text-textColor m-0 p-0 ml-1">{label}</p>
    <input className="p-2.5 bg-colorLight text-textColor border-2 border-textColor rounded-md font-bold m-0 w-20 h-10 text-lg text-center font-roboto antialiased" type="number" value={value} 
    onChange={onChangeHandler} />
  </div>
};



const DayEnd = () => {

  const navigate=useNavigate();
  const showToast = useToast();
  const [dayendDetails,setDayendDetails] =useState(null);

  const terminalId = JSON.parse(localStorage.getItem('terminalId'));
  const sessionDetails= JSON.parse(localStorage.getItem('sessionDetails'));// && JSON.parse(localStorage.getItem('sessionDetails'));
  

  useEffect(()=>{
    loadDayendDetails();
  },[])

  const [isLoading,setIsLoading]=useState(false);


  const loadDayendDetails = async () => {
    try{
    
      setIsLoading(true);
      const payload={ 
        sessionId:sessionDetails.sessionId,
        terminalId:terminalId
        // "skip":0,
        // "limit":5
      }
    const _result = await getSessionEnd(payload);

    setDayendDetails(_result.data.records[0]);
    console.log("getSessionEnd", _result.data);


    setIsLoading(false);
  }
  catch(err){
    setIsLoading(false);
    console.log('error:',err);
  }
  };

  const [cashDenominations, setCashDenominations] = useState([
    { label: "Rs 1", qty: 1, amount: 0 },
    { label: "Rs 2", qty: 2, amount: 0 },
    { label: "Rs 5", qty: 5, amount: 0 },
    { label: "Rs 10", qty: 10, amount: 0 },
    { label: "Rs 20", qty: 20, amount: 0 },
    { label: "Rs 50", qty: 50, amount: 0 },
    { label: "Rs 100", qty: 100, amount: 0 },
    { label: "Rs 500", qty: 500, amount: 0 },
    { label: "Rs 1000", qty: 1000, amount: 0 },
    { label: "Rs 5000", qty: 5000, amount: 0 }
  ]);

  
  const [cashDenominationTotal, setCashDenominationTotal] = useState(0);
  const [short, setShort] = useState(0);


  useEffect(() => {
    const total = cashDenominations.reduce((sum, d) => sum + d.amount, 0);
    setCashDenominationTotal(total);
  }, [cashDenominations]);

  useEffect(() => {
const short=cashDenominationTotal-dayendDetails?.expectedCash || 0;
    setShort(short);
  }, [dayendDetails,cashDenominationTotal]);

  const onChangeHandler = (e, label) => {
    const value = parseFloat(e.target.value) || 0; // Ensure value is a number

    // Update the amount based on the entered value and qty
    const cashDenominationsUpdated = cashDenominations.map(d => 
      d.label === label ? { ...d, amount: d.qty * value } : d
    );

    setCashDenominations(cashDenominationsUpdated);
  };

  const onDayEnd=async()=>{


    const payLoad = {
      sessionId: sessionDetails.sessionId,
      actualCash:cashDenominationTotal,
      short: short,
      isConfirm: false,
    };

    setIsLoading(true);

    const res = await endSession(payLoad);
    console.log("ssssss", res);
    setIsLoading(false);

    const { success, exception, error } = res.data;

    if (error) {
      showToast("danger", "Error", error.message);
      return;
    }

    if (exception) {
      showToast("danger", "Exception", exception.message);
      return;
    }

    showToast("success", "Success", success.message);
    navigate('/home');
  }

  const [showDialog, setShowDialog] = useState(false);

  const handleConfirm = () => {
    setShowDialog(false);
    onDayEnd();
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  const confirmDayend = () => {

    setShowDialog(true);
  };


  return (
  
    <div className="flex flex-col p-8 justify-center items-center gap-5 lg:p-4 bg-white">
        {showDialog && (
        <ConfirmDialog
          isVisible={true}
          message="Are you sure you want to proceed?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          title="Confirm Session End"
          severity="info"
        />
      )}

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Day Ending</h2>
      </div>
      <div className="flex flex-col gap-12 w-[70%] mb-12">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-20 lg:items-start sm:flex-col">
          <div className="flex-1">
            {/* {JSON.stringify(sessionDetails)} */}
            <BoldDetail label="Transactions" value={dayendDetails?.noOfTransactions} />
            <BoldDetail label="Voided Transactions" value={dayendDetails?.noOfVoidedTransactions} />
            {/* <BoldDetail label="Return Transactions" value={dayendDetails?.noOfReturnedTransactions} /> */}
           <BoldDetail label="Number Of Customers" value={dayendDetails?.noOfCustomers} />
            <br />
            <NormalDetail label="Number of Products Sold" value={dayendDetails?.noOfProductsSold} />
            <NormalDetail label="Number Products Returned" value={dayendDetails?.noOfProductsReturned} />
            {/* <br />
            <NormalDetail label="Number of Services" value={dayendDetails?.noOfServices} />
            <NormalDetail label="Number Services Returned" value={dayendDetails?.noOfServicesReturned} /> */}
            <br />

            <NormalDetail label="Product Sales" value={formatCurrency(dayendDetails?.productSales)} />
            {/* <NormalDetail label="Service Fees" value={dayendDetails?.serviceFees} /> */}
            <BoldDetail label="Total Sales" value={formatCurrency(dayendDetails?.totalSales)} />
          
          </div>
          <div className="flex-1 mt-4 lg:mt-0">
            <NormalDetail label="Discounts" value={formatCurrency(dayendDetails?.totalDiscounts)}  />
            <NormalDetail label="Returns" value={formatCurrency(dayendDetails?.totalReturns)}  />
            <NormalDetail label="Refunds" value={formatCurrency(dayendDetails?.totalRefunds)}  />
            <NormalDetail label="Total Tax:" value={formatCurrency(dayendDetails?.totalTax)}  />
            <BoldDetail label="Net Sales" value={formatCurrency(dayendDetails?.netSales)}  />
            <BoldDetail label="ATV Net" value={formatCurrency(dayendDetails?.averageTransactionValueNet)} />
            <BoldDetail label="ATV Gross" value={formatCurrency(dayendDetails?.averageTransactionValueGross)} />
            <br />
            <BoldDetail label="Net Cash Sales" value={formatCurrency(dayendDetails?.netCashSales)}  />
            <BoldDetail label="Net Card Sales" value={formatCurrency(dayendDetails?.netCardSales)}  />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-20 lg:items-center sm:flex-col mt-4">
          <div className="flex-1">
            <BoldDetail label="Net Cash Sales" value={formatCurrency(dayendDetails?.netCashSales)}  />
            <BoldDetail label="Opening Amount" value={formatCurrency(dayendDetails?.openingcashAmount)} />
            <BoldDetail label="Cash Additions / Drops" value={formatCurrency(dayendDetails?.cashAdditions)}  />
            <BoldDetail label="Cash Removals / Pickups" value={formatCurrency(dayendDetails?.cashRemovals)}  />
            <BoldDetail label="Expected Cash" value={formatCurrency(dayendDetails?.expectedCash)}  />
            <BoldDetail label="Actual cash" value={formatCurrency(cashDenominationTotal)}  />
            <BoldDetail label="Short/Over" value={formatCurrency(short)}  />
          </div>
          <div className="flex-1 mt-4 lg:mt-0">
          <p className="text-lg text-primaryColor font-bold mb-5">Enter the amount of each cash type (bills and coins) in the boxes provided.</p>       
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {cashDenominations.map((c) => (
                <CashDenomination key={c.label} label={c.label} value={c.value} onChangeHandler={(e)=>onChangeHandler(e,c.label)} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center pb-8">
        {/* <button className="w-full md:w-auto block md:inline-block px-12 button button-xl primary round-2">Finish Day</button> */}
        <button className="w-full md:w-auto block md:inline-block mt-4 md:mt-0 btn btn-lg btn-primary text-base-100 bg-primaryColor"
        onClick={confirmDayend}>
    Finish Day
      </button>
      </div>
    </div>


  );
};

export default DayEnd;

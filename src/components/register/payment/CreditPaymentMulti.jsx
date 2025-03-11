

import Customer from "../customerInfoPanel/CustomerInfoPanel";
import DatePicker from "../../DatePicker";



const CreditPaymentMulti=()=>{
    return (
      <>
        <div className="mb-4">
        <div className="grid mb-2">
              <div className="col-6">
              <div className="flex align-items-center gap-2">
             <span className=" pi pi-user text-xl font-semibold"></span> <span className="text-xl font-semibold">Credit Payment</span>
            </div>
              </div>
              <div className="col-6 pr-4">
                <div className="flex align-items-top justify-content-end">
                  <label
                    htmlFor="customAmount-single"
                    className="text-xl font-semibold mb-2 mr-5"
                  >
                    {" "}
                    Grand Total
                  </label>
                  <span className="text-xl font-normal">Rs 00.00</span>
                </div>
              </div>
            </div>
        <div className="grid mb-2">
          <div className="col-8 align-items-center">
          <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5 "
                    >
                      Customer 
                    </label>
            <Customer imageUrl="" label="Mr.customer name" />
          </div>
          <div className="col-4" >
   
                  <div className="flex flex-column align-items-center justify-content-end">
                    <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5 w-full ml-5"
                    >
                      Due Date
                    </label>
              
                    <DatePicker />
                  </div>
                </div>
          

          <div className="flex align-items-top justify-content-end">
         
          </div>
          </div>
          <div className="grid">
          <div className="col-4">
                <div className="flex">
                  <div className="flex-1 flex flex-column mr-3">
                    <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5"
                    >
                      Amount
                    </label>
                    <input
                      type="text"
                      className="p-inputtext-sm"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

          <div className="col-4 col-offset-4 flex align-items-end">
            <div className="flex w-full">
            <button
                    className="p-3"
                    aria-label="Pay"
                    severity="primary"
                    onClick={() => {}}
                    style={{ width: "100%", display: "block" }}
                    size="normal"
                    rounded
                  >
                           <span className="px-2">Split Amount</span>
                  </button>
            </div>
          </div>
        </div>
        </div>
      </>
    );
    
    
}
 export default CreditPaymentMulti;
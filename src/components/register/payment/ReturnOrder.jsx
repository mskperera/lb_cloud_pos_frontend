import { useState } from "react";
import { Input } from "daisyui"; // DaisyUI Input
import { Button } from "daisyui"; // DaisyUI Button
import { DataTable } from "react-data-table-component"; // Adjusted for data table
import { Tooltip } from "react-tooltip"; // DaisyUI Tooltip isn't available by default
import ReturnQty from "../ReturnQty";

const PromptOrderNumber = () => {
  return (
    <div className="grid">
      <div className="col-span-12">
        <div className="flex flex-col mt-5 justify-center">
          <div className="col-span-4 mx-auto">
            <Input
              type="text"
              className="input input-bordered w-full"
              placeholder="Invoice number"
            />
          </div>
          <div className="col-span-4 mx-auto mt-4">
            <Button
              className="w-full"
              onClick={() => {}}
              color="primary"
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderListForReturn = () => {
  const [retunQty, setReturnQty] = useState(null);
  const [isShowRetunQty, setIsShowRetunQty] = useState(null);
  const [products, setProducts] = useState([
    { description: "product1", unitPrice: "$100.30", qty: 2, amount: "$200.60" },
    { description: "product2", unitPrice: "$50.00", qty: 8, amount: "$400.00" },
    { description: "product3", unitPrice: "$100.30", qty: 2, amount: "$200.60" },
    { description: "product4", unitPrice: "$50.00", qty: 8, amount: "$400.00" },
  ]);

  const actions = (product) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-fast-backward"
          onClick={() => {
            setIsShowRetunQty(true);
          }}
          color="primary"
        >
          Return
        </Button>
      </div>
    );
  };

  const qty = (product) => {
    return <p>{product.qty}</p>;
  };

  return (
    <>
      <ReturnQty
        visible={isShowRetunQty}
        onClose={() => {
          setIsShowRetunQty(false);
        }}
      />
      <div className="grid grid-cols-3 p-2 gap-4">
        <div>
          <div className="card">
            <p className="font-semibold">Order #</p>
            <p className="font-normal">O-999342</p>
          </div>
        </div>
        <div>
          <div className="card">
            <p className="font-semibold">Customer</p>
            <p className="font-normal">Mr. Sumana Paala</p>
          </div>
        </div>
        <div>
          <div className="card">
            <p className="font-semibold">Order Date</p>
            <p className="font-normal">2023 Nov. 12 4:55:13 PM</p>
          </div>
        </div>
      </div>

      <div className="grid p-2">
        <div className="card">
          <DataTable
            columns={[
              {
                name: "Action",
                selector: "action",
                cell: actions,
              },
              {
                name: "Description",
                selector: "description",
              },
              {
                name: "Qty",
                selector: "qty",
                cell: qty,
              },
              {
                name: "Amount",
                selector: "amount",
              },
            ]}
            data={products}
            pagination
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">0.00</span>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <div className="flex justify-between">
            <span className="font-semibold">Discount</span>
            <span className="font-semibold">0.00</span>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <div className="flex justify-between">
            <span className="font-semibold">Tax</span>
            <span className="font-semibold">0.00</span>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <div className="flex justify-between">
            <span className="text-xl font-semibold">Grand Total</span>
            <span className="text-xl font-semibold">0.00</span>
          </div>
        </div>
      </div>
    </>
  );
};

const ReturnOrder = () => {
  const [selectedPaymentType, setSelectedPaymentType] = useState("Cash");

  return (
    <div className="card m-2">
      <Tooltip target=".custom-target-icon" />
      <div className="flex items-center gap-2 p-0 pr-4">
        <Button
          icon="pi pi-chevron-left custom-target-icon"
          rounded
          color="link"
          aria-label="Back"
          size="large"
          className="tooltip"
          data-tooltip="Back to Home"
        />
        <div className="flex items-center gap-2">
          <span className="pi pi-fast-backward text-xl font-semibold"></span>
          <span className="text-xl font-semibold">Return Order</span>
        </div>
      </div>

      <PromptOrderNumber />
      <OrderListForReturn />
    </div>
  );
};

export default ReturnOrder;


// import { useState } from "react";
// import { Button } from "primereact/button";
// import { Tooltip } from "primereact/tooltip";
// import { InputText } from "primereact/inputtext";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import ReturnQty from "../ReturnQty";

// const PromptOrderNumber = () => {
//   return (
//     <div className="grid">
//       <div className="col-12">
//         <div className="flex flex-column mt-5 justify-content-center">
//           <div className="col-4 col-offset-4">
//             <InputText
//               type="text"
//               className="inputtext-sm w-full"
//               placeholder="Invoice number"
//             />
//           </div>
//           <div className="col-4 col-offset-4">
//             <Button
//               className="p-3"
//               aria-label="Pay"
//               severity="primary"
//               onClick={() => {}}
//               style={{ width: "100%", display: "block" }}
//               size="normal"
//               rounded
//             >
//               <span className="px-2">Verify</span>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// const OrderListForReturn = () => {
//   const [retunQty, setReturnQty] = useState(null);
//   const [isShowRetunQty, setIsShowRetunQty] = useState(null);
//   const [products, setProducts] = useState([
//     {
//       description: "product1lllljjjjjlllllllllllllllllllllllljlkjjjjjk",
//       unitPrice: "$100.30",
//       qty: 2,
//       amount: "$200.60",
//     },
//     { description: "product1", unitPrice: "$50.00", qty: 8, amount: "$400.00" },
//     {
//       description: "product1lllljjjjjlllllllllllllllllllllllljlkjjjjjk",
//       unitPrice: "$100.30",
//       qty: 2,
//       amount: "$200.60",
//     },
//     { description: "product1", unitPrice: "$50.00", qty: 8, amount: "$400.00" },
//     {
//       description: "product1lllljjjjjlllllllllllllllllllllllljlkjjjjjk",
//       unitPrice: "$100.30",
//       qty: 2,
//       amount: "$200.60",
//     },
//     { description: "product1", unitPrice: "$50.00", qty: 8, amount: "$400.00" },
//     {
//       description: "product1lllljjjjjlllllllllllllllllllllllljlkjjjjjk",
//       unitPrice: "$100.30",
//       qty: 2,
//       amount: "$200.60",
//     },
//     { description: "product1", unitPrice: "$50.00", qty: 8, amount: "$400.00" },
//   ]);

//   const actions = (product) => {
//     return (
//       <>
//         <Button
//           icon="pi pi-fast-backward"
//           label="Return"
//           onClick={() => {
//             setIsShowRetunQty(true);
//           }}
//           rounded
//           severity="primary"
//           aria-label="User"
//           text
//         />
//       </>
//     );
//   };

//   const qty = (product) => {
//     return (
//       <>
//         <div className="flex flex-wrap align-items-center justify-content-between gap-2">
//           {/* <Button icon="pi pi-minus" rounded severity="primary" aria-label="User" /> */}
//           <p>{product.qty}</p>
//           {/* <Button icon="pi pi-plus" rounded severity="primary" aria-label="User" /> */}
//         </div>
//       </>
//     );
//   };

//   return (
//     <>
//       <ReturnQty
//         visible={isShowRetunQty}
//         onClose={() => {
//           setIsShowRetunQty(false);
//         }}
//       />
//       <div className="grid p-2">
//         <div className="col-4 pr-5">
//           <div className="card flex flex-row justify-content-between mb-2">
//             <p className="font-semibold m-0">Order #</p>
//             <p className="font-normal m-0">O-999342</p>
//           </div>
//         </div>
//         <div className="col-4 pr-5">
//           <div className="card flex flex-row justify-content-between mb-2">
//             <p className="font-semibold m-0">Cutomer</p>
//             <p className="font-normal m-0">Mr. Sumana paala</p>
//           </div>
//         </div>
//         <div className="col-4 pr-5">
//           <div className="card flex flex-row justify-content-between mb-2">
//             <p className="font-semibold m-0">Order Date</p>
//             <p className="font-normal m-0">2023 Nov. 12 4:55:13 PM</p>
//           </div>
//         </div>
//       </div>
//       <div className="grid">
//         <div className="col-12">
//           <div className="flex flex-column justify-content-center">
//             <div className="card border-round">
//               <DataTable
//                 value={products}
//                 scrollable
//                 scrollHeight="340px" // Set the desired height for scrolling
//                 // rowExpansionTemplate={cardBodyTemplate}
//                 className="orderlist-datatable"
//               >
//                 {/* Columns */}
//                 <Column field="action" header="" body={actions}></Column>
//                 <Column field="description" header="Description"></Column>
//                 <Column field="qty" header="Qty" body={qty}></Column>
//                 <Column
//                   field="amount"
//                   alignHeader="left"
//                   align="left"
//                   header="Amount"
//                 ></Column>
//               </DataTable>
//             </div>
//           </div>
//         </div>
//         <div className="col-12">
    
//                 <div className="grid p-3">
//                   <div className="col-12 lg:col-6 p-2">
//                     <div className="flex justify-content-between flex-wrap">
//                       <div className="flex align-items-top">
//                         <span className="text-md font-semibold">Total</span>
//                       </div>
//                       <div className="flex align-items-top">
//                         <span className="text-md font-semibold">0.00</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="col-12 lg:col-6  p-2">
//                     <div className="flex justify-content-between flex-wrap">
//                       <div className="flex align-items-top">
//                         <span className="text-md font-semibold">Discount</span>
//                       </div>
//                       <div className="flex align-items-top">
//                         <span className="text-md font-semibold">0.00</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="col-12 lg:col-6  p-2">
//                     <div className="flex justify-content-between flex-wrap">
//                       <div className="flex align-items-top">
//                         <span className="text-md font-semibold">Tax</span>
//                       </div>
//                       <div className="flex align-items-top">
//                         <span className="text-md font-semibold">0.00</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="col-12 lg:col-6  p-2">
//                     <div className="flex justify-content-between flex-wrap">
//                       <div className="flex align-items-top">
//                         <span className="text-xl font-semibold">
//                           Grand Total
//                         </span>
//                       </div>
//                       <div className="flex align-items-top">
//                         <span className="text-xl font-semibold">0.00</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//         </div>
//       </div>
//     </>
//   );
// };
// const ReturnOrder = () => {
//   const [selectedPaymentType, setSelectedPaymentType] = useState("Cash");

//   return (
//     <div className="card m-2">
//       <Tooltip target=".custom-target-icon" />

//       <div className="flex flex-row align-items-center justify-content-start p-0 gap-2 pr-4">
//         <Button
//           icon="pi pi-chevron-left custom-target-icon"
//           rounded
//           text
//           aria-label="Filter"
//           size="large"
//           tooltip="Back to Home"
//           tooltipOptions={{
//             position: "bottom",
//             mouseTrack: true,
//             mouseTrackTop: 15,
//           }}
//         />

//         <div className="flex align-items-center gap-2">
//           <span className=" pi pi-fast-backward text-xl font-semibold"></span>{" "}
//           <span className="text-xl font-semibold">Return Order</span>
//         </div>

//       </div>

//       <PromptOrderNumber />
//       <OrderListForReturn />
//     </div>
//   );
// };

// export default ReturnOrder;

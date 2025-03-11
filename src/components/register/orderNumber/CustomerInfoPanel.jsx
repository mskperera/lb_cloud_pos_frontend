

const Customer = ({ label, imageUrl,onAddCustomer }) => {
  return (
    <>
      <div
        className="card border-round  flex justify-content-streatch p-2"
        style={{ margin: "0px 0px" }}
      >
        <div className="flex align-items-center w-full">
     
          <div className="flex align-items-center justify-content-between m-2">
        
             {label ?    <span className="text-lg ">{label}</span> : <span className="text-lg ">Select a customer</span>}


         
          </div>
        </div>
     
        <div className="flex align-items-center">
        <button icon="pi pi-plus" onClick={onAddCustomer} rounded aria-label="Filter" />
        </div>
      </div>

 
    </>
  );
};




export default Customer;


// <div
// className="card border-round  flex justify-content-streatch p-2"
// style={{ margin: "0px 0px" }}
// >
// <div className="flex align-items-center w-full">
//   {imageUrl ? (
//     <Avatar image={imageUrl} className="mr-2" shape="circle" />
//   ) : (
//     <Avatar icon="pi pi-user" shape="circle" />
//   )}
//   <div className="flex align-items-center justify-content-between m-2">
//     {/* <span className="font-bold">Customer</span> */}
//     {label ? (
//       <span className="text-md">{label}</span>
//     ) : (
//       <span className="text-lg">Select a customer</span>
//     )}
//   </div>
// </div>

// <div className="flex align-items-center">
//   {label ? (
//     <Button
//       icon="pi pi-user-edit"
//       rounded
//       text
//       aria-label="Filter"
//       size="large"
//     />
//   ) : (
//     <Button
//       icon="pi pi-user-plus"
//       rounded
//       text
//       aria-label="Filter"
//       size="large"
//     />
//   )}
// </div>
// </div>
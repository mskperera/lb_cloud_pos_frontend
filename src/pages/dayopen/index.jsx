import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useToast } from "../../components/useToast";
import moment from "moment";
import { validate } from "../../utils/formValidation";
import FormElementMessage from "../../components/messges/FormElementMessage";
import { startSession } from "../../functions/session";
import { getTerminalDetailslByTerminalId } from "../../functions/terminal";
import { PlayCircle } from "lucide-react";
import { getCurrency } from "../../utils/format";
import { CURRENCY_DISPLAY_TYPE } from "../../utils/constants";

const DayOpen = () => {
  const navigate = useNavigate();
  let { terminalId } = useParams();
  const showToast = useToast();
  
  const [openingAmount, setOpeningAmount] = useState({
    label: "Opening Amount",
    value: "",
    isTouched: false,
    isValid: false,
    validationMessages: [],
    rules: { required: true, dataType: "decimal" },
  });

  const [notes, setNotes] = useState({
    label: "Notes",
    value: "",
    isTouched: false,
    isValid: false,
    validationMessages: [],
    rules: { required: false, dataType: "string" },
  });

  const [sessionName, setSessionName] = useState({
    label: "Session Name",
    value: moment().format('YYYY MMM DD'), // Corrected to YYYY
    isTouched: false,
    isValid: false,
    validationMessages: [],
    rules: { required: true, dataType: "string" },
  });

  const [terminalDetails, setTerminalDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTerminalDetailsByTerminalId();
  }, [terminalId]);

  const loadTerminalDetailsByTerminalId = async () => {
    const result = await getTerminalDetailslByTerminalId(terminalId);
    setTerminalDetails(result.data.records);
  };

  const handleInputChange = (setState, state, value) => {
    if (!state.rules) {
      console.error("No rules defined for validation in the state", state);
      return;
    }
    const validation = validate(value, state);
    setState({
      ...state,
      value: value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };

  const ValidationMessages = ({ state }) => {
    return (
      !state.isValid &&
      state.isTouched && (
        <div className="w-full">
          {state.validationMessages.map((message, index) => (
            <FormElementMessage
              key={index}
              className="w-full mt-2"
              severity="error"
              text={`${message}`}
            />
          ))}
        </div>
      )
    );
  };
  
  const validateAll = () => {
    const states = [sessionName, openingAmount];
    const updatedStates = states.map((state) => {
      const validation = validate(state.value, state);
      return {
        ...state,
        isValid: validation.isValid,
        isTouched: true,
        validationMessages: validation.messages,
      };
    });

    setSessionName(updatedStates[0]);
    setOpeningAmount(updatedStates[1]);

    return updatedStates.every((state) => state.isValid);
  };

  const dayStartHandler = async () => {
    if (!validateAll()) {
      return;
    }

    const payLoad = {
      sessionName: sessionName.value,
      terminalId: terminalId,
      openingCash: openingAmount.value,
      openingNote:notes.value,
      isConfirm: true
    };

    setIsLoading(true);
    const res = await startSession(payLoad);
    setIsLoading(false);

    const { success, exception, error } = res.data;

    if (error) {
      showToast("danger", "Error", error.message);
      return;
    }

    if (exception) {
      showToast("warning", "Exception", exception.message);
      return;
    }

    navigate(`/register/${terminalId}`);
    //showToast("success", "Success", success.message);
  };

return (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100">

    <div className="w-full max-w-md bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-200">

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-5 flex items-center gap-3">
        <div className="p-2.5 bg-white/20 rounded-xl text-white">
          <PlayCircle className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">
            Open Register Session
          </h2>

          <p className="text-xs text-sky-100 mt-1">
            Enter opening cash to begin a new session
          </p>
        </div>
      </div>


      {/* Form Body */}
      <div className="p-6 flex flex-col gap-5">


        {/* Terminal */}
        <div>
          <label
            htmlFor="terminal"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Terminal
          </label>

          <input
            id="terminal"
            type="text"
            value={terminalDetails?.terminalName || ""}
            readOnly
            disabled
            className="
              w-full px-3 py-2.5
              rounded-lg
              bg-slate-100
              border border-slate-200
              text-slate-600
              text-sm
              font-medium
              outline-none
            "
          />
        </div>



        {/* Session Name */}
        <div>
          <label
            htmlFor="sessionName"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Session Name
          </label>

          <input
            id="sessionName"
            type="text"
            placeholder="Enter session name"
            value={sessionName.value}
            onChange={(e) =>
              handleInputChange(
                setSessionName,
                sessionName,
                e.target.value
              )
            }
            className="
              w-full px-3 py-2.5
              rounded-lg
              border border-slate-300
              text-slate-800
              text-sm
              font-medium
              outline-none
              transition
              focus:border-sky-500
              focus:ring-4
              focus:ring-sky-500/10
            "
          />

          <ValidationMessages state={sessionName} />
        </div>



        {/* Opening Cash */}
        <div>
          <label
            htmlFor="openingAmount"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Opening Cash Amount  ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
          </label>

          <div className="relative">
            {/* <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">
           
            </span> */}

            <input
              id="openingAmount"
              type="number"
              placeholder="0.00"
              value={openingAmount.value}
              onChange={(e) =>
                handleInputChange(
                  setOpeningAmount,
                  openingAmount,
                  e.target.value
                )
              }
              className="
                w-full pl-3 pr-3 py-2.5
                rounded-lg
                border-2
                border-sky-200
                bg-sky-50
                text-slate-900
                text-sm
                font-bold
                outline-none
                transition
                focus:border-sky-500
                focus:ring-4
                focus:ring-sky-500/10
              "
            />
          </div>

          <ValidationMessages state={openingAmount} />
        </div>



        {/* Opening Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Opening Notes
            <span className="ml-1 text-xs text-slate-400 font-normal">
              (Optional)
            </span>
          </label>

          <textarea
            id="notes"
            rows={3}
            placeholder="Add any remarks for this session..."
            value={notes.value}
            onChange={(e) =>
              handleInputChange(
                setNotes,
                notes,
                e.target.value
              )
            }
            className="
              w-full px-3 py-2.5
              rounded-lg
              border border-slate-300
              bg-slate-50
              text-slate-700
              text-sm
              outline-none
              resize-none
              transition
              focus:bg-white
              focus:border-sky-500
              focus:ring-4
              focus:ring-sky-500/10
            "
          />

          <ValidationMessages state={notes} />
        </div>



        {/* Actions */}
        <div className="flex flex-col gap-3 mt-2">


          {/* Primary */}
          <button
            className="
              w-full py-3
              bg-sky-600
              hover:bg-sky-700
              text-white
              text-sm
              font-bold
              rounded-xl
              shadow-lg
              shadow-sky-500/20
              transition
              active:scale-[0.98]
              disabled:opacity-50
              disabled:pointer-events-none
            "
            onClick={dayStartHandler}
            disabled={isLoading}
          >
            {isLoading ? "Starting Session..." : "Start Session"}
          </button>



          {/* Secondary */}
          <button
            className="
              w-full py-3
              bg-slate-100
              hover:bg-slate-200
              text-slate-700
              text-sm
              font-semibold
              rounded-xl
              transition
              active:scale-[0.98]
            "
            onClick={() => navigate("/home")}
          >
            Return to Home
          </button>


        </div>


      </div>

    </div>

  </div>
);
};

export default DayOpen;


// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import { useToast } from "../../components/useToast";
// import moment from "moment";
// import { validate } from "../../utils/formValidation";
// import FormElementMessage from "../../components/messges/FormElementMessage";
// import { startSession } from "../../functions/session";
// import { getTerminalDetailslByTerminalId } from "../../functions/terminal";
// import { PlayCircle } from "lucide-react";



// const DayOpen = () => {


//   const navigate=useNavigate();
//   let { terminalId } = useParams();

//   const showToast = useToast();
  
//   const [openingAmount, setOpeningAmount] = useState({
//     label: "Opening Amount",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     validationMessages: [],
//     rules: { required: true, dataType: "decimal" },
//   });

//   const [notes, setNotes] = useState({
//     label: "Notes",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     validationMessages: [],
//     rules: { required: false, dataType: "string" },
//   });


//   const [sessionName, setSessionName] = useState({
//     label: "Session Name",
//     value: moment().format('yyyy MMM DD'),
//     isTouched: false,
//     isValid: false,
//     validationMessages: [],
//     rules: { required: true, dataType: "string" },
//   });


//   const [terminalDetails,setTerminalDetails]=useState(null)

//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(()=>{
//     loadTerminalDetailslByTerminalId();
//   },[terminalId]);



//   const loadTerminalDetailslByTerminalId= async () => {
//     const result = await getTerminalDetailslByTerminalId(terminalId);
//     setTerminalDetails(result.data.records)
//   };





//   const handleInputChange = (setState, state, value) => {
//     console.log("Nlllll", state);
//     if (!state.rules) {
//       console.error("No rules defined for validation in the state", state);
//       return;
//     }
//     const validation = validate(value, state);
//     setState({
//       ...state,
//       value: value,
//       isValid: validation.isValid,
//       isTouched: true,
//       validationMessages: validation.messages,
//     });
//   };




//   const ValidationMessages = ({ state }) => {
//     return (
//       !state.isValid &&
//       state.isTouched && (
//         <div className="w-full">
//           {state.validationMessages.map((message, index) => (
//             <FormElementMessage
//               key={index}
//               className="w-full mt-2"
//               severity="error"
//               text={`${message}`}
//             />
//           ))}
//         </div>
//       )
//     );
//   };
  

// const validateAll = () => {
//   const states = [sessionName,openingAmount];
//   const updatedStates = states.map((state) => {
//     const validation = validate(state.value, state);
//     return {
//       ...state,
//       isValid: validation.isValid,
//       isTouched: true,
//       validationMessages: validation.messages,
//     };
//   });


//   setSessionName(updatedStates[0]);
//   setOpeningAmount(updatedStates[1]);

//   return updatedStates.every((state) => state.isValid);
// };

// const dayStartHandler=async()=>{
//   if (!validateAll()) {
//     return;
//   }


//   const payLoad = {
//     sessionName:sessionName.value,
//     terminalId: terminalId,
//     openingCash:openingAmount.value,
//     isConfirm: true
//   };

//   setIsLoading(true);

//   const res = await startSession(payLoad);
//   console.log("ssssss", res);
//   setIsLoading(false);

//   const { success, exception, error } = res.data;

//   if (error) {
//     showToast("danger", "Error", error.message);
//     return;
//   }

//   if (exception) {
//     showToast("danger", "Exception", exception.message);
//     return;
//   }

//   navigate(`/register/${terminalId}`)
//   showToast("success", "Success", success.message);
// }





  
// return (
//   <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#edf2fa]">
//     <div className="w-full max-w-2xl p-6 bg-white border-gray-200 border-2 rounded-lg mx-auto flex flex-col items-center">
    
//             {/* Modern Section Header */}
//         <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
//               <PlayCircle className="h-5 w-5" />
//             </div>
//             <div>
//               <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Open Register Session</h2>
//               <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Initialize Daily Counter Float</p>
//             </div>
//           </div>
//         </div>
    
    


//       <div className="grid grid-cols-1 gap-6 w-full max-w-md">
//         {/* Terminal Name */}
//         <div>
//           <label htmlFor="terminal" className="block text-lg font-bold">
//             Terminal
//           </label>
//           <input
//             id="terminal"
//             type="text"
//             className="w-full p-2 border rounded-md bg-gray-100"
//             value={terminalDetails?.terminalName}
//             readOnly
//             disabled
//           />
//         </div>

//         {/* Session Name */}
//         <div>
//           <label htmlFor="sessionName" className="block text-lg font-bold">
//             Session Name 
//           </label>
//           <input
//             id="sessionName"
//             type="text"
//             className="w-full p-2 border rounded-md"
//             placeholder="Enter Session Name"
//             value={sessionName.value}
//             onChange={(e) =>
//               handleInputChange(setSessionName, sessionName, e.target.value)
//             }
//           />
//           <ValidationMessages state={sessionName} />
//         </div>

//         {/* Opening Amount */}
//         <div>
//           <label htmlFor="openingAmount" className="block text-lg font-bold">
//             Opening Cash Amount
//           </label>
//           <input
//             id="openingAmount"
//             type="number"
//             className="w-full p-2 border rounded-md"
//             placeholder="Enter opening amount"
//             value={openingAmount.value}
//             onChange={(e) =>
//               handleInputChange(setOpeningAmount, openingAmount, e.target.value)
//             }
//           />
//           <ValidationMessages state={openingAmount} />
//         </div>

//         {/* Notes */}
//         <div>
//           <label htmlFor="notes" className="block text-lg font-bold">
//              Opening Notes
//       <span className="ml-1 text-xs text-slate-400">
//         (Optional)
//       </span>
//           </label>



//           <textarea
//             id="notes"
//             className="w-full p-2 border rounded-md"
//             placeholder="Any remarks for the day start"
//             value={notes.value}
//             onChange={(e) => handleInputChange(setNotes, notes, e.target.value)}
//           />
//           <ValidationMessages state={notes} />
//         </div>

//         {/* Button */}
//         <button
//           className="w-full px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
//           onClick={dayStartHandler}
//           disabled={isLoading}
//         >
//           {isLoading ? "Starting..." : "Start Session"}
//         </button>

//         {/* Back to Home Button */}
//         <button
//           className="w-full mt-4 px-6 py-3 bg-slate-50 border border-slate-100 text-gray-500  rounded-lg hover:bg-gray-600 transition"
//           onClick={() => navigate("/home")}
//         >
//           Return to Home
//         </button>
//       </div>
//     </div>
//   </div>
// );
// };

// export default DayOpen;

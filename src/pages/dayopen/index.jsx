import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useToast } from "../../components/useToast";
import moment from "moment";
import { validate } from "../../utils/formValidation";
import FormElementMessage from "../../components/messges/FormElementMessage";
import { startSession } from "../../functions/session";
import { getTerminalDetailslByTerminalId } from "../../functions/terminal";



const DayOpen = () => {


  const navigate=useNavigate();
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
    value: moment().format('yyyy MMM DD'),
    isTouched: false,
    isValid: false,
    validationMessages: [],
    rules: { required: true, dataType: "string" },
  });


  const [terminalDetails,setTerminalDetails]=useState(null)

  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    loadTerminalDetailslByTerminalId();
  },[terminalId]);



  const loadTerminalDetailslByTerminalId= async () => {
    const result = await getTerminalDetailslByTerminalId(terminalId);
    setTerminalDetails(result.data.records)
  };





  const handleInputChange = (setState, state, value) => {
    console.log("Nlllll", state);
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
  const states = [sessionName,openingAmount];
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

const dayStartHandler=async()=>{
  if (!validateAll()) {
    return;
  }


  const payLoad = {
    sessionName:sessionName.value,
    terminalId: terminalId,
    openingCash:openingAmount.value,
    isConfirm: true
  };

  setIsLoading(true);

  const res = await startSession(payLoad);
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

  navigate(`/register/${terminalId}`)
  showToast("success", "Success", success.message);
}





  
return (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
    <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-lg mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mb-6">Day Start</h2>

      <div className="grid grid-cols-1 gap-6 w-full max-w-md">
        {/* Terminal Name */}
        <div>
          <label htmlFor="terminal" className="block text-lg font-bold">
            Terminal
          </label>
          <input
            id="terminal"
            type="text"
            className="w-full p-2 border rounded-md bg-gray-100"
            value={terminalDetails?.terminalName}
            readOnly
            disabled
          />
        </div>

        {/* Session Name */}
        <div>
          <label htmlFor="sessionName" className="block text-lg font-bold">
            Session Name
          </label>
          <input
            id="sessionName"
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter Session Name"
            value={sessionName.value}
            onChange={(e) =>
              handleInputChange(setSessionName, sessionName, e.target.value)
            }
          />
          <ValidationMessages state={sessionName} />
        </div>

        {/* Opening Amount */}
        <div>
          <label htmlFor="openingAmount" className="block text-lg font-bold">
            Opening Cash Amount
          </label>
          <input
            id="openingAmount"
            type="number"
            className="w-full p-2 border rounded-md"
            placeholder="Enter opening amount"
            value={openingAmount.value}
            onChange={(e) =>
              handleInputChange(setOpeningAmount, openingAmount, e.target.value)
            }
          />
          <ValidationMessages state={openingAmount} />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-lg font-bold">
            Notes
          </label>
          <textarea
            id="notes"
            className="w-full p-2 border rounded-md"
            placeholder="Any remarks for the day start"
            value={notes.value}
            onChange={(e) => handleInputChange(setNotes, notes, e.target.value)}
          />
          <ValidationMessages state={notes} />
        </div>

        {/* Button */}
        <button
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={dayStartHandler}
          disabled={isLoading}
        >
          {isLoading ? "Starting..." : "Start Day"}
        </button>
      </div>
    </div>
  </div>
);
};

export default DayOpen;

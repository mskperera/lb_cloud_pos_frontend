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




const validationMessages = (state) => {
  // Ensure that the function returns JSX or null
  return (
    !state.isValid &&
    state.isTouched && (
      <div>
        {state.validationMessages.map((message, index) => (
          <FormElementMessage
            key={index}
            className="mt-2 w-full"
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
    <div className="flex flex-col p-8 justify-center items-center gap-5 lg:p-4">
      <div className="text-center mb-4 pt-5">
        <h2 className="text-2xl font-bold">Day Start</h2>
      </div>
      <div className="flex flex-col gap-12 w-[20%] mb-12">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-20 lg:items-start sm:flex-col">
          <div className="flex-1 mt-4 lg:mt-0">
            <div className="flex flex-col gap-4">

                <div>
                  <label htmlFor="terminal" className="block text-lg font-bold">
                    Terminal
                  </label>
                  <input
                    id="terminal"
                    type="text"
                    className="w-full p-2 border-2 rounded-md"
                    placeholder="Terminal"
                    value={terminalDetails?.terminalName}
                    readOnly
                    disabled
                  />
                </div>
            

              <div>
                <label
                  htmlFor="openingAmount"
                  className="block text-lg font-bold"
                >
                  Session Name
                </label>
                <input
                  id="openingAmount"
                  type="text"
                  className="w-full p-2 border-2 rounded-md"
                  placeholder="Enter Session Name"
                  value={sessionName.value}
                  onChange={(e) => {
                    handleInputChange(
                      setSessionName,
                      sessionName,
                      e.target.value
                    );
                  }}
                />
                   {validationMessages(sessionName)}
              </div>
              <div>
                <label
                  htmlFor="openingAmount"
                  className="block text-lg font-bold"
                >
                  Opening Cash Amount
                </label>
                <input
                  id="openingAmount"
                  type="number"
                  className="w-full p-2 border-2 rounded-md"
                  placeholder="Enter opening amount"
                  value={openingAmount.value}
                  onChange={(e) => {
                    handleInputChange(
                      setOpeningAmount,
                      openingAmount,
                      e.target.value
                    );
                  }}
                />
                {validationMessages(openingAmount)}
              </div>
              <div>
                <label htmlFor="notes" className="block text-lg font-bold">
                  Notes
                </label>
                <textarea
                  id="notes"
                  className="w-full p-2 border-2 rounded-md"
                  placeholder="Any remarks for the day start"
                  value={notes.value}
                  onChange={(e) => {
                    handleInputChange(
                      setNotes,
                      notes,
                      e.target.value
                    );
                  }}
                />
                   {validationMessages(notes)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pb-8">
        <button
          className="w-full md:w-auto block md:inline-block mt-4 md:mt-0 btn btn-lg btn-primary text-base-100 bg-primaryColor"
          onClick={dayStartHandler}
        >
          Start Day
        </button>
      </div>
    </div>
  );
};

export default DayOpen;

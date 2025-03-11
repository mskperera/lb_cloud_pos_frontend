import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestSessionDetails } from "../functions/session";
import { bufferToBoolean } from "../utils/utils";

const HOCSession = ({terminalId, children }) => {
  //const terminalId = JSON.parse(localStorage.getItem('terminalId'));
  const navigate = useNavigate();
  const [isSessionEnded, setIsSessionEnded] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to track loading state


  useEffect(()=>{
    localStorage.setItem('terminalId',terminalId);
  },[terminalId])

  const loadLatestSessionDetails = async () => {
    try {
      console.log('HOCSession terminalId:', terminalId);
      const result = await getLatestSessionDetails(terminalId);
      console.log('isSessionEnded:', result);
      const { records } = result.data;
      //console.log('getLatestSessionDetails:', result);
      localStorage.setItem('sessionDetails',JSON.stringify(records));
      
      const isSessionEnded=records.isSessionEnded;
    
      setIsSessionEnded(isSessionEnded);
    } catch (error) {

      console.error('Error loading session details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLatestSessionDetails();
  }, [terminalId]);

  useEffect(() => {
    if (isSessionEnded) {
      navigate(`/daystart/${terminalId}`);
    }
  }, [isSessionEnded, navigate]);

  if (isLoading) {
    return <p>Waiting...</p>;
  }

  if (!isSessionEnded && !isLoading) {
    return <>{ children}</>;
  }

  return null;
};

export default HOCSession;

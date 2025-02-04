export const bufferToBoolean = (bufferObject) => {
    if (bufferObject && bufferObject.type === 'Buffer' && Array.isArray(bufferObject.data)) {
      return bufferObject.data.some(value => value !== 0);
    }
    return false;
  };

  



export const getCurrencyInfo = (bufferObject) => {
   
    return {symbol:'Rs',currencyCode:'LKR'};
  };

  

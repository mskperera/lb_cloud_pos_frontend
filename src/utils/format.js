  // const formatCurrency = (value) => {
  //   // Assuming USD for illustration; you might want to localize or parameterize currency
  //   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR' }).format(value);

import moment from "moment";
import { CURRENCY_DISPLAY_TYPE } from "./constants";
import { getSystemInfoFromLocalStorage } from "../functions/systemSettings";

  // };
  export const formatCurrency = (value,showSymbol=true) => {
    const {symbol,currencyCode}=getSystemInfoFromLocalStorage();
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    return  showSymbol ? `${symbol}. ${formattedNumber}` : formattedNumber;
  };

  export const getCurrency = (displayType) => {

    const {symbol,currencyCode}=getSystemInfoFromLocalStorage();
    console.log('ssssss',symbol)
    return  displayType===CURRENCY_DISPLAY_TYPE.SYMBOL? symbol:currencyCode;
  };

export const formatUtcToLocal = (value, dateOnly = false) => {
  const utcOffSet = moment().utcOffset();
  let localFormattedDate;

  if (dateOnly) {
    localFormattedDate = moment(value).add(utcOffSet, 'minutes').format('YYYY-MMM-DD');
  } else {
    localFormattedDate = moment(value).add(utcOffSet, 'minutes').format('YYYY-MMM-DD hh:mm:ss A');
  }

  return localFormattedDate;
};


export const formatDate = (value, dateOnly = false) => {

  let localFormattedDate;

  if (dateOnly) {
    localFormattedDate = moment(value).format('YYYY-MMM-DD');
  } else {
    localFormattedDate = moment(value).format('YYYY-MMM-DD hh:mm:ss A');
  }

  return localFormattedDate;
};



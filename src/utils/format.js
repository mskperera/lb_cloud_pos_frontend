  // const formatCurrency = (value) => {
  //   // Assuming USD for illustration; you might want to localize or parameterize currency
  //   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR' }).format(value);
  // };
  export const formatCurrency = (value) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    return `Rs ${formattedNumber}`;
  };
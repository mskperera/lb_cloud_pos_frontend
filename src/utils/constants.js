// database related constants
export const DISCOUNT_TYPES = {
    PERCENTAGE: 1,
    FIXED_AMOUNT: 2,
     NONE: 0 // Assuming 0 represents 'none'
  };

  // database related constants
export const PAYMENT_METHODS = {
  CASH: 1,
  CARD: 2,
  CHECK:3,
   CREDIT: 4
};


  export const DISCOUNT_SCOPE = {
    PRODUCT_LEVEL: 1,
    ORDER_LEVEL: 2
};

export const SAVE_TYPE = {
  ADD: "add",
  UPDATE: "update"
};

export const CONTACT_TYPE = {
  CUSTOMER: 1,
  SUPPLIER: 2,
  CUSTOMER_SUPPLIER: 3
};

export const USER_ROLE= {
  ADMIN: 1,
  MANAGER: 2,
  CASHIER: 3
};

export const CURRENCY_DISPLAY_TYPE= {
  SYMBOL: "symbol",
  CODE: "code"
};

// dropdown related constants
export const DROPDOWN_NOT_SELECTED_ID = 0;
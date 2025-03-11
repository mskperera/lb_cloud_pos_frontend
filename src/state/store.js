import { configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice.js'
import orderListSlice from "./orderList/orderListSlice.js";
import popupSlice from "./popup/popupSlice.js";
import storeSlice from './store/storeSlice.js';
import printerSlice from './printer/printerSlice.js';

export const store=configureStore({
    reducer:{
        user:userReducer,
        orderList:orderListSlice,
        popup:popupSlice,
        store:storeSlice,
        printer:printerSlice
    }
})


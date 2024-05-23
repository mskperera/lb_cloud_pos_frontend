import { configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice.js'
import orderListSlice from "./orderList/orderListSlice.js";
import popupSlice from "./popup/popupSlice.js";

export const store=configureStore({
    reducer:{
        user:userReducer,
        orderList:orderListSlice,
        popup:popupSlice
    }
})


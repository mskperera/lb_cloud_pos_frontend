import { configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice.js'
import navBarSlice from "./navBar/navBarSlice.js";
import orderListSlice from "./orderList/orderListSlice.js";
import popupSlice from "./popup/popupSlice.js";

export const store=configureStore({
    reducer:{
        user:userReducer,
        navbar:navBarSlice,
        orderList:orderListSlice,
        popup:popupSlice
    }
})


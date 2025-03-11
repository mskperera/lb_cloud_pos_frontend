import { createSlice } from "@reduxjs/toolkit"


const initialState={
    printerList:[]
}

const printerSlice=createSlice({
    name:"printer",
    initialState,
    reducers:{
        setPrinterList:(state,action)=>{
            state.printerList=action.payload.printerList
        }
    }
})

export const {setPrinterList}=printerSlice.actions;

export default printerSlice.reducer;
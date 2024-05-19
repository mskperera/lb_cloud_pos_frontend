import { createSlice } from "@reduxjs/toolkit"


const initialState={
    value:0,
    voidOrderVisible:false
}

const popupSlice=createSlice({
    name:"popup",
    initialState,
    reducers:{
        setVoidOrderVisible:(state,action)=>{
            state.voidOrderVisible=action.payload.isVisible
        },
        incrementByAmount:(state,action)=>{
            state.value+=action.payload.amount
        }
    }
})

export const {setVoidOrderVisible,incrementByAmount}=popupSlice.actions;

export default popupSlice.reducer;
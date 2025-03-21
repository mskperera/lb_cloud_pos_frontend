import { createSlice } from "@reduxjs/toolkit"


const initialState={
    value:0
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        increment:(state)=>{
            state.value+=1;
        },
        decrement:(state)=>{
            state.value-=1;
        },
        incrementByAmount:(state,action)=>{
            state.value+=action.payload.amount
        }
    }
})

export const {increment,decrement,incrementByAmount}=userSlice.actions;

export default userSlice.reducer;
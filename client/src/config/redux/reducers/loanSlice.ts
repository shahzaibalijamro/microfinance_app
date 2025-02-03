"use client"

import { createSlice } from '@reduxjs/toolkit';
const loanSlice = createSlice({
    name: 'loanSlice',
    initialState: {
        loanSlice: {},
    },
    reducers: {
        setLoanSlice: (state, action) => {
            const {loanData} = action.payload;
            state.loanSlice = loanData;
        },
        removeLoanSlice: (state) => {
            state.loanSlice = {};
        },
    },
});
export const { setLoanSlice, removeLoanSlice } = loanSlice.actions;
export default loanSlice.reducer;
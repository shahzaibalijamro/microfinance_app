"use client"

import { createSlice } from '@reduxjs/toolkit';

const dateSlice = createSlice({
    name: 'date',
    initialState: {
        isValid: false,
    },
    reducers: {
        setDateValidity: (state, action) => {
            state.isValid = action.payload;
        }
    },
});

export const { setDateValidity } = dateSlice.actions;
export default dateSlice.reducer;
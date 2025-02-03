"use client"

import { createSlice } from '@reduxjs/toolkit';

const timeSlice = createSlice({
    name: 'time',
    initialState: {
        isValid: false,
    },
    reducers: {
        setTime: (state, action) => {
            state.isValid = action.payload;
        }
    },
});

export const { setTime } = timeSlice.actions;
export default timeSlice.reducer;
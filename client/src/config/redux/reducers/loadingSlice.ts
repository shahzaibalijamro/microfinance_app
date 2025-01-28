"use client"

import { createSlice } from '@reduxjs/toolkit';
const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        isLoading: true,
    },
    reducers: {
        setLoadingState: (state, action) => {
            const {loading} = action.payload;
            state.isLoading = loading;
        }
    },
});
export const { setLoadingState } = loadingSlice.actions;
export default loadingSlice.reducer;
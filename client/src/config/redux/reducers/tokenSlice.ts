"use client"

import { createSlice } from '@reduxjs/toolkit';
const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        accessToken: "",
    },
    reducers: {
        setAccessToken: (state, action) => {
            const {token} = action.payload;
            state.accessToken = token;
        },
        removeAccessToken: (state) => {
            state.accessToken = "";
        },
    },
});
export const { setAccessToken, removeAccessToken } = tokenSlice.actions;
export default tokenSlice.reducer;
"use client"

import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
    },
    reducers: {
        setUser: (state, action) => {
            const {user} = action.payload;
            state.user = user;
        },
        removeUser: (state) => {
            state.user = {};
        },
    },
});
export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
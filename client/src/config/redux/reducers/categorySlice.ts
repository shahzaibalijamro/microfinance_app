"use client"

import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
    },
    reducers: {
        setCategoriesInRedux: (state, action) => {
            state.categories = action.payload;
        },
        removeCategories: (state) => {
            state.categories = [];
        },
    },
});

export const { setCategoriesInRedux, removeCategories } = categorySlice.actions;
export default categorySlice.reducer;
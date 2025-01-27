"use client"

import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from '../reducers/tokenSlice';
import userReducer from "../reducers/userSlice";
import categoriesReducer from "../reducers/categorySlice";
import loanSlice from "../reducers/loanSlice";

const store = configureStore({
    reducer: {
        token: tokenReducer,
        user: userReducer,
        categories: categoriesReducer,
        loanSlice: loanSlice
    },
});

export default store;
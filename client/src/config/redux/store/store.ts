"use client"

import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from '../reducers/tokenSlice';
import userReducer from "../reducers/userSlice";
import categoriesReducer from "../reducers/categorySlice";
import loanReducer from "../reducers/loanSlice";
import loadingReducer from "../reducers/loadingSlice";

const store = configureStore({
    reducer: {
        token: tokenReducer,
        user: userReducer,
        categories: categoriesReducer,
        loanSlice: loanReducer,
        isLoading: loadingReducer
    },
});

export default store;
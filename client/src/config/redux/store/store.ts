"use client"

import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from '../reducers/tokenSlice';
import userReducer from "../reducers/userSlice";
import categoriesReducer from "../reducers/categorySlice";
import loanReducer from "../reducers/loanSlice";
import loadingReducer from "../reducers/loadingSlice";
import timeSlice from "../reducers/timeSlice";
import dateSlice from "../reducers/dateSlice";
import appointmentSlice from "../reducers/appointmentSlice";

const store = configureStore({
    reducer: {
        token: tokenReducer,
        user: userReducer,
        categories: categoriesReducer,
        loanSlice: loanReducer,
        isLoading: loadingReducer,
        time: timeSlice,
        date: dateSlice,
        appointment: appointmentSlice,
    },
});

export default store;
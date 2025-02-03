"use client"

import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState: {
        appointment: null,
    },
    reducers: {
        setAppointmentInRedux: (state, action) => {
            state.appointment = action.payload;
        },
        removeAppointment: (state) => {
            state.appointment = null;
        },
    },
});

export const { setAppointmentInRedux, removeAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
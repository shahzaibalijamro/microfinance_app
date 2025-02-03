"use client"
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import Register from '../register';
import Loader from '@/components/Loader';

interface tokenState {
    token: {
        accessToken: string,
    }
}

const register = () => {
    const accessToken = useSelector((state: tokenState) => state.token.accessToken);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingVal, setLoadingVal] = useState(33);
    const authenticateUserState = async () => {
        setLoadingVal(90);
        try {
            const { data } = await axios.post("/api/v1/protected");
            console.log(data);
            router.replace("/");
        } catch (error: any) {
            console.log(error);
            const errorMsg = error.response?.data.message;
            if (errorMsg === "Refresh token is required! Please log in again.") {
                setLoading(true)
            }
        }
    }
    useEffect(() => {
        if (accessToken) {
            return router.replace("/");
        }
        if (!accessToken) {
            authenticateUserState();
        }
    }, []);
    return (
        <div>
            {loading ? <Register /> : <Loader loadingVal={loadingVal}/>}
        </div>
    )
}

export default register
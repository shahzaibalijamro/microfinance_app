"use client"
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import Login from '../login';
import Loader from '@/components/Loader';

interface tokenState {
    token: {
        accessToken: string,
    }
}

const login = () => {
    const accessToken = useSelector((state: tokenState) => state.token.accessToken);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
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
            setLoading(false)
        }
    }
    useEffect(() => {
        authenticateUserState();
    }, []);
    return (
        <div>
            {!loading ? <Login /> : <Loader loadingVal={loadingVal}/>}
        </div>
    )
}

export default login
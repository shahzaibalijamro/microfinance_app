"use client"
import React, { useEffect, useState } from 'react'
import axios from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import Login from '../login';
import Loader from '@/components/Loader';

const login = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [loadingVal, setLoadingVal] = useState(33);
    const authenticateUserState = async () => {
        setLoadingVal(90);
        try {
            const { data } = await axios.post("/api/v1/protected");
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
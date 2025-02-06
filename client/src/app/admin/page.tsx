"use client"
import React, { useEffect, useState } from 'react'
import axios from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import Admin from './admin';
import Loader from '@/components/Loader';

const AdminPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [loadingVal, setLoadingVal] = useState(33);
    const authenticateUserState = async () => {
        setLoadingVal(90);
        try {
            const { data } = await axios.post("/api/v1/protected");
            const {user} = data;
            if (user.role === "admin") {
                setLoading(false)
            }else{
                router.replace(`/dashboard/${user?.fullName}`)
            }
        } catch (error: any) {
            console.log(error);
            const errorMsg = error.response?.data.message;
            router.replace("/");
        }
    }
    useEffect(() => {
        authenticateUserState();
    }, []);
    return (
        <div>
            {!loading ? <Admin /> : <Loader loadingVal={loadingVal}/>}
        </div>
    )
}

export default AdminPage
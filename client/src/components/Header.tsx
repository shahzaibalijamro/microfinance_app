"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import axios from "@/config/axiosConfig"
import SaylaniIcon from "@/assets/saylani-welfare-international-trust-logo.png"
import { setAccessToken } from '@/config/redux/reducers/tokenSlice'
import { setUser } from '@/config/redux/reducers/userSlice'
import useRemoveUser from '@/hooks/removeUser'
import { toast } from 'sonner'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { setLoadingState } from '@/config/redux/reducers/loadingSlice'

interface tokenState {
    token: {
        accessToken: string,
    }
}

interface userState {
    user: {
        user: {
            fullName: string,
            _id: string,
            cnicNo: string,
            email: string
        },
    }
}

const Header = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const accessToken = useSelector((state: tokenState) => state.token.accessToken);
    const router = useRouter();
    const removeUserAndRedirect = useRemoveUser();
    const user = useSelector((state: userState) => state.user.user);
    const getTokens = async () => {
        try {
            const { data } = await axios.post("/api/v1/auth");
            if (data.user.role === "admin") {
                dispatch(setUser({ user: data.user }));
                dispatch(setAccessToken({ token: data.accessToken }));
                router.replace(`/admin`)
                setIsLoaded(true)
            }else{
                dispatch(setAccessToken({ token: data.accessToken }));
                dispatch(setUser({ user: data.user }));
                router.replace(`/dashboard/${data.user?.fullName}`)
                setIsLoaded(true)
            }
        } catch (error) {
            console.log(error);
            setIsLoaded(true);
            dispatch(setLoadingState({ loading: false }));
        }
    }
    useEffect(() => {
        if (!accessToken) {
            getTokens();
        }
    }, [])
    const logOutUser = async () => {
        try {
            const { data } = await axios.post("/api/v1/logout");
            removeUserAndRedirect();
        } catch (error: any) {
            console.log(error);
            if (error.response?.status === 500) {
                return toast("Something went wrong!", {
                    description: `Please try again later!`,
                    action: {
                        label: "Retry",
                        onClick: () => logOutUser(),
                    },
                })
            }
            removeUserAndRedirect()
        }
        return null;
    }
    return (
        <div className='w-full flex justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-4 md:py-4 items-center lg:py-3 lg:px-4 xl:px-5 xl:py-3'>
            <Link href={"/"}>
                <Image src={SaylaniIcon} priority alt='saylani-icon' />
            </Link>
            <div className='flex justify-center items-center gap-x-2'>
                {isLoaded && accessToken && user && <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className='focus-visible:outline-none'><Avatar className='w-9 h-9' >
                        <AvatarFallback className='font-medium text-white bg-[#8dc447] text-xl'>{user.fullName[0]}</AvatarFallback>
                    </Avatar></DropdownMenuTrigger>
                    <DropdownMenuContent className='z-50'>
                        <DropdownMenuItem onClick={logOutUser} className='cursor-pointer'>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>}
                {isLoaded && !accessToken && <Link href="/loancalculate">
                    <Button className='bg-[#0673be] transition-transform transform hover:scale-110 hover:text-white hover:bg-[#0673be] text-white'>
                        Request a loan
                    </Button>
                </Link>}
                {isLoaded && !accessToken && <Link href="/login">
                    <Button className='bg-[#8dc447] transition-transform transform hover:translate-y-[2px] hover:scale-110 hover:text-white hover:bg-[#8dc447] text-white'>Login</Button>
                </Link>}
            </div>
        </div>
    )
}

export default Header
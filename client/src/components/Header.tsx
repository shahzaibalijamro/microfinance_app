"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import axios from "@/config/axiosConfig"
import { setAccessToken } from '@/config/redux/reducers/tokenSlice'
import { setUser } from '@/config/redux/reducers/userSlice'
import useRemoveUser from '@/hooks/removeUser'
import { toast } from 'sonner'

interface tokenState {
    token: {
        accessToken: string,
    }
}

interface userState {
    user: {
        user: {
            userName: string,
            _id: string,
            profilePicture: {
                url: string
            }
        },
    }
}

const Header = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const accessToken = useSelector((state: tokenState) => state.token.accessToken);
    console.log(accessToken, "accessToken Before");
    const removeUserAndRedirect = useRemoveUser();
    const user = useSelector((state: userState) => state.user.user);
    console.log(user);
    // const getTokens = async () => {
    //     try {
    //         const { data } = await axios.post("/api/v1/auth");
    //         console.log(data);
    //         dispatch(setAccessToken({ token: data.accessToken }));
    //         dispatch(setUser({ user: data.user }));
    //         setIsLoaded(true)
    //     } catch (error) {
    //         console.log(error);
    //         setIsLoaded(true);
    //     }
    // }
    // useEffect(() => {
    //     if (!accessToken) {
    //         getTokens();
    //     }
    // }, [])
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
        <div className='w-full bg-[#1e40af] flex justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-4 md:py-4 items-center lg:py-3 lg:px-4 xl:px-5 xl:py-3'>
            <Link href={"/"}>
                <h1 className='text-xl text-white font-normal'>Saylani Microfinance App</h1>
            </Link>
            <div className='flex justify-center items-center gap-x-2'>
                {isLoaded && accessToken && user && <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className='focus-visible:outline-none'><Avatar className='w-9 h-9' >
                        <AvatarImage src={user.profilePicture.url} alt={`@${user.userName}`} />
                        <AvatarFallback className='font-medium text-xl'>{user.userName[0]}</AvatarFallback>
                    </Avatar></DropdownMenuTrigger>
                    <DropdownMenuContent className='z-50'>
                        <Link href={`/user/${user.userName}`}>
                        <DropdownMenuLabel className='cursor-pointer'>My Profile</DropdownMenuLabel>
                        </Link>
                        <DropdownMenuItem onClick={logOutUser} className='cursor-pointer'>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>}
                {isLoaded && !accessToken && <Link href="/register">
                    <Button className='bg-white transition hover:translate-y-[2px] hover:text-black hover:bg-white text-black'>Signup</Button>
                </Link>}
            </div>
        </div>
    )
}

export default Header
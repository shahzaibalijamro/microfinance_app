"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import axios from "@/config/axiosConfig"
import SaylaniIcon from "@/assets/saylani-welfare-international-trust-logo.png"
import { setAccessToken } from '@/config/redux/reducers/tokenSlice'
import { setUser } from '@/config/redux/reducers/userSlice'
import useRemoveUser from '@/hooks/removeUser'
import { toast } from 'sonner'
import Image from 'next/image'
import { Separator } from './ui/separator'

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
    useEffect(() => {
        if (!accessToken) {
            // getTokens();
            setIsLoaded(true)
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
                <Image src={SaylaniIcon} alt='saylani-icon' />
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
                <Link href="/loancalculate">
                    <Button className='bg-[#0673be] transition-transform transform hover:scale-110 hover:text-white hover:bg-[#0673be] text-white'>
                        Request a loan
                    </Button>
                </Link>
                {isLoaded && !accessToken && <Link href="/login">
                    <Button className='bg-[#8dc447] transition-transform transform hover:translate-y-[2px] hover:scale-110 hover:text-white hover:bg-[#8dc447] text-white'>Login</Button>
                </Link>}
            </div>
        </div>
    )
}

export default Header
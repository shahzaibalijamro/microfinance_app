"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FormEvent, useState } from "react"
import axios from "@/config/axiosConfig"
import { toast, Toaster } from "sonner"
import { useDispatch } from "react-redux"
import { setAccessToken } from "@/config/redux/reducers/tokenSlice"
import { setUser } from "@/config/redux/reducers/userSlice"
import { useRouter } from "next/navigation"
export default function Login() {
    const router = useRouter();
    const [userNameOrEmail, setUserNameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const loginUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const { data } = await axios.post("/api/v1/login", {
                userNameOrEmail,
                password
            })
            console.log(data);
            toast("Welcome Back!", {
                description: `You have successfully logged in. Enjoy your session!`,
                action: {
                    label: "Home",
                    onClick: () => {
                        dispatch(setAccessToken({ token: data.accessToken }));
                        dispatch(setUser({ user: data.user }));
                        router.replace('/')
                    },
                },
            })
            setTimeout(() => {
                dispatch(setAccessToken({ token: data.accessToken }));
                dispatch(setUser({ user: data.user }));
                router.replace('/');
            }, 2000);
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.message;
            if (errorMessage === "User does not exist!") {
                return toast("User does not exist!", {
                    description: `The provided email or username does not match any account.`,
                    action: {
                        label: "Ok",
                        onClick: () => console.log("Go to Home"),
                    },
                })
            }
            if (errorMessage === "Invalid credentials") {
                return toast("Invalid Credentials!", {
                    description: `The email or password you entered is incorrect. Please try again.`,
                    action: {
                        label: "Ok",
                        onClick: () => console.log("Go to Home"),
                    },
                })
            }
        }
    }
    return (
        <div className="w-full px-3 h-[90vh] flex justify-center items-center">
            <Toaster />
            <Card className="mx-auto w-full max-w-[640px]">
                <CardHeader>
                    <CardTitle className="text-3xl text-[#1e40af]">Login</CardTitle>
                    <CardDescription>Enter your information to Login</CardDescription>
                </CardHeader>
                <form onSubmit={loginUser}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username-or-email">Username or Email</Label>
                            <Input id="username-or-email" onChange={(e) => setUserNameOrEmail(e.target.value)} placeholder="shahzaibali" required minLength={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" required minLength={8} />
                        </div>
                        <Button type="submit" className="w-full hover:bg-[#3655bd] bg-[#1e40af]">Login</Button>
                        <div className="flex w-full justify-center gap-x-2 items-center">
                            <h1>New here?</h1>
                            <Link href={'/register'}>
                                <h1 className="cursor-pointer underline text-blue-700">Register now!</h1>
                            </Link>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}
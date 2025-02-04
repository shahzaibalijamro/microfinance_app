"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormEvent, useState } from "react"
import axios from "@/config/axiosConfig"
import { toast, Toaster } from "sonner"
import { useDispatch } from "react-redux"
import { setAccessToken } from "@/config/redux/reducers/tokenSlice"
import { setUser } from "@/config/redux/reducers/userSlice"
import { useRouter } from "next/navigation"

export default function Login() {
    const router = useRouter();
    const [cnicNo, setCnicNo] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const loginUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const cnicRegex = /^[0-9]{13}$/;
        if (!cnicRegex.test(cnicNo)) {
            return toast("Invalid CNIC!", {
                description: "CNIC must be a 13-digit number.",
                action: { label: "Ok", onClick: () => console.log("Invalid CNIC") },
            });
        }
        try {
            const { data } = await axios.post("/api/v1/login", {
                cnicNo,
                password
            })
            toast("Welcome Back!", {
                description: `You have successfully logged in. Enjoy your session!`,
                action: {
                    label: "Home",
                    onClick: () => {
                        if (data.user.role === "admin") {
                            dispatch(setAccessToken({ token: data.accessToken }));
                            dispatch(setUser({ user: data.user }));
                            router.replace(`/admin`)
                        } else {
                            dispatch(setAccessToken({ token: data.accessToken }));
                            dispatch(setUser({ user: data.user }));
                            router.replace(`/dashboard/${data.user?.fullName}`)
                        }
                    },
                },
            })
            setTimeout(() => {
                if (data.user.role === "admin") {
                    dispatch(setAccessToken({ token: data.accessToken }));
                    dispatch(setUser({ user: data.user }));
                    router.replace(`/admin`)
                } else {
                    dispatch(setAccessToken({ token: data.accessToken }));
                    dispatch(setUser({ user: data.user }));
                    router.replace(`/dashboard/${data.user?.fullName}`)
                }
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
        <div className="w-full px-3 h-[80vh] flex justify-center items-center">
            <Toaster />
            <Card className="mx-auto w-full max-w-[640px]">
                <CardHeader>
                    <CardTitle className="text-3xl text-[#0673be]">Login</CardTitle>
                    <CardDescription>Enter your information to Login</CardDescription>
                </CardHeader>
                <form onSubmit={loginUser}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cnic-no">CNIC No</Label>
                            <Input id="cnic-no" onChange={(e) => setCnicNo(e.target.value)} placeholder="4250112345678" required minLength={13} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" required minLength={8} />
                        </div>
                        <Button type="submit" className="w-full hover:bg-[#84b642] bg-[#8dc447]">Login</Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}
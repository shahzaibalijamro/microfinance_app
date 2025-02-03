"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FormEvent, useRef, useState } from "react"
import { toast } from "sonner"
import axios from "@/config/axiosConfig"
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/config/redux/reducers/tokenSlice";
import { setUser } from "@/config/redux/reducers/userSlice";
export default function Register() {
    const router = useRouter();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com)$/;
    const [userName, setUserName] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const dispatch = useDispatch();
    const profilePicture = useRef<HTMLInputElement | null>(null);
    const registerUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!emailRegex.test(email)) {
            return toast("Email Invalid!", {
                description: "Please use a valid email address from Gmail, Yahoo, Outlook, Hotmail, or iCloud.",
                action: {
                    label: "Close",
                    onClick: () => console.log("Undo"),
                },
            })
        }
        if (password !== confirmPassword) {
            return toast("Passwords do not match!", {
                description: "Please ensure both password fields match.",
                action: {
                    label: "Close",
                    onClick: () => console.log("Undo"),
                },
            })
        }
        if (profilePicture.current?.files?.[0] === undefined) {
            return toast("Error!", {
                description: `Please provide a profile picture.`,
                action: {
                    label: "OK",
                    onClick: () => console.log("ok"),
                },
            })
        };
        try {
            const formData = new FormData();
            formData.append("profilePicture", profilePicture.current?.files?.[0]);
            formData.append("fullName", fullName)
            formData.append("userName", userName)
            formData.append("email", email)
            formData.append("password", password)
            const {data} = await axios.post("/api/v1/register",formData)
            localStorage.setItem("accessToken",data.accessToken);
            dispatch(setAccessToken({token: data.accessToken}));
            dispatch(setUser({user: data.user}));
            toast("Successfully registered!", {
                description: `Welcome aboard ${data.user.userName}`,
                action: {
                    label: "Home",
                    onClick: () => router.replace('/'),
                },
            })
            setTimeout(() => {
                router.replace('/');
            }, 2000);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage === "Password does not meet the required criteria!") {
                return toast("Use a stronger password!", {
                    description: `Password must be at least 8 characters long and include at least one letter, one number, and one special character (e.g., @$!%*?&).`,
                    action: {
                        label: "ok",
                        onClick: () => console.log("Go to Home"),
                    },
                })
            }
            if (errorMessage === "This username is already taken.") {
                return toast("This username is already taken!", {
                    description: `Please choose a different username as this one is not available.`,
                    action: {
                        label: "ok",
                        onClick: () => console.log("Go to Home"),
                    },
                })
            }
            if (errorMessage === "This email is already taken.") {
                return toast("Email already in use!", {
                    description: `Please use a different email address or log in if you already have an account.`,
                    action: {
                        label: "ok",
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
                    <CardTitle className="text-3xl text-[#1e40af]">Register</CardTitle>
                    <CardDescription>Enter your information to create an account</CardDescription>
                </CardHeader>
                <form onSubmit={registerUser}>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="fullName">Fullname</Label>
                            <Input onChange={(e) => setFullName(e.target.value)} id="fullName" placeholder="Shahzaib Ali Jamro" required minLength={3} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input onChange={(e) => setUserName(e.target.value)} id="username" placeholder="shahzaibali" required minLength={3} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="shahzaib@example.com" required minLength={"@gmail.com".length} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="profilePicture">Profile Pic</Label>
                            <Input id="profilePicture" className='border cursor-pointer border-gray-300' required type="file" ref={profilePicture} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input onChange={(e) => setPassword(e.target.value)} id="password" placeholder="password" type="password" required minLength={8} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input onChange={(e) => setConfirmPassword(e.target.value)} id="confirm-password" placeholder="confirm password" type="password" required minLength={8} />
                        </div>
                        <Button type="submit" className="w-full hover:bg-[#3655bd] bg-[#1e40af]">Register</Button>
                        <div className="flex w-full justify-center gap-x-2 items-center">
                            <h1>Already own an account?</h1>
                            <Link href={'/login'}>
                                <h1 className="cursor-pointer underline text-blue-700">Login now!</h1>
                            </Link>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}
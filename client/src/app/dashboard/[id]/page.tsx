"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "@/config/axiosConfig";
import { Progress } from "@/components/ui/progress";
import { toast, Toaster } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useRemoveUser from "@/hooks/removeUser";
import { setLoanSlice } from "@/config/redux/reducers/loanSlice";
import { setLoadingState } from "@/config/redux/reducers/loadingSlice";
import { setUser } from "@/config/redux/reducers/userSlice";

// TypeScript Interfaces
interface UserState {
    user: {
        user: {
            fullName: string,
            _id: string,
            cnicNo: string,
            email: string
            isPasswordChanged: boolean
        };
    };
}
interface isLoading {
    isLoading: {
        isLoading: boolean,
    }
}
interface TokenState {
    token: {
        accessToken: string;
    };
}
interface User {
    fullName: string,
    _id: string,
    cnicNo: string,
    email: string,
    isPasswordChanged: boolean
}
interface Category {
    _id: string;
    name: string;
    description: string;
    subcategories: SubCategory[];
}
interface SubCategory {
    name: string;
    _id: string;
}
interface LoanDetails {
    _id: string;
    userId: string;
    loanCategory: string;
    loanSubcategory: string;
    initialDeposit: number;
    loanAmount: number;
    loanPeriod: number; // in months
    status: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    guarantors: Array<string>; // Assuming it's an array of guarantor IDs
    __v: number;
  }
  
// Component
const Page = ({ params, }: { params: Promise<{ id: string }> }) => {
    const isLoading = useSelector((state: isLoading) => state.isLoading.isLoading);
    const accessToken = useSelector(
        (state: TokenState) => state.token.accessToken
    );
    const user = useSelector((state: UserState) => state.user.user);
    const [isPasswordChanged, setIsPasswordChanged] = useState(true);
    const [password, setPassword] = useState<string>("");
    const [loanDetails,setLoanDetails] = useState<LoanDetails | null>(null)
    const [id, setId] = useState<string>("");
    const [loadingVal, setLoadingVal] = useState(33);
    const [doesUserExist, setDoesUserExist] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [doesCategoryExist, setDoesCategoryExist] = useState<boolean>(true);
    const dispatch = useDispatch();
    const removeUserAndRedirect = useRemoveUser();
    const router = useRouter();
    useEffect(() => {
        if (user._id && accessToken) {
            setLoadingVal(90);
            checkIsPasswordChanged();
        }
    }, [user, accessToken])
    const checkIsPasswordChanged = async () => {
        setIsPasswordChanged(user.isPasswordChanged);
        if (user.isPasswordChanged) {
            getCurrentLoanRequest();
        }
        dispatch(setLoadingState({ loading: false }));
    }
    const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return toast("Invalid Password", {
                description: `The password must be at least 8 characters long and include a combination of letters, numbers, and special characters.`,
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        }
        try {
            const { data } = await axios.patch("/api/v1/register", {
                cnicNo: user.cnicNo,
                password
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            console.log(data);
            setIsPasswordChanged(data.isPasswordChanged);
            dispatch(setUser({ user: data }));
            return toast("Password updated!", {
                description: `Your password has been updated successfully, you can use this password to login next time.`,
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        } catch (error) {
            console.log(error);
        }
    }
    const getCurrentLoanRequest = async () => {
        const { data } = await axios("/api/v1/loan", {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        console.log(data);
        setLoanDetails(data);
    }
    return (
        <>
            <Toaster />
            {isLoading ? (
                <div className="max-w-[200px] h-[80vh] mx-auto px-4 justify-center items-center mt-4 flex">
                    <Progress value={loadingVal} />
                </div>
            ) : !isPasswordChanged && !isLoading ? (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="mb-1">
                            <h2 className="text-xl font-semibold mb-2">
                                Update Your Password to Continue!
                            </h2>
                            <p className="mb-4">
                                You have successfully logged in using the credentials provided via email.
                                For security purposes, please update your password to proceed further.
                            </p>
                            <form onSubmit={updatePassword}>
                                <div className="mb-4">
                                    <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                                        Enter New Password
                                    </label>
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        type="password"
                                        id="newPassword"
                                        minLength={8}
                                        placeholder="Enter your new password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-[#0673be] text-white py-2 px-4 rounded-md hover:bg-[#0673be] focus:ring focus:ring-blue-300"
                                >
                                    Update Password
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : loanDetails ? (
                <div className="w-full bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row items-center gap-4 border max-w-[1200px] mx-auto mt-6">
                    {/* Left Section */}
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loan Category</h2>
                        <p className="text-lg text-gray-600">{loanDetails.loanCategory}</p>
                        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Loan Subcategory</h2>
                        <p className="text-lg text-gray-600">{loanDetails.loanSubcategory}</p>
                    </div>

                    {/* Center Section */}
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loan Amount</h2>
                        <p className="text-lg text-gray-600">{loanDetails.loanAmount.toLocaleString()} PKR</p>
                        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Initial Deposit</h2>
                        <p className="text-lg text-gray-600">{loanDetails.initialDeposit.toLocaleString()} PKR</p>
                        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Loan Period</h2>
                        <p className="text-lg text-gray-600">{loanDetails.loanPeriod} months</p>
                    </div>

                    {/* Right Section */}
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Status</h2>
                        <p className={`text-lg font-medium ${loanDetails.status === "Pending" ? "text-yellow-600" : "text-green-600"}`}>
                            {loanDetails.status}
                        </p>
                        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Created At</h2>
                        <p className="text-lg text-gray-600">{new Date(loanDetails.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            ) : <>
            <h1>Hello</h1>
            </>}
        </>
    );
};

export default Page;
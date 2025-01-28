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

// Component
const Page = ({ params, }: { params: Promise<{ id: string }> }) => {
    const accessToken = useSelector(
        (state: TokenState) => state.token.accessToken
    );
    const [isPasswordChanged, setIsPasswordChanged] = useState(true);
    const user = useSelector((state: UserState) => state.user.user);
    console.log(user, "===>");
    const isLoading = useSelector((state: isLoading) => state.isLoading.isLoading);
    console.log(isLoading);
    const [password, setPassword] = useState<string>("")
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
        (async () => {
            setLoadingVal(90);
            const resolvedParams = await params;
            setId(resolvedParams.id);
            dispatch(setLoadingState({ loading: false }));
        })();
    }, [params, accessToken]);
    useEffect(() => {
        checkIsPasswordChanged();
    }, [user])
    const goToLoanCalculator = (subcategory: SubCategory) => {
        dispatch(setLoanSlice({ loanData: { category: currentCategory?.name, subCategory: subcategory.name } }));
        router.push(`/loancalculate`);
    }
    const checkIsPasswordChanged = async () => {
        setIsPasswordChanged(user.isPasswordChanged);
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
            const {data} = await axios.patch("/api/v1/register",{
                cnicNo: user.cnicNo,
                password
            }, {
                headers: {
                    'Authorization' : `Bearer ${accessToken}`
                }
            })
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Toaster/>
            {isLoading ? (
                <div className="max-w-[200px] h-[80vh] mx-auto px-4 justify-center items-center mt-4 flex">
                    <Progress value={loadingVal} />
                </div>
            ) : !isPasswordChanged ? (
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
            ) : (
                <div className="max-w-[1200px] px-3 w-full mx-auto">
                    <div className="h-6 w-full"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentCategory?.subcategories && currentCategory?.subcategories?.length > 0 ? (
                            currentCategory.subcategories.map((subcategory: SubCategory) => (
                                <div
                                    key={subcategory._id}
                                    className="border rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-95 flex flex-col justify-between bg-white"
                                >
                                    <div className="flex flex-col justify-between h-full">
                                        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                                            {subcategory.name}
                                        </h2>
                                        <button
                                            className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            onClick={() => goToLoanCalculator(subcategory)}
                                        >
                                            Proceed
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center items-center my-4">
                                <h1 className="text-lg font-semibold text-gray-600">
                                    No categories found!
                                </h1>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Page;
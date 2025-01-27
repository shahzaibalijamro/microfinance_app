// "use client";

// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import React, { useEffect, useState } from 'react'
// import axios from "@/config/axiosConfig"
// import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import { Progress } from '@/components/ui/progress';
// import Link from 'next/link';
// import Card from '@/components/Card';
// import { toast, Toaster } from 'sonner';
// import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
// import useRemoveUser from '@/hooks/removeUser';
// import { removeAccessToken } from '@/config/redux/reducers/tokenSlice';
// import { removeUser } from '@/config/redux/reducers/userSlice';

// interface userState {
//     user: {
//         user: {
//             userName: string,
//             profilePicture: {
//                 url: string,
//             }
//         },
//     }
// }
// interface categoriesState {
//     categories: {
//         categories: [],
//     }
// }
// interface singlePost {
//     userId: {
//         userName: string;
//         profilePicture: {
//             url: string
//         };
//     };
//     _id: string;
//     content: string;
//     createdAt: string;
//     updatedAt: string;
//     media: {
//         url: string
//     };
//     likes: any[];
//     comments: any[];
//     __v: number;
// }
// interface tokenState {
//     token: {
//         accessToken: string,
//     }
// }
// interface User {
//     userName: string,
//     _id: string,
//     posts: [],
//     createdAt: string,
//     profilePicture: {
//         url: string,
//     }
// }
// interface Category {
//     _id: string;
//     name: string;
//     description: string;
//     subcategories: { name: string; _id: string }[];
// }
// interface SubCategory { name: string; _id: string };
// const Page = ({ params, }: { params: Promise<{ id: string }> }) => {
//     const categories = useSelector((state: categoriesState) => state.categories.categories);
//     const [loading, setLoading] = useState(true);
//     const accessToken = useSelector((state: tokenState) => state.token.accessToken);
//     const [currentCategory, setCurrentCategory] = useState<Category | {}>({})
//     const user = useSelector((state: userState) => state.user.user);
//     const [id, setId] = useState<string>("");
//     const [commentText, setCommentText] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [loadingVal, setLoadingVal] = useState(33);
//     const [posts, setPosts] = useState<singlePost[]>([]);
//     const [doesUserExist, setDoesUserExist] = useState(true);
//     const [currentUser, setCurrentUser] = useState<User | null>(null);
//     const dispatch = useDispatch();
//     const removeUserAndRedirect = useRemoveUser();
//     const router = useRouter();
//     console.log(categories, "===>");
//     const [doesCategoryExist, setDoesCategoryExist] = useState<boolean>(true);
//     useEffect(() => {
//         (async () => {
//             const resolvedParams = await params;
//             setId(resolvedParams.id);
//             const matchedCategory = categories.find(
//                 (category: Category) => decodeURIComponent(resolvedParams.id) === category.name
//             );
//             if (!matchedCategory) {
//                 // setDoesCategoryExist(false);
//                 const decodedId = decodeURIComponent(resolvedParams.id);
//                 const { data } = await axios.get(`/api/v1/category/${encodeURIComponent(decodedId)}`);
//                 console.log(data);
//                 setCurrentCategory(data)
//                 setDoesCategoryExist(true);
//             } else {
//                 setCurrentCategory(matchedCategory)
//                 setDoesCategoryExist(true);
//             }
//             setLoading(false)

//             // if (!accessToken) {
//             //     return authenticateUserState();
//             // }
//             // if (accessToken) {
//             //     fetchPosts(resolvedParams.id);
//             // }
//         })();
//     }, [params, accessToken]);
//     console.log(id);
//     return (
//         <>
//             {loading ? <div className='max-w-[200px] h-[80vh] mx-auto px-4 justify-center items-center mt-4 flex'><Progress value={loadingVal} /></div> : !doesCategoryExist ? <div className="flex items-center min-h-[85vh] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
//                 <div className="mx-auto space-y-6 text-center">
//                     <div className="space-y-3">
//                         <h1 className="text-4xl font-bold tracking-tighter text-[#1e40af] sm:text-5xl transition-transform hover:scale-110">404</h1>
//                         <p className="text-gray-500">Page not found!</p>
//                     </div>
//                     <Link
//                         href="/"
//                         className="inline-flex h-10 items-center rounded-md bg-[#1e40af] px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#3252bb] focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
//                         prefetch={false}
//                     >
//                         Return to Home
//                     </Link>
//                 </div>
//             </div> : <div className='max-w-[1200px] px-3 w-full mx-auto'>
//                 <div className="h-6 w-full"></div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                     {currentCategory.subcategories.length > 0 ? (
//                         currentCategory.subcategories.map((category:SubCategory) => (
//                             <div
//                                 key={category._id}
//                                 className="border rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-95 flex flex-col justify-between bg-white"
//                             >
//                                 <div className="flex flex-col justify-between h-full">
//                                     <h2 className="text-2xl font-semibold mb-2 text-gray-800">{category.name}</h2>
//                                     <button
//                                         className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                                     // onClick={() => goToSubCategory(category)}
//                                     >
//                                         Proceed
//                                     </button>
//                                 </div>
//                             </div>

//                         ))
//                     ) : (
//                         <div className="flex justify-center items-center my-4">
//                             <h1 className="text-lg font-semibold text-gray-600">No categories found!</h1>
//                         </div>
//                     )}
//                 </div>
//             </div>}
//         </>
//     )
// }

// export default Page

"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/config/axiosConfig";
import { Progress } from "@/components/ui/progress";
import { toast, Toaster } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import Card from "@/components/Card";
import useRemoveUser from "@/hooks/removeUser";
import { removeAccessToken } from "@/config/redux/reducers/tokenSlice";
import { removeUser } from "@/config/redux/reducers/userSlice";
import { setLoanSlice } from "@/config/redux/reducers/loanSlice";

// TypeScript Interfaces
interface UserState {
    user: {
        user: {
            userName: string;
            profilePicture: {
                url: string;
            };
        };
    };
}

interface CategoriesState {
    categories: {
        categories: Category[];
    };
}

interface SinglePost {
    userId: {
        userName: string;
        profilePicture: {
            url: string;
        };
    };
    _id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    media: {
        url: string;
    };
    likes: any[];
    comments: any[];
    __v: number;
}

interface TokenState {
    token: {
        accessToken: string;
    };
}

interface User {
    userName: string;
    _id: string;
    posts: any[];
    createdAt: string;
    profilePicture: {
        url: string;
    };
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
    const categories = useSelector(
        (state: CategoriesState) => state.categories.categories
    );
    const accessToken = useSelector(
        (state: TokenState) => state.token.accessToken
    );
    const user = useSelector((state: UserState) => state.user.user);

    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>("");
    const [commentText, setCommentText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingVal, setLoadingVal] = useState(33);
    const [posts, setPosts] = useState<SinglePost[]>([]);
    const [doesUserExist, setDoesUserExist] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [doesCategoryExist, setDoesCategoryExist] = useState<boolean>(true);

    const dispatch = useDispatch();
    const removeUserAndRedirect = useRemoveUser();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);

            const matchedCategory = categories.find(
                (category: Category) =>
                    decodeURIComponent(resolvedParams.id) === category.name
            );

            if (!matchedCategory) {
                const decodedId = decodeURIComponent(resolvedParams.id);
                try {
                    const { data } = await axios.get(
                        `/api/v1/category/${encodeURIComponent(decodedId)}`
                    );
                    setCurrentCategory(data);
                    setDoesCategoryExist(true);
                } catch (error) {
                    setDoesCategoryExist(false);
                    console.error("Category not found:", error);
                }
            } else {
                setCurrentCategory(matchedCategory);
                setDoesCategoryExist(true);
            }
            setLoading(false);
        })();
    }, [params, accessToken, categories]);
    const goToLoanCalculator = (subcategory: SubCategory) => {
        dispatch(setLoanSlice({loanData:{category: currentCategory?.name,subCategory: subcategory.name}}));
        router.push(`/loancalculate`);
    }
    return (
        <>
            {loading ? (
                <div className="max-w-[200px] h-[80vh] mx-auto px-4 justify-center items-center mt-4 flex">
                    <Progress value={loadingVal} />
                </div>
            ) : !doesCategoryExist ? (
                <div className="flex items-center min-h-[85vh] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                    <div className="mx-auto space-y-6 text-center">
                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold tracking-tighter text-[#1e40af] sm:text-5xl transition-transform hover:scale-110">
                                404
                            </h1>
                            <p className="text-gray-500">Page not found!</p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex h-10 items-center rounded-md bg-[#1e40af] px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#3252bb] focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                            prefetch={false}
                        >
                            Return to Home
                        </Link>
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
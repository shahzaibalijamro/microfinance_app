"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/config/axiosConfig";
import { Progress } from "@/components/ui/progress";
import { setLoanSlice } from "@/config/redux/reducers/loanSlice";

// TypeScript Interfaces
interface CategoriesState {
    categories: {
        categories: Category[];
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

const Page = ({ params, }: { params: Promise<{ id: string }> }) => {
    const categories = useSelector(
        (state: CategoriesState) => state.categories.categories
    );
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>("");
    const [loadingVal, setLoadingVal] = useState(33);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [doesCategoryExist, setDoesCategoryExist] = useState<boolean>(true);
    const dispatch = useDispatch();
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
                    console.log(data);
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
    }, [params, categories]);
    const goToLoanCalculator = (subcategory: SubCategory) => {
        dispatch(setLoanSlice({ loanData: { category: currentCategory?.name, subCategory: subcategory.name } }));
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
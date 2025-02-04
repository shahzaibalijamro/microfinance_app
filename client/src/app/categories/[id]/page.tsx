"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "@/config/axiosConfig";
import { setLoanSlice } from "@/config/redux/reducers/loanSlice";
import Loader from "@/components/Loader";
import PageNotFound from "@/components/PageNotFound";
import SubCategoryCard from "@/components/SubCategoryCard";

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
            {loading ? <Loader loadingVal={loadingVal} /> : !doesCategoryExist ? <PageNotFound /> : (
                <div className="max-w-[1200px] px-3 w-full mx-auto">
                    <div className="h-6 w-full"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentCategory?.subcategories && currentCategory?.subcategories?.length > 0 ? (
                            currentCategory.subcategories.map((subcategory: SubCategory) => (
                                <SubCategoryCard goToLoanCalculator={goToLoanCalculator} subcategory={subcategory} />
                            ))
                        ) : (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                                <div className="mx-auto space-y-6 text-center">
                                    <div className="space-y-3">
                                        <h1 className="text-4xl font-bold tracking-tighter text-[#0673be] sm:text-5xl transition-transform hover:scale-110">
                                            404
                                        </h1>
                                        <p className="text-gray-500">Category not found!</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Page;
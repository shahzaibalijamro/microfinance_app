"use client";

import React, { useEffect, useRef, useState } from 'react'
import axios from "@/config/axiosConfig"
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCategoriesInRedux } from '@/config/redux/reducers/categorySlice';
import { setLoadingState } from '@/config/redux/reducers/loadingSlice';
import Loader from '@/components/Loader';
import CategoryCard from '@/components/CategoryCard';

interface tokenState {
  token: {
    accessToken: string,
  }
}
interface isLoading {
  isLoading: {
    isLoading: boolean,
  }
}
interface userState {
  user: {
    user: {
      fullName: string,
      _id: string,
      cnicNo: string,
      email: string
    },
  }
}
interface SubCategory {
  _id: string;
  name: string;
}
interface Category {
  _id: string;
  name: string;
  description: string;
  subcategories: SubCategory[];
  maxLoan: number | null;
  loanPeriod: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
const Home = () => {
  const accessToken = useSelector((state: tokenState) => state.token.accessToken);
  const user = useSelector((state: userState) => state.user.user);
  const isLoading = useSelector((state: isLoading) => state.isLoading.isLoading);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [commentText, setCommentText] = useState("");
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingVal, setLoadingVal] = useState(33);
  const router = useRouter()
  const mediaRef = useRef<HTMLInputElement | null>(null);
  const getAllCategories = async (page = 1) => {
    setCategories([]);
    setLoading(true)
    setLoadingVal(50);
    try {
      const { data } = await axios.get("/api/v1/categories");
      setCategories(data);
      dispatch(setCategoriesInRedux(data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    (async () => {
      await getAllCategories()
    })()
  }, [])
  const goToSubCategory = (category: Category) => {
    router.push(`/categories/${category.name}`);
  }
  return (
    <>
      <div className="h-6 w-full"></div>
      {/* Loading Spinner */}
      {isLoading ? <Loader loadingVal={loadingVal} /> : (
        <>
          <h1 className='text-2xl text-center'>What Saylani offers you</h1>
          <div className="h-6 w-full"></div>
          <div className='max-w-[1200px] px-3 w-full mx-auto'>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.length > 0 ? (
                categories.map((category: Category) => (
                  <CategoryCard category={category} goToSubCategory={goToSubCategory} />
                ))
              ) : (
                <div className="flex justify-center items-center my-4">
                  <h1 className="text-lg font-semibold text-gray-600">No categories found!</h1>
                </div>
              )}
            </div>
          </div></>
      )}
      <div className="h-6 w-full"></div>
    </>
  )
}

export default Home
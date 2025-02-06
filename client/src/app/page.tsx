"use client";

import React, { useEffect, useRef, useState } from 'react'
import axios from "@/config/axiosConfig"
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCategoriesInRedux } from '@/config/redux/reducers/categorySlice';
import Loader from '@/components/Loader';
import CategoryCard from '@/components/CategoryCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
interface isLoading {
  isLoading: {
    isLoading: boolean,
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
  const isLoading = useSelector((state: isLoading) => state.isLoading.isLoading);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const [loadingVal, setLoadingVal] = useState(33);
  const router = useRouter()
  const getAllCategories = async () => {
    setCategories([]);
    setLoadingVal(50);
    try {
      const { data } = await axios.get("/api/v1/categories");
      setCategories(data);
      dispatch(setCategoriesInRedux(data));
    } catch (error) {
      console.log(error);
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
      {isLoading ? <Loader loadingVal={loadingVal} /> : (
        <>
          <h1 className='text-2xl text-center'>What Saylani offers you</h1>
          <div className="h-6 w-full"></div>
          <div className='max-w-[1200px] px-3 w-full mx-auto'>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.length > 0 ? (
                categories.map((category: Category) => (
                  <CategoryCard key={category._id} category={category} goToSubCategory={goToSubCategory} />
                ))
              ) : (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[200px] w-full my-4">
                  <LoadingSpinner className='text-center w-full'/>
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
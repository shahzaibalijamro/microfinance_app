"use client";

import Card from '@/components/Card';
import InputForm from '@/components/InputForm'
import React, { useEffect, useRef, useState } from 'react'
import axios from "@/config/axiosConfig"
import { Progress } from '@/components/ui/progress';
import Head from 'next/head';
import { toast, Toaster } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { setCategoriesInRedux } from '@/config/redux/reducers/categorySlice';

interface tokenState {
  token: {
    accessToken: string,
  }
}
interface singlePost {
  userId: {
    userName: string;
    profilePicture: {
      url: string
    }
  };
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  media: {
    url: string
  };
  likes: any[];
  comments: any[];
  __v: number;
}
interface userState {
  user: {
    user: {
      userName: string
      profilePicture: {
        url: string
      }
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
    setLoadingVal(80);
    try {
      const { data } = await axios.get("/api/v1/categories");
      setLoadingVal(90);
      console.log(data);
      setCategories(data);
      dispatch(setCategoriesInRedux(data))
      // if (data?.message === "You're all caught up!") {
      //   return setPosts([])
      // }
      // setPosts(data)
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
    console.log(process.env.NEXT_PUBLIC_API_URL, "==>");
  }, [])
  // const addPost = async () => {
  //   if (!accessToken) {
  //     return toast("Unauthorized!", {
  //       description: `You need to log in to add a post. Please log in and try again.`,
  //       action: {
  //         label: "Login",
  //         onClick: () => router.push("/login"),
  //       },
  //     })
  //   }
  //   if (mediaRef.current?.files?.[0] === undefined && (!textInput || textInput.trim() === "")) {
  //     return toast("Error!", {
  //       description: `Please provide either a file or some text content before submitting.`,
  //       action: {
  //         label: "OK",
  //         onClick: () => console.log("ok"),
  //       },
  //     })
  //   };
  //   const formData = new FormData();
  //   if (mediaRef.current?.files?.[0] !== undefined) {
  //     formData.append("file", mediaRef.current?.files?.[0])
  //   }
  //   if (!(!textInput || textInput.trim() === "")) {
  //     formData.append("content", textInput)
  //   }
  //   try {
  //     const { data } = await axios.post("/api/v1/post", formData, {
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`
  //       }
  //     })
  //     const { post } = data;
  //     post.userId = {
  //       userName: user.userName,
  //       profilePicture: {
  //         url: user.profilePicture.url
  //       }
  //     }
  //     // setPosts([post,...posts]);
  //   } catch (error) {
  //     console.log(error);
  //     toast("Something went wrong!", {
  //       description: `Please try again later.`,
  //       action: {
  //         label: "Retry",
  //         onClick: () => addPost(),
  //       },
  //     })
  //   }
  // }
  // const likePost = async (id: string, index: number) => {
  //   console.log(id)
  //   if (!accessToken) {
  //     return toast("Unauthorized!", {
  //       description: `You need to log in to like a post. Please log in and try again.`,
  //       action: {
  //         label: "Login",
  //         onClick: () => router.push("/login"),
  //       },
  //     })
  //   }
  //   try {
  //     const { data } = await axios.post(`/api/v1/post/${id}`, {}, {
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`
  //       }
  //     })
  //     console.log(data);
  //     const confirmationMessage = data.message;
  //     if (confirmationMessage === "Post Unliked") {
  //       const { unLike } = data;
  //       // posts[index].likes = unLike.likes;
  //       // setPosts([...posts]);
  //       return toast("Post Unliked!", {
  //         action: {
  //           label: "Undo",
  //           onClick: () => likePost(id, index),
  //         },
  //       });
  //     }
  //     if (confirmationMessage === "Post liked") {
  //       const { like } = data;
  //       posts[index].likes = like.likes;
  //       setPosts([...posts]);
  //       return toast("Post liked!", {
  //         action: {
  //           label: "Undo",
  //           onClick: () => likePost(id, index),
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // const commentOnPost = async (id: string, index: number) => {
  //   if (!(commentText || commentText.trim() !== "")) {
  //     return toast("Empty Comment!", {
  //       description: `Cannot add an empty comment.`,
  //       action: {
  //         label: "Ok",
  //         onClick: () => null,
  //       },
  //     })
  //   }
  //   if (!accessToken) {
  //     return toast("Unauthorized!", {
  //       description: `You need to log in to comment on a post. Please log in and try again.`,
  //       action: {
  //         label: "Login",
  //         onClick: () => router.push("/login"),
  //       },
  //     })
  //   }
  //   try {
  //     const {data} = await axios.post(`/api/v1/post/comment/${id}`,{
  //       text: commentText
  //     },{
  //       headers: {
  //         'Authorization' : `Bearer ${accessToken}`
  //       }
  //     })
  //     console.log(data);
  //     const currentDateTime = new Date().toISOString();
  //     posts[index].comments.unshift({
  //       text: commentText,
  //       createdAt: currentDateTime,
  //       userId: { userName: user.userName }
  //     });
  //     setPosts([...posts]);
  //     setCommentText("");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // const goToNextPage = async () => {
  //   getAllPosts(currentPage+1);
  //   setCurrentPage(currentPage+1)
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: 'smooth',
  //   });
  // }
  // const goToPreviousPage = async () => {
  //   if (currentPage === 1) {
  //     return null
  //   }
  //   getAllPosts(currentPage-1);
  //   setCurrentPage(currentPage-1);
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: 'smooth',
  //   });
  // }
  const goToSubCategory = (category:Category) => {
    console.log(category);
    router.push(`/categories/${category.name}`);
  }
  return (
    <>
      <Head>
        <title>Home - My App</title>
      </Head>
      <Toaster />
      <div className="h-6 w-full"></div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="w-full h-[80vh] flex justify-center items-center my-4">
          <Progress className='w-48' value={loadingVal} />
        </div>
      ) : (
        <>
          <h1 className='text-2xl text-center'>What Saylani offers you</h1>
          <div className="h-6 w-full"></div>
          <div className='max-w-[1200px] px-3 w-full mx-auto'>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.length > 0 ? (
                categories.map((category:Category) => (
                  <div
                    key={category._id}
                    className="border rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-95 flex flex-col justify-between bg-white"
                  >
                    <div className="flex flex-col justify-between h-full">
                      <h2 className="text-2xl font-semibold mb-2 text-gray-800">{category.name}</h2>
                      <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                      <button
                        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        onClick={() => goToSubCategory(category)}
                      >
                        Proceed
                      </button>
                    </div>
                  </div>

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
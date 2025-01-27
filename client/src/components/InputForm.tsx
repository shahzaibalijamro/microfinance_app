"use client";
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from './ui/button'
interface Props {
    setTextInput: (value: string) => void;
    mediaRef: React.RefObject<HTMLInputElement | null>;
    addPost: () => void;
}
const InputForm = ({setTextInput,mediaRef,addPost}:Props) => {
    return (
        <div className='max-w-[640px] p-4 rounded-[10px] bg-gray-200 border border-gray-400 mx-4 sm:mx-auto'>
            <Input onChange={(e) => setTextInput(e.target.value)} className='bg-white h-11 border border-gray-300' type='text' placeholder="What's on your mind?" />
            <h1 className='text-center my-2'>Or upload a picture</h1>
            <div className="w-full bg-white rounded-[6px] flex justify-center max-w-full cursor-pointer items-center">
                <Input id="picture" className='border cursor-pointer border-gray-300' type="file" ref={mediaRef} />
            </div>
            <div className='flex mt-3 justify-center items-center'>
                <Button onClick={addPost} className='bg-[#1e40af] hover:bg-[#3b5ecf] text-white'>Post</Button>
            </div>
        </div>
    )
}

export default InputForm
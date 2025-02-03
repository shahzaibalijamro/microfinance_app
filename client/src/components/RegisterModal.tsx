import React, { FormEvent } from 'react'
import { LoadingSpinner } from './LoadingSpinner';

interface RegisterModal {
    setIsModalOpen: (value: boolean) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    cnic: string; 
    setCnic: (value:string) => void;
    email: string;
    setEmail: (value:string) => void;
    name: string
    setName: (value:string) => void;
    isLoading: boolean
}

const RegisterModal = ({
    setIsModalOpen,
    handleSubmit,
    cnic,
    setCnic,
    email,
    setEmail,
    name,
    setName,
    isLoading
}: RegisterModal) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                <button
                    className="absolute h-6 w-6 text-[28px] top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={() => setIsModalOpen(false)}
                >
                    &times;
                </button>
                <h2 className="text-lg font-bold mb-4">Additional Details</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">CNIC</label>
                        <input
                            type="number"
                            required
                            placeholder="Enter your CNIC"
                            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            value={cnic}
                            onChange={(e) => setCnic(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#8dc447] text-white font-medium rounded-md hover:bg-[#87b848] transition"
                    >
                        {isLoading ? <LoadingSpinner/> : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default RegisterModal
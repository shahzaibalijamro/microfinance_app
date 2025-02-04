
import React, { FormEvent } from 'react'
import { Button } from './ui/button';
import { LoadingSpinner } from './LoadingSpinner';
interface UpdatePasswordModal {
    updatePassword: (event: FormEvent<HTMLFormElement>) => void;
    password: string;
    setPassword: (value: string) => void;
    loading: boolean;
}
const UpdatePasswordModal = (
    {updatePassword,password,loading,setPassword}: UpdatePasswordModal
    ) => {
    return (
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
                            {loading ? <LoadingSpinner/> : "Update Password"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdatePasswordModal;
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const ConfirmationModal = ({email} : {email:string}) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Loan Request Received!</h2>
                    <p>
                        Your loan request has been received successfully. An email has been sent to{" "}
                        <strong>{email}</strong> containing your login credentials. Please log in using the provided details to complete the next steps, including submitting additional information and scheduling your appointment.
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        If you don’t see the email in your inbox, please check your spam folder.
                    </p>
                </div>
                <div className="flex justify-end mt-4">
                <Link href="/login">
                    <Button variant="default">Login</Button>
                </Link>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal
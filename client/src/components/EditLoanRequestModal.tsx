import Image from 'next/image'
import React, { ChangeEvent, FormEvent, RefObject } from 'react'
import { Button } from './ui/button'
import close from "@/assets/close.png";
import { DatePicker } from './DatePicker';
import TimePicker from './TimePicker';
import { LoadingSpinner } from './LoadingSpinner';

interface LoanDetails {
    _id: string;
    userId: string;
    loanCategory: string;
    loanSubcategory: string;
    initialDeposit: number;
    loanAmount: number;
    loanPeriod: number; // in months
    status: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    guarantors: Guarantors[];
    salarySheet: {
        url: string;
        public_id: string;
    };
    bankStatement: {
        url: string;
        public_id: string;
    };
    __v: number;
    address: string;
    mobileNo: string
}
interface Guarantors {
    _id: string;
    name: string,
    cnic: string,
    email: string,
    location: string
}
interface EditLoanRequestModal {
    editLoanRequest: (event: FormEvent<HTMLFormElement>) => void;
    user: {
        fullName: string,
        _id: string,
        cnicNo: string,
        email: string,
        isPasswordChanged: boolean
        address: string,
        mobileNo: string
    };
    loanDetails: LoanDetails;
    setAddress: (value: string) => void,
    setMobileNo: (value: string) => void;
    setG1Name: (value: string) => void;
    setG2Name: (value: string) => void;
    setG1Email: (value: string) => void;
    setG2Email: (value: string) => void;
    setG1Location: (value: string) => void;
    setG2Location: (value: string) => void;
    setG1Cnic: (value: string) => void;
    setG2Cnic: (value: string) => void;
    date: Date | undefined;
    setDate: (value: Date | undefined) => void;
    hour: number;
    setHour: (value: number) => void;
    salarySheet: RefObject<HTMLInputElement | null>;
    bankStatement: RefObject<HTMLInputElement | null>;
    setIsEditModalOpen: (value: boolean) => void;
    loading: boolean;
    appointmentLocation: string;
    setAppointmentLocation: (value: string) => void;
    setSelectedTime: (value: string) => void;
    selectedTime: string;
}

const EditLoanRequestModal = ({
    editLoanRequest,
    user,
    setAppointmentLocation,
    loading,
    salarySheet,
    setIsEditModalOpen,
    bankStatement,
    loanDetails,
    setAddress,
    setMobileNo,
    setG1Name,
    setG2Name,
    setG1Email,
    setG2Email,
    setG1Location,
    setG2Location,
    setG1Cnic,
    setG2Cnic }: EditLoanRequestModal) => {
    return (
        <div className="fixed px-3 inset-0 bg-gray-900 bg-opacity-50 flex justify-center overflow-y-auto py-[50px]">
            <div className="bg-white relative p-6 rounded-lg shadow-lg w-full max-w-2xl h-fit">
                <div className="mb-1">
                    <h2 className="text-xl text-center font-semibold mb-4">
                        Edit loan request
                    </h2>
                    <form onSubmit={editLoanRequest}>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    // value={user?.address}
                                    defaultValue={user?.address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    type="text"
                                    placeholder="Address"
                                    required
                                    minLength={10}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                />
                                <input
                                    defaultValue={user?.mobileNo}
                                    onChange={(e) => setMobileNo(e.target.value)}
                                    type="number"
                                    required
                                    minLength={11}
                                    placeholder="Phone Number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Guarantors' Information</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        defaultValue={loanDetails?.guarantors[0].name}
                                        onChange={(e) => setG1Name(e.target.value)}
                                        type="text"
                                        required
                                        minLength={3}
                                        placeholder="Guarantor 1 Name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        defaultValue={loanDetails?.guarantors[0].email}
                                        onChange={(e) => setG1Email(e.target.value)}
                                        type="email"
                                        required
                                        minLength={"one@gmail.com".length}
                                        placeholder="Guarantor 1 Email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        defaultValue={loanDetails?.guarantors[0].location}
                                        onChange={(e) => setG1Location(e.target.value)}
                                        type="text"
                                        required
                                        minLength={10}
                                        placeholder="Guarantor 1 Location"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        defaultValue={loanDetails?.guarantors[0].cnic}
                                        onChange={(e) => setG1Cnic(e.target.value)}
                                        type="number"
                                        required
                                        minLength={13}
                                        placeholder="Guarantor 1 CNIC"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        defaultValue={loanDetails?.guarantors[1].name}
                                        required
                                        onChange={(e) => setG2Name(e.target.value)}
                                        type="text"
                                        minLength={3}
                                        placeholder="Guarantor 2 Name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        defaultValue={loanDetails?.guarantors[1].email}
                                        required
                                        onChange={(e) => setG2Email(e.target.value)}
                                        type="email"
                                        minLength={"one@gmail.com".length}
                                        placeholder="Guarantor 2 Email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        defaultValue={loanDetails?.guarantors[1].location}
                                        onChange={(e) => setG2Location(e.target.value)}
                                        required
                                        type="text"
                                        minLength={10}
                                        placeholder="Guarantor 2 Location"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        required
                                        defaultValue={loanDetails?.guarantors[1].cnic}
                                        onChange={(e) => setG2Cnic(e.target.value)}
                                        type="text"
                                        minLength={13}
                                        placeholder="Guarantor 2 CNIC"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Statement and Salary Sheet Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Statement and Salary Sheet</h3>

                            {/* Salary Sheet Input */}
                            <div className="mb-4">
                                <label htmlFor="salarySheet" className="block text-sm font-medium mb-2">
                                    Update Salary Sheet (Leave as it is, If you don't want to update)
                                </label>
                                <div className="mb-2">
                                    <Image src={loanDetails ? loanDetails?.salarySheet.url : ""} alt="salary sheet" width={100} height={100} />
                                </div>
                                <input
                                    ref={salarySheet}
                                    type="file"
                                    id="salarySheet"
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                />
                                <p className="text-sm text-gray-500 mt-1">Upload your latest salary slip or salary certificate (PDF, DOC, JPG, PNG).</p>
                            </div>

                            {/* Bank Statement Input */}
                            <div className="mb-4">
                                <label htmlFor="bankStatement" className="block text-sm font-medium mb-2">
                                    Update Bank Statement (Leave as it is, If you don't want to update)
                                </label>
                                <div className="mb-2">
                                    <Image src={loanDetails ? loanDetails?.bankStatement.url : ""} alt="Bank Statement" width={100} height={100} />
                                </div>
                                <input
                                    type="file"
                                    ref={bankStatement}
                                    id="bankStatement"
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                />
                                <p className="text-sm text-gray-500 mt-1">Upload your latest bank statement (PDF, DOC, JPG, PNG).</p>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-[#0673be] text-white py-2 px-4 rounded-md hover:bg-[#0673be] focus:ring focus:ring-blue-300"
                        >
                            {loading ? <LoadingSpinner /> : "Edit Details"}
                        </Button>
                    </form>
                </div>
                <Image onClick={() => setIsEditModalOpen(false)} width={13} className="absolute cursor-pointer top-4 right-4" src={close} alt="cross" />
            </div>
        </div>
    )
}

export default EditLoanRequestModal
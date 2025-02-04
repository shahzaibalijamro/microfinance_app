import Image from 'next/image';
import React, { useState } from 'react'
import { Button } from './ui/button';
import close from "@/assets/close.png"
import { DatePicker } from './DatePicker';
import TimePicker from './TimePicker';
import TokenSlip from './TokenSlip';

interface ViewMoreModal {
    setIsviewMoreModalOpen: (value: boolean) => void;
    user?: {
        fullName: string,
        _id: string,
        cnicNo: string,
        email: string
        isPasswordChanged: boolean
        address: string,
        mobileNo: string
    };
    loanDetails?: {
        _id: string;
        userId: string;
        loanCategory: string;
        loanSubcategory: string;
        initialDeposit: number;
        loanAmount: number;
        loanPeriod: number;
        status: string;
        createdAt: string;
        updatedAt: string;
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
    date: Date | undefined;
    appointmentLocation: string;
    selectedTime: string;
    loading: boolean;
    request?: LoanApplication;
}
interface LoanApplication {
    _id: string;
    bankStatement: {
        public_id: string;
        url: string;
    };
    createdAt: string;
    updatedAt: string;
    status: string;
    initialDeposit: number;
    loanAmount: number;
    loanCategory: string;
    loanSubcategory: string;
    loanPeriod: number;
    salarySheet: {
        public_id: string;
        url: string;
    };
    guarantors: {
        _id: string;
        name: string;
        cnic: string;
        email: string;
        location: string;
    }[];
    userId: {
        _id: string;
        fullName: string;
        cnicNo: string;
        email: string;
        mobileNo: string;
        address: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    __v: number;
}
interface Guarantors {
    _id: string;
    name: string,
    cnic: string,
    email: string,
    location: string
};
const ViewMoreModal = ({ setIsviewMoreModalOpen, loading, appointmentLocation, date, selectedTime, user, loanDetails, request }: ViewMoreModal) => {
    const [showTokenSlip, setShowTokenSlip] = useState(false)
    return (
        <>
            {request && <div className="fixed px-3 inset-0 bg-gray-900 bg-opacity-50 flex justify-center overflow-y-auto py-[50px]">
                <div className="bg-white relative p-6 rounded-lg shadow-lg w-full max-w-2xl h-fit">
                    <div className="mb-1">
                        <h2 className="text-xl text-center font-semibold mb-4">
                            Your submitted Request
                        </h2>
                        <form onSubmit={() => setIsviewMoreModalOpen(false)}>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Loan Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="salarySheet" className="block text-sm font-medium mb-2">
                                            Loan Category
                                        </label>
                                        <input
                                            defaultValue={request.loanCategory}
                                            type="text"
                                            readOnly
                                            placeholder="Loan Category"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="salarySheet" className="block text-sm font-medium mb-2">
                                            Loan Subcategory
                                        </label>
                                        <input
                                            defaultValue={request.loanSubcategory}
                                            type="text"
                                            readOnly
                                            placeholder="Loan Subcategory"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="salarySheet" className="block text-sm font-medium mb-2">
                                            Loan Amount
                                        </label>
                                        <input
                                            defaultValue={request.loanAmount}
                                            type="text"
                                            readOnly
                                            placeholder="Loan Amount"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="salarySheet" className="block text-sm font-medium mb-2">
                                            Initial Deposit
                                        </label>
                                        <input
                                            defaultValue={request.initialDeposit}
                                            type="text"
                                            readOnly
                                            placeholder="Initial Deposit"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="salarySheet" className="block text-sm font-medium mb-2">
                                            Loan Period (Months)
                                        </label>
                                        <input
                                            defaultValue={request.loanPeriod}
                                            type="text"
                                            readOnly
                                            placeholder="Loan Period (Months)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        readOnly
                                        defaultValue={request?.userId?.address}
                                        type="text"
                                        placeholder="Address"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        readOnly
                                        defaultValue={request?.userId?.mobileNo}
                                        type="number"
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
                                        readOnly
                                            defaultValue={request?.guarantors[0]?.name}
                                            type="text"
                                            placeholder="Guarantor 1 Name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                        readOnly
                                            defaultValue={request?.guarantors[0]?.email}
                                            type="email"
                                            placeholder="Guarantor 1 Email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                        readOnly
                                            defaultValue={request?.guarantors[0]?.location}
                                            type="text"
                                            placeholder="Guarantor 1 Location"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                        readOnly
                                            defaultValue={request?.guarantors[0]?.cnic}
                                            type="number"
                                            placeholder="Guarantor 1 CNIC"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                        readOnly
                                            defaultValue={request?.guarantors[1]?.name}
                                            type="text"
                                            placeholder="Guarantor 2 Name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                        readOnly
                                            defaultValue={request?.guarantors[1]?.email}
                                            type="email"
                                            placeholder="Guarantor 2 Email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                        readOnly
                                            defaultValue={request?.guarantors[1]?.location}
                                            type="text"
                                            placeholder="Guarantor 2 Location"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                        readOnly
                                            required
                                            defaultValue={request?.guarantors[1]?.cnic}
                                            type="text"
                                            placeholder="Guarantor 2 CNIC"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Statement and Salary Sheet</h3>
                                <div className="flex w-full justify-around items-stretch">
                                    <div className="mb-4">
                                        <label htmlFor="salarySheet" className="block text-sm font-medium mb-2">
                                            Salary Sheet
                                        </label>
                                        <Image src={request?.salarySheet?.url} alt="salary sheet" width={100} height={100} />
                                    </div>
                                    <div className="mb-4 flex flex-col justify-start">
                                        <label htmlFor="Bank Statement" className="block text-sm font-medium mb-2">
                                            Bank Statement
                                        </label>
                                        <Image src={request?.bankStatement?.url} alt="Bank Statement" width={100} height={100} />
                                    </div>
                                </div>
                            </div>
                            {!loading && <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-3">Appointment</h3>
                                <DatePicker update={false} editAble={false} date={date} />
                                <TimePicker update={false} editAble={false} selectedTime={selectedTime} />
                                <div className="">
                                    <select
                                        defaultValue={appointmentLocation}
                                        className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                    >
                                        <option value="">{appointmentLocation}</option>
                                    </select>
                                </div>
                            </div>}
                            <div className='mb-4 text-center'>
                                <Button
                                    type='button'
                                    onClick={() => setShowTokenSlip(true)}
                                    className="bg-[#0971c0] hover:bg-[#0971c0d9] text-white px-5 py-2 hover:bg-blue-600 transition duration-300"
                                >
                                    Show Recieved Slip
                                </Button>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#0673be] text-white py-2 px-4 rounded-md hover:bg-[#0673be] focus:ring focus:ring-blue-300"
                            >
                                Close
                            </Button>
                        </form>
                        {showTokenSlip && <TokenSlip setShowTokenSlip={setShowTokenSlip} />}
                    </div>
                    <Image onClick={() => setIsviewMoreModalOpen(false)} width={13} className="absolute cursor-pointer top-4 right-4" src={close} alt="cross" />
                </div>
            </div>}
            {loanDetails && <div className="fixed px-3 inset-0 bg-gray-900 bg-opacity-50 flex justify-center overflow-y-auto py-[50px]">
                <div className="bg-white relative p-6 rounded-lg shadow-lg w-full max-w-2xl h-fit">
                    <div className="mb-1">
                        <h2 className="text-xl text-center font-semibold mb-4">
                            Your submitted Request
                        </h2>
                        <form onSubmit={() => setIsviewMoreModalOpen(false)}>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        readOnly
                                        defaultValue={user?.address}
                                        type="text"
                                        placeholder="Address"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        defaultValue={user?.mobileNo}
                                        type="number"
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
                                            type="text"
                                            placeholder="Guarantor 1 Name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                            defaultValue={loanDetails?.guarantors[0].email}
                                            type="email"
                                            placeholder="Guarantor 1 Email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                            defaultValue={loanDetails?.guarantors[0].location}
                                            type="text"
                                            placeholder="Guarantor 1 Location"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                            defaultValue={loanDetails?.guarantors[0].cnic}
                                            type="number"
                                            placeholder="Guarantor 1 CNIC"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            defaultValue={loanDetails?.guarantors[1].name}
                                            type="text"
                                            placeholder="Guarantor 2 Name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                            defaultValue={loanDetails?.guarantors[1].email}
                                            type="email"
                                            placeholder="Guarantor 2 Email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                            defaultValue={loanDetails?.guarantors[1].location}
                                            type="text"
                                            placeholder="Guarantor 2 Location"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                        <input
                                            required
                                            defaultValue={loanDetails?.guarantors[1].cnic}
                                            type="text"
                                            placeholder="Guarantor 2 CNIC"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Statement and Salary Sheet</h3>
                                <div className="flex w-full justify-around items-stretch">
                                    <div className="mb-4">
                                        <label htmlFor="salarySheet" className="block text-sm font-medium mb-2">
                                            Salary Sheet
                                        </label>
                                        <Image src={loanDetails ? loanDetails?.salarySheet.url : ""} alt="salary sheet" width={100} height={100} />
                                    </div>
                                    <div className="mb-4 flex flex-col justify-start">
                                        <label htmlFor="Bank Statement" className="block text-sm font-medium mb-2">
                                            Bank Statement
                                        </label>
                                        <Image src={loanDetails ? loanDetails?.bankStatement.url : ""} alt="Bank Statement" width={100} height={100} />
                                    </div>
                                </div>
                            </div>
                            {!loading && <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-3">Appointment</h3>
                                <DatePicker update={false} editAble={false} date={date} />
                                <TimePicker update={false} editAble={false} selectedTime={selectedTime} />
                                <div className="">
                                    <select
                                        defaultValue={appointmentLocation}
                                        className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                    >
                                        <option value="">{appointmentLocation}</option>
                                    </select>
                                </div>
                            </div>}
                            <div className='mb-4 text-center'>
                                <Button
                                    type='button'
                                    onClick={() => setShowTokenSlip(true)}
                                    className="bg-[#0971c0] hover:bg-[#0971c0d9] text-white px-5 py-2 hover:bg-blue-600 transition duration-300"
                                >
                                    Show Recieved Slip
                                </Button>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#0673be] text-white py-2 px-4 rounded-md hover:bg-[#0673be] focus:ring focus:ring-blue-300"
                            >
                                Close
                            </Button>
                        </form>
                        {showTokenSlip && <TokenSlip setShowTokenSlip={setShowTokenSlip} />}
                    </div>
                    <Image onClick={() => setIsviewMoreModalOpen(false)} width={13} className="absolute cursor-pointer top-4 right-4" src={close} alt="cross" />
                </div>
            </div>}
        </>
    )
}

export default ViewMoreModal;
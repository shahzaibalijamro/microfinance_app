import React from 'react'
interface Guarantors {
    _id: string;
    name: string,
    cnic: string,
    email: string,
    location: string
}
interface LoanDetailsCard {
    loanDetails?: {
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
    };
    setIsModalOpen?: (value: boolean) => void;
    setIsEditModalOpen: (value: boolean) => void;
    handleViewMoreModal: (userId: string, index: number) => Promise<void>;
    approveOrDisapproveRequest?: (request: LoanApplication, text: string, index: number) => Promise<void>;
    request?: LoanApplication;
    index: number
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
const LoanDetailsCard = ({ loanDetails, request, handleViewMoreModal, setIsModalOpen, setIsEditModalOpen, index, approveOrDisapproveRequest }: LoanDetailsCard) => {
    return (
        <>
            {request && <div className="w-full bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 border max-w-[1200px] mx-auto mt-6">
                <div className="w-full text-center flex gap-3 flex-col sm:flex-row items-center">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Name</h2>
                        <p className="text-lg text-gray-600">{request.userId.fullName}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Cnic Number</h2>
                        <p className="text-lg text-gray-600">{request.userId.cnicNo}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Mobile No</h2>
                            <p className="text-lg text-gray-600">{request.userId.mobileNo || "Not provided yet"}</p>
                        </div>
                    </div>
                    <div className="flex-1 text-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-1">Status</h2>
                            <p
                                className={`text-lg font-medium ${request.status === "Documents Pending"
                                        ? "text-yellow-600"
                                        : request.status === "Approved"
                                            ? "text-green-600"
                                            : request.status === "Rejected"
                                                ? "text-red-600"
                                                : "text-green-600"
                                    }`}
                            >
                                {request.status}
                            </p>

                        </div>
                    </div>
                </div>
                {request.guarantors.length > 0 && approveOrDisapproveRequest && <div className="w-full flex justify-center sm:flex-row flex-col gap-y-3 gap-x-2 items-center">
                    <button onClick={() => handleViewMoreModal(request.userId._id, index ? index : 0)} className="mt-auto w-full bg-[#0971c0] text-white py-2 px-4 rounded-lg hover:bg-[#0971c0d9] transition-all">
                        View full request
                    </button>
                    {request.status === "Under Review" ? <>
                        <button onClick={() => approveOrDisapproveRequest(request, "Approve", index)} className="mt-auto w-full bg-[#8dc447] text-white py-2 px-4 rounded-lg hover:bg-[#8dc447] transition-all">
                            Approve
                        </button>
                        <button onClick={() => approveOrDisapproveRequest(request, "Reject", index)} className="mt-auto w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all">
                            Reject
                        </button>
                    </> : request.status === "Approved" ? <button onClick={() => approveOrDisapproveRequest(request, "Reject", index)} className="mt-auto w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all">
                        Reject
                    </button> : <button onClick={() => approveOrDisapproveRequest(request, "Approve", index)} className="mt-auto w-full bg-[#8dc447] text-white py-2 px-4 rounded-lg hover:bg-[#8dc447] transition-all">
                        Approve
                    </button>}
                </div>}
            </div>}
            {loanDetails && <div className="w-full bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 border max-w-[1200px] mx-auto mt-6">
                <div className="w-full sm:items-end text-center sm:text-start flex gap-4 flex-col sm:flex-row items-center">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loan Category</h2>
                        <p className="text-lg text-gray-600">{loanDetails.loanCategory}</p>
                        <h2 className="text-xl font-semibold text-gray-800 mt-2 mb-2">Loan Subcategory</h2>
                        <p className="text-lg text-gray-600">{loanDetails.loanSubcategory}</p>
                        <h2 className="text-xl font-semibold mt-2 text-gray-800 mb-2">Loan Amount</h2>
                        <p className="text-lg text-gray-600">{loanDetails.loanAmount.toLocaleString()} PKR</p>
                    </div>
                    <div className="flex-1 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Initial Deposit</h2>
                        <p className="text-lg text-gray-600">{loanDetails.initialDeposit.toLocaleString()} PKR</p>
                        <h2 className="text-xl font-semibold text-gray-800 mt-2 mb-2">Loan Period</h2>
                        <p className="text-lg text-gray-600">{loanDetails.loanPeriod} months</p>
                        <h2 className="text-xl font-semibold text-gray-800 mt-2 mb-2">Requested At</h2>
                        <p className="text-lg text-gray-600">{new Date(loanDetails.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex-1 h-full sm:text-end text-center flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-1">Status</h2>
                            <p 
                            className={`text-lg font-medium 
                            ${loanDetails.status === "Documents Pending" ? "text-yellow-600" : 
                                loanDetails.status === "Rejected" ? 
                            "text-red-600" : "text-green-600"}`}>
                                {loanDetails.status}
                            </p>
                        </div>
                    </div>
                </div>
                {loanDetails.status === "Documents Pending" && <div className="w-full">
                    <button onClick={() => setIsModalOpen ? setIsModalOpen(true) : console.log(false)} className="mt-auto w-full bg-[#0971c0] text-white py-2 px-4 rounded-lg hover:bg-[#0971c0d9] transition-all">
                        Add Guarantor Information
                    </button>
                </div>}
                {loanDetails.guarantors.length > 0 && <div className="w-full flex justify-center sm:flex-row flex-col gap-y-3 gap-x-2 items-center">
                    <button onClick={() => handleViewMoreModal("", 0)} className="mt-auto w-full bg-[#0971c0] text-white py-2 px-4 rounded-lg hover:bg-[#0971c0d9] transition-all">
                        View full request
                    </button>
                    {loanDetails.status === "Under Review" && <button onClick={() => setIsEditModalOpen(true)} className="mt-auto w-full bg-[#0971c0] text-white py-2 px-4 rounded-lg hover:bg-[#0971c0d9] transition-all">
                        Edit request
                    </button>}
                </div>}
                {loanDetails?.status === "Rejected" && <h1 className='text-center'>
                    Your loan request has been rejected. Please check the email we sent for more details.
                    </h1>}
                {loanDetails?.status === "Approved" && <h1 className='text-center'>
                    Your loan request has been Approved. Please check the email we sent for more details.
                    </h1>}
            </div>}
        </>
    )
}

export default LoanDetailsCard;
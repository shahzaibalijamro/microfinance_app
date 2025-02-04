"use client"
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import axios from "@/config/axiosConfig"
import { useDispatch, useSelector } from 'react-redux';
import LoanDetailsCard from '@/components/LoanDetailsCard';
import { setAppointmentInRedux } from '@/config/redux/reducers/appointmentSlice';
import Loader from '@/components/Loader';
import ViewMoreModal from '@/components/ViewMoreModal';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
interface TokenState {
    token: {
        accessToken: string;
    };
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
const page = () => {
    const accessToken = useSelector(
        (state: TokenState) => state.token.accessToken
    );
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [mobileNo, setMobileNo] = useState("");
    const [g1Name, setG1Name] = useState("");
    const [g1Email, setG1Email] = useState("");
    const [g1Location, setG1Location] = useState("");
    const [g1Cnic, setG1Cnic] = useState("");
    const [g2Name, setG2Name] = useState("");
    const [g2Email, setG2Email] = useState("");
    const [g2Location, setG2Location] = useState("");
    const [g2Cnic, setG2Cnic] = useState("");
    const [appointmentLocation, setAppointmentLocation] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false)
    const [loadingVal, setLoadingVal] = useState(30)
    const [loanRequests, setLoanRequests] = useState<LoanApplication[]>([]);
    const [isviewMoreModalOpen, setIsviewMoreModalOpen] = useState(false)
    const salarySheet = useRef<HTMLInputElement>(null);
    const [hour, setHour] = useState<number>(0);
    const [date, setDate] = useState<Date | undefined>();
    const [address, setAddress] = useState("");
    const bankStatement = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    useEffect(() => {
        if (accessToken) {
            getAllLoanRequests()
        }
    }, [accessToken])
    const getAllLoanRequests = async () => {
        setLoadingVal(80)
        try {
            const { data } = await axios("/api/v1/requests", {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            setLoadingVal(99)
            setLoanRequests(data);
            console.log(data);
        setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }
    const searchByTokenNumber = async (event:ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
    }
    const filterByStatus = async (event:ChangeEvent<HTMLSelectElement>) => {
        console.log(event.target.value);
    }
    const handleViewMoreModal = async (userId: string, index: number) => {
        console.log(userId);
        setLoading(true);
        try {
            const { data } = await axios(`/api/v1/appoint/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            dispatch(setAppointmentInRedux(data));
            console.log(data);
            setAppointmentLocation(data.location);
            const inputDate = data.appointmentDay;
            const [month, day, year] = inputDate.split("/").map(Number);
            const formattedDate = new Date(year, month - 1, day);
            console.log(formattedDate);
            setDate(formattedDate);
            setSelectedTime(data.appointmentTime)
            setIsviewMoreModalOpen(true)
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }
    const approveOrDisapproveRequest = async (request: LoanApplication, text: string, index: number) => {
        try {
            const { data } = await axios.put(`/api/v1/approve`, { request, text }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            if (text === "Approve") {
                toast("Request Approved!", {
                    description: `Request has been approved, the requester will be notified through email!`,
                    action: { label: "Ok", onClick: () => console.log("Ok clicked") },
                });
            } else {
                toast("Request Rejected!", {
                    description: `Request has been rejected, the requester will be notified through email!`,
                    action: { label: "Ok", onClick: () => console.log("Ok clicked") },
                });
            }
            console.log(data);
            let updatedRequest = data;
            updatedRequest.userId = request.userId;
            loanRequests[0] = updatedRequest;
            setLoanRequests([...loanRequests]);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='mx-3'>
            <div className="w-full bg-white shadow-md rounded-lg p-3 flex gap-4 border max-w-[1200px] relative mx-auto mt-6">
                <input onChange={searchByTokenNumber} className='p-3 rounded-md w-full focus-visible:outline-slate-300' type="number" placeholder='Search by token number' name="" id="" />
                <div className='max-w-[300px] top-[5px] relative w-full'>
                    <select
                    onChange={filterByStatus}
                        className="px-3 focus-visible:outline-none w-full py-2 border rounded-md focus:ring focus:ring-slate-300"
                    >
                        <option value="">Filter by</option>
                        <option value={'Approved'}>
                            Approved
                        </option>
                        <option value={'Rejected'}>
                            Rejected
                        </option>
                        <option value={'Under Review'}>
                        Under Review
                        </option>
                    </select>
                </div>
            </div>
            <Toaster />
            {loanRequests.length > 0 ? loanRequests.map((request, index) => {
                return <div key={request._id}>
                    <LoanDetailsCard request={request} index={index} handleViewMoreModal={handleViewMoreModal} approveOrDisapproveRequest={approveOrDisapproveRequest} setIsEditModalOpen={setIsEditModalOpen} />
                    {isviewMoreModalOpen &&
                        <ViewMoreModal appointmentLocation={appointmentLocation} date={date} loading={loading} selectedTime={selectedTime} setIsviewMoreModalOpen={setIsviewMoreModalOpen} request={request} />}
                </div>
            }) : <Loader loadingVal={loadingVal} />}
        </div>
    )
}

export default page
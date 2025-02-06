"use client"
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import axios from "@/config/axiosConfig"
import { useDispatch, useSelector } from 'react-redux';
import LoanDetailsCard from '@/components/LoanDetailsCard';
import { setAppointmentInRedux } from '@/config/redux/reducers/appointmentSlice';
import ViewMoreModal from '@/components/ViewMoreModal';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { debounce } from 'lodash';
import { Progress } from '@/components/ui/progress';

// TypeScript Interfaces
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
    const [singleUserData, setSingleUserData] = useState<LoanApplication | undefined>(undefined)
    const [cnicNumber, setCnicNumber] = useState("");
    const [appointmentLocation, setAppointmentLocation] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState("");
    const [loading, setLoading] = useState(false)
    const [loadingVal, setLoadingVal] = useState(30);
    const [notFound, setNotFound] = useState(false);
    const [loanRequests, setLoanRequests] = useState<LoanApplication[]>([]);
    const [isviewMoreModalOpen, setIsviewMoreModalOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>();
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
        } catch (error: any) {
            console.log(error);
        }
    }
    const debouncedSearch = useCallback(
        debounce(async (cnic: string) => {
            if (cnic.length < 3) {
                return await getAllLoanRequests()
            };
            try {
                const { data } = await axios.get(`/api/v1/search/${cnic}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                setLoanRequests(data);
            } catch (error: any) {
                console.log(error);
                const errorMsg = error?.response?.data?.message;
                if (errorMsg === "No requests found!") {
                    setLoanRequests([]);
                    setNotFound(true);
                }
            }
        }, 700),
        [accessToken]
    );
    const searchByCnicNumber = async (event: ChangeEvent<HTMLInputElement>) => {
        const searchInput = event.target.value;
        setCnicNumber(searchInput)
        debouncedSearch(searchInput);
    }
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);
    const filterByStatus = async (event: ChangeEvent<HTMLSelectElement>) => {
        const status = event.target.value;
        try {
            if (status === "All requests") {
                return await getAllLoanRequests()
            }
            const { data } = await axios(`/api/v1/filter/${status}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            if (data.message === "You're all caught up!") {
                await getAllLoanRequests();
                return toast("No such requests found!", {
                    description: `No such requests found in the database!`,
                    action: { label: "Ok", onClick: () => console.log("Ok clicked") },
                });
            }
            setLoanRequests(data);
        } catch (error) {
            console.log(error);
        }
    }
    const handleViewMoreModal = async (userId: string, index: number) => {
        setLoading(true);
        try {
            const { data } = await axios(`/api/v1/appoint/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            dispatch(setAppointmentInRedux(data));
            setAppointmentLocation(data.location);
            const inputDate = data.appointmentDay;
            const [month, day, year] = inputDate.split("/").map(Number);
            const formattedDate = new Date(year, month - 1, day);
            setDate(formattedDate);
            setSelectedTime(data.appointmentTime)
            setIsviewMoreModalOpen(true)
            setSingleUserData(loanRequests[index])
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
            <Toaster />
            <div className="w-full bg-white shadow-md rounded-lg p-3 flex flex-col sm:flex-row gap-2 border max-w-[1200px] relative mx-auto mt-6">
                <input
                    value={cnicNumber}
                    onChange={searchByCnicNumber}
                    className='px-3 py-2 border-slate-200 border rounded-md w-full focus-visible:outline-slate-300'
                    type="number"
                    placeholder='Search by CNIC Number'
                />
                <div className='sm:max-w-[300px] max-w-full top-[2px] relative w-full'>
                    <select
                        onChange={filterByStatus}
                        className="px-3 focus-visible:outline-none w-full py-2 border rounded-md focus:ring focus:ring-slate-300"
                    >
                        <option value="All requests">All requests</option>
                        <option value={'Approved'}>
                            Approved
                        </option>
                        <option value={'Rejected'}>
                            Rejected
                        </option>
                        <option value={'Under Review'}>
                            Under Review
                        </option>
                        <option value={'Documents Pending'}>
                            Documents Pending
                        </option>
                    </select>
                </div>
            </div>
            {loanRequests.length > 0 ? <>
                {loanRequests.map((request, index) => {
                    return <div key={request._id}>
                        <LoanDetailsCard request={request} index={index} handleViewMoreModal={handleViewMoreModal} approveOrDisapproveRequest={approveOrDisapproveRequest} />
                    </div>
                })}
                {isviewMoreModalOpen &&
                    <ViewMoreModal appointmentLocation={appointmentLocation} date={date} loading={loading} selectedTime={selectedTime} setIsviewMoreModalOpen={setIsviewMoreModalOpen} request={singleUserData} />}
            </> : notFound ? <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                <div className="mx-auto space-y-6 text-center">
                    <div className="space-y-3">
                        <h1 className="text-4xl font-bold tracking-tighter text-[#0673be] sm:text-5xl transition-transform hover:scale-110">
                            404
                        </h1>
                        <p className="text-gray-500">No request found of such user!</p>
                    </div>
                </div>
            </div> : <div className="max-w-[200px] w-full px-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Progress value={loadingVal} />
        </div>}
        </div >
    )
}

export default page
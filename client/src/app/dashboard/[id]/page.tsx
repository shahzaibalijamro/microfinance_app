"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "@/config/axiosConfig";
import { toast, Toaster } from "sonner";
import { setLoadingState } from "@/config/redux/reducers/loadingSlice";
import { setUser } from "@/config/redux/reducers/userSlice";
import ViewMoreModal from "@/components/ViewMoreModal";
import AddGuarantorModal from "@/components/AddGuarantorModal";
import UpdatePasswordModal from "@/components/updatePasswordModal";
import Loader from "@/components/Loader";
import LoanDetailsCard from "@/components/LoanDetailsCard";
import EditLoanRequestModal from "@/components/EditLoanRequestModal";
import TokenSlip from "@/components/TokenSlip";
import { setAppointmentInRedux } from "@/config/redux/reducers/appointmentSlice";
// TypeScript Interfaces
interface UserState {
    user: {
        user: {
            fullName: string,
            _id: string,
            cnicNo: string,
            email: string
            isPasswordChanged: boolean
            address: string,
            mobileNo: string
        };
    };
}
interface isLoading {
    isLoading: {
        isLoading: boolean,
    }
}
interface timeState {
    time: {
        isValid: boolean;
    };
}
interface dateState {
    date: {
        isValid: boolean;
    };
}
interface TokenState {
    token: {
        accessToken: string;
    };
}
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
interface Appointment {
    _id: string;
    appointmentDay: string;
    appointmentTime: string;
    location: string;
    tokenNumber: number;
}
// Component
const Page = () => {
    const isLoading = useSelector((state: isLoading) => state.isLoading.isLoading);
    const accessToken = useSelector(
        (state: TokenState) => state.token.accessToken
    );
    const user = useSelector((state: UserState) => state.user.user);
    const isTimeValid = useSelector((state: timeState) => state.time.isValid);
    const isDateValid = useSelector((state: dateState) => state.date.isValid);
    const [isPasswordChanged, setIsPasswordChanged] = useState(true);
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false)
    const [showTokenSlip, setShowTokenSlip] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null)
    const [loadingVal, setLoadingVal] = useState(33);
    const [address, setAddress] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [g1Name, setG1Name] = useState("");
    const [g1Email, setG1Email] = useState("");
    const [g1Location, setG1Location] = useState("");
    const [g1Cnic, setG1Cnic] = useState("");
    const [g2Name, setG2Name] = useState("");
    const [g2Email, setG2Email] = useState("");
    const [g2Location, setG2Location] = useState("");
    const [g2Cnic, setG2Cnic] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [date, setDate] = useState<Date | undefined>();
    const [hour, setHour] = useState<number>(0);
    const [appointment, setAppointment] = useState<Appointment | null>(null)
    const [appointmentLocation, setAppointmentLocation] = useState<string>("Saylani Head Office Bahadurabad");
    const [isviewMoreModalOpen, setIsviewMoreModalOpen] = useState(false)
    const salarySheet = useRef<HTMLInputElement>(null);
    const bankStatement = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    useEffect(() => {
        if (user._id && accessToken) {
            setLoadingVal(90);
            checkIsPasswordChanged();
        }
    }, [user, accessToken])
    useEffect(() => {
        if (isEditModalOpen === false) {
            setAddress("");
            setMobileNo("");
            setG1Cnic("");
            setG1Email("");
            setG1Location("");
            setG1Name("");
            setG2Cnic("");
            setG2Email("");
            setG2Location("");
            setG2Name("");
        }
    }, [isEditModalOpen])
    const checkIsPasswordChanged = async () => {
        setIsPasswordChanged(user.isPasswordChanged);
        if (user.isPasswordChanged) {
            getCurrentLoanRequest();
        }
        dispatch(setLoadingState({ loading: false }));
    }
    const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return toast("Invalid Password", {
                description: `The password must be at least 8 characters long and include a combination of letters, numbers, and special characters.`,
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        }
        setLoading(true);
        try {
            const { data } = await axios.patch("/api/v1/register", {
                cnicNo: user.cnicNo,
                password
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            console.log(data);
            setIsPasswordChanged(data.isPasswordChanged);
            dispatch(setUser({ user: data }));
            return toast("Password updated!", {
                description: `Your password has been updated successfully, you can use this password to login next time.`,
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    const getCurrentLoanRequest = async () => {
        const { data } = await axios("/api/v1/loan", {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        setLoanDetails(data);
    }
    const updateLoanRequest = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const cnicRegex = /^[0-9]{13}$/;
        const mobileNoRegex = /^[0-9]{11}$/;
        const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com)$/i;
        if (!g1Cnic || !g2Cnic || !g1Email || !g2Email || !g1Location || !g2Location || !g1Name || !g2Name || !mobileNo || !address) {
            return toast("Missing or Invalid Fields!", {
                description: "Please ensure all required fields are filled correctly.",
                action: { label: "Ok", onClick: () => console.log("Validation error") },
            });
        }
        if (!cnicRegex.test(g1Cnic)) {
            return toast("Invalid CNIC!", {
                description: "Guarantor one's CNIC must be a 13-digit number.",
                action: { label: "Ok", onClick: () => console.log("Invalid CNIC") },
            });
        }
        if (!cnicRegex.test(g2Cnic)) {
            return toast("Invalid CNIC!", {
                description: "Guarantor two's CNIC must be a 13-digit number.",
                action: { label: "Ok", onClick: () => console.log("Invalid CNIC") },
            });
        }
        if (!mobileNoRegex.test(mobileNo)) {
            return toast("Invalid CNIC!", {
                description: "Mobile number must be an 11-digit number.",
                action: { label: "Ok", onClick: () => console.log("Invalid CNIC") },
            });
        }
        if (!emailRegex.test(g1Email)) {
            return toast("Invalid Email!", {
                description: "Guarantor one's email address is not valid.",
                action: { label: "Ok", onClick: () => console.log("Invalid Email") },
            });
        }
        if (!emailRegex.test(g2Email)) {
            return toast("Invalid Email!", {
                description: "Guarantor two's email address is not valid.",
                action: { label: "Ok", onClick: () => console.log("Invalid Email") },
            });
        }
        if (!isTimeValid) {
            return toast("Invalid time!", {
                description: "Please change time!",
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        }
        if (!isDateValid) {
            return toast("Invalid date!", {
                description: "Please change date!",
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        }
        const formData = new FormData();
        if (salarySheet.current && salarySheet.current?.files?.[0] !== undefined) {
            formData.append("salarySheet", salarySheet.current?.files?.[0]);
        } else {
            return toast("SalarySheet is required!", {
                description: "Please upload the Salary Sheet to proceed.",
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        }
        if (bankStatement.current && bankStatement.current?.files?.[0] !== undefined) {
            formData.append("bankStatement", bankStatement.current?.files?.[0]);
        } else {
            return toast("bankStatement is required!", {
                description: "Please upload the Bank Statement to proceed.",
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        }
        setLoading(true);
        const guarantors = [
            {
                name: g1Name,
                email: g1Email,
                location: g1Location,
                cnic: g1Cnic
            },
            {
                name: g2Name,
                email: g2Email,
                location: g2Location,
                cnic: g2Cnic
            }
        ];
        console.log(mobileNo);
        console.log(guarantors);
        console.log(address);
        console.log(date?.toLocaleDateString());
        console.log(selectedTime);
        console.log(appointmentLocation);
        if (!appointmentLocation) {
            return toast("No location selected!", {
                description: "Kindly select an appointment location",
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        }
        formData.append("address", address);
        formData.append("mobileNo", mobileNo);
        if (date) {
            formData.append("appointmentDay", date?.toLocaleDateString());
        }
        formData.append("appointmentTime", selectedTime);
        formData.append("location", appointmentLocation);
        formData.append("guarantors", JSON.stringify(guarantors));
        try {
            const { data } = await axios.put(`/api/v1/loan/${loanDetails?._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            setLoanDetails(data.loanRequest);
            dispatch(setUser({ user: data.theUser }))
            setAppointment(data.appointment);
            console.log(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setIsModalOpen(false);
            setShowTokenSlip(true);
        }
    }
    const editLoanRequest = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const Address = address || user.address
        const MobileNo = mobileNo || user.mobileNo
        const guarantors = [
            {
                name: g1Name || loanDetails?.guarantors[0].name,
                email: g1Email || loanDetails?.guarantors[0].email,
                location: g1Location || loanDetails?.guarantors[0].location,
                cnic: g1Cnic || loanDetails?.guarantors[0].cnic,
                _id: loanDetails?.guarantors[0]._id
            },
            {
                name: g2Name || loanDetails?.guarantors[1].name,
                email: g2Email || loanDetails?.guarantors[1].email,
                location: g2Location || loanDetails?.guarantors[1].location,
                cnic: g2Cnic || loanDetails?.guarantors[1].cnic,
                _id: loanDetails?.guarantors[1]._id
            }
        ];
        if (Address === user.address && MobileNo === user.mobileNo && JSON.stringify(guarantors) === JSON.stringify(loanDetails?.guarantors) && bankStatement.current && bankStatement.current?.files?.[0] === undefined && salarySheet.current && salarySheet.current?.files?.[0] === undefined) {
            return setIsEditModalOpen(false);
        }
        const formData = new FormData();
        if (Address !== user.address) {
            formData.append("address", Address);
        }
        if (MobileNo !== user.mobileNo) {
            formData.append("mobileNo", MobileNo);
        }
        if (JSON.stringify(guarantors) !== JSON.stringify(loanDetails?.guarantors)) {
            formData.append("guarantors", JSON.stringify(guarantors));
        }
        if (bankStatement.current && bankStatement.current?.files?.[0] !== undefined) {
            formData.append("bankStatement", bankStatement.current?.files?.[0]);
        }
        if (salarySheet.current && salarySheet.current?.files?.[0] !== undefined) {
            formData.append("salarySheet", salarySheet.current?.files?.[0]);
        }
        setLoading(true);
        try {
            const { data } = await axios.put(`/api/v1/loan/edit/${loanDetails?._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            setLoanDetails(data.loanRequest);
            dispatch(setUser({ user: data.theUser }));
            console.log(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsEditModalOpen(false)
            setLoading(false);
        }
    }
    const handleViewMoreModal = async () => {
        const {data} = await axios("/api/v1/appoint",{
            headers:{
                'Authorization': `Bearer ${accessToken}`
            }
        })
        setLoading(true);
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
    }
    return (
        <div className="mx-3">
            <Toaster />
            {isLoading && <Loader loadingVal={loadingVal} />}
            {isModalOpen && <AddGuarantorModal loading={loading} appointmentLocation={appointmentLocation} setAppointmentLocation={setAppointmentLocation} hour={hour} setHour={setHour} date={date} setDate={setDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} address={address} salarySheet={salarySheet} bankStatement={bankStatement} g1Cnic={g1Cnic} g1Name={g1Name} g1Location={g1Location} g2Location={g2Location} g1Email={g1Email} g2Name={g2Name} mobileNo={mobileNo} g2Cnic={g2Cnic} setG1Cnic={setG1Cnic} setG1Location={setG1Location} setG2Cnic={setG2Cnic} setAddress={setAddress} setG1Email={setG1Email} setG1Name={setG1Name} setG2Name={setG2Name} setG2Location={setG2Location} g2Email={g2Email} setG2Email={setG2Email} setIsModalOpen={setIsModalOpen} setMobileNo={setMobileNo} updateLoanRequest={updateLoanRequest} key={"AddGuarantorModal"} />}
            {loanDetails && <LoanDetailsCard handleViewMoreModal={handleViewMoreModal} setIsEditModalOpen={setIsEditModalOpen} loanDetails={loanDetails} setIsModalOpen={setIsModalOpen} key={"Loan Detail Card"} />}
            {showTokenSlip && appointment && <TokenSlip appointment={appointment} setShowTokenSlip={setShowTokenSlip} />}
            {isEditModalOpen && loanDetails && !isviewMoreModalOpen && <EditLoanRequestModal appointmentLocation={appointmentLocation} date={date} hour={hour} selectedTime={selectedTime} setAppointmentLocation={setAppointmentLocation} setDate={setDate} setHour={setHour} setSelectedTime={setSelectedTime} loading={loading} bankStatement={bankStatement} editLoanRequest={editLoanRequest} loanDetails={loanDetails} salarySheet={salarySheet} setAddress={setAddress} setG1Cnic={setG1Cnic} setG1Location={setG1Location} setG1Email={setG1Email} setG2Cnic={setG2Cnic} setG2Name={setG1Name} setG2Location={setG2Location} setG1Name={setG1Name} setG2Email={setG2Email} setMobileNo={setMobileNo} setIsEditModalOpen={setIsEditModalOpen} user={user} key={"EditLoanRequestModal"} />}
            {!isPasswordChanged && !isLoading && <UpdatePasswordModal password={password} setPassword={setPassword} loading={loading} updatePassword={updatePassword} />}
            {isviewMoreModalOpen && loanDetails &&
                <ViewMoreModal loading={loading} appointmentLocation={appointmentLocation} date={date} selectedTime={selectedTime} user={user} setIsviewMoreModalOpen={setIsviewMoreModalOpen} loanDetails={loanDetails} />}
        </div>
    );
};

export default Page;
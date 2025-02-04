import Image from 'next/image';
import React, { ChangeEvent, ChangeEventHandler, FormEvent, RefObject } from 'react'
import { Button } from './ui/button';
import close from "@/assets/close.png"
import { DatePicker } from './DatePicker';
import { Input } from './ui/input';
import TimePicker from './TimePicker';
import { LoadingSpinner } from './LoadingSpinner';
interface AddGuarantorModal {
    updateLoanRequest: (event: FormEvent<HTMLFormElement>) => void;
    address: string;
    setAddress: (value: string) => void,
    mobileNo: string;
    setMobileNo: (value: string) => void;
    g1Name: string;
    g2Name: string;
    setG1Name: (value: string) => void;
    setG2Name: (value: string) => void;
    g1Email: string;
    g2Email: string;
    setG1Email: (value: string) => void;
    setG2Email: (value: string) => void;
    g1Location: string;
    g2Location: string;
    setG1Location: (value: string) => void;
    setG2Location: (value: string) => void;
    g1Cnic: string;
    g2Cnic: string;
    setSelectedTime: (value: string) => void;
    selectedTime: string;
    setG1Cnic: (value: string) => void;
    setG2Cnic: (value: string) => void;
    salarySheet: RefObject<HTMLInputElement | null>;
    bankStatement: RefObject<HTMLInputElement | null>;
    setIsModalOpen: (value: boolean) => void;
    date: Date | undefined;
    setDate: (value: Date | undefined) => void;
    hour: number;
    setHour: (value: number) => void;
    appointmentLocation: string;
    setAppointmentLocation: (value: string) => void;
    loading:boolean
}
const AddGuarantorModal = ({
    updateLoanRequest,
    setAppointmentLocation,
    appointmentLocation,
    address,
    setAddress,
    setSelectedTime,
    selectedTime,
    date,
    setDate,
    hour,
    setHour,
    setMobileNo,
    setG1Name,
    setG2Name,
    setG1Email,
    setG2Email,
    setG1Location,
    setG2Location,
    setG1Cnic,
    setG2Cnic,
    mobileNo,
    g1Name,
    g2Name,
    g1Email,
    g2Email,
    g1Location,
    g2Location,
    g1Cnic,
    g2Cnic,
    salarySheet,
    loading,
    bankStatement,
    setIsModalOpen
}: AddGuarantorModal) => {
    const handleCategoryChange = (event:ChangeEvent<HTMLSelectElement>) => {
        setAppointmentLocation(event.target.value);
    }
    return (
        <div className="fixed px-3 inset-0 bg-gray-900 bg-opacity-50 flex justify-center overflow-y-auto py-[50px]">
            <div className="bg-white relative p-6 rounded-lg shadow-lg w-full max-w-2xl h-fit">
                <div className="mb-1">
                    <h2 className="text-xl text-center font-semibold mb-4">
                        Please fill this form with your details
                    </h2>
                    <form onSubmit={updateLoanRequest}>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    type="text"
                                    placeholder="Address"
                                    required
                                    minLength={10}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                />
                                <input
                                    value={mobileNo}
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
                                        value={g1Name}
                                        onChange={(e) => setG1Name(e.target.value)}
                                        type="text"
                                        required
                                        minLength={3}
                                        placeholder="Guarantor 1 Name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        value={g1Email}
                                        onChange={(e) => setG1Email(e.target.value)}
                                        type="email"
                                        required
                                        minLength={"one@gmail.com".length}
                                        placeholder="Guarantor 1 Email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        value={g1Location}
                                        onChange={(e) => setG1Location(e.target.value)}
                                        type="text"
                                        required
                                        minLength={10}
                                        placeholder="Guarantor 1 Location"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        value={g1Cnic}
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
                                        value={g2Name}
                                        required
                                        onChange={(e) => setG2Name(e.target.value)}
                                        type="text"
                                        minLength={3}
                                        placeholder="Guarantor 2 Name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        value={g2Email}
                                        required
                                        onChange={(e) => setG2Email(e.target.value)}
                                        type="email"
                                        minLength={"one@gmail.com".length}
                                        placeholder="Guarantor 2 Email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        value={g2Location}
                                        onChange={(e) => setG2Location(e.target.value)}
                                        required
                                        type="text"
                                        minLength={10}
                                        placeholder="Guarantor 2 Location"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                    />
                                    <input
                                        required
                                        value={g2Cnic}
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
                                    Upload Salary Sheet
                                </label>
                                <input
                                    ref={salarySheet}
                                    type="file"
                                    required
                                    id="salarySheet"
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                />
                                <p className="text-sm text-gray-500 mt-1">Upload your latest salary slip or salary certificate (PDF, DOC, JPG, PNG).</p>
                            </div>

                            {/* Bank Statement Input */}
                            <div className="mb-4">
                                <label htmlFor="bankStatement" className="block text-sm font-medium mb-2">
                                    Upload Bank Statement
                                </label>
                                <input
                                    required
                                    type="file"
                                    ref={bankStatement}
                                    id="bankStatement"
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
                                />
                                <p className="text-sm text-gray-500 mt-1">Upload your latest bank statement (PDF, DOC, JPG, PNG).</p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Setup Appointment</h3>

                            {/* Salary Sheet Input */}
                            <DatePicker editAble={true} update={false} date={date} setDate={setDate} />
                            {/* Bank Statement Input */}
                            <TimePicker editAble={true} update={false} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                            <div className="mb-4">
                                <label htmlFor="calender" className="block text-sm font-medium mb-2">
                                    Select the suitable location
                                </label>
                                <select
                                    value={appointmentLocation}
                                    onChange={handleCategoryChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                >
                                    <option value="">Select a Category</option>
                                    <option value={"Saylani Head Office Bahadurabad"}>
                                        Saylani Head Office Bahadurabad
                                    </option>
                                    <option value={"Saylani Gulshan Branch"}>
                                        Saylani Gulshan Branch
                                    </option>
                                </select>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-[#0673be] text-white py-2 px-4 rounded-md hover:bg-[#0673be] focus:ring focus:ring-blue-300"
                        >
                            {loading ? <LoadingSpinner className='text-center'/> : "Submit Details"}
                        </Button>
                    </form>
                </div>
                <Image onClick={() => setIsModalOpen(false)} width={13} className="absolute cursor-pointer top-4 right-4" src={close} alt="cross" />
            </div>
        </div>
    )
}

export default AddGuarantorModal;
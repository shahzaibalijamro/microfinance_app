"use client";
import React, { useEffect, useState } from "react";
import axios from "@/config/axiosConfig";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Define types for categories and subcategories
interface Category {
    _id: string;
    name: string;
    maxLoan: number;
    loanPeriod: number;
    subcategories?: { _id: string; name: string }[];
}

type LoanBreakdown = {
    moneyBorrowed: number;
    initialDeposit: number;
    loanPeriod: number;
    monthlyInstallment: number;
};

const LoanCalculate = () => {
    const [categories, setCategories] = useState<Category[]>([]); // Fixed the type
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingVal, setLoadingVal] = useState<number>(33);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null); // Fixed type to allow null
    const [initialDeposit, setInitialDeposit] = useState<string>("");
    const [loanPeriod, setLoanPeriod] = useState<string>("");
    const [isRegistered, setIsRegistered] = useState(true);
    const [loanBreakdown, setLoanBreakdown] = useState<LoanBreakdown | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const router = useRouter()
    const [cnic, setCnic] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    useEffect(() => {
        getAllCategories();
    }, []);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const cnicRegex = /^[0-9]{13}$/;
        const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com)$/i;
        if (!cnicRegex.test(cnic)) {
            return toast("Invalid CNIC!", {
                description: "CNIC must be a 13-digit number.",
                action: { label: "Ok", onClick: () => console.log("Invalid CNIC") },
            });
        }

        if (!emailRegex.test(email)) {
            return toast("Invalid Email!", {
                description: "Please enter a valid email address.",
                action: { label: "Ok", onClick: () => console.log("Invalid Email") },
            });
        }
        const { data } = await axios.post("/api/v1/register", { fullName: name, email, cnicNo: cnic })
        console.log(data);
        console.log({ cnic, email, name });
        setIsModalOpen(false);
        setTimeout(() => {
            setIsRegistered(true);
        }, 200)
    };

    const getAllCategories = async () => {
        setLoading(true);
        setLoadingVal(80);
        try {
            const { data } = await axios.get("/api/v1/categories");
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => { // Fixed event type
        const selectedOption = e.target.value;
        setSelectedCategory(selectedOption);
        setSelectedSubCategory("");
        const selectedCategoryObject = categories.find(
            (category) => category.name === selectedOption
        );
        setCurrentCategory(selectedCategoryObject || null);
    };

    const calculateLoanBreakdown = () => {
        if (!selectedCategory || !selectedSubCategory || !initialDeposit || !loanPeriod) {
            return toast("Please fill in all fields", {
                description: "All fields are required to proceed.",
                action: { label: "Ok", onClick: () => console.log("ok") },
            });
        }
        const numericLoanPeriod = Number(loanPeriod);
        if (isNaN(numericLoanPeriod)) {
            return toast("Please enter a valid loan period", {
                description: "Ensure that the loan period is a valid number.",
                action: { label: "Ok", onClick: () => console.log("ok") },
            });
        }
        const selectCategory = categories.find((category) => category.name === selectedCategory);
        console.log(selectedCategory);
        if (selectCategory && selectCategory.maxLoan !== null && amount > selectCategory.maxLoan) {
            return toast("Amount limit!", {
                description: `You cannot take a loan of more than ${selectCategory.maxLoan}.`,
                action: { label: "Ok", onClick: () => console.log("ok") },
            });
        }
        if (Number(initialDeposit) < 0.1 * amount) {
            return toast("Insufficient Deposit!", {
                description: "You must deposit at least 10% of the amount you want to borrow.",
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        }
        if (selectCategory && +loanPeriod > selectCategory.loanPeriod * 12) {
            return toast("Repayment Period Exceeded!", {
                description: `The loan period cannot exceed ${selectCategory.loanPeriod * 12} months for this category.`,
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        }
        setLoanBreakdown({ moneyBorrowed: amount, initialDeposit: +initialDeposit, loanPeriod: +loanPeriod, monthlyInstallment: amount / +loanPeriod });
    };

    return (
        <div className="mt-8 flex justify-center items-center bg-gray-100">
            <Toaster />
            {loading ? (
                <div className="w-full h-[80vh] flex justify-center items-center my-4">
                    <Progress className='w-48' value={loadingVal} />
                </div>
            ) : isRegistered ? (
                <Dialog open={isRegistered}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="mb-[6px]">Loan Request Received!</DialogTitle>
                            <DialogDescription>
                                Your loan request has been received successfully. An email has been sent to <strong>{email}</strong> containing your login credentials. Please log in using the provided details to complete the next steps, including submitting additional information and scheduling your appointment.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-0 flex justify-end">
                            <Button
                                variant="default"
                                onClick={() => {
                                    router.push("/")
                                }}
                            >
                                Home
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            ) : (
                <div className="w-full">
                    <div className="bg-white mx-auto p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h1 className="text-2xl font-bold text-center mb-6">Loan Calculator</h1>
                        <form className="space-y-4">
                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                >
                                    <option value="">Select a Category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subcategory Selection */}
                            {selectedCategory && currentCategory && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Subcategory</label>
                                    <select
                                        value={selectedSubCategory}
                                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                    >
                                        <option value="">Select a Subcategory</option>
                                        {currentCategory?.subcategories?.map((sub) => (
                                            <option key={sub._id} value={sub._id}>
                                                {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    placeholder="Enter Loan Amount"
                                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                />
                            </div>

                            {/* Initial Deposit */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Initial Deposit</label>
                                <input
                                    type="number"
                                    value={initialDeposit}
                                    onChange={(e) => setInitialDeposit(e.target.value)}
                                    placeholder="Enter Initial Deposit"
                                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                />
                            </div>

                            {/* Loan Period */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Loan Period (months)</label>
                                <input
                                    type="number"
                                    value={loanPeriod}
                                    onChange={(e) => setLoanPeriod(e.target.value)}
                                    placeholder="Enter Loan Period"
                                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                />
                            </div>

                            {/* Calculate Button */}
                            <button
                                type="button"
                                onClick={calculateLoanBreakdown}
                                className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
                            >
                                Calculate Loan
                            </button>

                            {/* Loan Breakdown */}
                            {loanBreakdown && loanBreakdown.moneyBorrowed > 0 && (
                                <>
                                    <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-md">
                                        <p><strong>Money Borrowed:</strong> {loanBreakdown.moneyBorrowed}</p>
                                        <p><strong>Initial Deposit:</strong> {loanBreakdown.initialDeposit}</p>
                                        <p><strong>Loan Period:</strong> {loanBreakdown.loanPeriod} months</p>
                                        <p><strong>Monthly Installment:</strong> {loanBreakdown.monthlyInstallment}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)} // Open modal
                                        className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
                                    >
                                        Proceed
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                    <div className="h-6 w-full"></div>
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setIsModalOpen(false)} // Close modal
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-bold mb-4">Additional Details</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Input 1 */}
                            <div>
                                <label className="block text-sm font-medium mb-1">CNIC</label>
                                <input
                                    type="text"
                                    placeholder="Enter your CNIC"
                                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                    value={cnic}
                                    onChange={(e) => setCnic(e.target.value)}
                                />
                            </div>
                            {/* Input 2 */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {/* Input 3 */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoanCalculate;
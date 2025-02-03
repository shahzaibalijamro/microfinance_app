"use client";
import React, { FormEvent, useEffect, useState } from "react";
import axios from "@/config/axiosConfig";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import ConfirmationModal from "@/components/ConfirmationModal";
import LoanCalculatorForm from "@/components/LoanCalculatorForm";
import RegisterModal from "@/components/RegisterModal";

// Typescript interfaces
interface Category {
    _id: string;
    name: string;
    maxLoan: number;
    loanPeriod: number;
    subcategories?: { _id: string; name: string }[];
}
type LoanBreakdown = {
    moneyBorrowed: number | null;
    initialDeposit: number;
    loanPeriod: number;
    monthlyInstallment: number | null;
};

const LoanCalculate = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingVal, setLoadingVal] = useState<number>(33);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [initialDeposit, setInitialDeposit] = useState<number | null>(null);
    const [loanPeriod, setLoanPeriod] = useState<number | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loanBreakdown, setLoanBreakdown] = useState<LoanBreakdown | null>(null);
    const [amount, setAmount] = useState<number | null>(null);
    const router = useRouter()
    const [cnic, setCnic] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getAllCategories();
    }, []);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const cnicRegex = /^[0-9]{13}$/;
        const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com)$/i;
        if (!cnicRegex.test(cnic)) {
            setIsLoading(false);
            return toast("Invalid CNIC!", {
                description: "CNIC must be a 13-digit number.",
                action: { label: "Ok", onClick: () => console.log("Invalid CNIC") },
            });
        }
        if (!emailRegex.test(email)) {
            setIsLoading(false);
            return toast("Invalid Email!", {
                description: "Please enter a valid email address.",
                action: { label: "Ok", onClick: () => console.log("Invalid Email") },
            });
        }
        const { data } = await axios.post("/api/v1/register", {
            fullName: name, email, cnicNo: cnic, loanCategory: selectedCategory, loanSubcategory: selectedSubCategory, initialDeposit, loanAmount: amount,
            loanPeriod
        })
        setIsLoading(false);
        console.log(data);
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
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        if (selectCategory && selectCategory.maxLoan !== null && amount && amount > selectCategory.maxLoan) {
            return toast("Amount limit!", {
                description: `You cannot take a loan of more than ${selectCategory.maxLoan}.`,
                action: { label: "Ok", onClick: () => console.log("ok") },
            });
        }
        if (amount && Number(initialDeposit) < 0.1 * amount) {
            return toast("Insufficient Deposit!", {
                description: "You must deposit at least 10% of the amount you want to borrow.",
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        }
        if (selectCategory && loanPeriod > selectCategory.loanPeriod * 12) {
            return toast("Repayment Period Exceeded!", {
                description: `The loan period cannot exceed ${selectCategory.loanPeriod * 12} months for this category.`,
                action: { label: "Ok", onClick: () => console.log("Ok clicked") },
            });
        }
        setLoanBreakdown({ moneyBorrowed: amount, initialDeposit: initialDeposit, loanPeriod: loanPeriod, monthlyInstallment: amount && (amount - initialDeposit) / loanPeriod });
    };

    return (
        <div className="mt-8 flex justify-center items-center bg-gray-100">
            <Toaster />
            {loading ? 
            <Loader loadingVal={loadingVal} />
            : isRegistered ? 
            <ConfirmationModal email={email} /> : 
            <LoanCalculatorForm amount={amount} calculateLoanBreakdown={calculateLoanBreakdown} categories={categories} currentCategory={currentCategory} handleCategoryChange={handleCategoryChange} initialDeposit={initialDeposit} loanBreakdown={loanBreakdown} loanPeriod={loanPeriod} selectedCategory={selectedCategory} selectedSubCategory={selectedSubCategory} setAmount={setAmount} setInitialDeposit={setInitialDeposit} setIsModalOpen={setIsModalOpen} setLoanPeriod={setLoanPeriod} setSelectedSubCategory={setSelectedSubCategory}/>}
            {isModalOpen && 
            <RegisterModal cnic={cnic} email={email} handleSubmit={handleSubmit} isLoading={isLoading} name={name} setCnic={setCnic} setEmail={setEmail} setIsModalOpen={setIsModalOpen} setName={setName}/>}
        </div>
    );
};

export default LoanCalculate;
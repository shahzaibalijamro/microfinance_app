import React from 'react'

interface LoanCalculatorForm {
    selectedCategory: string;
    handleCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    categories: Category[];
    currentCategory: Category | null;
    selectedSubCategory: string;
    setSelectedSubCategory: (value:string) => void;
    amount : number | null;
    setAmount: (value:number) => void;
    initialDeposit: number | null;
    setInitialDeposit: (value:number) => void;
    loanPeriod: number | null;
    setLoanPeriod: (value:number) => void;
    calculateLoanBreakdown: () => void;
    loanBreakdown : LoanBreakdown | null;
    setIsModalOpen : (value:boolean) => void;
}

type LoanBreakdown = {
    moneyBorrowed: number | null;
    initialDeposit: number;
    loanPeriod: number;
    monthlyInstallment: number | null;
};

interface Category {
    _id: string;
    name: string;
    maxLoan: number;
    loanPeriod: number;
    subcategories?: { _id: string; name: string }[];
}

const LoanCalculatorForm = ({
    selectedCategory,
    handleCategoryChange,
    categories,
    currentCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    amount,
    setAmount,
    initialDeposit,
    setInitialDeposit,
    loanPeriod,
    setLoanPeriod,
    calculateLoanBreakdown,
    loanBreakdown,
    setIsModalOpen,
}:LoanCalculatorForm) => {
    return (
        <div className="w-full">
            <div className="bg-white sm:mx-auto mx-[8px] mx- p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h1 className="text-2xl font-bold text-center mb-6">Loan Calculator</h1>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                        >
                            <option value="">Select a Category</option>
                            {categories.map((category:Category) => (
                                <option key={category._id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedCategory && currentCategory && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Subcategory</label>
                            <select
                                value={selectedSubCategory}
                                onChange={(e) => setSelectedSubCategory(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            >
                                <option value="">Select a Subcategory</option>
                                {currentCategory?.subcategories?.map((sub:{ _id: string; name: string }) => (
                                    <option key={sub._id} value={sub.name}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input
                            type="number"
                            value={amount ? amount : ""}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            placeholder="Enter Loan Amount"
                            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Initial Deposit</label>
                        <input
                            type="number"
                            value={initialDeposit ? initialDeposit : ""}
                            onChange={(e) => setInitialDeposit(Number(e.target.value))}
                            placeholder="Enter Initial Deposit"
                            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Loan Period (months)</label>
                        <input
                            type="number"
                            value={loanPeriod ? loanPeriod : ""}
                            onChange={(e) => setLoanPeriod(Number(e.target.value))}
                            placeholder="Enter Loan Period"
                            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={calculateLoanBreakdown}
                        className="w-full py-2 px-4 main-button text-white font-medium rounded-md transition"
                    >
                        Calculate Loan
                    </button>
                    {loanBreakdown && loanBreakdown.moneyBorrowed && loanBreakdown.moneyBorrowed > 0 && (
                        <>
                            <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-md">
                                <p><strong>Money Borrowed:</strong> {loanBreakdown.moneyBorrowed} PKR</p>
                                <p><strong>Initial Deposit:</strong> {loanBreakdown.initialDeposit} PKR</p>
                                <p><strong>Loan Period:</strong> {loanBreakdown.loanPeriod} months</p>
                                <p><strong>Monthly Installment:</strong> {loanBreakdown.monthlyInstallment} PKR</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="w-full main-button py-2 px-4 text-white font-medium rounded-md transition"
                            >
                                Proceed
                            </button>
                        </>
                    )}
                </form>
            </div>
            <div className="h-6 w-full"></div>
        </div>
    )
}

export default LoanCalculatorForm
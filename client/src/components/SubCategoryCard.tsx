import React from 'react'

interface SubCategoryCard {
    subcategory: subcategory;
    goToLoanCalculator: (value: subcategory) => void;
}

interface subcategory {
    name: string;
    _id: string;
}

const SubCategoryCard = ({ subcategory, goToLoanCalculator }: SubCategoryCard) => {
    return (
        <div
            key={subcategory._id}
            className="border rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-95 flex flex-col justify-between bg-white"
        >
            <div className="flex flex-col justify-between h-full">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                    {subcategory.name}
                </h2>
                <button
                    className="mt-4 py-2 px-4 main-button text-white rounded-lg transition-colors"
                    onClick={() => goToLoanCalculator(subcategory)}
                >
                    Proceed
                </button>
            </div>
        </div>
    )
}

export default SubCategoryCard
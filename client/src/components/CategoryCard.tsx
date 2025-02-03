import React from 'react'

interface CategoryCard {
    category: Category;
    goToSubCategory: (category:Category) => void;
}
interface SubCategory {
    _id: string;
    name: string;
}
interface Category {
    _id: string;
    name: string;
    description: string;
    subcategories: SubCategory[];
    maxLoan: number | null;
    loanPeriod: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const CategoryCard = ({ category, goToSubCategory }: CategoryCard) => {
    return (
        <div
            key={category._id}
            className="border rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-95 flex flex-col justify-between bg-white"
        >
            <div className="flex flex-col justify-between h-full">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{category.name}</h2>
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                <button
                    className="mt-4 py-2 px-4 main-button text-white rounded-lg transition-colors"
                    onClick={() => goToSubCategory(category)}
                >
                    Proceed
                </button>
            </div>
        </div>
    )
}

export default CategoryCard
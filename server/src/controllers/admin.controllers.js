import mongoose from "mongoose";
import Category from "../models/categorySchema.models.js";

const addCategory = async (req, res) => {
    const { name, subcategories, maxLoan, loanPeriod,description } = req.body;
    try {
        const newCategory = await Category.create({
            name,
            subcategories,
            description,
            maxLoan,
            loanPeriod,
        });
        // Send a success response
        res.status(201).json({
            success: true,
            message: 'Loan category added successfully!',
            newCategory,
        });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Loan category name must be unique!',
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to add loan category.',
            });
        }
    }
};

export { addCategory }
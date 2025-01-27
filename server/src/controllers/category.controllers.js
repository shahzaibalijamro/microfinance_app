import Category from "../models/categorySchema.models.js";

const getAllCategories = async (req,res) => {
    try {
        const categories = await Category.find({});
        return res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

const getCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({
                message: "Category name is required!",
            });
        }
        const category = await Category.findOne({ name });
        if (!category) {
            return res.status(404).json({
                message: "Category not found!",
            });
        }
        return res.status(200).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong!",
        });
    }
};


export {getAllCategories,getCategoryByName}
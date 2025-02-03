import mongoose from "mongoose"

const loanCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Loan category name is required!'],
        unique: [true, 'Loan category name must be unique!'],
    },
    description: {
        type: String,
        required: [true, 'Loan category description is required!'],
    },
    subcategories: [
        {
            name: {
                type: String,
                required: [true, 'Subcategory name is required!'],
            },
        },
    ],
    maxLoan: {
        type: Number,
        default: null
    },
    loanPeriod: {
        type: Number, // In years
        required: [true, 'Loan period is required!'],
    },
}, { timestamps: true });

loanCategorySchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Loan category name must be unique!'));
    } else {
        next(error);
    }
});

export default mongoose.model("LoanCategory", loanCategorySchema)
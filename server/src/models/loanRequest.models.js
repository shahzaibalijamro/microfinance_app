import mongoose from 'mongoose';

const loanRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    loanCategory: {
        type: String,
        required: true,
    },
    loanSubcategory: {
        type: String,
        required: true,
    },
    initialDeposit: {
        type: Number,
        required: true,
    },
    loanAmount: {
        type: Number,
        required: true,
    },
    loanPeriod: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: [
            'Under Review',       // When the loan request is being reviewed by the admin
            'Approved',           // When the loan is approved
            'Rejected',           // When the loan request is rejected
            'Documents Pending',  // When additional documents or information are needed
            'Completed',          // When the loan process is finished, and all steps are completed
        ],
        default: 'Documents Pending',
    },
    guarantors: [{
        name: String,
        email: String,
        location: String,
        cnic: String,
    }],
    salarySheet: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    bankStatement: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }
}, { timestamps: true });

export default mongoose.model('LoanRequest', loanRequestSchema);
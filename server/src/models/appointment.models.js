import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'userId is required!']
    },
    tokenNumber: {
        type: Number,
        required: [true, 'tokenNumber is required!'],
    },
    loanRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoanRequest',
        required: [true, 'loanRequest Id is required!']
    },
    appointmentTime: {
        type: String,
        required: true
    },
    appointmentDay: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        enum: ["Saylani Head Office Bahadurabad", "Saylani Gulshan Branch"],
        default: "Saylani Head Office Bahadurabad"
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema)
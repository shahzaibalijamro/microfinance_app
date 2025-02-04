import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Username is required!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: [true, 'Email must be unique!'],
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            message: props => `${props.value} is not a valid email address!`,
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    cnicNo: {
        type: String,
        required: [true, 'CNIC number is required!'],
        unique: [true, 'CNIC number must be unique!'],
        validate: {
            validator: function (value) {
                return /^[0-9]{13}$/.test(value);
            },
            message: props => `${props.value} is not a valid CNIC number! CNIC should be a 13-digit numeric value.`,
        }
    },
    role: { 
        type: String,
        enum: ['user', 'admin'], 
        default: 'user' ,
        validate: {
            validator: function (value) {
                return value === 'user' || value === 'admin';
            },
            message: props => `${props.value} is not a valid role. It must be 'user' or 'admin'.`
        }
    },
    isPasswordChanged: {
        type: Boolean,
        default: false
    },
    address:{
        type: String,
    },
    mobileNo: {
        type: String,
    },
    loanRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoanRequest'
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified()) return next()
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    try {
        if (!regex.test(this.password)) return next(new Error("Password does not meet the required criteria"));
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
})

export default mongoose.model("User", userSchema, 'users')
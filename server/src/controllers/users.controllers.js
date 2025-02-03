import mongoose from "mongoose";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken"
import Request from "../models/loanRequest.models.js"
import bcrypt from "bcrypt"
import { generateAccessandRefreshTokens } from "../utils/token.utils.js";
import { sendWelcomeEmail } from "../utils/nodemailer.utils.js";
import { generateRandomPassword } from "../utils/password.utils.js";

// // registers User
const registerUser = async (req, res) => {
    const {
        fullName,
        email,
        password,
        role,
        cnicNo,
        loanCategory,
        loanSubcategory,
        initialDeposit,
        loanAmount,
        loanPeriod
    } = req.body;
    if (!cnicNo || !email || !fullName) {
        return res.status(401).json({
            message: "Required fields not met!"
        });
    }
    if (!loanCategory || !loanSubcategory || !initialDeposit || !loanAmount || !loanPeriod) {
        return res.status(401).json({
            message: "Required fields not met for loan request!"
        });
    }
    let session;
    try {
        let pass;
        if (!password) {
            pass = generateRandomPassword();
        }
        session = await mongoose.startSession();
        session.startTransaction();
        const user = await User.create([{
            cnicNo,
            email,
            password: password || pass,
            fullName,
            role: role || 'user'
        }], { session });
        const loanRequest = await Request.create([{
            userId: user[0]._id,
            loanCategory,
            loanSubcategory,
            initialDeposit,
            loanAmount,
            loanPeriod
        }], { session });
        await session.commitTransaction();
        if (pass) {
            await sendWelcomeEmail(email, pass, cnicNo);
        }
        res.status(201).json({
                message: "New user created",
                user : user[0],
                loanRequest: loanRequest[0],
            });
    } catch (error) {
        console.log(error);
        //update the frontend error response
        if (session) {
            await session.abortTransaction();
        }
        if (error.message === "Password does not meet the required criteria") {
            return res.status(400).json({ message: "Password does not meet the required criteria!" });
        }
        if (error.message === "Email must be unique!") {
            return res.status(400).json({ message: "This email is already taken, please login or use a different one!" });
        }
        if (error.message === "CNIC number must be unique!") {
            return res.status(400).json({ message: "This CNIC number is already taken, please login or use a different one!" });
        }

        if (error.message && error.message.includes("is not a valid role")) {
            return res.status(400).json({ message: "Invalid role. It must be 'user' or 'admin'." });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: 'Server error' });
    }finally{
        if (session) {
            session.endSession();
        }
    }
};

const updateUserPassword = async (req,res) => {
    const {cnicNo,password} = req.body;
    if (!cnicNo || !password) {
        return res.status(400).json({ error: "CNIC number and password are required." });
    }
    try {
        const user = await User.findOne({cnicNo});
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            })
        }
        user.password = password;
        user.isPasswordChanged = true;
        user.save();
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

const loginUser = async function (req, res) {
    const { cnicNo, password } = req.body;
    if (!cnicNo || !password) {
        return res.status(400).json({ message: "Username, email, and password are required!" });
    }
    try {
        const user = await User.findOne({ cnicNo:cnicNo });
        console.log(user,password);
        if (!user) return res.status(404).json({
            message: "User does not exist!"
        })
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(401).json({
            message: "Invalid credentials"
        })
        const { accessToken, refreshToken } = generateAccessandRefreshTokens(user)
        res
            .cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.STATUS === "development" ? false : true, sameSite: process.env.STATUS === "development" ? 'Lax' : 'None', maxAge: 24 * 60 * 60 * 1000 })
            .status(200)
            .json({
                message: "User successfully logged in!",
                user,
                accessToken,
                refreshToken
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred during login" });
    }
}

// const deleteUser = async (req, res) => {
//     const { refreshToken } = req.cookies;
//     let session;
//     try {
//         if (!refreshToken) {
//             return res.status(401).json({ message: "No refresh token provided" });
//         }
//         const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//         session = await mongoose.startSession();
//         session.startTransaction();
//         const deleteUserPosts = await Post.deleteMany({ userId: { _id: decodedToken._id } }, { session });
//         const deleteUserComments = await Comment.deleteMany({ userId: decodedToken._id }, { session });
//         const deleteUserLikes = await Post.updateMany(
//             { likes: decodedToken._id },
//             { $pull: { likes: decodedToken._id } }, { session }
//         );
//         const deleteUser = await User.findByIdAndDelete(decodedToken._id, { session });
//         await deleteImageFromCloudinary(deleteUser.profilePicture.public_id)
//         if (!deleteUser) {
//             await session.abortTransaction();
//             return res.status(404).json({
//                 message: "User not found"
//             })
//         }
//         await session.commitTransaction();
//         res.clearCookie("refreshToken", {
//             httpOnly: true,
//             secure: process.env.STATUS === "development" ? false : true,
//             sameSite: process.env.STATUS === "development" ? 'Lax' : 'None',
//             maxAge: 0,
//             path: '/',
//         });
//         return res.status(200).json({ message: "User deleted!" });
//     } catch (error) {
//         if (session) await session.abortTransaction()
//         if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
//             return res.status(401).json({ message: "Invalid or expired token" });
//         }
//         console.log(error);
//         return res.status(500).json({ message: "Error occurred while deleting the user" });
//     } finally {
//         if (session) await session.endSession()
//     }
// };


export { registerUser, loginUser,updateUserPassword }
import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.models.js"
import { generateAccessandRefreshTokens } from "../utils/token.utils.js";

// //generates access token on app start
const isUserLoggedIn = async (req, res) => {
    const currentRefreshToken = req.cookies?.refreshToken;
    if (!currentRefreshToken) {
        return res.status(401).json({
            message: "Refresh token not found!"
        })
    }
    try {
        const decoded = jwt.verify(currentRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log(decoded);
        //check if the user exists in DB
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            })
        }
        //generate new tokens if user found
        const { accessToken, refreshToken } = generateAccessandRefreshTokens(user);
        res
            //Adding cookies
            .cookie("refreshToken", refreshToken, { httpOnly: true,
                secure: process.env.STATUS === "development" ? false : true, 
                maxAge: 24 * 60 * 60 * 1000, sameSite: process.env.STATUS === "development" ? 'Lax' : 'None' })
            .json({
                accessToken,
                user
            })
    } catch (error) {
        console.error(error.stack || error.message || error);
        if (error.message === "jwt malformed") {
            return res.status(400).json({
                message: "Refresh token is malformed!"
            })
        }
        if (error.message === "jwt expired") {
            return res.status(400).json({
                message: "Refresh token is expired!"
            })
        }
        return res.status(500).json({
            message: "Something went wrong while authenticating!"
        })
    }
}

// //authenticates user when accessing secure routes
const authenticateUser = async (req, res) => {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token is required! Please log in again."
        });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            })
        }
        return res.status(200).json({
            user,
            isValid: true
        })
    } catch (error) {
        console.log(error);
        if (error.message === "jwt malformed") {
            return res.status(400).json({
                message: "Refresh token is malformed!"
            })
        }
        if (error.message === "jwt expired") {
            return res.status(400).json({
                message: "Refresh token is expired, Please login again!"
            })
        }
        if (error.message === "jwt must be provided") {
            return res.status(400).json({
                message: "Refresh token not found or is invalid!"
            })
        }
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

// //logout user
const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token provided!" });
        const checkToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (!checkToken) return res.status(401).json({
            message: "Invalid or expired token!"
        })
        res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.STATUS === "development" ? false : true, maxAge: 0, sameSite: process.env.STATUS === "development" ? 'Lax' : 'None', });
        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

export { isUserLoggedIn, authenticateUser, logoutUser }
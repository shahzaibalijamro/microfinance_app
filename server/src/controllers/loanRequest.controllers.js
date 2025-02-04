import Request from "../models/loanRequest.models.js";
import User from "../models/user.models.js";
import Appointment from "../models/appointment.models.js"
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../utils/cloudinary.utils.js";
import mongoose from "mongoose";

const getCurrentLoanRequest = async (req, res) => {
    const user = req.user;
    try {
        const loanRequest = await Request.findOne({ userId: user._id });
        if (!loanRequest) {
            return res.status(404).json({
                message: "Loan request not found!"
            })
        }
        return res.status(200).json(loanRequest);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

const updateLoanRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const user = req.user;
        const { address, mobileNo, appointmentTime, appointmentDay, location } = req.body;
        let { guarantors } = req.body;
        guarantors = JSON.parse(guarantors);
        if (!requestId) return res.status(400).json({ message: "Loan request ID is required!" });
        if (!req.files?.salarySheet || !req.files?.bankStatement) {
            return res.status(400).json({ message: "Both Salary Sheet and Bank Statement are required." });
        }
        if (!address || !mobileNo || !guarantors) {
            return res.status(400).json({ message: "Address, Mobile no, and Guarantors data is required!" });
        }
        const loanRequest = await Request.findById(requestId);
        if (!loanRequest) return res.status(404).json({ message: "Loan request not found!" });
        if (loanRequest.userId.toString() !== user._id) {
            return res.status(401).json({ message: "Unauthorized to update this loan request!" });
        }
        const [salarySheet, bankStatement] = await Promise.all([
            uploadImageToCloudinary(req.files["salarySheet"][0].buffer),
            uploadImageToCloudinary(req.files["bankStatement"][0].buffer),
        ]);

        if (!salarySheet || !bankStatement) {
            return res.status(500).json({ message: "Could not upload media!" });
        }
        const tokenNumber = await Request.countDocuments({ status: "Documents Pending" });
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const appointment = await Appointment.create([{
                userId: user._id,
                tokenNumber,
                loanRequestId: requestId,
                appointmentTime,
                appointmentDay,
                location,
            }], { session });
            loanRequest.set({
                guarantors,
                bankStatement: { url: bankStatement.url, public_id: bankStatement.public_id },
                salarySheet: { url: salarySheet.url, public_id: salarySheet.public_id },
                status: "Under Review",
                appointment: appointment[0]._id
            });
            const theUser = await User.findByIdAndUpdate(
                user._id,
                { address, mobileNo },
                { new: true, session }
            );
            await loanRequest.save({ session });
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({ loanRequest, theUser, appointment: appointment[0] });
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
};


const editLoanRequest = async (req, res) => {
    const { requestId } = req.params;
    const user = req.user;
    let salarySheet = req.files?.["salarySheet"] ? req.files["salarySheet"][0] : null;
    let bankStatement = req.files?.["bankStatement"] ? req.files["bankStatement"][0] : null;
    const { address, mobileNo, guarantors } = req.body;
    try {
        if (!requestId) return res.status(400).json({ message: "Loan request Id is required!" });
        const loanRequest = await Request.findById(requestId);
        if (!loanRequest) return res.status(404).json({ message: "Loan request not found!" });
        if (loanRequest.userId.toString() !== user._id && user.role !== "admin") {
            return res.status(401).json({ message: "You are not authorized to update this loan request!" });
        }
        if (salarySheet) {
            console.log("salarySheet", salarySheet);
            try {
                const [newSalarySheet] = await Promise.all([
                    uploadImageToCloudinary(salarySheet.buffer),
                    deleteImageFromCloudinary(loanRequest.salarySheet.public_id)
                ]);
                loanRequest.salarySheet = { url: newSalarySheet.url, public_id: newSalarySheet.public_id };
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Could not upload the document" });
            }
        }
        if (bankStatement) {
            console.log("bankStatement", bankStatement);
            try {
                const [newBankStatement] = await Promise.all([
                    uploadImageToCloudinary(bankStatement.buffer),
                    deleteImageFromCloudinary(loanRequest.bankStatement.public_id)
                ]);
                loanRequest.bankStatement = { url: newBankStatement.url, public_id: newBankStatement.public_id };
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Could not upload the document" });
            }
        }
        if (guarantors) {
            console.log("guarantors", guarantors);
            loanRequest.guarantors = JSON.parse(guarantors);
        }
        loanRequest.status = "Under Review";
        const updateFields = {};
        if (address) updateFields.address = address;
        if (mobileNo) updateFields.mobileNo = mobileNo;
        const theUser = await User.findByIdAndUpdate(
            user._id,
            { $set: updateFields },
            { new: true }
        );
        await loanRequest.save();
        return res.status(200).json({ loanRequest, theUser });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
};

export { getCurrentLoanRequest, editLoanRequest, updateLoanRequest };
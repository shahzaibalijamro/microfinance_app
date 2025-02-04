import mongoose from "mongoose";
import Category from "../models/categorySchema.models.js";
import Request from "../models/loanRequest.models.js";
import Appointment from "../models/appointment.models.js";
import { notifyUser } from "../utils/nodemailer.utils.js";

const addCategory = async (req, res) => {
    const { name, subcategories, maxLoan, loanPeriod, description } = req.body;
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

const getAllLoanRequests = async (req, res) => {
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const skip = (+page - 1) * +limit;
    try {
        const loanRequests = await Request.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate([{ path: 'userId', select: '-password -role -isPasswordChanged' }]);
        if (loanRequests.length === 0) return res.status(200).json({
            message: "You're all caught up!"
        })
        res.status(200).json(loanRequests)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

const approveOrDisapproveRequest = async (req, res) => {
    const { request, text } = req.body;
    try {
        if (text === "Approve") {
            const approveRequest = await Request.findByIdAndUpdate(request._id, {
                status: "Approved"
            }, { new: true });
            const updateAppointment = await Appointment.findOneAndUpdate({
                loanRequestId: request._id},{isCompleted: true},{new:true});
            if (!approveRequest) {
                return res.status(404).json(approveRequest)
            }
            //still continue
            await notifyUser(request.userId.email,updateAppointment.appointmentDay,updateAppointment.appointmentTime,updateAppointment.location,"Approved")
            return res.status(200).json(approveRequest)
        }
        if (text === "Reject") {
            const rejectRequest = await Request.findByIdAndUpdate(request._id, {
                status: "Rejected"
            }, { new: true });
            if (!rejectRequest) {
                return res.status(404).json(rejectRequest)
            }
            await notifyUser(request.userId.email,null,null,null,"Rejected")
            return res.status(200).json(rejectRequest)
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

const filterRequestsByStatus = async (req,res) => {
    const {status} = req.params;
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const skip = (+page - 1) * +limit;
    try {
        const requests = await Request.find({status}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate([{ path: 'userId', select: '-password -role -isPasswordChanged' }]);
        if (requests.length === 0) return res.status(200).json({
            message: "You're all caught up!"
        })
        return res.status(200).json(requests);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}
export { addCategory, getAllLoanRequests, approveOrDisapproveRequest,filterRequestsByStatus }
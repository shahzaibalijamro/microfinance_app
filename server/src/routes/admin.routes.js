import express from "express"
import { addCategory, approveOrDisapproveRequest, filterRequestsByCnic, filterRequestsByStatus, getAllLoanRequests } from "../controllers/admin.controllers.js";
import { checkIfAdmin } from "../middlewares/auth.middlewares.js";

const adminRouter = express.Router();

//add category
adminRouter.post("/addcategory",checkIfAdmin, addCategory)
//get all loan requests
adminRouter.get("/requests",checkIfAdmin, getAllLoanRequests)
//approve or disapprove requests
adminRouter.put("/approve",checkIfAdmin, approveOrDisapproveRequest)
//filtering
adminRouter.get("/filter/:status",checkIfAdmin, filterRequestsByStatus)
adminRouter.get("/search/:cnic",checkIfAdmin, filterRequestsByCnic)

export { adminRouter }
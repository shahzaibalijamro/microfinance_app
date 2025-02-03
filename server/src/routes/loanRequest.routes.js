import express from "express"
import { editLoanRequest, getCurrentLoanRequest, updateLoanRequest } from "../controllers/loanRequest.controllers.js";
import { verifyRequest } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const loanRequestRouter = express.Router();

//fetch the loan request of each user
loanRequestRouter.get("/loan", verifyRequest ,getCurrentLoanRequest);
//edit loan request
loanRequestRouter.put("/loan/edit/:requestId", verifyRequest,upload.fields([
    { name: "salarySheet", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 }
]),editLoanRequest);
//update loan request
loanRequestRouter.put(
    "/loan/:requestId",
    verifyRequest,
    upload.fields([
        { name: "salarySheet", maxCount: 1 },
        { name: "bankStatement", maxCount: 1 }
    ]),
    updateLoanRequest);

export { loanRequestRouter }
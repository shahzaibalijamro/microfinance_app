import express from "express"
import { getCurrentLoanRequest } from "../controllers/loanRequest.controllers.js";
import { verifyRequest } from "../middlewares/auth.middlewares.js";

const loanRequestRouter = express.Router();

//fetch all categories on app start
loanRequestRouter.get("/loan", verifyRequest ,getCurrentLoanRequest);

export { loanRequestRouter }
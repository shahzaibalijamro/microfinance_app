import express from "express"
import { addCategory } from "../controllers/admin.controllers.js";
import { checkIfAdmin } from "../middlewares/auth.middlewares.js";

const adminRouter = express.Router();

//add category
adminRouter.post("/addcategory",checkIfAdmin, addCategory)

export { adminRouter }
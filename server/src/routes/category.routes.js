import express from "express"
import { getAllCategories, getCategoryByName } from "../controllers/category.controllers.js";
const categoryRouter = express.Router();

//fetch all categories on app start
categoryRouter.get("/categories", getAllCategories)


categoryRouter.get("/category/:name", getCategoryByName)

export { categoryRouter }
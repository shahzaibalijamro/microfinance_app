import express from "express"
import { verifyRequest } from "../middlewares/auth.middlewares.js";
import { getCurrentAppointment } from "../controllers/appointment.controllers.js";

const appointmentRouter = express.Router();

//add category
appointmentRouter.get("/appoint/:userId?",verifyRequest, getCurrentAppointment)

export { appointmentRouter }
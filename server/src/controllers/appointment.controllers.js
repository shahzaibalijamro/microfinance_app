import Appointment from "../models/appointment.models.js"

const getCurrentAppointment = async (req, res) => {
    const user = req.user;
    const {userId} = req.params;
    try {
        const appointment = await Appointment.findOne({ userId:userId ? userId : user._id });
        if (!appointment) {
            return res.status(404).json({
                message: "appointment not found!"
            })
        }
        return res.status(200).json(appointment);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

export {getCurrentAppointment}
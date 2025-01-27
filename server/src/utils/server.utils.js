import mongoose from "mongoose";

const checkServerHealth = async (req,res) => {
    try {
            await mongoose.connection.db.admin().ping();
            res.status(200).json({
                status: "success",
                message: "Server is healthy",
                data: {
                    uptime: process.uptime(),
                    timestamp: new Date(),
                },
            });
        } catch (error) {
            console.error("Health check failed:", error);
    
            res.status(500).json({
                status: "error",
                message: "Server is down or encountering an issue",
            });
        }
}

export {checkServerHealth}
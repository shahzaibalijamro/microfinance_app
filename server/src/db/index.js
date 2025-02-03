import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/simple_social_media_app`)
        console.log(`\n MONGO DB CONNECTION SUCCESS !! DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGO DB CONNECTION FAILED !!!" , error)
        process.exit(1)
    }
}

export {connectDB}
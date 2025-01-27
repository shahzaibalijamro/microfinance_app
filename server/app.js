import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
app.use(express.json());
const corsConfig = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ["GET","POST","PUT","DELETE"]
}
app.options("",cors(corsConfig))
app.use(cors(corsConfig));
export {app}
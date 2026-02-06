import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js"
import connectionsRoutes from "./routes/connections.routes.js"
import dotenv from "dotenv";

import { connectDB } from "./lib/db.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors(
    {
        origin: [process.env.FRONTEND_URL],
        credentials: true
    }
));
app.use(express.json({limit: '5mb'})); 
app.use(cookieParser());


// all api is tested 
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1/notifications", notificationRoutes)
app.use("/api/v1/connections", connectionsRoutes)


try {
    app.listen(PORT, () => {
        console.log(`server running on.. ${PORT}`);
    })

    connectDB();
} catch (error) {
    console.log("Error in server start : " + error);
    process.exit(1);
}